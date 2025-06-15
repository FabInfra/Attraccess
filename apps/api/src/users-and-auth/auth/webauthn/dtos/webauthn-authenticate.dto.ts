import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsNotEmpty, IsString } from 'class-validator';
import { User } from '@attraccess/database-entities';
import { AuthenticationResponseJSON } from '@simplewebauthn/server';

export class WebAuthnAuthenticateRequestDto {
  @ApiProperty({
    description: 'The ID of the authentication challenge',
    example: 123,
  })
  @IsNumber()
  @IsNotEmpty()
  authenticationId: number;

  @ApiProperty({
    description: 'The WebAuthn authentication data',
    example: {},
  })
  @IsObject()
  @IsNotEmpty()
  data: AuthenticationResponseJSON;
}

export class WebAuthnAuthenticateResponseDto {
  @ApiProperty({
    description: 'JWT token for authenticated user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'The authenticated user',
  })
  user: User;
}
