import { Resource } from '@fabaccess/database-entities';
import { PaginatedResponse } from '../../types/response';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResourceResponseDto extends PaginatedResponse<Resource> {
  @ApiProperty({ type: [Resource] })
  data: Resource[];
}
