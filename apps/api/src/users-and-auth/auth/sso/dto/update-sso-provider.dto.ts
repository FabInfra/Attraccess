import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOIDCConfigurationDto {
  @ApiProperty({
    description: 'The issuer of the provider',
    example: 'https://sso.example.com/auth/realms/example',
    required: false,
  })
  @IsString()
  @IsOptional()
  issuer?: string;

  @ApiProperty({
    description: 'The authorization URL of the provider',
    example: 'https://sso.example.com/auth/realms/example/protocol/openid-connect/auth',
    required: false,
  })
  @IsString()
  @IsOptional()
  authorizationURL?: string;

  @ApiProperty({
    description: 'The token URL of the provider',
    example: 'https://sso.example.com/auth/realms/example/protocol/openid-connect/token',
    required: false,
  })
  @IsString()
  @IsOptional()
  tokenURL?: string;

  @ApiProperty({
    description: 'The user info URL of the provider',
    example: 'https://sso.example.com/auth/realms/example/protocol/openid-connect/userinfo',
    required: false,
  })
  @IsString()
  @IsOptional()
  userInfoURL?: string;

  @ApiProperty({
    description: 'The client ID of the provider',
    example: 'fabaccess-client',
    required: false,
  })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiProperty({
    description: 'The client secret of the provider',
    example: 'client-secret',
    required: false,
  })
  @IsString()
  @IsOptional()
  clientSecret?: string;
}

export class UpdateSSOProviderDto {
  @ApiProperty({
    description: 'The name of the SSO provider',
    example: 'Company Keycloak',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The OIDC configuration for the provider',
    type: UpdateOIDCConfigurationDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateOIDCConfigurationDto)
  oidcConfiguration?: UpdateOIDCConfigurationDto;
}
