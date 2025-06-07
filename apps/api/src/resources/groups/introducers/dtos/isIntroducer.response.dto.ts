import { ApiProperty } from '@nestjs/swagger';

export class IsResourceGroupIntroducerResponseDto {
  @ApiProperty({
    description: 'Whether the user is an introducer for the resource',
    type: Boolean,
  })
  isIntroducer: boolean;
}
