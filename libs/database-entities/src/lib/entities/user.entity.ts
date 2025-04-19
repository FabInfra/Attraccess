import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ResourceIntroduction } from './resourceIntroduction.entity';
import { ResourceUsage } from './resourceUsage.entity';
import { RevokedToken } from './revokedToken.entity';
import { AuthenticationDetail } from './authenticationDetail.entity';
import { ResourceIntroducer } from './resourceIntroducer';

export class SystemPermissions {
  @Column({ default: false })
  @ApiProperty({
    description: 'Whether the user can manage resources',
    example: false,
  })
  canManageResources!: boolean;

  @Column({ default: false })
  @ApiProperty({
    description: 'Whether the user can manage system configuration',
    example: false,
  })
  canManageSystemConfiguration!: boolean;

  @Column({ default: false })
  @ApiProperty({
    description: 'Whether the user can manage users',
    example: false,
  })
  canManageUsers!: boolean;
}

export type SystemPermission = keyof SystemPermissions;

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  id!: number;

  @Column({
    unique: true,
  })
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  username!: string;

  @Column({ unique: true })
  @Exclude()
  email!: string;

  @Column({ default: false })
  @ApiProperty({
    description: 'Whether the user has verified their email address',
    example: true,
  })
  isEmailVerified!: boolean;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  emailVerificationToken!: string | null;

  @Column({ type: 'datetime', nullable: true })
  @Exclude()
  emailVerificationTokenExpiresAt!: Date | null;

  @Column(() => SystemPermissions, { prefix: '' })
  @ApiProperty({
    description: 'System-wide permissions for the user',
    example: {
      canManageResources: true,
      canManageSystemConfiguration: false,
      canManageUsers: false,
    },
  })
  systemPermissions!: SystemPermissions;

  @CreateDateColumn()
  @ApiProperty({
    description: 'When the user was created',
  })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'When the user was last updated',
  })
  updatedAt!: Date;

  @OneToMany(() => ResourceIntroduction, (introduction) => introduction.receiverUser, {
    onDelete: 'CASCADE',
  })
  resourceIntroductions!: ResourceIntroduction[];

  @OneToMany(() => ResourceUsage, (usage) => usage.user, {
    onDelete: 'SET NULL',
  })
  resourceUsages!: ResourceUsage[];

  @OneToMany(() => RevokedToken, (token) => token.user, {
    onDelete: 'CASCADE',
  })
  revokedTokens!: RevokedToken[];

  @OneToMany(() => AuthenticationDetail, (detail) => detail.user, {
    onDelete: 'CASCADE',
  })
  authenticationDetails!: AuthenticationDetail[];

  @OneToMany(() => ResourceIntroducer, (introducer) => introducer.user, {
    onDelete: 'CASCADE',
  })
  resourceIntroducerPermissions!: ResourceIntroducer[];
}
