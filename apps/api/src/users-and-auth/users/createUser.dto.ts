import { ApiProperty } from '@nestjs/swagger';

export abstract class CreateUserDto {
  @ApiProperty()
  username: string;
}
