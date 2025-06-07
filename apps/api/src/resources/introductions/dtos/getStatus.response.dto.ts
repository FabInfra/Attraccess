import { ApiProperty } from '@nestjs/swagger';

export class GetIntroductionStatusResponseDto {
  @ApiProperty({
    description: 'Whether the user has a valid introduction for the resource',
    example: true,
  })
  hasValidIntroduction!: boolean;
}
