import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailChangeDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The new email address to confirm',
    example: 'newemail@example.com',
  })
  newEmail!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The verification token',
    example: 'abc123def456',
  })
  token!: string;
}