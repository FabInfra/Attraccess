import { ApiProperty } from '@nestjs/swagger';

export class ToggleNfcCardDisabledResponseDto {
  @ApiProperty({ description: 'The ID of the NFC card' })
  id!: number;

  @ApiProperty({ description: 'Whether the NFC card is now disabled' })
  isDisabled!: boolean;
}