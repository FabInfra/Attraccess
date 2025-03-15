import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Resource } from './resource.entity';
import { ResourceIntroductionUser } from './resourceIntroductionUser.entity';
import { ResourceIntroduction } from './resourceIntroduction.entity';

@Entity()
export class ResourceGroup {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the resource group',
    example: 1,
  })
  id!: number;

  @Column()
  @ApiProperty({
    description: 'The name of the resource group',
    example: '3D Printers',
  })
  name!: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'When the resource group was created',
  })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'When the resource group was last updated',
  })
  updatedAt!: Date;

  @OneToMany(() => Resource, (resource) => resource.group)
  resources!: Resource[];

  @OneToMany(
    () => ResourceIntroductionUser,
    (introductionUser) => introductionUser.resourceGroup
  )
  introductionUsers!: ResourceIntroductionUser[];

  @OneToMany(
    () => ResourceIntroduction,
    (introduction) => introduction.resourceGroup
  )
  introductions!: ResourceIntroduction[];
}
