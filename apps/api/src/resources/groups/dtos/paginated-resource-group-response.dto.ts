import { ApiProperty } from '@nestjs/swagger';
import { ResourceGroup } from '@attraccess/database-entities';
import { PaginatedResponse } from '../../../types/pagination';

export class PaginatedResourceGroupResponseDto
  implements PaginatedResponse<ResourceGroup>
{
  @ApiProperty({ type: [ResourceGroup] })
  data!: ResourceGroup[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}
