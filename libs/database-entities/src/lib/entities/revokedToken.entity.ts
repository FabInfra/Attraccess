import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class RevokedToken {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the revoked token',
    example: 1,
  })
  id!: number;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'The JWT tokens ID that was revoked',
  })
  tokenId!: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'When the token was revoked',
  })
  revokedAt!: Date;
}
