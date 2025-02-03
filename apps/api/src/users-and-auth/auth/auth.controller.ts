import { Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../../types/request';
import { LoginGuard } from '../strategies/login.guard';
import { Auth } from '../strategies/systemPermissions.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/session/local')
  @UseGuards(LoginGuard)
  async postSession(@Req() request: AuthenticatedRequest) {
    const authToken = await this.authService.createJWT(request.user);

    return {
      user: request.user,
      authToken,
    };
  }

  @Delete('/session')
  @Auth()
  async deleteSession(@Req() request: AuthenticatedRequest) {
    await this.authService.revokeJWT(request.authInfo.tokenId);
    return request.logout();
  }
}
