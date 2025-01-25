import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedRequest } from '@attraccess/types';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should allow a user to get their own profile', async () => {
    const user = await usersService.createOne('test');

    const response = await controller.getUserById(user.id.toString(), {
      user,
    } as AuthenticatedRequest);

    expect(response).toEqual(user);
  });

  it("should not allow a user to get another user's profile", async () => {
    const user = await usersService.createOne('test');
    const otherUser = await usersService.createOne('other');

    expect(
      controller.getUserById(otherUser.id.toString(), {
        user,
      } as AuthenticatedRequest)
    ).rejects.toThrow(ForbiddenException);
  });
});
