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
import { MqttServer } from './mqttServer.entity';

@Entity()
export class MqttResourceConfig {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the MQTT resource configuration',
    example: 1,
  })
  id!: number;

  @Column({ type: 'integer' })
  @ApiProperty({
    description: 'The ID of the resource this configuration is for',
    example: 1,
  })
  resourceId!: number;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Name of this MQTT configuration',
    example: 'Primary Status Feed',
  })
  name!: string;

  @Column({ type: 'integer' })
  @ApiProperty({
    description: 'The ID of the MQTT server to publish to',
    example: 1,
  })
  serverId!: number;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Topic template using Handlebars for in-use status',
    example: 'resources/{{id}}/status',
  })
  inUseTopic!: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Message template using Handlebars for in-use status',
    example: '{"status": "in_use", "resourceId": "{{id}}", "timestamp": "{{timestamp}}"}',
  })
  inUseMessage!: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Topic template using Handlebars for not-in-use status',
    example: 'resources/{{id}}/status',
  })
  notInUseTopic!: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Message template using Handlebars for not-in-use status',
    example: '{"status": "not_in_use", "resourceId": "{{id}}", "timestamp": "{{timestamp}}"}',
  })
  notInUseMessage!: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'When the MQTT resource configuration was created',
  })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'When the MQTT resource configuration was last updated',
  })
  updatedAt!: Date;

  @ManyToOne(() => Resource, undefined, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resourceId' })
  resource!: Resource;

  @ManyToOne(() => MqttServer, (server) => server.resourceConfigs)
  @JoinColumn({ name: 'serverId' })
  server!: MqttServer;
}
