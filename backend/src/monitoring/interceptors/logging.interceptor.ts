import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { MonitoringService } from '../monitoring.service';
import { redactSensitiveData } from '../utils/redaction.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    const startTime = req.startTime || Date.now();
    const requestId = req.requestId || (req.headers['x-request-id'] as string) || 'unknown';
    const method = req.method;
    const originalUrl = req.originalUrl || req.url;
    const sanitizedUrl = redactSensitiveData(originalUrl);
    const clientIp = req.ip || req.socket?.remoteAddress || '127.0.0.1';

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startTime;
          const statusCode = res.statusCode;
          this.monitoringService.recordRequest(statusCode, durationMs);

          if (statusCode >= 500) {
            this.logger.error(`[${requestId}] ${method} ${sanitizedUrl} ${statusCode} - ${durationMs}ms`);
          } else if (statusCode >= 400) {
            this.logger.warn(`[${requestId}] ${method} ${sanitizedUrl} ${statusCode} - ${durationMs}ms`);
          } else {
            this.logger.log(`[${requestId}] ${method} ${sanitizedUrl} ${statusCode} - ${durationMs}ms`);
          }
        },
        error: (err: any) => {
          const durationMs = Date.now() - startTime;
          const statusCode = err.status || err.statusCode || 500;
          this.monitoringService.recordRequest(statusCode, durationMs);

          this.logger.error(
            `[${requestId}] ${method} ${sanitizedUrl} ${statusCode} - ${durationMs}ms | Error: ${err.message || 'Internal error'}`
          );
        },
      })
    );
  }
}
