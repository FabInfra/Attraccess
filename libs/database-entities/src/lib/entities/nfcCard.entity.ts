import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

import { PrimaryGeneratedColumn } from 'typeorm';

class NTag424Keys {
  @Column({
    type: 'text',
    nullable: false,
    default: Array(16).fill('0').join(''),
  })
  '0'!: string; // master key
}

@Entity()
export class NFCCard {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The ID of the NFC card' })
  id!: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  @ApiProperty({ description: 'The UID of the NFC card' })
  uid!: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @ApiProperty({ description: 'The ID of the user that owns the NFC card' })
  userId!: number;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  @ApiProperty({ description: 'Whether the NFC card is temporarily disabled' })
  isDisabled!: boolean;

  @Column(() => NTag424Keys, { prefix: 'key_' })
  @Exclude()
  keys!: NTag424Keys;

  @CreateDateColumn()
  @ApiProperty({ description: 'The date and time the NFC card was created' })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'The date and time the NFC card was last updated' })
  updatedAt!: Date;
}
