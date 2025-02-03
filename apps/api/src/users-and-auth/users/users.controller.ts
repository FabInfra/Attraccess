import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  Body,
  Inject,
  forwardRef,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from '../../types/request';
import { AuthService } from '../auth/auth.service';
import { Auth, SystemPermission } from '../strategies/systemPermissions.guard';
import { ApiProperty } from '@nestjs/swagger';
import { CreateLocalUserDto } from './createLocalUser.dto';

class GetUsersQueryDto {
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
}

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

  @Post()
  async createUser(@Body() body: CreateLocalUserDto) {
    const user = await this.usersService.createOne(body.username);
    await this.authService.addAuthenticationDetails(user.id, {
      type: body.strategy,
      details: {
        password: body.password,
      },
    });
    return user;
  }

  @Auth()
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

  @Get()
  @Auth(SystemPermission.canManageUsers)
  async getUsers(@Query() query: GetUsersQueryDto) {
    return this.usersService.findAll({
      page: query.page,
      limit: query.limit,
    });
  }
}
