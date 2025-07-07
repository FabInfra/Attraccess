import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthenticationDetail, AuthenticationType, User, RevokedToken } from '@fabaccess/database-entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { EmailService } from '../../email/email.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const AuthenticationDetailRepository = getRepositoryToken(AuthenticationDetail);
const RevokedTokenRepository = getRepositoryToken(RevokedToken);

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let authenticationDetailRepository: Repository<AuthenticationDetail>;
  let revokedTokenRepository: Repository<RevokedToken>;
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
            updateUser: jest.fn(),
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
        {
          provide: EmailService,
          useValue: {
            sendVerificationEmail: jest.fn(),
          },
        },
        {
          provide: RevokedTokenRepository,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    authenticationDetailRepository = module.get<typeof authenticationDetailRepository>(AuthenticationDetailRepository);
    revokedTokenRepository = module.get<typeof revokedTokenRepository>(RevokedTokenRepository);
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should authenticate user with correct credentials', async () => {
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      systemPermissions: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      resourceIntroductions: [],
      resourceUsages: [],
      authenticationDetails: [],
      resourceIntroducerPermissions: [],
    } as User;
    jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

    const authenticationDetail: Partial<AuthenticationDetail> = {
      userId: 1,
      type: AuthenticationType.LOCAL_PASSWORD,
      password: 'hashed-password',
    };
    jest
      .spyOn(authenticationDetailRepository, 'findOne')
      .mockResolvedValue(authenticationDetail as AuthenticationDetail);

    // Mock bcrypt.compare to return true for correct password
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const isAuthenticated = await authService.getUserByAuthenticationDetails('testuser', {
      type: AuthenticationType.LOCAL_PASSWORD,
      details: { password: 'correct-password' },
    });

    expect(isAuthenticated).not.toBeNull();
    expect(bcrypt.compare).toHaveBeenCalledWith('correct-password', 'hashed-password');
  });

  it('should not authenticate user with incorrect credentials', async () => {
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      systemPermissions: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      resourceIntroductions: [],
      resourceUsages: [],
      authenticationDetails: [],
      resourceIntroducerPermissions: [],
    } as User;
    jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

    jest.spyOn(authenticationDetailRepository, 'findOne').mockResolvedValue({
      id: 1,
      userId: user.id,
      type: AuthenticationType.LOCAL_PASSWORD,
      password: 'hashed-password',
    } as AuthenticationDetail);

    // Mock bcrypt.compare to return false for incorrect password
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const isAuthenticated = await authService.getUserByAuthenticationDetails('testuser', {
      type: AuthenticationType.LOCAL_PASSWORD,
      details: { password: 'wrong-password' },
    });

    expect(isAuthenticated).toBeNull();
    expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password');
  });

  it('should authenticate user with email instead of username', async () => {
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      systemPermissions: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      resourceIntroductions: [],
      resourceUsages: [],
      authenticationDetails: [],
      resourceIntroducerPermissions: [],
    } as User;

    // Mock findOne to return null for username search (first call) and user for email search (second call)
    jest
      .spyOn(usersService, 'findOne')
      .mockResolvedValueOnce(null) // First call with username returns null
      .mockResolvedValueOnce(user); // Second call with email returns user

    const authenticationDetail: Partial<AuthenticationDetail> = {
      userId: 1,
      type: AuthenticationType.LOCAL_PASSWORD,
      password: 'hashed-password',
    };
    jest
      .spyOn(authenticationDetailRepository, 'findOne')
      .mockResolvedValue(authenticationDetail as AuthenticationDetail);

    // Mock bcrypt.compare to return true for correct password
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const isAuthenticated = await authService.getUserByAuthenticationDetails('test@example.com', {
      type: AuthenticationType.LOCAL_PASSWORD,
      details: { password: 'correct-password' },
    });

    expect(isAuthenticated).not.toBeNull();
    expect(usersService.findOne).toHaveBeenNthCalledWith(1, { username: 'test@example.com' });
    expect(usersService.findOne).toHaveBeenNthCalledWith(2, { email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('correct-password', 'hashed-password');
  });

  it('should create a JWT for a valid user', async () => {
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      systemPermissions: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      resourceIntroductions: [],
      resourceUsages: [],
      authenticationDetails: [],
      resourceIntroducerPermissions: [],
    } as User;

    jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

    const token = await authService.createJWT(user);

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
    jest.spyOn(revokedTokenRepository, 'findOne').mockResolvedValue({ id: 1, tokenId } as RevokedToken);
    await authService.revokeJWT({ tokenId });

    const isRevoked = await authService.isJWTRevoked({ tokenId });
    expect(isRevoked).toBe(true);
  });

  it('should not authenticate a non-existent user', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

    const isAuthenticated = await authService.getUserByAuthenticationDetails('nonexistentuser', {
      type: AuthenticationType.LOCAL_PASSWORD,
      details: { password: 'password' },
    });

    expect(isAuthenticated).toBeNull();
  });
});
