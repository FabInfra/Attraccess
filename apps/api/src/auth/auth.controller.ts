import { Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { LoginGuard } from './strategies/login.guard';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../types/request';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoginGuard)
  @Post('/session/local')
  async postSession(@Req() request: AuthenticatedRequest) {
    const authToken = await this.authService.createJWT(request.user);

    return {
      user: request.user,
      authToken,
    };
  }

  @UseGuards(LoginGuard)
  @Delete('/session')
  async deleteSession(@Req() request: AuthenticatedRequest) {
    await this.authService.revokeJWT(request.authInfo.tokenId);
    return request.logout();
  }
}
