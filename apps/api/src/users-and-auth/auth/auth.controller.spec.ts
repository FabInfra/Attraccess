import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../../types/request';
import { User } from '../../database/entities';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createJWT: jest.fn(),
            revokeJWT: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
      imports: [],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return a JWT token when starting a session', async () => {
    const user: Partial<User> = { id: 1, username: 'testuser' };
    jest.spyOn(authService, 'createJWT').mockResolvedValue('testtoken');

    const result = await authController.postSession({
      user,
      authInfo: {
        tokenId: '123',
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      logout: async () => {},
    } as AuthenticatedRequest);

    expect(result).toHaveProperty('authToken');
    expect(result).toHaveProperty('user');
    expect(result.user).toEqual(user);
    expect(result.authToken).toEqual('testtoken');

    expect(authService.createJWT).toHaveBeenCalledWith(user);
  });
});
