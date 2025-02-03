import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import {
  AuthenticationDetail,
  AuthenticationType,
} from '../../database/entities';
import { User } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';

export interface LocalPasswordAuthenticationOptions {
  password: string;
}

type AuthenticationOptionsTypeMapping = {
  [AuthenticationType.LOCAL_PASSWORD]: LocalPasswordAuthenticationOptions;
};

export type AuthenticationOptions<T extends AuthenticationType> = {
  type: T;
  details: AuthenticationOptionsTypeMapping[T];
};

@Injectable()
export class AuthService {
  private readonly revokedJWTs: string[] = [];

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(AuthenticationDetail)
    private authenticationDetailRepository: Repository<AuthenticationDetail>
  ) {}

  private async getAuthenticationDetail(
    authenticationType: AuthenticationType,
    userId: number
  ): Promise<AuthenticationDetail> {
    const details = await this.authenticationDetailRepository.findOne({
      where: { userId, type: authenticationType },
    });

    if (!details) {
      throw new NotFoundException(
        `Authentication details for user ${userId} not found`
      );
    }

    return details;
  }

  async validateAuthenticationDetails<T extends AuthenticationType>(
    userId: number,
    options: AuthenticationOptions<T>
  ): Promise<boolean> {
    const authenticationDetails = await this.getAuthenticationDetail(
      options.type,
      userId
    );

    switch (options.type) {
      case AuthenticationType.LOCAL_PASSWORD:
        // TODO: use encryption to compare passwords
        return options.details.password === authenticationDetails.password;

      default:
        return false;
    }
  }

  async addAuthenticationDetails<T extends AuthenticationType>(
    userId: number,
    options: AuthenticationOptions<T>
  ): Promise<void> {
    // TODO: replace with database logic

    const authenticationDetail = new AuthenticationDetail();
    authenticationDetail.userId = userId;
    authenticationDetail.type = options.type;
    authenticationDetail.password = options.details.password;

    await this.authenticationDetailRepository.save(authenticationDetail);
  }

  async getUserByUsernameAndAuthenticationDetails<T extends AuthenticationType>(
    username: string,
    options: AuthenticationOptions<T>
  ): Promise<User | null> {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      return null;
    }

    const isValid = await this.validateAuthenticationDetails(user.id, options);
    if (!isValid) {
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
