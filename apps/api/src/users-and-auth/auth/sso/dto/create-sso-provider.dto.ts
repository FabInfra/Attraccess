import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SSOProviderType } from '@fabaccess/database-entities';
import { Type } from 'class-transformer';

export class CreateOIDCConfigurationDto {
  @ApiProperty({
    description: 'The issuer of the provider',
    example: 'https://sso.example.com/auth/realms/example',
  })
  @IsString()
  @IsNotEmpty()
  issuer: string;

  @ApiProperty({
    description: 'The authorization URL of the provider',
    example: 'https://sso.example.com/auth/realms/example/protocol/openid-connect/auth',
  })
  @IsString()
  @IsNotEmpty()
  authorizationURL: string;

  @ApiProperty({
    description: 'The token URL of the provider',
    example: 'https://sso.example.com/auth/realms/example/protocol/openid-connect/token',
  })
  @IsString()
  @IsNotEmpty()
  tokenURL: string;

  @ApiProperty({
    description: 'The user info URL of the provider',
    example: 'https://sso.example.com/auth/realms/example/protocol/openid-connect/userinfo',
  })
  @IsString()
  @IsNotEmpty()
  userInfoURL: string;

  @ApiProperty({
    description: 'The client ID of the provider',
    example: 'fabaccess-client',
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'The client secret of the provider',
    example: 'client-secret',
  })
  @IsString()
  @IsNotEmpty()
  clientSecret: string;
}

export class CreateSSOProviderDto {
  @ApiProperty({
    description: 'The name of the SSO provider',
    example: 'Company Keycloak',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The type of SSO provider',
    enum: SSOProviderType,
    example: SSOProviderType.OIDC,
  })
  @IsString()
  @IsNotEmpty()
  type: SSOProviderType;

  @ApiProperty({
    description: 'The OIDC configuration for the provider',
    type: CreateOIDCConfigurationDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateOIDCConfigurationDto)
  oidcConfiguration?: CreateOIDCConfigurationDto;
}
