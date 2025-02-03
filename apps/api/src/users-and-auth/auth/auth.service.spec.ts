import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import {
  AuthenticationDetail,
  AuthenticationType,
  User,
} from '../../database/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

const AuthenticationDetailRepository = getRepositoryToken(AuthenticationDetail);

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let authenticationDetailRepository: Repository<AuthenticationDetail>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: AuthenticationDetailRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    authenticationDetailRepository = module.get<
      typeof authenticationDetailRepository
    >(AuthenticationDetailRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should authenticate user with correct credentials', async () => {
    const user: Partial<User> = { id: 1, username: 'testuser' };
    jest.spyOn(usersService, 'findOne').mockResolvedValue(user as User);

    const authenticationDetail: Partial<AuthenticationDetail> = {
      userId: 1,
      type: AuthenticationType.LOCAL_PASSWORD,
      password: 'my-password',
    };
    jest
      .spyOn(authenticationDetailRepository, 'findOne')
      .mockResolvedValue(authenticationDetail as AuthenticationDetail);

    const isAuthenticated =
      await authService.getUserByUsernameAndAuthenticationDetails('testuser', {
        type: AuthenticationType.LOCAL_PASSWORD,
        details: { password: 'my-password' },
      });

    expect(isAuthenticated).not.toBeNull();
  });

  it('should not authenticate user with incorrect credentials', async () => {
    const user: Partial<User> = { id: 1, username: 'testuser' };
    jest.spyOn(usersService, 'findOne').mockResolvedValue(user as User);

    jest.spyOn(authenticationDetailRepository, 'findOne').mockResolvedValue({
      id: 1,
      userId: user.id,
      type: AuthenticationType.LOCAL_PASSWORD,
      password: 'my-password',
    } as AuthenticationDetail);

    const isAuthenticated =
      await authService.getUserByUsernameAndAuthenticationDetails('testuser', {
        type: AuthenticationType.LOCAL_PASSWORD,
        details: { password: 'wrongpassword' },
      });

    expect(isAuthenticated).toBeNull();
  });

  it('should create a JWT for a valid user', async () => {
    const user: Partial<User> = { id: 1, username: 'testuser' };

    jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

    const token = await authService.createJWT(user as User);

    expect(token).toBeDefined();
    expect(token).toEqual('test-token');

    expect(jwtService.sign).toHaveBeenCalledWith({
      username: user.username,
      sub: user.id,
      tokenId: expect.any(String),
    });
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
          type: AuthenticationType.LOCAL_PASSWORD,
          details: { password: 'password' },
        }
      );

    expect(isAuthenticated).toBeNull();
  });
});
