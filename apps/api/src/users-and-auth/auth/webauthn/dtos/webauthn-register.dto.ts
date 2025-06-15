import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsNotEmpty } from 'class-validator';
import { User } from '@attraccess/database-entities';
import { RegistrationResponseJSON } from '@simplewebauthn/server';

export class WebAuthnRegisterRequestDto {
  @ApiProperty({
    description: 'The ID of the registration challenge',
    example: 123,
  })
  @IsNumber()
  @IsNotEmpty()
  registrationId: number;

  @ApiProperty({
    description: 'The WebAuthn registration data',
    example: {},
  })
  @IsObject()
  @IsNotEmpty()
  data: RegistrationResponseJSON;
}

export class WebAuthnRegisterResponseDto {
  @ApiProperty({
    description: 'The registered credential ID',
    example: 'credential_id_example',
  })
  credentialId: string;

  @ApiProperty({
    description: 'The user this credential is registered to',
  })
  user: User;
}
