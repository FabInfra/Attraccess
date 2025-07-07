import { ApiProperty } from '@nestjs/swagger';
import { FabReader } from '@fabaccess/plugins-backend-sdk';

export class UpdateReaderResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Reader updated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'The updated reader',
    type: FabReader,
  })
  reader: FabReader;
}
