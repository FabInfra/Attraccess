import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@attraccess/database-entities';
import { AuthenticatedRequest } from '@attraccess/plugins-backend-sdk';

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
            createJWT: jest.fn().mockResolvedValue('test-token'),
            revokeJWT: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should create a session', async () => {
    const user: Partial<User> = {
      id: 1,
      username: 'testuser',
    };

    const mockRequest = {
      ...Object.create(Request.prototype),
      user,
      authInfo: { tokenId: 'test-token-id' },
      logout: jest.fn().mockResolvedValue(undefined),
    } as AuthenticatedRequest;

    const result = await authController.createSession(mockRequest);

    expect(result).toEqual({
      authToken: 'test-token',
      user: {
        id: 1,
        username: 'testuser',
      },
    });
    expect(authService.createJWT).toHaveBeenCalledWith(user);
  });

  it('should delete a session and revoke JWT', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      jwtTokenId: 'test-jwt-token-id',
    };

    const mockRequest = {
      ...Object.create(Request.prototype),
      user: mockUser,
      authInfo: { tokenId: 'test-token-id' },
      logout: jest.fn().mockImplementation((cb) => cb()),
    } as AuthenticatedRequest;

    await authController.endSession(mockRequest);

    expect(mockRequest.logout).toHaveBeenCalled();
    expect(authService.revokeJWT).toHaveBeenCalledWith({ tokenId: 'test-jwt-token-id' });
  });
});
