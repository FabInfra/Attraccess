import { ResourceUsage } from '@fabaccess/database-entities';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '../../../types/response';

export class GetResourceHistoryResponseDto extends PaginatedResponse<ResourceUsage> {
  @ApiProperty({
    type: [ResourceUsage],
  })
  data: ResourceUsage[];
}
