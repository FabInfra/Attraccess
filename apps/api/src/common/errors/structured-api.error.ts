import { HttpException, HttpStatus } from '@nestjs/common';

export interface StructuredErrorResponse {
  message: string;
  errorCode: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

export class StructuredApiError extends HttpException {
  constructor(public readonly errorCode: string, message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        message,
        errorCode,
        statusCode,
        timestamp: new Date().toISOString(),
      },
      statusCode
    );
  }

  getStructuredResponse(path?: string): StructuredErrorResponse {
    const response = this.getResponse() as StructuredErrorResponse;
    return {
      ...response,
      path,
    };
  }
}

// Base classes for structured errors
// Specific error implementations should be created in their respective modules
