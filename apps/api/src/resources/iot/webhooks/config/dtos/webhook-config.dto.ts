import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsInt, IsOptional, IsEnum, Min, Max, IsJSON, MaxLength } from 'class-validator';
import { ToBoolean } from '../../../../../common/request-transformers';

export enum WebhookHttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export class CreateWebhookConfigDto {
  @ApiProperty({
    description: 'Friendly name for the webhook',
    example: 'Slack Notification',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description:
      'Destination URL for the webhook. Supports templating with variables like {{id}}, {{name}}, {{event}}, etc.',
    example: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
  })
  @MaxLength(2048)
  url: string;

  @ApiProperty({
    description: 'HTTP method to use for the webhook request',
    enum: WebhookHttpMethod,
    example: WebhookHttpMethod.POST,
  })
  @IsEnum(WebhookHttpMethod)
  method: WebhookHttpMethod;

  @ApiProperty({
    description: 'JSON object for custom headers. Values can include templates like {{id}}, {{name}}, etc.',
    example: '{"Content-Type": "application/json", "Authorization": "Bearer token123", "X-Resource-Name": "{{name}}"}',
    required: false,
  })
  @IsJSON()
  @IsOptional()
  headers?: string;

  @ApiProperty({
    description: 'Template for payload when resource is in use',
    example: '{"status": "in_use", "resource": "{{name}}", "user": "{{user.name}}", "timestamp": "{{timestamp}}"}',
  })
  @IsString()
  inUseTemplate: string;

  @ApiProperty({
    description: 'Template for payload when resource is not in use',
    example: '{"status": "not_in_use", "resource": "{{name}}", "timestamp": "{{timestamp}}"}',
  })
  @IsString()
  notInUseTemplate: string;

