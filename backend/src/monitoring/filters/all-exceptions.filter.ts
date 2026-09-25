import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { redactSensitiveData } from '../utils/redaction.util';
import { classifyDatabaseError } from '../../database/database-error.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = (request as any).requestId || (request.headers['x-request-id'] as string) || 'unknown';
    const isProd = process.env.NODE_ENV === 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';
    let errorName = 'InternalServerError';

    const hasPrismaCode = typeof (exception as any)?.code === 'string' && (exception as any).code.startsWith('P');
    const isPrismaError =
      hasPrismaCode ||
      (exception instanceof Error &&
        (exception.name.includes('Prisma') || exception.constructor?.name?.includes('Prisma')));

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        message = resObj.message || exception.message;
        errorName = resObj.error || exception.name;
      } else {
        message = res;
        errorName = exception.name;
      }
    } else if (isPrismaError) {
      const classified = classifyDatabaseError(exception);
      status = classified.httpStatus;
      errorName = classified.errorName;
      message = classified.sanitizedMessage;

      if (classified.retryAfterSeconds && classified.httpStatus === HttpStatus.SERVICE_UNAVAILABLE) {
        response.setHeader('Retry-After', String(classified.retryAfterSeconds));
      }
    } else if (typeof exception === 'object' && exception !== null) {
      const rawMsg = ((exception as any).message || '').toLowerCase();
      const looksLikeDbError =
        rawMsg.includes('compute time quota') ||
        rawMsg.includes("can't reach database server") ||
        rawMsg.includes('database server') ||
        rawMsg.includes('connection pool') ||
        rawMsg.includes('econnrefused') ||
        rawMsg.includes('econnreset');

      if (looksLikeDbError) {
        const classified = classifyDatabaseError(exception);
        status = classified.httpStatus;
        errorName = classified.errorName;
        message = classified.sanitizedMessage;

        if (classified.retryAfterSeconds && classified.httpStatus === HttpStatus.SERVICE_UNAVAILABLE) {
          response.setHeader('Retry-After', String(classified.retryAfterSeconds));
        }
      } else {
        errorName = (exception as any).name || 'Error';
        if (!isProd) {
          message = (exception as any).message || String(exception);
        }
      }
    }

    // Never leak raw Prisma or internal class names in client response
    if (errorName.includes('Prisma')) {
      errorName = status >= 500 ? 'InternalServerError' : 'DatabaseError';
    }

    const safeMessage = redactSensitiveData(message);
    const sanitizedUrl = redactSensitiveData(request.originalUrl || request.url);

    // Detailed server-side error logging
    if (status >= 500) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(
        `[${requestId}] ${status} Unhandled Exception on ${request.method} ${sanitizedUrl}: ${exception instanceof Error ? exception.message : JSON.stringify(exception)}`,
        stack
      );
    } else if (status >= 400) {
      this.logger.warn(
        `[${requestId}] ${status} ${errorName} on ${request.method} ${sanitizedUrl}: ${typeof safeMessage === 'string' ? safeMessage : JSON.stringify(safeMessage)}`
      );
    }

    const responseBody = {
      statusCode: status,
      error: errorName,
      message: safeMessage,
      requestId,
      timestamp: new Date().toISOString(),
    };

    response.setHeader('X-Request-ID', requestId);
    response.status(status).json(responseBody);
  }
}
