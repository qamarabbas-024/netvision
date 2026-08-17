import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../monitoring.service';
import { sanitizeRequestId } from '../utils/redaction.util';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

@Injectable()
export class RequestCorrelationMiddleware implements NestMiddleware {
  constructor(private readonly monitoringService: MonitoringService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const rawClientHeader = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string | undefined;
    const sanitizedId = sanitizeRequestId(rawClientHeader);
    const requestId = sanitizedId || this.monitoringService.generateRequestId();

    req.requestId = requestId;
    req.startTime = Date.now();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);

    next();
  }
}
