import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebAuthnService } from './webauthn.service';
import { AuthService } from '../auth.service';
import { Auth, AuthenticatedRequest } from '@attraccess/plugins-backend-sdk';
import {
  WebAuthnRegisterRequestDto,
  WebAuthnRegisterResponseDto,
  WebAuthnAuthenticateRequestDto,
  WebAuthnAuthenticateResponseDto,
} from './dtos';

@ApiTags('Authentication')
@Controller('auth/webauthn')
export class WebAuthnController {
  constructor(private readonly webauthnService: WebAuthnService, private readonly authService: AuthService) {}

  @Get('registration-options')
  @Auth()
  @ApiOperation({ summary: 'Get WebAuthn registration options', operationId: 'getRegistrationOptions' })
  @ApiResponse({
    status: 200,
    description: 'The WebAuthn registration options',
    schema: {
      type: 'object',
      properties: {
        registrationId: { type: 'number' },
        data: { type: 'object', additionalProperties: true },
      },
    },
  })
  async getRegistrationOptions(@Req() request: AuthenticatedRequest) {
    return await this.webauthnService.createRegistrationOptions(request.user);
  }

  @Post('registration')
  @Auth()
  @ApiOperation({ summary: 'Register a new WebAuthn device', operationId: 'register' })
  @ApiResponse({
    status: 200,
    description: 'The WebAuthn registration options',
    type: WebAuthnRegisterResponseDto,
  })
  async register(@Req() request: AuthenticatedRequest, @Body() body: WebAuthnRegisterRequestDto) {
    return await this.webauthnService.verifyRegistration(request.user.id, body.registrationId, body.data);
  }

  @Get('authentication-options')
  @Auth()
  @ApiOperation({ summary: 'Get WebAuthn authentication options', operationId: 'getAuthenticationOptions' })
  @ApiResponse({
    status: 200,
    description: 'The WebAuthn authentication options',
  })
  async getAuthenticationOptions(@Req() request: AuthenticatedRequest) {
    return await this.webauthnService.createAuthenticationOptions(request.user);
  }

  @Post('authenticate')
  @Auth()
  @ApiOperation({ summary: 'Authenticate a WebAuthn device', operationId: 'authenticate' })
  @ApiResponse({
    status: 200,
    description: 'The WebAuthn authentication options',
    type: WebAuthnAuthenticateResponseDto,
  })
  async authenticate(@Req() request: AuthenticatedRequest, @Body() body: WebAuthnAuthenticateRequestDto) {
    const isVerified = await this.webauthnService.verifyAuthentication(
      request.user.id,
      body.authenticationId,
      body.data
    );

    if (!isVerified) {
      throw new UnauthorizedException('Authentication failed');
    }

    const jwt = await this.authService.createJWT(request.user);

    return {
      token: jwt,
      user: request.user,
    };
  }
}
