import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateResourceGroupDto {
  @ApiProperty({
    description: 'The name of the resource group',
    example: '3D Printers',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
