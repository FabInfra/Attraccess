import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateResourceGroupDto {
  @ApiProperty({
    description: 'The name of the resource group',
    example: 'Resource Group 1',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The description of the resource group',
    example: 'This is a resource group',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
