import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookConfig, Resource } from '@attraccess/database-entities';
import { ResourceUsageStartedEvent, ResourceUsageEndedEvent } from '../../resources/usage/events/resource-usage.events';
import * as Handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { createHmac } from 'crypto';

interface QueueItem {
  webhookId: number;
  resourceId: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  payload: string;
  retries: number;
  maxRetries: number;
  retryDelay: number;
  secret: string | null;
  signatureHeader: string;
  lastAttempt: Date | null;
}

@Injectable()
export class WebhookPublisherService {
  private templates: Record<string, HandlebarsTemplateDelegate> = {};
  private readonly logger = new Logger(WebhookPublisherService.name);
  private readonly messageQueue: Map<string, QueueItem[]> = new Map();
  private queueProcessor: NodeJS.Timeout | null = null;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(WebhookConfig)
    private readonly webhookConfigRepository: Repository<WebhookConfig>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {
    // Start queue processor
    this.startQueueProcessor();
  }

  private compileTemplate(template: string): HandlebarsTemplateDelegate {
    if (!this.templates[template]) {
      this.templates[template] = Handlebars.compile(template);
    }
    return this.templates[template];
  }

  private processTemplate(template: string, context: Record<string, unknown>): string {
    const compiled = this.compileTemplate(template);
    return compiled(context);
  }

  /**
   * Process a URL with Handlebars templates
   * This allows dynamic URL parameters based on resource attributes
   */
  private processUrlTemplate(url: string, context: Record<string, unknown>): string {
    // Check if URL contains any handlebars templates
    if (url.includes('{{') && url.includes('}}')) {
      return this.processTemplate(url, context);
    }
    return url;
  }

  /**
   * Process headers with Handlebars templates
   * This allows dynamic header values based on resource attributes
   */
  private processHeaderTemplates(
    headers: Record<string, string>,
    context: Record<string, unknown>
  ): Record<string, string> {
    const processedHeaders: Record<string, string> = {};

    // Process each header value
    for (const [key, value] of Object.entries(headers)) {
      if (value && value.includes('{{') && value.includes('}}')) {
        processedHeaders[key] = this.processTemplate(value, context);
      } else {
        processedHeaders[key] = value;
      }
    }

    return processedHeaders;
  }

  private startQueueProcessor(): void {
    // Process queue every 5 seconds
    const interval = this.configService.get<number>('WEBHOOK_QUEUE_INTERVAL_MS', 5000);
    this.queueProcessor = setInterval(() => {
      this.processMessageQueue();
    }, interval);
  }

  private stopQueueProcessor(): void {
    if (this.queueProcessor) {
      clearInterval(this.queueProcessor);
      this.queueProcessor = null;
    }
  }

  private getQueueKey(resourceId: number): string {
    return `resource:${resourceId}`;
  }

  private async processMessageQueue(): Promise<void> {
    for (const [queueKey, items] of this.messageQueue.entries()) {
      if (items.length === 0) {
        this.messageQueue.delete(queueKey);
        continue;
      }

      // Process each item in the queue
      const now = new Date();
      const updatedItems: QueueItem[] = [];

      for (const item of items) {
        // Skip if not enough time has passed since the last attempt
        if (item.lastAttempt !== null && now.getTime() - item.lastAttempt.getTime() < item.retryDelay) {
          updatedItems.push(item);
          continue;
        }

        try {
          await this.sendWebhookRequest(item);
          // Request succeeded, don't add it back to the queue
        } catch (error) {
          // If retry is enabled and we haven't reached the max retries,
          // add it back to the queue
          if (item.retries < item.maxRetries) {
            updatedItems.push({
              ...item,
              retries: item.retries + 1,
              lastAttempt: now,
            });
          } else {
            this.logger.error(`Failed to send webhook after ${item.maxRetries} retries: ${error.message}`, error.stack);
          }
        }
      }

      if (updatedItems.length === 0) {
        this.messageQueue.delete(queueKey);
      } else {
        this.messageQueue.set(queueKey, updatedItems);
      }
    }
  }

