import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AssignResourceToGroupDto {
  @ApiProperty({
    description: 'The ID of the resource to assign to the group',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  resourceId!: number;
}
