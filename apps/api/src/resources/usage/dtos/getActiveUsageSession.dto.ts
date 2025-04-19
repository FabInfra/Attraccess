import { ResourceUsage } from '@attraccess/database-entities';
import { ApiProperty } from '@nestjs/swagger';

export class GetActiveUsageSessionDto {
  @ApiProperty({
    type: ResourceUsage,
  })
  activeSession: ResourceUsage | null;
}
