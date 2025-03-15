import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { FileUpload } from '../../common/types/file-upload.types';
import { Type } from 'class-transformer';

export class UpdateResourceDto {
  @ApiProperty({
    description: 'The name of the resource',
    example: '3D Printer',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'A detailed description of the resource',
    example: 'Prusa i3 MK3S+ 3D printer with 0.4mm nozzle',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The ID of the group this resource belongs to',
    example: 15,
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  groupId?: number;

  @ApiProperty({
    description: 'New resource image file',
    required: false,
    type: 'string',
    format: 'binary',
  })
  image?: FileUpload;
}
