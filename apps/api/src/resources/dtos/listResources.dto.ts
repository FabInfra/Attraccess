import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListResourcesDto {
  @ApiProperty({
    description: 'Page number (1-based)',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: 'Search term to filter resources',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Group ID to filter resources. Send -1 to find ungrouped resources.',
    required: false,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  groupId?: number;

  @ApiProperty({
    description: 'Resource IDs to filter resources',
    required: false,
    type: [Number],
  })
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  ids?: number[];
}
