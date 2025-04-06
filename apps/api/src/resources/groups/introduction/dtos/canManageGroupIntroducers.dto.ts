import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for checking if a user can manage introducers for a group
 */
export class CanManageGroupIntroducersResponseDto {
  @ApiProperty({
    description: 'Whether the user can manage introducers for the group',
    example: true,
  })
  canManageIntroducers: boolean;
}
