import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/server';

@Entity()
export class PasskeyAuthenticationOptions {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the authentication detail',
    example: 1,
  })
  id!: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'The date and time the NFC card was created' })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'The date and time the NFC card was last updated' })
  updatedAt!: Date;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({
    type: 'text',
    nullable: false,
  })
  challenge!: string;

  public static fromData(options: PublicKeyCredentialRequestOptionsJSON, userId: number) {
    const newPasskeyRegistrationOptions = new PasskeyAuthenticationOptions();
    newPasskeyRegistrationOptions.challenge = options.challenge;
    newPasskeyRegistrationOptions.userId = userId;
    return newPasskeyRegistrationOptions;
  }
}
