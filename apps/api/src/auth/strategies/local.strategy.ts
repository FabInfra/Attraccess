import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService, UserAuthenticationType } from '../auth.service';
import { User } from '@attraccess/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user =
      await this.authService.getUserByUsernameAndAuthenticationDetails(
        username,
        {
          type: UserAuthenticationType.PASSWORD,
          details: {
            password,
          },
        }
      );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
