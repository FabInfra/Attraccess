import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateResourceGroupDto {
  @ApiProperty({
    description: 'The name of the resource group',
    example: 'Resource Group 1',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the resource group',
    example: 'This is a resource group',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
