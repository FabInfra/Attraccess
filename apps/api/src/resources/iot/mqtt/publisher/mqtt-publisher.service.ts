import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource, MqttResourceConfig } from '@attraccess/database-entities';
import { ConfigService } from '@nestjs/config';
import { MqttClientService } from '../../../../mqtt/mqtt-client.service';
import {
  ResourceUsageStartedEvent,
  ResourceUsageEndedEvent,
  ResourceUsageTakenOverEvent,
} from '../../../../resources/usage/events/resource-usage.events';
import { IotService, TemplateContext } from '../../iot.service';

@Injectable()
export class MqttPublisherService {
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
    private readonly resourceRepository: Repository<Resource>,
    private readonly iotService: IotService
  ) {
    this.maxRetries = this.configService.get<number>('MQTT_MAX_RETRIES', 3);
    this.retryDelay = this.configService.get<number>('MQTT_RETRY_DELAY_MS', 5000);

    // Start queue processor
    this.startQueueProcessor();
  }

  private startQueueProcessor(): void {
    if (this.queueProcessor) {
      clearInterval(this.queueProcessor);
    }

    this.queueProcessor = setInterval(() => this.processMessageQueue(), this.retryDelay);
  }

  private getQueueKey(resourceId: number): string {
    return `resource:${resourceId}`;
  }

  private async processMessageQueue(): Promise<void> {
    const now = new Date();

    for (const [queueKey, messages] of this.messageQueue.entries()) {
      if (messages.length === 0) {
        this.messageQueue.delete(queueKey);
        continue;
      }

      // Process each message in the queue
      const remainingMessages = [];

      for (const queuedMessage of messages) {
        // Skip messages that haven't waited long enough
        const timeSinceLastAttempt = now.getTime() - queuedMessage.lastAttempt.getTime();
        if (timeSinceLastAttempt < this.retryDelay) {
          remainingMessages.push(queuedMessage);
          continue;
        }

        // Try to publish
        try {
          const serverStatus = await this.mqttClientService.getStatusOfOne(queuedMessage.serverId);

          if (serverStatus.connected) {
            await this.mqttClientService.publish(queuedMessage.serverId, queuedMessage.topic, queuedMessage.message);

            this.logger.log(
              `Successfully published queued message for resource ${queuedMessage.resourceId} after retry`
            );
          } else {
            // Server still not connected, increment retry count
            queuedMessage.retries++;
            queuedMessage.lastAttempt = new Date();

            if (queuedMessage.retries < this.maxRetries) {
              this.logger.warn(
                `MQTT server ${queuedMessage.serverId} still not connected. Queuing message for retry ${queuedMessage.retries}/${this.maxRetries}`
              );
              remainingMessages.push(queuedMessage);
            } else {
              this.logger.error(
                `Failed to publish message for resource ${queuedMessage.resourceId} after ${this.maxRetries} retries. Discarding message.`
              );
            }
          }
        } catch (error) {
          // Handle publish error
          queuedMessage.retries++;
          queuedMessage.lastAttempt = new Date();

          if (queuedMessage.retries < this.maxRetries) {
            this.logger.warn(
              `Error publishing queued message: ${error.message}. Queuing for retry ${queuedMessage.retries}/${this.maxRetries}`
            );
            remainingMessages.push(queuedMessage);
          } else {
            this.logger.error(
              `Failed to publish message for resource ${queuedMessage.resourceId} after ${this.maxRetries} retries. Discarding message.`
            );
          }
        }
      }

      // Update queue with remaining messages
      if (remainingMessages.length > 0) {
        this.messageQueue.set(queueKey, remainingMessages);
      } else {
        this.messageQueue.delete(queueKey);
      }
    }
  }

  private async publishWithRetry(serverId: number, resourceId: number, topic: string, message: string): Promise<void> {
    try {
      // Try to publish immediately first
      await this.mqttClientService.publish(serverId, topic, message);
      this.logger.debug(`Successfully published message to ${topic}`);
    } catch (error) {
      // If publishing fails, queue for retry
      this.logger.warn(
        `Failed to publish message for resource ${resourceId}. Error: ${error.message}. Queuing for retry.`
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
    }
  }

  @OnEvent('resource.usage.started')
  async handleResourceUsageStarted(event: ResourceUsageStartedEvent) {
    const configs = await this.mqttResourceConfigRepository.find({
      where: { resourceId: event.resourceId },
      relations: ['server'],
    });

    await Promise.all(
      configs.map(async (config) => {
        if (!config.sendOnStart) {
          return;
        }
        try {
          const resource = await this.resourceRepository.findOne({
            where: { id: event.resourceId },
          });

          if (!resource) {
            this.logger.warn(`Resource with ID ${event.resourceId} not found`);
            return;
          }

          // Create template context
          const context: TemplateContext = {
            id: resource.id,
            name: resource.name,
            timestamp: new Date().toISOString(),
            user: {
              id: event.user.id,
              username: event.user.username,
            },
          };

          // Process templates
          const topic = this.iotService.processTemplate(config.inUseTopic, context);
          const message = this.iotService.processTemplate(config.inUseMessage, context);

          this.logger.debug(`Publishing resource in-use event to ${topic}`);

          // Publish to MQTT with retry capability
          await this.publishWithRetry(config.serverId, resource.id, topic, message);
        } catch (error) {
          // Log error but don't fail the operation
          this.logger.error('Failed to publish resource usage started event to MQTT', config, error);
        }
      })
    );
  }

  @OnEvent('resource.usage.ended')
  async handleResourceUsageEnded(event: ResourceUsageEndedEvent) {
    const configs = await this.mqttResourceConfigRepository.find({
      where: { resourceId: event.resourceId },
      relations: ['server'],
    });

    await Promise.all(
      configs.map(async (config) => {
        if (!config.sendOnStop) {
          return;
        }
        try {
          const resource = await this.resourceRepository.findOne({
            where: { id: event.resourceId },
          });

          if (!resource) {
            this.logger.warn(`Resource with ID ${event.resourceId} not found`);
            return;
          }

          // Create template context
          const context = {
            id: resource.id,
            name: resource.name,
            timestamp: new Date().toISOString(),
            user: event.user,
          };

          // Process templates
          const topic = this.iotService.processTemplate(config.notInUseTopic, context);
          const message = this.iotService.processTemplate(config.notInUseMessage, context);

          this.logger.debug(`Publishing resource not-in-use event to ${topic}`);

          // Publish to MQTT with retry capability
          await this.publishWithRetry(config.serverId, resource.id, topic, message);
        } catch (error) {
          // Log error but don't fail the operation
          this.logger.error('Failed to publish resource usage ended event to MQTT', config, error);
        }
      })
    );
  }


  @OnEvent('resource.usage.taken_over')
  async handleResourceUsageTakenOver(event: ResourceUsageTakenOverEvent) {
    const configs = await this.mqttResourceConfigRepository.find({
      where: { resourceId: event.resourceId },
      relations: ['server'],
    });

    await Promise.all(
      configs.map(async (config) => {
        if (!config.sendOnTakeover || !config.takeoverTopic || !config.takeoverMessage) {
          return;
        }

        try {
          const resource = await this.resourceRepository.findOne({
            where: { id: event.resourceId },
          });

          if (!resource) {
            this.logger.warn(`Resource with ID ${event.resourceId} not found`);
            return;
          }

          const context: TemplateContext = {
            id: resource.id,
            name: resource.name,
            timestamp: event.takeoverTime.toISOString(),
            user: {
              id: event.newUser.id,
              username: event.newUser.username,
            },
            previousUser: event.previousUser
              ? {
                  id: event.previousUser.id,
                  username: event.previousUser.username,
                }
              : null,
          };

          const topic = this.iotService.processTemplate(config.takeoverTopic, context);
          const message = this.iotService.processTemplate(config.takeoverMessage, context);

          this.logger.debug(`Publishing resource takeover event to ${topic}`);
          await this.publishWithRetry(config.serverId, resource.id, topic, message);
        } catch (error) {
          this.logger.error('Failed to publish resource usage takeover event to MQTT', config, error);
        }
      })
    );
  }

}
