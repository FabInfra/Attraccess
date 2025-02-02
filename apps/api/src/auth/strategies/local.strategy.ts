import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthenticationType } from '../../database/entities';
import { User } from '../../database/entities';

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
          type: AuthenticationType.PASSWORD,
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
