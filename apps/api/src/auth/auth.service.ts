import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@attraccess/types';
import { nanoid } from 'nanoid';

export enum UserAuthenticationType {
  PASSWORD = 'password',
}

export interface UserAuthenticationDetails {
  id: number;
  userId: number;
  type: UserAuthenticationType;
  password: string | null;
}

export interface PasswordAuthenticationOptions {
  password: string;
}

type AuthenticationOptionsTypeMapping = {
  [UserAuthenticationType.PASSWORD]: PasswordAuthenticationOptions;
};

export type AuthenticationOptions<T extends UserAuthenticationType> = {
  type: T;
  details: AuthenticationOptionsTypeMapping[T];
};

@Injectable()
export class AuthService {
  private readonly authenticationDetails: UserAuthenticationDetails[] = [
    {
      id: 1,
      userId: 1,
      password: 'password',
      type: UserAuthenticationType.PASSWORD,
    },
  ];
  private readonly revokedJWTs: string[] = [];

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  private async getAuthenticationDetails(
    userId: number
  ): Promise<UserAuthenticationDetails> {
    // TODO: replace with database logic
    const details = this.authenticationDetails.find(
      (details) => details.userId === userId
    );

    if (!details) {
      throw new NotFoundException(
        `Authentication details for user ${userId} not found`
      );
    }

    return details;
  }

  async validateAuthenticationDetails<T extends UserAuthenticationType>(
    userId: number,
    options: AuthenticationOptions<T>
  ): Promise<boolean> {
    const authenticationDetails = await this.getAuthenticationDetails(userId);

    switch (authenticationDetails?.type) {
      case UserAuthenticationType.PASSWORD:
        // TODO: use encryption to compare passwords
        return options.details.password === authenticationDetails.password;

      default:
        return false;
    }
  }

  async addAuthenticationDetails<T extends UserAuthenticationType>(
    userId: number,
    options: AuthenticationOptions<T>
  ): Promise<void> {
    // TODO: replace with database logic

    this.authenticationDetails.push({
      id: this.authenticationDetails.length + 1,
      userId,
      type: options.type,
      password: options.details.password,
    });
  }

  async getUserByUsernameAndAuthenticationDetails<
    T extends UserAuthenticationType
  >(username: string, options: AuthenticationOptions<T>): Promise<User | null> {
    const user = await this.usersService.findOne({ username });

    // Check if user is null
    if (!user) {
      console.log('user not found');
      return null;
    }

    const isValid = await this.validateAuthenticationDetails(user.id, options);
    if (!isValid) {
      console.log('invalid');
      return null;
    }

    return user;
  }

  async createJWT(user: User): Promise<string> {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
      tokenId: nanoid(),
    });
  }

  async revokeJWT(tokenId: string): Promise<void> {
    // TODO: replace with database logic

    this.revokedJWTs.push(tokenId);
  }

  async isJWTRevoked(tokenId: string): Promise<boolean> {
    // TODO: replace with database logic
    return this.revokedJWTs.includes(tokenId);
  }
}
