import {
  SystemPermissionsGuard,
  SystemPermission,
} from './systemPermissions.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { User } from '../../database/entities';

describe('SystemPermissionsGuard', () => {
  let guard: SystemPermissionsGuard;
  let reflector: Reflector;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new SystemPermissionsGuard(reflector);

    mockContext = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: {
            systemPermissions: {},
          },
        }),
      }),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no permissions are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([]);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should allow access when required permission is present', () => {
    const mockUser = {
      systemPermissions: {
        [SystemPermission.canManageUsers]: true,
      },
    } as User;

    const mockContextWithUser = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: mockUser }),
      }),
    } as unknown as ExecutionContext;

    jest
      .spyOn(reflector, 'get')
      .mockReturnValue([SystemPermission.canManageUsers]);

    const result = guard.canActivate(mockContextWithUser);

    expect(result).toBe(true);
  });

  it('should deny access when required permission is missing', () => {
    const mockUser = {
      systemPermissions: {
        [SystemPermission.canManageUsers]: false,
      },
    } as User;

    const mockContextWithUser = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: mockUser }),
      }),
    } as unknown as ExecutionContext;

    jest
      .spyOn(reflector, 'get')
      .mockReturnValue([SystemPermission.canManageUsers]);

    const result = guard.canActivate(mockContextWithUser);

    expect(result).toBe(false);
  });

  it('should deny access when permission is undefined', () => {
    const mockUser = {
      systemPermissions: {},
    } as User;

    const mockContextWithUser = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: mockUser }),
      }),
    } as unknown as ExecutionContext;

    jest
      .spyOn(reflector, 'get')
      .mockReturnValue([SystemPermission.canManageUsers]);

    const result = guard.canActivate(mockContextWithUser);

    expect(result).toBe(false);
  });
});
