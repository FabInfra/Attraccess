import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from '../../config/app.config';
import { existsSync, readFileSync } from 'fs';

import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { AuthenticatedUser } from '@attraccess/plugins-backend-sdk';

interface JwtPayload {
  username: string;
  sub: number;
  tokenId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  private static _resolveSecret(appConfig: AppConfigType | undefined, logger: Logger): string {
    if (!appConfig) {
      logger.error('AppConfig not available during JWT secret resolution.');
      throw new Error('AppConfig not available for JWT Strategy secret resolution.');
    }

    const configuredSecretOrPath = appConfig.AUTH_JWT_SECRET;
    const jwtSecretOrigin = appConfig.AUTH_JWT_ORIGIN;
    let jwtSecret: string;

    if (jwtSecretOrigin === 'FILE') {
      const jwtKeyPath = configuredSecretOrPath;
      if (!existsSync(jwtKeyPath)) {
        logger.error(`JWT secret file (path from AUTH_JWT_SECRET) does not exist at ${jwtKeyPath}`);
        throw new Error(`JWT secret file does not exist at ${jwtKeyPath}. JWT Strategy cannot be initialized.`);
      }
      jwtSecret = readFileSync(jwtKeyPath).toString().trim();
      if (!jwtSecret) {
        logger.error(`JWT secret file at ${jwtKeyPath} is empty`);
        throw new Error(`JWT secret file at ${jwtKeyPath} is empty. JWT Strategy cannot be initialized.`);
      }
    } else if (jwtSecretOrigin === 'ENV') {
      jwtSecret = configuredSecretOrPath;
      if (!jwtSecret) {
        logger.error('AUTH_JWT_SECRET (as secret value) is not set in config for JWT (origin ENV)');
        throw new Error('AUTH_JWT_SECRET is not configured for ENV origin. JWT Strategy cannot be initialized.');
      }
    } else {
      // This should be caught by Zod schema validation on appConfig load.
      const errorMessage = `Unknown JWT secret origin in config: ${jwtSecretOrigin}. JWT Strategy cannot be initialized.`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    return jwtSecret;
  }

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService
  ) {
    const appConfig = configService.get<AppConfigType>('app');
    // Use a temporary logger for secret resolution before super()
    // as this.logger (instance property) is not available if it's an initialized property
    // and super() must be called first.
    const initLogger = new Logger('JwtStrategyInit');
    const secret = JwtStrategy._resolveSecret(appConfig, initLogger);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const isRevoked = await this.authService.isJWTRevoked({ tokenId: payload.tokenId });
    if (isRevoked) {
      this.logger.warn(`JWT token ${payload.tokenId} is revoked`);
      throw new UnauthorizedException();
    }

    if (!payload.sub) {
      this.logger.warn('JWT payload does not contain user ID (sub)');
      throw new UnauthorizedException('Invalid JWT Token');
    }

    const user = (await this.usersService.findOne({ id: payload.sub })) as AuthenticatedUser;

    if (!user) {
      this.logger.warn(`User with ID ${payload.sub} not found`);
      throw new UnauthorizedException();
    }

    user.jwtTokenId = payload.tokenId;

    return user;
  }
}
