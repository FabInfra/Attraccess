import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/strategies/jwt.guard';
import { AuthenticatedRequest } from '@attraccess/types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserById(
    @Param('id') idString: string,
    @Req() request: AuthenticatedRequest
  ) {
    const id = parseInt(idString);
    const authenticatedUser = request.user;

    if (authenticatedUser?.id !== id) {
      throw new ForbiddenException();
    }

    const user = await this.usersService.findOne({ id });
    if (!user) {
      throw new ForbiddenException();
    }

    return user;
  }
}
