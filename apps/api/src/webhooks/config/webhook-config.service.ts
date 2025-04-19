import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookConfig, Resource } from '@attraccess/database-entities';
import { randomBytes, createHmac } from 'crypto';

@Injectable()
export class WebhookConfigService {
  private readonly logger = new Logger(WebhookConfigService.name);

  constructor(
    @InjectRepository(WebhookConfig)
    private readonly webhookConfigRepository: Repository<WebhookConfig>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {}

  async findAllByResourceId(resourceId: number): Promise<WebhookConfig[]> {
    this.logger.debug(`Finding all webhook configs for resource ID: ${resourceId}`);
    const configs = await this.webhookConfigRepository.find({
      where: { resourceId },
      order: { id: 'ASC' },
    });
    this.logger.debug(`Found ${configs.length} webhook configs for resource ID: ${resourceId}`);
    return configs;
  }

  async findById(id: number, resourceId: number): Promise<WebhookConfig> {
    this.logger.debug(`Finding webhook config by ID: ${id} for resource ID: ${resourceId}`);
    const webhook = await this.webhookConfigRepository.findOne({
      where: { id, resourceId },
    });

    if (!webhook) {
      this.logger.warn(`Webhook config ID ${id} not found for resource ${resourceId}.`);
      throw new NotFoundException(`Webhook configuration with ID ${id} not found`);
    }

    this.logger.debug(`Found webhook config ID ${id} for resource ${resourceId}.`);
    return webhook;
  }

  async create(resourceId: number, data: Partial<WebhookConfig>): Promise<WebhookConfig> {
    this.logger.debug(
      `Attempting to create webhook config for resource ${resourceId} with data: ${JSON.stringify(data)}` // Data likely doesn't contain secret yet
    );
    // Check if resource exists
    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId },
    });

    if (!resource) {
      this.logger.warn(`Create webhook config failed: Resource ${resourceId} not found.`);
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }

    // Generate a secure random secret
    this.logger.debug(`Generating secret for new webhook config.`);
    const secret = this.generateSecret();
    this.logger.debug(`Generated secret: ${secret.substring(0, 10)}...[REDACTED]`);

    // Create and save the webhook configuration
    const webhook = this.webhookConfigRepository.create({
      ...data,
      resourceId,
      secret,
    });

    const savedWebhook = await this.webhookConfigRepository.save(webhook);
    this.logger.log(`Successfully created webhook config ID ${savedWebhook.id} for resource ${resourceId}`);
    return savedWebhook;
  }

  async update(id: number, resourceId: number, data: Partial<WebhookConfig>): Promise<WebhookConfig> {
    // Omit secret from logs if present in data
    const { secret, ...loggableData } = data;
    this.logger.debug(
      `Attempting to update webhook config ID ${id} for resource ${resourceId} with data: ${JSON.stringify(
        loggableData
      )}`
    );

    // First check if the webhook exists
    await this.findById(id, resourceId);

    // Update the webhook
    this.logger.debug(`Performing update for webhook config ID ${id}`);
    await this.webhookConfigRepository.update({ id, resourceId }, data);

    // Return the updated webhook
    this.logger.log(`Successfully updated webhook config ID ${id}. Fetching updated record.`);
    return this.findById(id, resourceId);
  }

  async delete(id: number, resourceId: number): Promise<void> {
    this.logger.debug(`Attempting to delete webhook config ID ${id} for resource ${resourceId}`);
    // First check if the webhook exists
    await this.findById(id, resourceId);

    // Delete the webhook
    this.logger.debug(`Performing delete for webhook config ID ${id}`);
    await this.webhookConfigRepository.delete({ id, resourceId });
    this.logger.log(`Successfully deleted webhook config ID ${id}`);
  }

  async updateStatus(id: number, resourceId: number, active: boolean): Promise<WebhookConfig> {
    this.logger.debug(`Updating status for webhook config ID ${id} to active=${active}`);
    return this.update(id, resourceId, { active });
  }

  async regenerateSecret(id: number, resourceId: number): Promise<WebhookConfig> {
    this.logger.debug(`Regenerating secret for webhook config ID ${id}`);
    // Generate a new secret
    const secret = this.generateSecret();
    this.logger.debug(`Generated new secret: ${secret.substring(0, 10)}...[REDACTED]`);

    // Update the webhook with the new secret
    return this.update(id, resourceId, { secret });
  }

  generateSecret(): string {
    this.logger.debug('Generating new webhook secret string.');
    // Generate a secure random secret with prefix for type identification
    return `whsec_${randomBytes(24).toString('hex')}`;
  }

  generateSignature(payload: string, secret: string): string {
    // Generate HMAC SHA-256 signature
    return createHmac('sha256', secret).update(payload).digest('hex');
  }

  async testWebhook(id: number, resourceId: number): Promise<{ success: boolean; message: string }> {
    this.logger.debug(`Attempting to test webhook config ID ${id} for resource ${resourceId}`);
    try {
      // Get the webhook configuration
      const webhook = await this.findById(id, resourceId);

      // Validate webhook configuration
      if (!webhook.url) {
        this.logger.warn(`Test webhook failed for ID ${id}: URL not configured.`);
        return {
          success: false,
          message: 'Webhook URL is not configured',
        };
      }

      this.logger.log(`Webhook test simulation successful for ID ${id}.`);
      // For testing purposes, we simulate a successful response
      // The actual HTTP request will be handled by the WebhookPublisherService
      let message = 'Webhook test request simulated successfully';

      // Add information about signature verification if a secret is set
      if (webhook.secret) {
        message += `. To verify signatures, extract the X-Webhook-Timestamp header and combine it with the payload as "\${timestamp}.\${payload}", then compute the HMAC SHA-256 signature with your secret key.`;
      }

      return {
        success: true,
        message,
      };
    } catch (error) {
      this.logger.error(`Error testing webhook: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error testing webhook: ${error.message}`,
      };
    }
  }
}
