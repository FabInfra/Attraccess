import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Resource } from './resource.entity';

@Entity()
export class WebhookConfig {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the webhook configuration',
    example: 1,
  })
  id!: number;

  @Column({ type: 'integer' })
  @ApiProperty({
    description: 'The ID of the resource this webhook configuration is for',
    example: 1,
  })
  resourceId!: number;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Friendly name for the webhook',
    example: 'Slack Notification',
  })
  name!: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Destination URL for the webhook',
    example: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
  })
  url!: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'HTTP method to use for the webhook request',
    example: 'POST',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
  method!: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'JSON object for custom headers',
    example: '{"Content-Type": "application/json", "Authorization": "Bearer token123"}',
    required: false,
  })
  headers!: string | null;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Template for payload when resource is in use',
    example: '{"status": "in_use", "resource": "{{name}}", "user": "{{user.name}}", "timestamp": "{{timestamp}}"}',
  })
  inUseTemplate!: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Template for payload when resource is not in use',
    example: '{"status": "not_in_use", "resource": "{{name}}", "timestamp": "{{timestamp}}"}',
  })
  notInUseTemplate!: string;

  @Column({ default: true, type: 'boolean' })
  @ApiProperty({
    description: 'Whether the webhook is active',
    example: true,
  })
  active!: boolean;

  @Column({ default: false, type: 'boolean' })
  @ApiProperty({
    description: 'Whether to enable retry mechanism for failed webhook requests',
    example: true,
  })
  retryEnabled!: boolean;

  @Column({ default: 3, type: 'integer' })
  @ApiProperty({
    description: 'Number of retry attempts for failed webhook requests (maximum 10)',
    example: 3,
  })
  maxRetries!: number;

  @Column({ default: 1000, type: 'integer' })
  @ApiProperty({
    description: 'Delay in milliseconds between retries (maximum 10000)',
    example: 1000,
  })
  retryDelay!: number;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({
    description: 'Secret key for signing webhook payloads',
    example: 'whsec_abcdef123456789',
    required: false,
  })
  secret!: string | null;

  @Column({ default: 'X-Webhook-Signature', type: 'text' })
  @ApiProperty({
    description: 'Name of the header that contains the signature',
    example: 'X-Webhook-Signature',
  })
  signatureHeader!: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'When the webhook configuration was created',
  })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'When the webhook configuration was last updated',
  })
  updatedAt!: Date;

  @ManyToOne(() => Resource, undefined, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resourceId' })
  resource!: Resource;
}
