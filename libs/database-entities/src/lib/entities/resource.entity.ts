import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ViewEntity,
  ViewColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceIntroduction } from './resourceIntroduction.entity';
import { ResourceUsage } from './resourceUsage.entity';
import { ResourceIntroducer } from './resourceIntroducer';
import { MqttResourceConfig } from './mqttResourceConfig.entity';
import { WebhookConfig } from './webhookConfig.entity';
import { ResourceGroup } from './resourceGroup.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the resource',
    example: 1,
  })
  id!: number;

  @Column()
  @ApiProperty({
    description: 'The name of the resource',
    example: '3D Printer',
  })
  name!: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'A detailed description of the resource',
    example: 'Prusa i3 MK3S+ 3D printer with 0.4mm nozzle',
    required: false,
  })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'The filename of the resource image',
    example: '1234567890_abcdef.jpg',
    required: false,
  })
  imageFilename!: string | null;

  @CreateDateColumn()
  @ApiProperty({
    description: 'When the resource was created',
  })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'When the resource was last updated',
  })
  updatedAt!: Date;

  @OneToMany(() => ResourceIntroduction, (introduction) => introduction.resource)
  introductions!: ResourceIntroduction[];

  @OneToMany(() => ResourceUsage, (usage) => usage.resource)
  usages!: ResourceUsage[];

  @OneToMany(() => ResourceIntroducer, (introducer) => introducer.resource)
  introducers!: ResourceIntroducer[];

  @OneToOne(() => MqttResourceConfig, (config) => config.resource)
  mqttConfig!: MqttResourceConfig;

  @OneToMany(() => WebhookConfig, (config) => config.resource)
  webhookConfigs!: WebhookConfig[];

  @ManyToMany(() => ResourceGroup, (group) => group.resources)
  @JoinTable()
  @ApiProperty({
    description: 'The groups the resource belongs to',
    type: ResourceGroup,
    isArray: true,
  })
  groups!: ResourceGroup[];
}

@ViewEntity({
  materialized: false,
  expression: (connection) =>
    connection
      .createQueryBuilder()
      .select('resource.id', 'id')
      .addSelect('COALESCE(SUM(usage.usageInMinutes), -1)', 'totalUsageMinutes')
      .from(Resource, 'resource')
      .leftJoin(ResourceUsage, 'usage', 'usage.resourceId = resource.id')
      .groupBy('resource.id'),
})
export class ResourceComputedView {
  @ViewColumn()
  id!: number;

  @ViewColumn()
  totalUsageMinutes!: number;
}
