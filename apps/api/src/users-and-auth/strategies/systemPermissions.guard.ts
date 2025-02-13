import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from '../../database/entities';
import { JwtGuard } from './jwt.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export enum SystemPermission {
  canManageUsers = 'canManageUsers',
}

const NeedsSystemPermissions = Reflector.createDecorator<SystemPermission[]>();

export function Auth(...permissions: SystemPermission[]) {
  return applyDecorators(
    NeedsSystemPermissions(permissions),
    UseGuards(JwtGuard, SystemPermissionsGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
}

@Injectable()
export class SystemPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.get(
      NeedsSystemPermissions,
      context.getHandler()
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      console.warn('No user found in request');
      throw new UnauthorizedException();
    }

    return this.matchPermissions(requiredPermissions, user);
  }

  private matchPermissions(
    requiredPermissions: SystemPermission[],
    user: User
  ): boolean {
    return requiredPermissions.every(
      (permission) => user.systemPermissions[permission] === true
    );
  }
}
