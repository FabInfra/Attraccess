# Structured API Error Handling

This directory contains the implementation for machine-readable API error responses.

## Overview

Instead of relying on human-readable error messages for error handling, this system provides machine-readable error codes that can be consistently translated on the frontend.

## Error Response Format

All API errors now return a structured response:

```json
{
  "message": "Email already in use",
  "errorCode": "EMAIL_ALREADY_IN_USE",
  "statusCode": 403,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/users/123/email"
}
```

## Available Error Codes

Error codes are now organized by module. See each module's `errors/` directory for specific error codes.

### Generic

- `HTTP_EXCEPTION` - Fallback for standard HTTP exceptions

### Example: User Email Management (in users module)

- `EMAIL_ALREADY_IN_USE` - The email address is already registered to another user
- `USER_NOT_FOUND` - The specified user does not exist
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions for this action
- `INVALID_EMAIL_FORMAT` - The provided email address format is invalid

## Usage

### Backend (NestJS)

```typescript
import { EmailAlreadyInUseError } from './errors/user-email.errors';

// Instead of:
throw new ForbiddenException('Email already in use');

// Use:
throw new EmailAlreadyInUseError();
```

### Frontend (React)

```typescript
const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError && error.body) {
    const apiErrorBody = error.body as {
      errorCode?: string;
      message?: string;
    };

    // Use machine-readable error code for translation
    if (apiErrorBody.errorCode) {
      const translationKey = `errors.${apiErrorBody.errorCode}`;
      const translation = t(translationKey);

      if (translation !== translationKey) {
        return translation;
      }
    }

    // Fallback to human-readable message
    return apiErrorBody.message || 'Unknown error';
  }

  return 'Unknown error';
};
```

## Benefits

1. **Consistent Error Handling** - All errors follow the same structure
2. **Internationalization** - Error codes can be translated to any language
3. **Frontend Independence** - Frontend doesn't depend on specific error message text
4. **Maintainability** - Error codes are stable even if messages change
5. **Type Safety** - Error codes can be typed and validated

## Module Organization

Error classes should be organized by module, not globally:

```
apps/api/src/
├── common/errors/
│   ├── structured-api.error.ts    # Base classes only
│   └── structured-api-error.filter.ts
├── users-and-auth/users/errors/
│   └── user-email.errors.ts       # User-specific errors
├── resources/errors/
│   └── resource.errors.ts         # Resource-specific errors
└── [other-module]/errors/
    └── [module].errors.ts         # Module-specific errors
```

## Adding New Error Types

1. **Create the error class** in your module's `errors/` directory:

```typescript
// apps/api/src/my-module/errors/my-module.errors.ts
import { StructuredApiError } from '../../common/errors/structured-api.error';

export class MyCustomError extends StructuredApiError {
  constructor() {
    super('MY_CUSTOM_ERROR', 'Something went wrong', HttpStatus.BAD_REQUEST);
  }
}
```

2. **Add translations** to frontend translation files:

```json
{
  "errors": {
    "MY_CUSTOM_ERROR": "Something went wrong"
  }
}
```

3. **Use in controllers**:

```typescript
import { MyCustomError } from './errors/my-module.errors';

throw new MyCustomError();
```
