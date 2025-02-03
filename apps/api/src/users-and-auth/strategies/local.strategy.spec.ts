import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth/auth.service';
import { User } from '../../database/entities';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            getUserByUsernameAndAuthenticationDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return a user if validation is successful', async () => {
    const user: Partial<User> = { id: 1, username: 'testuser' }; // Mock user object
    jest
      .spyOn(authService, 'getUserByUsernameAndAuthenticationDetails')
      .mockResolvedValue(user as User);

    const result = await localStrategy.validate('testuser', 'password2');
    expect(result).toEqual(user);
  });

  it('should throw an UnauthorizedException if validation fails', async () => {
    jest
      .spyOn(authService, 'getUserByUsernameAndAuthenticationDetails')
      .mockResolvedValue(null);

    await expect(
      localStrategy.validate('testuser', 'wrongpassword')
    ).rejects.toThrow(UnauthorizedException);
  });
});
