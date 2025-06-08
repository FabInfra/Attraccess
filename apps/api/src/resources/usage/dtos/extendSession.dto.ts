import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ExtendSessionDto {
  @ApiProperty({
    description: 'Additional minutes to extend the session',
    example: 60,
    enum: [60, 120, 240, 360, 720, 1440], // +1h, +2h, +4h, +6h, +12h, +24h
  })
  @IsInt()
  @Min(1)
  @IsIn([60, 120, 240, 360, 720, 1440])
  @Type(() => Number)
  additionalMinutes: number;
}