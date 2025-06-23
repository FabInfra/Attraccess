import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceBillingConfiguration } from './resourceBillingConfiguration.entity';

@Entity()
export class ResourceBillingConfigurationFixedFeeOptions {
  @PrimaryGeneratedColumn()
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

  @Column({ type: 'float' })
  @ApiProperty({
    description: 'The fixed fee amount',
    example: 11.5,
  })
  fixedFee!: number;

  @Column({ type: 'int' })
  @ApiProperty({
    description: 'The ID of the billing configuration this options belongs to',
  })
  billingConfigurationId!: number;

  @ManyToOne(() => ResourceBillingConfiguration, (billingConfiguration) => billingConfiguration.optionsForFixedFee)
  @JoinColumn({ name: 'billingConfigurationId' })
  billingConfiguration!: ResourceBillingConfiguration;
}
