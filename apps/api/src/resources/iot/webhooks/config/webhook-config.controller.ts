import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { WebhookConfigService } from './webhook-config.service';
import {
  CreateWebhookConfigDto,
  UpdateWebhookConfigDto,
  WebhookStatusDto,
  WebhookTestResponseDto,
  WebhookConfigResponseDto,
} from './dtos/webhook-config.dto';
import { WebhookConfig } from '@fabaccess/database-entities';
import { Auth } from '@fabaccess/plugins-backend-sdk';

@ApiTags('Webhooks')
@Controller('resources/:resourceId/webhooks')
@Auth('canManageResources')
export class WebhookConfigController {
  constructor(private readonly webhookConfigService: WebhookConfigService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all webhook configurations for a resource',
    operationId: 'webhookConfigGetAll',
  })
  @ApiParam({ name: 'resourceId', type: 'number', description: 'Resource ID' })
  @ApiResponse({
    status: 200,
    description: 'List of webhook configurations for the resource',
    type: [WebhookConfigResponseDto],
  })
  async getAll(@Param('resourceId', ParseIntPipe) resourceId: number): Promise<WebhookConfig[]> {
    return this.webhookConfigService.findAllByResourceId(resourceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get webhook configuration by ID', operationId: 'webhookConfigGetOneById' })
  @ApiParam({ name: 'resourceId', type: 'number', description: 'Resource ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Webhook configuration ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The webhook configuration',
    type: WebhookConfigResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Webhook configuration not found' })
  async getOneById(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<WebhookConfig> {
    return this.webhookConfigService.findById(id, resourceId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new webhook configuration',
    description: `
      Creates a new webhook configuration for a resource.
      
      ## URL Templating
      
      The webhook URL can include Handlebars templates that will be replaced with context values when the webhook is triggered.
      
      Example: \`https://example.com/webhooks/{{id}}/{{event}}\`
      
      ## Header Templating
      
      Header values can include Handlebars templates that will be replaced with context values when the webhook is triggered.
      
      Example: \`{"Authorization": "Bearer {{user.id}}", "X-Resource-Name": "{{name}}"}\`
      
      ## Available Template Variables
      
      Available template variables for URLs, headers, and payloads:
      - \`id\`: Resource ID
      - \`name\`: Resource name
      - \`description\`: Resource description
      - \`timestamp\`: ISO timestamp of the event
      - \`user.id\`: ID of the user who triggered the event
      - \`event\`: Either "started" or "ended" depending on the resource usage state
    `,
    operationId: 'webhookConfigCreateOne',
  })
  @ApiParam({ name: 'resourceId', type: 'number', description: 'Resource ID' })
  @ApiResponse({
    status: 201,
    description: 'The webhook configuration has been created',
    type: WebhookConfigResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async createOne(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Body() createWebhookConfigDto: CreateWebhookConfigDto
  ): Promise<WebhookConfig> {
    return this.webhookConfigService.create(resourceId, createWebhookConfigDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update webhook configuration', operationId: 'webhookConfigUpdateOne' })
  @ApiParam({ name: 'resourceId', type: 'number', description: 'Resource ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Webhook configuration ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The webhook configuration has been updated',
    type: WebhookConfigResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Webhook configuration not found' })
  async updateOne(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWebhookConfigDto: UpdateWebhookConfigDto
  ): Promise<WebhookConfig> {
    return this.webhookConfigService.update(id, resourceId, updateWebhookConfigDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete webhook configuration', operationId: 'webhookConfigDeleteOne' })
  @ApiParam({ name: 'resourceId', type: 'number', description: 'Resource ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Webhook configuration ID',
  })
  @ApiResponse({
    status: 204,
    description: 'The webhook configuration has been deleted',
  })
  @ApiResponse({ status: 404, description: 'Webhook configuration not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return this.webhookConfigService.delete(id, resourceId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Enable or disable webhook', operationId: 'webhookConfigUpdateStatus' })
  @ApiParam({ name: 'resourceId', type: 'number', description: 'Resource ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Webhook configuration ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The webhook status has been updated',
    type: WebhookConfigResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Webhook configuration not found' })
  async updateStatus(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: WebhookStatusDto
  ): Promise<WebhookConfig> {
    return this.webhookConfigService.updateStatus(id, resourceId, statusDto.active);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test webhook', operationId: 'webhookConfigTest' })
  @ApiParam({ name: 'resourceId', type: 'number', description: 'Resource ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Webhook configuration ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Test result',
    type: WebhookTestResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Webhook configuration not found' })
  async test(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<WebhookTestResponseDto> {
    return this.webhookConfigService.testWebhook(id, resourceId);
  }

  @Post(':id/regenerate-secret')
  @ApiOperation({ summary: 'Regenerate webhook secret', operationId: 'webhookConfigRegenerateSecret' })
  @ApiParam({ name: 'resourceId', type: 'number', description: 'Resource ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Webhook configuration ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The webhook secret has been regenerated',
    type: WebhookConfigResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Webhook configuration not found' })
  @ApiOperation({
    summary: 'Signature Verification',
    description: `
      When signature verification is enabled, each webhook request includes:
      
      1. A timestamp header (X-Webhook-Timestamp)
      2. A signature header (configurable, default: X-Webhook-Signature)
      
      To verify the signature:
      1. Extract the timestamp from the X-Webhook-Timestamp header
      2. Combine the timestamp and payload as "\${timestamp}.\${payload}"
      3. Compute the HMAC-SHA256 signature using your webhook secret
      4. Compare the resulting signature with the value in the signature header
      
      Example (Node.js):
      \`\`\`javascript
      const crypto = require('crypto');
      
      function verifySignature(payload, timestamp, signature, secret) {
        const signaturePayload = \`\${timestamp}.\${payload}\`;
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(signaturePayload)
          .digest('hex');
        
        return crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSignature)
        );
      }
      \`\`\`
    `,
  })
  async regenerateSecret(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<WebhookConfig> {
    return this.webhookConfigService.regenerateSecret(id, resourceId);
  }
}
