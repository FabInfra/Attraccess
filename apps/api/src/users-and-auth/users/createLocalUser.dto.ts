import { ApiProperty } from '@nestjs/swagger';
import { AuthenticationType } from '../../database/entities';
import { CreateUserDto } from './createUser.dto';

export class CreateLocalUserDto extends CreateUserDto {
  @ApiProperty({
    enum: AuthenticationType,
  })
  strategy: AuthenticationType.LOCAL_PASSWORD;
  @ApiProperty()
  password: string;
}
