import { HttpStatus } from '@nestjs/common';
import { StructuredApiError } from '../../../common/errors/structured-api.error';

// User email management specific errors
export class EmailAlreadyInUseError extends StructuredApiError {
  constructor() {
    super('EMAIL_ALREADY_IN_USE', 'Email already in use', HttpStatus.FORBIDDEN);
  }
}

export class UserNotFoundError extends StructuredApiError {
  constructor(identifier: string | number) {
    super('USER_NOT_FOUND', `User with identifier "${identifier}" not found`, HttpStatus.NOT_FOUND);
  }
}

export class InsufficientPermissionsError extends StructuredApiError {
  constructor(action: string) {
    super('INSUFFICIENT_PERMISSIONS', `Insufficient permissions to ${action}`, HttpStatus.FORBIDDEN);
  }
}

export class InvalidEmailFormatError extends StructuredApiError {
  constructor() {
    super('INVALID_EMAIL_FORMAT', 'Invalid email format', HttpStatus.BAD_REQUEST);
  }
}
