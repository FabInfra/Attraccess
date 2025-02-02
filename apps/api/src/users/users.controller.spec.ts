import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedRequest } from '../types/request';
import { User } from '../database/entities';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        UsersController,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should allow a user to get their own profile', async () => {
    const user: Partial<User> = { id: 1, username: 'testuser' };

    jest.spyOn(usersService, 'findOne').mockResolvedValue(user as User);

    const response = await controller.getUserById(user.id.toString(), {
      user,
    } as AuthenticatedRequest);

    expect(response).toEqual(user);
  });

  it("should not allow a user to get another user's profile", async () => {
    expect(
      controller.getUserById('1', {
        user: { id: 2 },
      } as AuthenticatedRequest)
    ).rejects.toThrow(ForbiddenException);
  });
});
