import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource, MqttResourceConfig } from '@attraccess/database-entities';
import { ResourceUsageStartedEvent, ResourceUsageEndedEvent } from '../../usage/events/resource-usage.events';
import { MqttClientService } from '../../../mqtt/mqtt-client.service';
import * as Handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MqttPublisherService {
  private templates: Record<string, HandlebarsTemplateDelegate> = {};
  private readonly logger = new Logger(MqttPublisherService.name);
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly messageQueue: Map<
    string,
    {
      serverId: number;
      topic: string;
      message: string;
      retries: number;
      resourceId: number;
      lastAttempt: Date;
    }[]
  > = new Map();
  private queueProcessor: NodeJS.Timeout | null = null;

  constructor(
    private readonly mqttClientService: MqttClientService,
    private readonly configService: ConfigService,
    @InjectRepository(MqttResourceConfig)
    private readonly mqttResourceConfigRepository: Repository<MqttResourceConfig>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {
    this.maxRetries = this.configService.get<number>('MQTT_MAX_RETRIES', 3);
    this.retryDelay = this.configService.get<number>('MQTT_RETRY_DELAY_MS', 5000);
    this.logger.log(
      `Initialized MqttPublisherService with maxRetries: ${this.maxRetries}, retryDelay: ${this.retryDelay}ms`
    );

    // Start queue processor
    this.startQueueProcessor();
  }

  private compileTemplate(template: string): HandlebarsTemplateDelegate {
    if (!this.templates[template]) {
      this.logger.debug(`Compiling new MQTT Handlebars template: ${template.substring(0, 50)}...`);
      this.templates[template] = Handlebars.compile(template);
    }
    return this.templates[template];
  }

  private processTemplate(template: string, context: Record<string, unknown>): string {
    const compiledTemplate = this.compileTemplate(template);
    const result = compiledTemplate(context);
    this.logger.debug(`Processed MQTT template: ${template.substring(0, 50)}... -> ${result.substring(0, 100)}...`);
    return result;
  }

  private startQueueProcessor(): void {
    if (this.queueProcessor) {
      this.logger.debug('Clearing existing MQTT queue processor interval.');
      clearInterval(this.queueProcessor);
    }

    this.logger.log(`Starting MQTT message queue processor with interval: ${this.retryDelay}ms`);
    this.queueProcessor = setInterval(() => this.processMessageQueue(), this.retryDelay);
  }

  private stopQueueProcessor(): void {
    if (this.queueProcessor) {
      this.logger.log('Stopping MQTT message queue processor.');
      clearInterval(this.queueProcessor);
      this.queueProcessor = null;
    }
  }

  private getQueueKey(resourceId: number): string {
    return `resource:${resourceId}`;
  }

  private async processMessageQueue(): Promise<void> {
    if (this.messageQueue.size === 0) {
      // this.logger.debug('MQTT message queue is empty, skipping processing run.');
      return;
    }
    this.logger.debug(`Starting MQTT message queue processing run. Processing ${this.messageQueue.size} queue keys.`);
    const now = new Date();

    for (const [queueKey, messages] of this.messageQueue.entries()) {
      if (messages.length === 0) {
        this.logger.debug(`MQTT queue key ${queueKey} is empty, removing.`);
        this.messageQueue.delete(queueKey);
        continue;
      }
      this.logger.debug(`Processing ${messages.length} messages for MQTT queue key ${queueKey}.`);

      // Process each message in the queue
      const remainingMessages = [];

      for (const queuedMessage of messages) {
        // Skip messages that haven't waited long enough
        const timeSinceLastAttempt = now.getTime() - queuedMessage.lastAttempt.getTime();
        if (timeSinceLastAttempt < this.retryDelay) {
          this.logger.debug(
            `Skipping message for resource ${queuedMessage.resourceId} (server ${queuedMessage.serverId}) due to retry delay. Retries: ${queuedMessage.retries}.`
          );
          remainingMessages.push(queuedMessage);
          continue;
        }

        // Try to publish
        try {
          this.logger.debug(`Checking status of MQTT server ${queuedMessage.serverId}`);
          const serverStatus = await this.mqttClientService.getStatusOfOne(queuedMessage.serverId);

          if (serverStatus.connected) {
            this.logger.debug(
              `Server ${queuedMessage.serverId} connected. Attempting to publish queued message for resource ${queuedMessage.resourceId} (Topic: ${queuedMessage.topic})`
            );
            await this.mqttClientService.publish(queuedMessage.serverId, queuedMessage.topic, queuedMessage.message);

            this.logger.log(
              `Successfully published queued message for resource ${queuedMessage.resourceId} to server ${queuedMessage.serverId} after retry.`
            );
          } else {
            // Server still not connected, increment retry count
            queuedMessage.retries++;
            queuedMessage.lastAttempt = new Date();

            if (queuedMessage.retries < this.maxRetries) {
              this.logger.warn(
                `MQTT server ${queuedMessage.serverId} still not connected for resource ${queuedMessage.resourceId}. Requeuing message for retry ${queuedMessage.retries}/${this.maxRetries}.`
              );
              remainingMessages.push(queuedMessage);
            } else {
              this.logger.error(
                `Failed to publish message for resource ${queuedMessage.resourceId} to server ${queuedMessage.serverId} after ${this.maxRetries} retries (server unavailable). Discarding message.`
              );
            }
          }
        } catch (error) {
          // Handle publish error
          this.logger.error(
            `Error publishing queued message for resource ${queuedMessage.resourceId} to server ${queuedMessage.serverId}: ${error.message}`,
            error.stack
          );
          queuedMessage.retries++;
          queuedMessage.lastAttempt = new Date();

          if (queuedMessage.retries < this.maxRetries) {
            this.logger.warn(
              `Requeuing failed message for resource ${queuedMessage.resourceId} (server ${queuedMessage.serverId}) for retry ${queuedMessage.retries}/${this.maxRetries}.`
            );
            remainingMessages.push(queuedMessage);
          } else {
            this.logger.error(
              `Failed to publish message for resource ${queuedMessage.resourceId} to server ${queuedMessage.serverId} after ${this.maxRetries} retries (publish error). Discarding message.`
            );
          }
        }
      }

      // Update queue with remaining messages
      if (remainingMessages.length > 0) {
        this.logger.debug(`MQTT queue key ${queueKey} updated with ${remainingMessages.length} remaining messages.`);
        this.messageQueue.set(queueKey, remainingMessages);
      } else {
        this.logger.debug(`MQTT queue key ${queueKey} is now empty, removing.`);
        this.messageQueue.delete(queueKey);
      }
    }
    this.logger.debug(`Finished MQTT message queue processing run.`);
  }

  private async publishWithRetry(serverId: number, resourceId: number, topic: string, message: string): Promise<void> {
    this.logger.debug(
      `Attempting to publish message for resource ${resourceId} to server ${serverId}, topic: ${topic}`
    );
    try {
      // Try to publish immediately first
      await this.mqttClientService.publish(serverId, topic, message);
      this.logger.debug(`Successfully published message to ${topic}`);
    } catch (error) {
      // If publishing fails, queue for retry
      this.logger.warn(
        `Immediate publish failed for resource ${resourceId} to server ${serverId}. Error: ${error.message}. Queuing for retry.`
      );

      const queueKey = this.getQueueKey(resourceId);
      const queuedItem = {
        serverId,
        topic,
        message,
        retries: 0,
        resourceId,
        lastAttempt: new Date(),
      };

      if (!this.messageQueue.has(queueKey)) {
        this.messageQueue.set(queueKey, []);
      }

      this.messageQueue.get(queueKey).push(queuedItem);
      this.logger.log(
        `Message for resource ${resourceId} (server ${serverId}) queued for retry. Queue size: ${
          this.messageQueue.get(queueKey)?.length
        }`
      );
    }
  }

  @OnEvent('resource.usage.started')
  async handleResourceUsageStarted(event: ResourceUsageStartedEvent) {
    this.logger.log(`Handling resource.usage.started event for MQTT publisher, resource ID: ${event.resourceId}`);
    try {
      const config = await this.mqttResourceConfigRepository.findOne({
        where: { resourceId: event.resourceId },
        relations: ['server'],
      });

      if (!config) {
        // This is normal, just debug log
        this.logger.debug(`No MQTT config found for resource ${event.resourceId}, skipping publish.`);
        return; // No MQTT config for this resource
      }
      this.logger.debug(
        `Found MQTT config ${config.id} for resource ${event.resourceId}, server ID: ${config.serverId}`
      );

      const resource = await this.resourceRepository.findOne({
        where: { id: event.resourceId },
      });

      if (!resource) {
        // Resource should exist if event fired, but handle defensively
        this.logger.error(`Resource ${event.resourceId} not found, cannot publish MQTT started event.`);
        return;
      }

      // Create template context
      const context = {
        id: resource.id,
        name: resource.name,
        timestamp: new Date().toISOString(),
      };

      // Process templates
      this.logger.debug(`Processing MQTT templates for resource ${event.resourceId} (started)`);
      const topic = this.processTemplate(config.inUseTopic, context);
      const message = this.processTemplate(config.inUseMessage, context);

      this.logger.debug(`Publishing resource in-use event to ${topic}`);

      // Publish to MQTT with retry capability
      this.logger.debug(`Calling publishWithRetry for resource ${resource.id} (started)`);
      await this.publishWithRetry(config.serverId, resource.id, topic, message);
    } catch (error) {
      // Log error but don't fail the operation
      this.logger.error('Failed to publish resource usage started event to MQTT', error);
    }
  }

  @OnEvent('resource.usage.ended')
  async handleResourceUsageEnded(event: ResourceUsageEndedEvent) {
    this.logger.log(`Handling resource.usage.ended event for MQTT publisher, resource ID: ${event.resourceId}`);
    try {
      const config = await this.mqttResourceConfigRepository.findOne({
        where: { resourceId: event.resourceId },
        relations: ['server'],
      });

      if (!config) {
        this.logger.debug(`No MQTT config found for resource ${event.resourceId}, skipping publish.`);
        return;
      }
      this.logger.debug(
        `Found MQTT config ${config.id} for resource ${event.resourceId}, server ID: ${config.serverId}`
      );

      const resource = await this.resourceRepository.findOne({
        where: { id: event.resourceId },
      });

      if (!resource) {
        this.logger.error(`Resource ${event.resourceId} not found, cannot publish MQTT ended event.`);
        return;
      }

      // Create template context
      const context = {
        id: resource.id,
        name: resource.name,
        timestamp: new Date().toISOString(),
      };

      // Process templates
      this.logger.debug(`Processing MQTT templates for resource ${event.resourceId} (ended)`);
      const topic = this.processTemplate(config.notInUseTopic, context);
      const message = this.processTemplate(config.notInUseMessage, context);

      this.logger.debug(`Publishing resource not-in-use event to ${topic}`);

      // Publish to MQTT with retry capability
      this.logger.debug(`Calling publishWithRetry for resource ${resource.id} (ended)`);
      await this.publishWithRetry(config.serverId, resource.id, topic, message);
    } catch (error) {
      this.logger.error('Failed to publish resource usage ended event to MQTT', error);
    }
  }
}
