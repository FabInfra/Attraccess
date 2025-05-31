import { ApiProperty } from '@nestjs/swagger';

export class SetNfcCardDisabledDto {
  @ApiProperty({ description: 'The ID of the NFC card to update disabled status' })
  cardId!: number;
  
  @ApiProperty({ description: 'Whether the NFC card should be disabled' })
  isDisabled!: boolean;
}