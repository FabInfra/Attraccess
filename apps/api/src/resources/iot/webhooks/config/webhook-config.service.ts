import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookConfig, Resource } from '@fabaccess/database-entities';
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
    return this.webhookConfigRepository.find({
      where: { resourceId },
      order: { id: 'ASC' },
    });
  }

  async findById(id: number, resourceId: number): Promise<WebhookConfig> {
    const webhook = await this.webhookConfigRepository.findOne({
      where: { id, resourceId },
    });

    if (!webhook) {
      throw new NotFoundException(`Webhook configuration with ID ${id} not found`);
    }

    return webhook;
  }

  async create(resourceId: number, data: Partial<WebhookConfig>): Promise<WebhookConfig> {
    // Check if resource exists
    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }

    // Generate a secure random secret
    const secret = this.generateSecret();

    // Create and save the webhook configuration
    const webhook = this.webhookConfigRepository.create({
      ...data,
      resourceId,
      secret,
    });

    return this.webhookConfigRepository.save(webhook);
  }

  async update(id: number, resourceId: number, data: Partial<WebhookConfig>): Promise<WebhookConfig> {
    // First check if the webhook exists
    await this.findById(id, resourceId);

    // Update the webhook
    await this.webhookConfigRepository.update({ id, resourceId }, data);

    // Return the updated webhook
    return this.findById(id, resourceId);
  }

  async delete(id: number, resourceId: number): Promise<void> {
    // First check if the webhook exists
    await this.findById(id, resourceId);

    // Delete the webhook
    await this.webhookConfigRepository.delete({ id, resourceId });
  }

  async updateStatus(id: number, resourceId: number, active: boolean): Promise<WebhookConfig> {
    return this.update(id, resourceId, { active });
  }

  async regenerateSecret(id: number, resourceId: number): Promise<WebhookConfig> {
    // Generate a new secret
    const secret = this.generateSecret();

    // Update the webhook with the new secret
    return this.update(id, resourceId, { secret });
  }

  generateSecret(): string {
    // Generate a secure random secret with prefix for type identification
    return `whsec_${randomBytes(24).toString('hex')}`;
  }

  generateSignature(payload: string, secret: string): string {
    // Generate HMAC SHA-256 signature
    return createHmac('sha256', secret).update(payload).digest('hex');
  }

  async testWebhook(id: number, resourceId: number): Promise<{ success: boolean; message: string }> {
    try {
      // Get the webhook configuration
      const webhook = await this.findById(id, resourceId);

      // Validate webhook configuration
      if (!webhook.url) {
        return {
          success: false,
          message: 'Webhook URL is not configured',
        };
      }

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
