import { ApiProperty } from '@nestjs/swagger';

export class ToggleNfcCardDisabledDto {
  @ApiProperty({ description: 'The ID of the NFC card to toggle disabled status' })
  cardId!: number;
}