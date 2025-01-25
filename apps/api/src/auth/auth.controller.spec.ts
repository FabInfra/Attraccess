import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService, UserAuthenticationType } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthenticatedRequest } from '@attraccess/types';

describe('AuthController', () => {
  let authController: AuthController;
  let jwtService: JwtService;
  let usersService: UsersService;
  let authService: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
      imports: [
        UsersModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return a JWT token when starting a session', async () => {
    await usersService.createOne('test');
    const user = await usersService.findOne({ id: 1 });

    await authService.addAuthenticationDetails(1, {
      type: UserAuthenticationType.PASSWORD,
      details: {
        password: 'test',
      },
    });

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

    // validate JWT token content (should contain id and username)
    const decoded = jwtService.verify(result.authToken);

    expect(decoded).toEqual(
      expect.objectContaining({
        sub: user.id,
        username: user.username,
      })
    );
  });
});
