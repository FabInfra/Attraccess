import { User } from '../../database/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  authToken: string;
}
