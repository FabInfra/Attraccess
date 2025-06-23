import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceBillingConfigurationFixedFeeOptions } from './resourceBillingConfigurationFixedFeeOptions.entity';
import { Resource } from './resource.entity';

export enum ResourceBillingConfigurationType {
  FIXED_FEE = 'fixed-fee',
  SESSION_DURATION = 'session-duration',
  TRACKED_USAGE = 'tracked-usage',
}

@Entity()
export class ResourceBillingConfiguration {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the resource billing configuration',
    example: 1,
  })
  id!: number;

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

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'The name of the resource billing configuration, will be shown in the billing statement',
    example: 'Power consumption',
  })
  name!: string;

  @Column({ type: 'simple-enum', enum: ResourceBillingConfigurationType })
  @ApiProperty({
    description: 'The type of the resource billing configuration',
    example: ResourceBillingConfigurationType.FIXED_FEE,
  })
  type!: ResourceBillingConfigurationType;

  @Column({ type: 'int' })
  @ApiProperty({
    description: 'The ID of the resource this billing configuration belongs to',
  })
  resourceId!: number;

  @ManyToOne(() => Resource, (resource) => resource.billingConfigurations)
  @JoinColumn({ name: 'resourceId' })
  @ApiProperty({
    description: 'The resource this billing configuration belongs to',
    type: () => Resource,
  })
  resource!: Resource;

  @OneToMany(() => ResourceBillingConfigurationFixedFeeOptions, (options) => options.billingConfiguration)
  @ApiProperty({
    description: 'The options for the fixed fee billing configuration',
    type: () => ResourceBillingConfigurationFixedFeeOptions,
  })
  optionsForFixedFee!: ResourceBillingConfigurationFixedFeeOptions[];
}