  private async sendWebhookRequest(item: QueueItem): Promise<void> {
    try {
      const headers: Record<string, string> = {};

      // Parse headers if they exist
      if (item.headers) {
        Object.assign(headers, item.headers);
      }

      // Add timestamp header
      const timestamp = Date.now().toString();
      headers['X-Webhook-Timestamp'] = timestamp;

      // Add signature if secret is provided
      if (item.secret) {
        // Include timestamp in signature calculation
        const signaturePayload = `${timestamp}.${item.payload}`;
        const signature = this.generateSignature(signaturePayload, item.secret);
        headers[item.signatureHeader] = signature;
      }

      const config: AxiosRequestConfig = {
        method: item.method,
        url: item.url,
        headers,
        timeout: 10000, // 10 second timeout
      };

      // Add data for appropriate methods
      if (['POST', 'PUT', 'PATCH'].includes(item.method.toUpperCase())) {
        config.data = item.payload;
      }

      const response = await axios(config);

      this.logger.log(`Webhook sent successfully to ${item.url} (${response.status})`);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // The request was made and the server responded with an error status
        this.logger.error(
          `Webhook error: Server responded with ${axiosError.response.status}: ${JSON.stringify(
            axiosError.response.data
          )}`
        );
      } else if (axiosError.request) {
        // The request was made but no response was received
        this.logger.error(`Webhook error: No response received - ${axiosError.message}`);
      } else {
        // Something happened in setting up the request
        this.logger.error(`Webhook error: ${axiosError.message}`);
      }

      throw error; // Re-throw to handle in the queue processor
    }
  }

  private generateSignature(payload: string, secret: string): string {
    // Generate HMAC SHA-256 signature
    return createHmac('sha256', secret).update(payload).digest('hex');
  }

  async queueWebhook(
    webhookId: number,
    resourceId: number,
    url: string,
    method: string,
    headers: Record<string, string>,
    payload: string,
    retryEnabled: boolean,
    maxRetries: number,
    retryDelay: number,
    secret: string | null,
    signatureHeader: string
  ): Promise<void> {
    const queueKey = this.getQueueKey(resourceId);

    // Create queue if it doesn't exist
    if (!this.messageQueue.has(queueKey)) {
      this.messageQueue.set(queueKey, []);
    }

    // Add item to queue
    this.messageQueue.get(queueKey)?.push({
      webhookId,
      resourceId,
      url,
      method,
      headers,
      payload,
      retries: 0,
      maxRetries: retryEnabled ? maxRetries : 0,
      retryDelay,
      secret,
      signatureHeader,
      lastAttempt: null, // Use null instead of Date(0)
    });
  }

  @OnEvent('resource.usage.started')
  async handleResourceUsageStarted(event: ResourceUsageStartedEvent) {
    try {
      const { resourceId, startTime } = event;

      // Fetch all webhook configurations for this resource
      const webhooks = await this.webhookConfigRepository.find({
        where: { resourceId, active: true },
      });

      if (webhooks.length === 0) {
        return;
      }

      // Fetch resource details for context
      const resource = await this.resourceRepository.findOne({
        where: { id: resourceId },
        relations: ['usages'],
      });

      if (!resource) {
        this.logger.warn(`Cannot send webhooks for non-existent resource ${resourceId}`);
        return;
      }

      // Prepare context for template
      const context = {
        id: resource.id,
        name: resource.name,
        description: resource.description,
        timestamp: startTime.toISOString(),
        event: 'started',
      };

      // Process webhooks
      for (const webhook of webhooks) {
        try {
          // Process template
          const payload = this.processTemplate(webhook.inUseTemplate, context);

          // Process URL template
          const processedUrl = this.processUrlTemplate(webhook.url, context);

          // Parse headers if provided
          let headers: Record<string, string> = {};
          if (webhook.headers) {
            try {
              headers = JSON.parse(webhook.headers);

              // Process header templates
              headers = this.processHeaderTemplates(headers, context);
            } catch (error) {
              this.logger.warn(`Invalid headers JSON for webhook ${webhook.id}: ${error.message}`);
            }
          }

          // Queue webhook
          await this.queueWebhook(
            webhook.id,
            resourceId,
            processedUrl,
            webhook.method,
            headers,
            payload,
            webhook.retryEnabled,
            webhook.maxRetries,
            webhook.retryDelay,
            webhook.secret,
            webhook.signatureHeader
          );
        } catch (error) {
          this.logger.error(
            `Error processing webhook ${webhook.id} for resource ${resourceId}: ${error.message}`,
            error.stack
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error handling resource.usage.started event: ${error.message}`, error.stack);
    }
  }

  @OnEvent('resource.usage.ended')
  async handleResourceUsageEnded(event: ResourceUsageEndedEvent) {
    try {
      const { resourceId, endTime } = event;

      // Fetch all webhook configurations for this resource
      const webhooks = await this.webhookConfigRepository.find({
        where: { resourceId, active: true },
      });

      if (webhooks.length === 0) {
        return;
      }

      // Fetch resource details for context
      const resource = await this.resourceRepository.findOne({
        where: { id: resourceId },
      });

      if (!resource) {
        this.logger.warn(`Cannot send webhooks for non-existent resource ${resourceId}`);
        return;
      }

      // Prepare context for template
      const context = {
        id: resource.id,
        name: resource.name,
        description: resource.description,
        timestamp: endTime.toISOString(),
        event: 'ended',
      };

      // Process webhooks
      for (const webhook of webhooks) {
        try {
          // Process template
          const payload = this.processTemplate(webhook.notInUseTemplate, context);

          // Process URL template
          const processedUrl = this.processUrlTemplate(webhook.url, context);

          // Parse headers if provided
          let headers: Record<string, string> = {};
          if (webhook.headers) {
            try {
              headers = JSON.parse(webhook.headers);

              // Process header templates
              headers = this.processHeaderTemplates(headers, context);
            } catch (error) {
              this.logger.warn(`Invalid headers JSON for webhook ${webhook.id}: ${error.message}`);
            }
          }

          // Queue webhook
          await this.queueWebhook(
            webhook.id,
            resourceId,
            processedUrl,
            webhook.method,
            headers,
            payload,
            webhook.retryEnabled,
            webhook.maxRetries,
            webhook.retryDelay,
            webhook.secret,
            webhook.signatureHeader
          );
        } catch (error) {
          this.logger.error(
            `Error processing webhook ${webhook.id} for resource ${resourceId}: ${error.message}`,
            error.stack
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error handling resource.usage.ended event: ${error.message}`, error.stack);
    }
  }

  // Method to test a webhook without actually sending it
  async testWebhook(webhookId: number, resourceId: number): Promise<{ success: boolean; message: string }> {
    try {
      // Find the webhook configuration
      const webhook = await this.webhookConfigRepository.findOne({
        where: { id: webhookId, resourceId },
      });

      if (!webhook) {
        return {
          success: false,
          message: `Webhook configuration with ID ${webhookId} not found`,
        };
      }

      // Fetch resource details for context
      const resource = await this.resourceRepository.findOne({
        where: { id: resourceId },
      });

      if (!resource) {
        return {
          success: false,
          message: `Resource with ID ${resourceId} not found`,
        };
      }

      // Prepare test context
      const context = {
        id: resource.id,
        name: resource.name,
        description: resource.description,
        timestamp: new Date().toISOString(),
        user: { id: 0, name: 'Test User' },
        event: 'test',
      };

      // Process template
      const payload = this.processTemplate(webhook.inUseTemplate, context);

      // Process URL template
      const processedUrl = this.processUrlTemplate(webhook.url, context);

      // Parse headers if provided
      let headers: Record<string, string> = {};
      if (webhook.headers) {
        try {
          headers = JSON.parse(webhook.headers);

          // Process header templates
          headers = this.processHeaderTemplates(headers, context);
        } catch (error) {
          return {
            success: false,
            message: `Invalid headers JSON: ${error.message}`,
          };
        }
      }

      // Add signature if secret is provided
      if (webhook.secret) {
        const timestamp = Date.now().toString();
        headers['X-Webhook-Timestamp'] = timestamp;

        // Include timestamp in signature calculation
        const signaturePayload = `${timestamp}.${payload}`;
        const signature = this.generateSignature(signaturePayload, webhook.secret);
        headers[webhook.signatureHeader] = signature;
      }

      // Create Axios config for testing
      const config: AxiosRequestConfig = {
        method: webhook.method,
        url: processedUrl,
        headers,
      };

      // Add data for appropriate methods
      if (['POST', 'PUT', 'PATCH'].includes(webhook.method.toUpperCase())) {
        config.data = payload;
      }

      // Send the test request
      await axios(config);

      return {
        success: true,
        message: 'Webhook test request sent successfully',
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        return {
          success: false,
          message: `Server responded with ${axiosError.response.status}: ${JSON.stringify(axiosError.response.data)}`,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          message: `No response received - ${axiosError.message}`,
        };
      } else {
        return {
          success: false,
          message: `Error: ${axiosError.message}`,
        };
      }
    }
  }
}
