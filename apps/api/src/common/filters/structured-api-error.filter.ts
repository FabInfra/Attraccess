import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { StructuredApiError } from '../errors/structured-api.error';

@Catch(StructuredApiError)
export class StructuredApiErrorFilter implements ExceptionFilter {
  catch(exception: StructuredApiError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = exception.getStructuredResponse(request.url);

    response.status(status).json(errorResponse);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Transform standard HttpExceptions to structured format
    const exceptionResponse = exception.getResponse();
    let message: string;
    let errorCode: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      errorCode = 'HTTP_EXCEPTION';
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as { message?: string; error?: string };
      message = responseObj.message || exception.message;
      errorCode = responseObj.error || 'HTTP_EXCEPTION';
    } else {
      message = exception.message;
      errorCode = 'HTTP_EXCEPTION';
    }

    response.status(status).json({
      message,
      errorCode,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
