import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginGuard } from '../strategies/login.guard';
import { Auth, AuthenticatedRequest } from '@fabaccess/plugins-backend-sdk';
import { CreateSessionResponse } from './auth.types';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/session/local')
  @UseGuards(LoginGuard)
  @ApiOperation({ summary: 'Create a new session using local authentication', operationId: 'createSession' })
  @ApiResponse({
    status: 200,
    description: 'The session has been created',
    type: CreateSessionResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'Username or email address',
        },
        password: { type: 'string' },
      },
    },
  })
  async createSession(@Req() request: AuthenticatedRequest): Promise<CreateSessionResponse> {
    const authToken = await this.authService.createJWT(request.user);

    return {
      user: request.user,
      authToken,
    };
  }

  @Get('/session/refresh')
  @Auth()
  @ApiOperation({ summary: 'Refresh the current session', operationId: 'refreshSession' })
  @ApiOkResponse({
    description: 'The session has been refreshed',
    type: CreateSessionResponse,
  })
  async refreshSession(@Req() request: AuthenticatedRequest): Promise<CreateSessionResponse> {
    const authToken = await this.authService.createJWT(request.user);
    await this.authService.revokeJWT({ tokenId: request.user.jwtTokenId });
    return {
      user: request.user,
      authToken,
    };
  }

  @Delete('/session')
  @Auth()
  @ApiOperation({ summary: 'Logout and invalidate the current session', operationId: 'endSession' })
  @ApiOkResponse({
    description: 'The session has been deleted',
    schema: {
      type: 'object',
      properties: {},
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User is not authenticated',
  })
  async endSession(@Req() request: AuthenticatedRequest): Promise<void> {
    const tokenId = request.user.jwtTokenId;
    await new Promise<void>((resolve) => request.logout(resolve));
    if (tokenId) {
      await this.authService.revokeJWT({ tokenId });
    }
  }
}
