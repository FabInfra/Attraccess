import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateResourceGroupDto {
  @ApiProperty({
    description: 'The name of the resource group',
    example: '3D Printers',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;
}
