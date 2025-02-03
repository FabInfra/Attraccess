import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// Services and Controllers
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

// Strategies
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

// Constants and Entities
import { jwtConstants } from './constants';
import { User, AuthenticationDetail } from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AuthenticationDetail]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [UsersService, AuthService, LocalStrategy, JwtStrategy],
  controllers: [UsersController, AuthController],
  exports: [UsersService, AuthService],
})
export class UsersAndAuthModule {}
