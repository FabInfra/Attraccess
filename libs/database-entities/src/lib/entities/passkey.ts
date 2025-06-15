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
import { AuthenticatorTransportFuture, VerifiedRegistrationResponse } from '@simplewebauthn/server';

@Entity()
export class Passkey {
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

  @Column({
    type: 'integer',
    nullable: false,
  })
  userId!: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({
    type: 'text',
    nullable: false,
  })
  passKeyId!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  publicKey!: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  counter!: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  transports!: AuthenticatorTransportFuture[];

  @Column({
    type: 'text',
    nullable: false,
  })
  deviceType!: string;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  backedUp!: boolean;

  public static fromData(registrationInfo: VerifiedRegistrationResponse['registrationInfo'], userId: number) {
    const newPasskey = new Passkey();
    newPasskey.userId = userId;
    newPasskey.passKeyId = registrationInfo.credential.id;
    newPasskey.publicKey = Buffer.from(registrationInfo.credential.publicKey).toString('base64');
    newPasskey.counter = registrationInfo.credential.counter;
    newPasskey.transports = registrationInfo.credential.transports;
    newPasskey.deviceType = registrationInfo.credentialDeviceType;
    newPasskey.backedUp = registrationInfo.credentialBackedUp;
    return newPasskey;
  }
}