  @ApiProperty({
    description: 'Whether the webhook is active',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  active?: boolean = true;

  @ApiProperty({
    description: 'Whether to enable retry mechanism for failed webhook requests',
    example: true,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  retryEnabled?: boolean = false;

  @ApiProperty({
    description: 'Number of retry attempts for failed webhook requests (maximum 10)',
    example: 3,
    required: false,
    default: 3,
  })
  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  maxRetries?: number = 3;

  @ApiProperty({
    description: 'Delay in milliseconds between retries (maximum 10000)',
    example: 1000,
    required: false,
    default: 1000,
  })
  @IsInt()
  @Min(100)
  @Max(10000)
  @IsOptional()
  retryDelay?: number = 1000;

  @ApiProperty({
    description: 'Name of the header that contains the signature',
    example: 'X-Webhook-Signature',
    required: false,
    default: 'X-Webhook-Signature',
  })
  @IsString()
  @IsOptional()
  signatureHeader?: string = 'X-Webhook-Signature';

  @ApiProperty({
    description: 'Whether to send a webhook when a resource usage starts',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  sendOnStart?: boolean = true;

  @ApiProperty({
    description: 'Whether to send a webhook when a resource usage stops',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  sendOnStop?: boolean = true;

  @ApiProperty({
    description: 'Whether to send a webhook when a resource usage is taken over',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  sendOnTakeover?: boolean = false;

  @ApiProperty({
    description: 'Template for payload when resource usage is taken over',
    example: '{"status": "taken_over", "resource": "{{name}}", "newUser": "{{user.name}}", "previousUser": "{{previousUser.name}}", "timestamp": "{{timestamp}}"}',
    required: false,
  })
  @IsString()
  @IsOptional()
  takeoverTemplate?: string;
}

export class UpdateWebhookConfigDto {
  @ApiProperty({
    description: 'Friendly name for the webhook',
    example: 'Slack Notification',
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description:
      'Destination URL for the webhook. Supports templating with variables like {{id}}, {{name}}, {{event}}, etc.',
    example: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    required: false,
  })
  @MaxLength(2048)
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'HTTP method to use for the webhook request',
    enum: WebhookHttpMethod,
    example: WebhookHttpMethod.POST,
    required: false,
  })
  @IsEnum(WebhookHttpMethod)
  @IsOptional()
  method?: WebhookHttpMethod;

  @ApiProperty({
    description: 'JSON object for custom headers. Values can include templates like {{id}}, {{name}}, etc.',
    example: '{"Content-Type": "application/json", "Authorization": "Bearer token123", "X-Resource-Name": "{{name}}"}',
    required: false,
  })
  @IsJSON()
  @IsOptional()
  headers?: string;

  @ApiProperty({
    description: 'Template for payload when resource is in use',
    example: '{"status": "in_use", "resource": "{{name}}", "user": "{{user.name}}", "timestamp": "{{timestamp}}"}',
    required: false,
  })
  @IsString()
  @IsOptional()
  inUseTemplate?: string;

  @ApiProperty({
    description: 'Template for payload when resource is not in use',
    example: '{"status": "not_in_use", "resource": "{{name}}", "timestamp": "{{timestamp}}"}',
    required: false,
  })
  @IsString()
  @IsOptional()
  notInUseTemplate?: string;

  @ApiProperty({
    description: 'Whether to enable retry mechanism for failed webhook requests',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  retryEnabled?: boolean;

  @ApiProperty({
    description: 'Number of retry attempts for failed webhook requests (maximum 10)',
    example: 3,
    required: false,
  })
  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  maxRetries?: number;

  @ApiProperty({
    description: 'Delay in milliseconds between retries (maximum 10000)',
    example: 1000,
    required: false,
  })
  @IsInt()
  @Min(100)
  @Max(10000)
  @IsOptional()
  retryDelay?: number;

  @ApiProperty({
    description: 'Name of the header that contains the signature',
    example: 'X-Webhook-Signature',
    required: false,
  })
  @IsString()
  @IsOptional()
  signatureHeader?: string;

  @ApiProperty({
    description: 'Whether to send a webhook when a resource usage starts',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  sendOnStart?: boolean;

  @ApiProperty({
    description: 'Whether to send a webhook when a resource usage stops',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  sendOnStop?: boolean;

  @ApiProperty({
    description: 'Whether to send a webhook when a resource usage is taken over',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  sendOnTakeover?: boolean;

  @ApiProperty({
    description: 'Template for payload when resource usage is taken over',
    example: '{"status": "taken_over", "resource": "{{name}}", "newUser": "{{user.name}}", "previousUser": "{{previousUser.name}}", "timestamp": "{{timestamp}}"}',
    required: false,
  })
  @IsString()
  @IsOptional()
  takeoverTemplate?: string;
}

export class WebhookStatusDto {
  @ApiProperty({
    description: 'Whether the webhook is active',
    example: true,
  })
  @IsBoolean()
  @ToBoolean()
  active: boolean;
}

export class WebhookTestResponseDto {
  @ApiProperty({
    description: 'Whether the test was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message describing the test result',
    example: 'Webhook test request sent successfully',
  })
  message: string;
}

export class WebhookConfigResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the webhook configuration',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The ID of the resource this webhook configuration is for',
    example: 1,
  })
  resourceId: number;

  @ApiProperty({
    description: 'Friendly name for the webhook',
    example: 'Slack Notification',
  })
  name: string;

  @ApiProperty({
    description:
      'Destination URL for the webhook. Supports templating with variables like {{id}}, {{name}}, {{event}}, etc.',
    example: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
  })
  url: string;

  @ApiProperty({
    description: 'HTTP method to use for the webhook request',
    enum: WebhookHttpMethod,
    example: WebhookHttpMethod.POST,
  })
  method: string;

  @ApiProperty({
    description: 'JSON object for custom headers. Values can include templates like {{id}}, {{name}}, etc.',
    example: '{"Content-Type": "application/json", "Authorization": "Bearer token123", "X-Resource-Name": "{{name}}"}',
  })
  headers: string | null;

  @ApiProperty({
    description: 'Template for payload when resource is in use',
    example: '{"status": "in_use", "resource": "{{name}}", "user": "{{user.name}}", "timestamp": "{{timestamp}}"}',
  })
  inUseTemplate: string;

  @ApiProperty({
    description: 'Template for payload when resource is not in use',
    example: '{"status": "not_in_use", "resource": "{{name}}", "timestamp": "{{timestamp}}"}',
  })
  notInUseTemplate: string;

  @ApiProperty({
    description: 'Whether the webhook is active',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Whether to enable retry mechanism for failed webhook requests',
    example: true,
  })
  retryEnabled: boolean;

  @ApiProperty({
    description: 'Number of retry attempts for failed webhook requests',
    example: 3,
  })
  maxRetries: number;

  @ApiProperty({
    description: 'Delay in milliseconds between retries',
    example: 1000,
  })
  retryDelay: number;

  @ApiProperty({
    description: 'Name of the header that contains the signature',
    example: 'X-Webhook-Signature',
  })
  signatureHeader: string;

  @ApiProperty({
    description: 'Whether to send a webhook when a resource usage starts',
    example: true,
  })
  sendOnStart: boolean;

  @ApiProperty({
    description: 'Whether to send a webhook when a resource usage stops',
    example: true,
  })
  sendOnStop: boolean;

  @ApiProperty({
    description: 'Whether to send a webhook when a resource usage is taken over',
    example: false,
  })
  sendOnTakeover: boolean;

  @ApiProperty({
    description: 'Template for payload when resource usage is taken over',
    example: '{"status": "taken_over", "resource": "{{name}}", "newUser": "{{user.name}}", "previousUser": "{{previousUser.name}}", "timestamp": "{{timestamp}}"}',
  })
  takeoverTemplate: string | null;


  @ApiProperty({
    description: 'When the webhook configuration was created',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the webhook configuration was last updated',
  })
  updatedAt: Date;
}
