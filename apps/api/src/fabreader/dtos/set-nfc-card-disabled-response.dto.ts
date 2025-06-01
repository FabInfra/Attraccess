import { ApiProperty } from '@nestjs/swagger';

export class SetNfcCardDisabledResponseDto {
  @ApiProperty({ description: 'The ID of the NFC card' })
  id!: number;

  @ApiProperty({ description: 'Whether the NFC card is now disabled' })
  isDisabled!: boolean;
}