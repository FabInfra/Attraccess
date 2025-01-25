import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, UserAuthenticationType } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import { User } from '@attraccess/types';

describe('AuthService', () => {
  let authService: AuthService;
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
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should authenticate user with correct credentials', async () => {
    // first add authentication details
    await authService.addAuthenticationDetails(1, {
      type: UserAuthenticationType.PASSWORD,
      details: { password: 'password' },
    });

    jest.spyOn(usersService, 'findOne').mockResolvedValue({
      id: 1,
      username: 'testuser',
    } as User);

    const isAuthenticated =
      await authService.getUserByUsernameAndAuthenticationDetails('testuser', {
        type: UserAuthenticationType.PASSWORD,
        details: { password: 'password' },
      });

    expect(isAuthenticated).not.toBeNull();
  });

  it('should not authenticate user with incorrect credentials', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue({
      id: 1,
      username: 'testuser',
    } as User);

    const isAuthenticated =
      await authService.getUserByUsernameAndAuthenticationDetails('testuser', {
        type: UserAuthenticationType.PASSWORD,
        details: { password: 'wrongpassword' },
      });

    expect(isAuthenticated).toBeNull();
  });

  it('should create a JWT for a valid user', async () => {
    const user: User = { id: 1, username: 'testuser' };
    const token = await authService.createJWT(user);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should revoke a JWT and identify it as revoked', async () => {
    const tokenId = 'testTokenId';
    await authService.revokeJWT(tokenId);

    const isRevoked = await authService.isJWTRevoked(tokenId);
    expect(isRevoked).toBe(true);
  });

  it('should not authenticate a non-existent user', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

    const isAuthenticated =
      await authService.getUserByUsernameAndAuthenticationDetails(
        'nonexistentuser',
        {
          type: UserAuthenticationType.PASSWORD,
          details: { password: 'password' },
        }
      );

    expect(isAuthenticated).toBeNull();
  });
});
