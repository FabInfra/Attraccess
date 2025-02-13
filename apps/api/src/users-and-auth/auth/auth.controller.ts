import { Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../../types/request';
import { LoginGuard } from '../strategies/login.guard';
import { Auth } from '../strategies/systemPermissions.guard';
import { CreateSessionResponse } from './auth.types';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/session/local')
  @UseGuards(LoginGuard)
  @ApiResponse({
    status: 200,
    description: 'The session has been created',
    type: CreateSessionResponse,
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: {
          type: 'string',
          description: 'The username for authentication',
        },
        password: {
          type: 'string',
          description: 'The password for authentication',
        },
      },
    },
  })
  async postSession(
    @Req() request: AuthenticatedRequest
  ): Promise<CreateSessionResponse> {
    const authToken = await this.authService.createJWT(request.user);

    return {
      user: request.user,
      authToken,
    };
  }

  @Delete('/session')
  @Auth()
  @ApiOkResponse({
    description: 'The session has been deleted',
  })
  async deleteSession(@Req() request: AuthenticatedRequest) {
    const tokenId = request.authInfo?.tokenId;
    await new Promise<void>((resolve) => request.logout(resolve));
    if (tokenId) {
      await this.authService.revokeJWT(tokenId);
    }
  }
}
