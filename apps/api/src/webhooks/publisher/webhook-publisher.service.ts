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
    this.logger.log('Initializing WebhookPublisherService and starting queue processor.');
    this.startQueueProcessor();
  }

  private compileTemplate(template: string): HandlebarsTemplateDelegate {
    if (!this.templates[template]) {
      this.logger.debug(`Compiling new Handlebars template: ${template.substring(0, 50)}...`);
      this.templates[template] = Handlebars.compile(template);
    }
    return this.templates[template];
  }

  private processTemplate(template: string, context: Record<string, unknown>): string {
    const compiled = this.compileTemplate(template);
    const result = compiled(context);
    this.logger.debug(`Processed template: ${template.substring(0, 50)}... -> ${result.substring(0, 100)}...`);
    return result;
  }

  /**
   * Process a URL with Handlebars templates
   * This allows dynamic URL parameters based on resource attributes
   */
  private processUrlTemplate(url: string, context: Record<string, unknown>): string {
    // Check if URL contains any handlebars templates
    if (url.includes('{{') && url.includes('}}')) {
      this.logger.debug(`Processing URL template: ${url}`);
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
    let processed = false;

    // Process each header value
    for (const [key, value] of Object.entries(headers)) {
      if (value && value.includes('{{') && value.includes('}}')) {
        processedHeaders[key] = this.processTemplate(value, context);
        processed = true;
      } else {
        processedHeaders[key] = value;
      }
    }

    if (processed) {
      this.logger.debug(
        `Processed header templates. Original: ${JSON.stringify(headers)}, Processed: ${JSON.stringify(
          processedHeaders
        )}`
      );
    }

    return processedHeaders;
  }

  private startQueueProcessor(): void {
    // Process queue every 5 seconds
    const interval = this.configService.get<number>('WEBHOOK_QUEUE_INTERVAL_MS', 5000);
    this.logger.log(`Starting webhook queue processor with interval: ${interval}ms`);
    this.queueProcessor = setInterval(() => {
      this.processMessageQueue();
    }, interval);
  }

  private stopQueueProcessor(): void {
    if (this.queueProcessor) {
      this.logger.log('Stopping webhook queue processor.');
      clearInterval(this.queueProcessor);
      this.queueProcessor = null;
    }
  }

  private getQueueKey(resourceId: number): string {
    return `resource:${resourceId}`;
  }

  private async processMessageQueue(): Promise<void> {
    if (this.messageQueue.size === 0) {
      // this.logger.debug('Webhook queue is empty, skipping processing run.'); // Can be noisy
      return;
    }

    this.logger.debug(`Starting webhook queue processing run. Processing ${this.messageQueue.size} queue keys.`);

    for (const [queueKey, items] of this.messageQueue.entries()) {
      if (items.length === 0) {
        this.logger.debug(`Queue key ${queueKey} is empty, removing.`);
        this.messageQueue.delete(queueKey);
        continue;
      }

      this.logger.debug(`Processing ${items.length} items for queue key ${queueKey}.`);
      // Process each item in the queue
      const now = new Date();
      const updatedItems: QueueItem[] = [];

      for (const item of items) {
        // Skip if not enough time has passed since the last attempt
        if (item.lastAttempt !== null && now.getTime() - item.lastAttempt.getTime() < item.retryDelay) {
          this.logger.debug(
            `Skipping item for webhook ${item.webhookId} (resource ${item.resourceId}) due to retry delay. Retries: ${item.retries}.`
          );
          updatedItems.push(item);
          continue;
        }

        try {
          await this.sendWebhookRequest(item);
          this.logger.log(
            `Webhook item processed successfully for webhook ${item.webhookId} (resource ${item.resourceId}), removing from queue.`
          );
          // Request succeeded, don't add it back to the queue
        } catch (error) {
          // If retry is enabled and we haven't reached the max retries,
          // add it back to the queue
          const nextRetryCount = item.retries + 1;
          if (nextRetryCount <= item.maxRetries) {
            this.logger.warn(
              `Webhook item failed for webhook ${item.webhookId} (resource ${item.resourceId}). Requeuing for retry ${nextRetryCount}/${item.maxRetries}. Error: ${error.message}`
            );
            updatedItems.push({
              ...item,
              retries: nextRetryCount,
              lastAttempt: now,
            });
          } else {
            this.logger.error(
              `Failed to send webhook for webhook ${item.webhookId} (resource ${item.resourceId}) after ${item.maxRetries} retries. Giving up. Error: ${error.message}`,
              error.stack
            );
          }
        }
      }

      if (updatedItems.length === 0) {
        this.logger.debug(`Queue key ${queueKey} is now empty after processing, removing.`);
        this.messageQueue.delete(queueKey);
      } else if (updatedItems.length < items.length) {
        this.logger.debug(`Queue key ${queueKey} updated. ${updatedItems.length} items remaining.`);
        this.messageQueue.set(queueKey, updatedItems);
      } else {
        // No items processed successfully or failed permanently in this run, likely due to delays
        this.logger.debug(`Queue key ${queueKey} remains unchanged with ${updatedItems.length} items.`);
      }
    }
    this.logger.debug(`Finished webhook queue processing run.`);
  }

  private async sendWebhookRequest(item: QueueItem): Promise<void> {
    this.logger.debug(
      `Sending webhook request for ID ${item.webhookId} (Resource ${item.resourceId}): ${item.method} ${item.url}`
    );
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

      this.logger.debug(`Webhook headers for ${item.webhookId}: ${JSON.stringify(headers)}`);

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

      this.logger.debug(
        `Sending webhook request to ${item.url} with config: ${JSON.stringify({
          method: config.method,
          url: config.url,
          headers: config.headers,
          timeout: config.timeout,
          hasData: !!config.data,
        })}`
      );

      const response = await axios(config);

      this.logger.log(`Webhook sent successfully to ${item.url} (${response.status})`);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // The request was made and the server responded with an error status
        this.logger.error(
          `Webhook error sending to ${item.url}: Server responded with ${axiosError.response.status}: ${JSON.stringify(
            axiosError.response.data
          )}`,
          axiosError.stack // Include stack for context
        );
      } else if (axiosError.request) {
        // The request was made but no response was received
        this.logger.error(
          `Webhook error sending to ${item.url}: No response received - ${axiosError.message}`,
          axiosError.stack
        );
      } else {
        // Something happened in setting up the request
        this.logger.error(
          `Webhook error sending to ${item.url}: Request setup failed - ${axiosError.message}`,
          axiosError.stack
        );
      }

      throw error; // Re-throw to handle in the queue processor
    }
  }

  private generateSignature(payload: string, secret: string): string {
    this.logger.debug('Generating webhook signature.');
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
    this.logger.debug(`Queueing webhook ${webhookId} for resource ${resourceId} to queue key ${queueKey}`);

    // Create queue if it doesn't exist
    if (!this.messageQueue.has(queueKey)) {
      this.logger.debug(`Creating new queue for key ${queueKey}`);
      this.messageQueue.set(queueKey, []);
    }

    const newItem: QueueItem = {
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
      lastAttempt: null,
    };

    // Add item to queue
    this.messageQueue.get(queueKey)?.push(newItem);
    this.logger.log(
      `Webhook ${webhookId} (Resource ${resourceId}) added to queue ${queueKey}. Items in queue: ${
        this.messageQueue.get(queueKey)?.length
      }`
    );
  }

  @OnEvent('resource.usage.started')
  async handleResourceUsageStarted(event: ResourceUsageStartedEvent) {
    this.logger.log(`Handling resource.usage.started event for resource ID: ${event.resourceId}`);
    try {
      const { resourceId, startTime } = event;

      // Fetch all webhook configurations for this resource
      const webhooks = await this._getWebhooksForResource(resourceId);

      if (webhooks.length === 0) {
        this.logger.debug(`No active webhooks found for resource ${resourceId}.`);
        return;
      }
      this.logger.log(`Found ${webhooks.length} active webhooks for resource ${resourceId}.`);

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
          this.logger.debug(`Processing 'started' webhook ${webhook.id} for resource ${resourceId}.`);
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
          this.logger.debug(`Successfully queued 'started' webhook ${webhook.id} for resource ${resourceId}.`);
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
    this.logger.log(`Handling resource.usage.ended event for resource ID: ${event.resourceId}`);
    try {
      const { resourceId, endTime } = event;

      // Fetch all webhook configurations for this resource
      const webhooks = await this._getWebhooksForResource(resourceId);

      if (webhooks.length === 0) {
        this.logger.debug(`No active webhooks found for resource ${resourceId}.`);
        return;
      }
      this.logger.log(`Found ${webhooks.length} active webhooks for resource ${resourceId}.`);

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
          this.logger.debug(`Processing 'ended' webhook ${webhook.id} for resource ${resourceId}.`);
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
          this.logger.debug(`Successfully queued 'ended' webhook ${webhook.id} for resource ${resourceId}.`);
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
    this.logger.log(`Attempting to test webhook ID: ${webhookId} for resource ID: ${resourceId}`);
    try {
      // Find the webhook configuration
      const webhook = await this.webhookConfigRepository.findOne({
        where: { id: webhookId, resourceId },
      });

      if (!webhook) {
        this.logger.warn(`Webhook configuration with ID ${webhookId} for resource ${resourceId} not found.`);
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
        this.logger.warn(`Resource with ID ${resourceId} not found for webhook test.`);
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

      this.logger.debug(`Test context created for webhook ${webhookId}: ${JSON.stringify(context)}`);

      // Process template
      const payload = this.processTemplate(webhook.inUseTemplate, context);
      this.logger.debug(`Test payload generated for webhook ${webhookId}: ${payload.substring(0, 200)}...`);

      // Process URL template
      const processedUrl = this.processUrlTemplate(webhook.url, context);
      this.logger.debug(`Test URL processed for webhook ${webhookId}: ${processedUrl}`);

      // Parse headers if provided
      let headers: Record<string, string> = {};
      if (webhook.headers) {
        try {
          headers = JSON.parse(webhook.headers);

          // Process header templates
          headers = this.processHeaderTemplates(headers, context);
        } catch (error) {
          this.logger.error(`Invalid headers JSON during test for webhook ${webhookId}: ${error.message}`);
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

      this.logger.debug(`Test headers generated for webhook ${webhookId}: ${JSON.stringify(headers)}`);

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

      this.logger.log(`Sending test request for webhook ${webhookId} to ${processedUrl}`);
      // Send the test request
      const response = await axios(config);
      this.logger.log(`Webhook test request for ${webhookId} sent successfully. Status: ${response.status}`);

      return {
        success: true,
        message: 'Webhook test request sent successfully',
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        this.logger.error(
          `Webhook test failed for ${webhookId}: Server responded with ${axiosError.response.status}: ${JSON.stringify(
            axiosError.response.data
          )}`,
          axiosError.stack
        );
        return {
          success: false,
          message: `Server responded with ${axiosError.response.status}: ${JSON.stringify(axiosError.response.data)}`,
        };
      } else if (axiosError.request) {
        this.logger.error(
          `Webhook test failed for ${webhookId}: No response received - ${axiosError.message}`,
          axiosError.stack
        );
        return {
          success: false,
          message: `No response received - ${axiosError.message}`,
        };
      } else {
        this.logger.error(`Webhook test failed for ${webhookId}: Error ${axiosError.message}`, axiosError.stack);
        return {
          success: false,
          message: `Error: ${axiosError.message}`,
        };
      }
    }
  }

  /**
   * Fetches active webhook configurations for a given resource ID.
   * @param resourceId The ID of the resource.
   * @returns A promise resolving to an array of WebhookConfig entities.
   */
  private async _getWebhooksForResource(resourceId: number): Promise<WebhookConfig[]> {
    this.logger.debug(`Fetching active webhooks for resource ID: ${resourceId}`);
    try {
      const webhooks = await this.webhookConfigRepository.find({
        where: { resourceId, active: true },
      });
      this.logger.debug(`Found ${webhooks.length} active webhooks for resource ID: ${resourceId}`);
      return webhooks;
    } catch (error) {
      this.logger.error(`Failed to fetch webhooks for resource ID ${resourceId}: ${error.message}`, error.stack);
      return []; // Return empty array on error to prevent downstream failures
    }
  }
}
