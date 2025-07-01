import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminChangeEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The new email address',
    example: 'newemail@example.com',
  })
  newEmail!: string;
}