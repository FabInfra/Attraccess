import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class StartUsageSessionDto {
  @ApiProperty({
    description: 'Optional notes about the usage session',
    required: false,
    example: 'Printing a prototype case',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Whether to force takeover of an existing session (only works if resource allows takeover)',
    required: false,
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  forceTakeOver?: boolean;

  @ApiProperty({
    description: 'Estimated session duration in minutes',
    required: false,
    example: 120,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  estimatedDurationMinutes?: number;
}
