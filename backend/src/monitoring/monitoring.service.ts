import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { redactSensitiveData } from './utils/redaction.util';
import * as crypto from 'crypto';

export interface AuthAuditEvent {
  event:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'REGISTER_SUCCESS'
    | 'OAUTH_SUCCESS'
    | 'OAUTH_FAILED'
    | 'PASSWORD_RESET_REQUEST'
    | 'RATE_LIMIT_EXCEEDED';
  ip: string;
  userIdentifier?: string;
  requestId?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface SandboxAuditEvent {
  event:
    | 'SESSION_CREATED'
    | 'COMMAND_EXECUTED'
    | 'SESSION_TERMINATED'
    | 'FORBIDDEN_COMMAND'
    | 'PROVIDER_ERROR';
  sessionId: string;
  provider: string;
  userId?: string;
  requestId?: string;
  commandSnippet?: string;
  exitCode?: number;
  durationMs?: number;
  timestamp: string;
}

export interface MetricsSummary {
  uptimeSeconds: number;
  totalRequests: number;
  status2xxCount: number;
  status4xxCount: number;
  status5xxCount: number;
  averageLatencyMs: number;
  activeSessions: number;
  timestamp: string;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly startTime = Date.now();

  private requestCount = 0;
  private count2xx = 0;
  private count4xx = 0;
  private count5xx = 0;
  private totalLatencyMs = 0;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a cryptographically secure, unique Request ID
   */
  public generateRequestId(): string {
    return `nv-req-${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}`;
  }

  /**
   * Record HTTP request completion metrics
   */
  public recordRequest(statusCode: number, durationMs: number): void {
    this.requestCount++;
    this.totalLatencyMs += durationMs;

    if (statusCode >= 200 && statusCode < 400) {
      this.count2xx++;
    } else if (statusCode >= 400 && statusCode < 500) {
      this.count4xx++;
    } else if (statusCode >= 500) {
      this.count5xx++;
    }
  }

  /**
   * Safe, structured Auth security event auditor.
   * Redacts sensitive data before writing to structured audit logs.
   */
  public recordAuthEvent(
    event: AuthAuditEvent['event'],
    metadata: {
      ip: string;
      userIdentifier?: string;
      requestId?: string;
      details?: Record<string, any>;
    }
  ): void {
    const sanitizedDetails = metadata.details ? redactSensitiveData(metadata.details) : undefined;
    const auditRecord: AuthAuditEvent = {
      event,
      ip: metadata.ip,
      userIdentifier: metadata.userIdentifier ? redactSensitiveData(metadata.userIdentifier) : undefined,
      requestId: metadata.requestId,
      details: sanitizedDetails,
      timestamp: new Date().toISOString(),
    };

    const isFailureOrWarning = event.includes('FAILED') || event.includes('RATE_LIMIT');
    const logMessage = `[AUTH_AUDIT] ${event} | IP: ${auditRecord.ip} | User: ${auditRecord.userIdentifier || 'anonymous'} | ReqID: ${auditRecord.requestId || 'n/a'}`;

    if (isFailureOrWarning) {
      this.logger.warn(logMessage);
    } else {
      this.logger.log(logMessage);
    }
  }

  /**
   * Safe Sandbox lifecycle auditor.
   */
  public recordSandboxEvent(
    event: SandboxAuditEvent['event'],
    metadata: {
      sessionId: string;
      provider: string;
      userId?: string;
      requestId?: string;
      commandSnippet?: string;
      exitCode?: number;
      durationMs?: number;
    }
  ): void {
    const sanitizedCommand = metadata.commandSnippet ? redactSensitiveData(metadata.commandSnippet) : undefined;
    const auditRecord: SandboxAuditEvent = {
      event,
      sessionId: metadata.sessionId,
      provider: metadata.provider,
      userId: metadata.userId,
      requestId: metadata.requestId,
      commandSnippet: sanitizedCommand,
      exitCode: metadata.exitCode,
      durationMs: metadata.durationMs,
      timestamp: new Date().toISOString(),
    };

    const logMessage = `[SANDBOX_AUDIT] ${event} | SessID: ${auditRecord.sessionId} | Provider: ${auditRecord.provider} | ExitCode: ${auditRecord.exitCode ?? 'n/a'}`;
    if (event === 'FORBIDDEN_COMMAND' || event === 'PROVIDER_ERROR') {
      this.logger.warn(logMessage);
    } else {
      this.logger.log(logMessage);
    }
  }

  /**
   * Check Database connectivity & health
   */
  public async checkDatabaseHealth(): Promise<{ healthy: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const latencyMs = Date.now() - start;
      return { healthy: true, latencyMs };
    } catch (err: any) {
      this.logger.error(`Database health check failed: ${err?.message || err}`);
      return { healthy: false, latencyMs: Date.now() - start, error: 'Database query failed' };
    }
  }

  /**
   * Get safe sanitized metrics summary
   */
  public getMetricsSummary(): MetricsSummary {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const averageLatencyMs = this.requestCount > 0 ? Number((this.totalLatencyMs / this.requestCount).toFixed(2)) : 0;

    return {
      uptimeSeconds,
      totalRequests: this.requestCount,
      status2xxCount: this.count2xx,
      status4xxCount: this.count4xx,
      status5xxCount: this.count5xx,
      averageLatencyMs,
      activeSessions: 0,
      timestamp: new Date().toISOString(),
    };
  }
}
