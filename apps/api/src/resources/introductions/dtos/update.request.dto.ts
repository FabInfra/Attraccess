import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateResourceIntroductionDto {
  @ApiProperty({
    description: 'The comment for the action',
    example: 'This is a comment',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
