import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Resource } from './resource.entity';
import { User } from './user.entity';
import { ResourceGroup } from './resourceGroup.entity';

@Entity()
export class ResourceIntroducer {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the introduction permission',
    example: 1,
  })
  id!: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'The ID of the resource',
    example: 1,
  })
  resourceId!: number;

  @Column()
  @ApiProperty({
    description: 'The ID of the user who can give introductions',
    example: 1,
  })
  userId!: number;

  @CreateDateColumn()
  @ApiProperty({
    description: 'When the permission was granted',
  })
  grantedAt!: Date;

  @ManyToOne(() => Resource)
  @JoinColumn({ name: 'resourceId' })
  resource!: Resource;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    description: 'The user who can give introductions',
    type: () => User,
  })
  user!: User;

  @ManyToOne(() => ResourceGroup)
  @JoinColumn({ name: 'resourceGroupId' })
  resourceGroup!: ResourceGroup;
}
