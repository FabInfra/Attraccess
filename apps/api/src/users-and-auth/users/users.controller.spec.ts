import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedRequest } from '../../types/request';
import { AuthenticationType, User } from '../../database/entities';
import { AuthService } from '../auth/auth.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

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
            createOne: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            addAuthenticationDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
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

  it('should allow a user to create a new user using the local password strategy', async () => {
    const user: Partial<User> = { id: 1, username: 'testuser' };

    jest.spyOn(usersService, 'createOne').mockResolvedValue(user as User);

    const response = await controller.createUser({
      username: 'testuser',
      strategy: AuthenticationType.LOCAL_PASSWORD,
      password: 'password',
    });

    expect(response).toEqual(user);
    expect(authService.addAuthenticationDetails).toHaveBeenCalledWith(user.id, {
      type: AuthenticationType.LOCAL_PASSWORD,
      details: {
        password: 'password',
      },
    });
    expect(usersService.createOne).toHaveBeenCalledWith('testuser');
  });
});
