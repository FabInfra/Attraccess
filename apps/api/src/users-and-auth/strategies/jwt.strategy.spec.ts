import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../../database/entities';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let usersService: Partial<UsersService>;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn(),
    };

    authService = {
      isJWTRevoked: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UsersService, useValue: usersService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should validate and return a user if JWT is valid and not revoked', async () => {
    const payload = { username: 'testuser', sub: 1, tokenId: 'token123' };
    const user = { id: 1, username: 'testuser' };

    jest.spyOn(authService, 'isJWTRevoked').mockResolvedValue(false);
    jest.spyOn(usersService, 'findOne').mockResolvedValue(user as User);

    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual(user);
  });

  it('should throw UnauthorizedException if JWT is revoked', async () => {
    const payload = { username: 'testuser', sub: 1, tokenId: 'token123' };

    jest.spyOn(authService, 'isJWTRevoked').mockResolvedValue(true);

    await expect(jwtStrategy.validate(payload)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const payload = { username: 'testuser', sub: 1, tokenId: 'token123' };

    jest.spyOn(authService, 'isJWTRevoked').mockResolvedValue(false);
    jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

    await expect(jwtStrategy.validate(payload)).rejects.toThrow(
      UnauthorizedException
    );
  });
});
