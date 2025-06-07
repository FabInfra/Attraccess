import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateResourceGroupIntroductionDto {
  @ApiProperty({
    description: 'The comment for the action',
    example: 'This is a comment',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
