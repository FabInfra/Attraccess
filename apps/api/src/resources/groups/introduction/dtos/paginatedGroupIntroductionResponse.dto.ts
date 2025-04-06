import { ResourceIntroduction } from '@attraccess/database-entities';
import { PaginatedResponseDto } from '../../../../types/response';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedGroupIntroductionResponseDto extends PaginatedResponseDto<ResourceIntroduction> {
  @ApiProperty({ type: [ResourceIntroduction] })
  data: ResourceIntroduction[];
}
