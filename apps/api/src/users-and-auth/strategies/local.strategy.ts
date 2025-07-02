import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthenticationType, User } from '@attraccess/database-entities';

class UnknownUserOrPasswordException extends UnauthorizedException {
  constructor() {
    super('UnkownUserOrPasswordException');
    super.name = 'UnknownUserOrPasswordException';
  }
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    this.logger.log(`Validating user ${username}`);

    const user = await this.authService.getUserByAuthenticationDetails(username, {
      type: AuthenticationType.LOCAL_PASSWORD,
      details: {
        password,
      },
    });

    if (!user) {
      this.logger.debug(`No user found with username or email: ${username}`);
      throw new UnknownUserOrPasswordException();
    }

    this.logger.debug(`User ${user.id} validated successfully`);
    return user;
  }
}
