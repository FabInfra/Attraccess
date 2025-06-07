import { ApiProperty } from '@nestjs/swagger';

export class CanControlResponseDto {
  @ApiProperty({
    description: 'Whether the user can control the resource',
    type: Boolean,
  })
  canControl: boolean;
}
