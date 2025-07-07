import { User } from '@fabaccess/database-entities';
import { PaginatedResponse } from '../../../types/response';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedUsersResponseDto extends PaginatedResponse<User> {
  @ApiProperty({ type: [User] })
  data: User[];
}
