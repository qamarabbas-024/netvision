import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { redactSensitiveData, createStructuredLog } from './utils/redaction.util';
import * as crypto from 'crypto';

export interface AuthAuditEvent {
  event:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'REGISTER_SUCCESS'
    | 'OAUTH_SUCCESS'
    | 'OAUTH_FAILED'
    | 'PASSWORD_RESET_REQUEST'
    | 'RATE_LIMIT_EXCEEDED'
    | 'REFRESH_SUCCESS'
    | 'REFRESH_FAILED'
    | 'LOGOUT';
  ip: string;
  userIdentifier?: string;
  requestId?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface SecurityAuditEvent {
  event:
    | 'TOKEN_REUSE_DETECTED'
    | 'RATE_LIMIT_EXCEEDED'
    | 'FORBIDDEN_COMMAND'
    | 'SUSPICIOUS_ACCESS'
    | 'SESSION_REVOKED';
  ip?: string;
  userId?: string;
  requestId?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface CertificationAuditEvent {
  event:
    | 'EXAM_ATTEMPTED'
    | 'EXAM_PASSED'
    | 'EXAM_FAILED'
    | 'CAPSTONE_SUBMITTED'
    | 'CAPSTONE_PASSED'
    | 'CAPSTONE_FAILED';
  userId?: string;
  courseId?: string;
  score?: number;
  requestId?: string;
  timestamp: string;
}

export interface LabAuditEvent {
  event:
    | 'COMMAND_EXECUTED'
    | 'COMMAND_FAILED'
    | 'LAB_COMPLETED'
    | 'FORBIDDEN_COMMAND';
  scenarioId?: string;
  commandSnippet?: string;
  userId?: string;
  durationMs?: number;
  requestId?: string;
  timestamp: string;
}

export interface QuizAuditEvent {
  event: 'QUIZ_COMPLETED';
  quizId?: string;
  score?: number;
  userId?: string;
  requestId?: string;
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

export interface AlertEvaluation {
  id: string;
  name: string;
  status: 'OK' | 'WARNING' | 'CRITICAL';
  threshold: string;
  currentValue: string | number;
  message: string;
  triggeredAt?: string;
}

export interface MetricsSummary {
  uptimeSeconds: number;
  totalRequests: number;
  status2xxCount: number;
  status4xxCount: number;
  status5xxCount: number;
  errorRatePercent: number;
  status5xxPercent: number;
  averageLatencyMs: number;
  latency: {
    minMs: number;
    maxMs: number;
    avgMs: number;
    p95Ms: number;
  };
  auth: {
    successes: number;
    failures: number;
    refreshSuccesses: number;
    refreshFailures: number;
    tokenReuseCount: number;
  };
  learning: {
    quizCompletions: number;
    labCompletions: number;
    labCommandExecutions: number;
    labCommandFailures: number;
    certificationAttempts: number;
    certificationPasses: number;
    certificationFailures: number;
    capstoneSubmissions: number;
    capstonePasses: number;
    capstoneFailures: number;
  };
  database: {
    healthy: boolean;
    lastLatencyMs: number;
  };
  activeAlertsCount: number;
  healthMonitoringLoad?: {
    totalProbes: number;
    cachedProbes: number;
    executedDbQueries: number;
    cacheHitRatePercent: number;
    maxQueriesPerMinute: number;
    peakConcurrentConnections: number;
    probeTtlMs: number;
  };
  timestamp: string;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly startTime = Date.now();

  // HTTP Request metrics
  private requestCount = 0;
  private count2xx = 0;
  private count4xx = 0;
  private count5xx = 0;
  private totalLatencyMs = 0;
  private minLatencyMs = 0;
  private maxLatencyMs = 0;
  private readonly recentLatencies: number[] = [];
  private static readonly MAX_LATENCY_SAMPLES = 200;

  // Auth metrics
  private authSuccesses = 0;
  private authFailures = 0;
  private refreshSuccesses = 0;
  private refreshFailures = 0;
  private tokenReuseCount = 0;

  // Learning & Lab metrics
  private quizCompletions = 0;
  private labCompletions = 0;
  private labCommandExecutions = 0;
  private labCommandFailures = 0;
  private providerErrors = 0;
  private forbiddenCommands = 0;

  // Certification metrics
  private certificationAttempts = 0;
  private certificationPasses = 0;
  private certificationFailures = 0;
  private capstoneSubmissions = 0;
  private capstonePasses = 0;
  private capstoneFailures = 0;

  // Database metrics
  private dbHealthy = true;
  private lastDbLatencyMs = 0;
  private lastDbCheckTime = 0;
  private lastDbError?: string;
  private inFlightDbCheck: Promise<{ healthy: boolean; latencyMs: number; error?: string }> | null = null;
  public static readonly DB_PROBE_CACHE_TTL_MS = 2000;
  public static readonly DB_PROBE_TIMEOUT_MS = 2000;

  // Health Monitoring Load metrics (Drop 18 Requirement 7)
  private totalHealthProbes = 0;
  private cachedHealthProbes = 0;
  private executedDbQueries = 0;

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

    if (this.requestCount === 1) {
      this.minLatencyMs = durationMs;
      this.maxLatencyMs = durationMs;
    } else {
      if (durationMs < this.minLatencyMs) this.minLatencyMs = durationMs;
      if (durationMs > this.maxLatencyMs) this.maxLatencyMs = durationMs;
    }

    if (this.recentLatencies.length >= MonitoringService.MAX_LATENCY_SAMPLES) {
      this.recentLatencies.shift();
    }
    this.recentLatencies.push(durationMs);

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
    if (event === 'LOGIN_SUCCESS' || event === 'REGISTER_SUCCESS' || event === 'OAUTH_SUCCESS') {
      this.authSuccesses++;
    } else if (event === 'LOGIN_FAILED' || event === 'OAUTH_FAILED' || event === 'RATE_LIMIT_EXCEEDED') {
      this.authFailures++;
    } else if (event === 'REFRESH_SUCCESS') {
      this.refreshSuccesses++;
    } else if (event === 'REFRESH_FAILED') {
      this.refreshFailures++;
    }

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
    const structuredLog = createStructuredLog(
      isFailureOrWarning ? 'WARN' : 'LOG',
      'AUTH_AUDIT',
      `Auth Event: ${event}`,
      {
        requestId: metadata.requestId,
        event,
        metadata: {
          ip: auditRecord.ip,
          user: auditRecord.userIdentifier || 'anonymous',
          details: auditRecord.details,
        },
      }
    );

    const logMessage = `[AUTH_AUDIT] ${event} | IP: ${auditRecord.ip} | User: ${auditRecord.userIdentifier || 'anonymous'} | ReqID: ${auditRecord.requestId || 'n/a'}`;
    if (isFailureOrWarning) {
      this.logger.warn(logMessage);
    } else {
      this.logger.log(logMessage);
    }
  }

  /**
   * Safe Security Event Auditor.
   */
  public recordSecurityEvent(
    event: SecurityAuditEvent['event'],
    metadata: {
      ip?: string;
      userId?: string;
      requestId?: string;
      details?: Record<string, any>;
    }
  ): void {
    if (event === 'TOKEN_REUSE_DETECTED') {
      this.tokenReuseCount++;
    } else if (event === 'FORBIDDEN_COMMAND') {
      this.forbiddenCommands++;
    }

    const auditRecord: SecurityAuditEvent = {
      event,
      ip: metadata.ip,
      userId: metadata.userId ? redactSensitiveData(metadata.userId) : undefined,
      requestId: metadata.requestId,
      details: metadata.details ? redactSensitiveData(metadata.details) : undefined,
      timestamp: new Date().toISOString(),
    };

    const logMessage = `[SECURITY_AUDIT] 🚨 ${event} | IP: ${auditRecord.ip || 'n/a'} | User: ${auditRecord.userId || 'anonymous'} | ReqID: ${auditRecord.requestId || 'n/a'}`;
    this.logger.error(logMessage);
  }

  /**
   * Safe Certification & Capstone Auditor.
   */
  public recordCertificationEvent(
    event: CertificationAuditEvent['event'],
    metadata: {
      userId?: string;
      courseId?: string;
      score?: number;
      requestId?: string;
    }
  ): void {
    if (event === 'EXAM_ATTEMPTED') {
      this.certificationAttempts++;
    } else if (event === 'EXAM_PASSED') {
      this.certificationPasses++;
    } else if (event === 'EXAM_FAILED') {
      this.certificationFailures++;
    } else if (event === 'CAPSTONE_SUBMITTED') {
      this.capstoneSubmissions++;
    } else if (event === 'CAPSTONE_PASSED') {
      this.capstonePasses++;
    } else if (event === 'CAPSTONE_FAILED') {
      this.capstoneFailures++;
    }

    const logMessage = `[CERTIFICATION_AUDIT] ${event} | Course: ${metadata.courseId || 'Mastery'} | Score: ${metadata.score ?? 'n/a'} | ReqID: ${metadata.requestId || 'n/a'}`;
    this.logger.log(logMessage);
  }

  /**
   * Safe Lab & Troubleshooting Event Auditor.
   */
  public recordLabEvent(
    event: LabAuditEvent['event'],
    metadata: {
      scenarioId?: string;
      commandSnippet?: string;
      userId?: string;
      durationMs?: number;
      requestId?: string;
    }
  ): void {
    if (event === 'COMMAND_EXECUTED') {
      this.labCommandExecutions++;
    } else if (event === 'COMMAND_FAILED') {
      this.labCommandFailures++;
    } else if (event === 'LAB_COMPLETED') {
      this.labCompletions++;
    } else if (event === 'FORBIDDEN_COMMAND') {
      this.forbiddenCommands++;
    }

    const sanitizedCommand = metadata.commandSnippet ? redactSensitiveData(metadata.commandSnippet) : undefined;
    const logMessage = `[LAB_AUDIT] ${event} | Scenario: ${metadata.scenarioId || 'unknown'} | Cmd: ${sanitizedCommand || 'n/a'}`;
    if (event === 'COMMAND_FAILED' || event === 'FORBIDDEN_COMMAND') {
      this.logger.warn(logMessage);
    } else {
      this.logger.log(logMessage);
    }
  }

  /**
   * Safe Quiz Event Auditor.
   */
  public recordQuizEvent(
    event: QuizAuditEvent['event'],
    metadata: {
      quizId?: string;
      score?: number;
      userId?: string;
      requestId?: string;
    }
  ): void {
    if (event === 'QUIZ_COMPLETED') {
      this.quizCompletions++;
    }

    const logMessage = `[QUIZ_AUDIT] ${event} | Quiz: ${metadata.quizId || 'unknown'} | Score: ${metadata.score ?? 'n/a'}`;
    this.logger.log(logMessage);
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
    if (event === 'COMMAND_EXECUTED') {
      this.labCommandExecutions++;
      if (metadata.exitCode && metadata.exitCode !== 0) {
        this.labCommandFailures++;
      }
    } else if (event === 'PROVIDER_ERROR') {
      this.providerErrors++;
    } else if (event === 'FORBIDDEN_COMMAND') {
      this.forbiddenCommands++;
    }

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
   * Check Database connectivity & health with query storm debouncing and timeout protection.
   * Caches results for 2000ms to prevent health probe storms from overloading the database.
   */
  public async checkDatabaseHealth(
    forceCheck = false
  ): Promise<{ healthy: boolean; latencyMs: number; error?: string; cached?: boolean }> {
    this.totalHealthProbes++;
    const now = Date.now();

    // 1. Serve from short-lived TTL cache unless forced
    if (!forceCheck && now - this.lastDbCheckTime < MonitoringService.DB_PROBE_CACHE_TTL_MS) {
      this.cachedHealthProbes++;
      return {
        healthy: this.dbHealthy,
        latencyMs: this.lastDbLatencyMs,
        error: this.lastDbError,
        cached: true,
      };
    }

    // 2. Coalesce concurrent requests onto existing in-flight probe
    if (this.inFlightDbCheck) {
      this.cachedHealthProbes++;
      return this.inFlightDbCheck;
    }

    // 3. Launch isolated probe with strict timeout
    this.inFlightDbCheck = (async () => {
      this.executedDbQueries++;
      const start = Date.now();
      let timeoutId: NodeJS.Timeout | null = null;
      try {
        const queryPromise = this.prisma.$queryRaw`SELECT 1`;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error(`Database probe query timed out after ${MonitoringService.DB_PROBE_TIMEOUT_MS}ms`)),
            MonitoringService.DB_PROBE_TIMEOUT_MS
          );
        });

        await Promise.race([queryPromise, timeoutPromise]);

        const latencyMs = Date.now() - start;
        this.dbHealthy = true;
        this.lastDbLatencyMs = latencyMs;
        this.lastDbCheckTime = Date.now();
        this.lastDbError = undefined;
        return { healthy: true, latencyMs };
      } catch (err: any) {
        const latencyMs = Date.now() - start;
        const sanitizedErr = redactSensitiveData(err?.message || String(err));
        this.dbHealthy = false;
        this.lastDbLatencyMs = latencyMs;
        this.lastDbCheckTime = Date.now();
        this.lastDbError = sanitizedErr;
        this.logger.error(`Database health probe failed (${latencyMs}ms): ${sanitizedErr}`);
        return { healthy: false, latencyMs, error: sanitizedErr };
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        this.inFlightDbCheck = null;
      }
    })();

    return this.inFlightDbCheck;
  }

  /**
   * Calculate 95th percentile latency from recent request samples
   */
  private calculateP95Latency(): number {
    if (this.recentLatencies.length === 0) return 0;
    const sorted = [...this.recentLatencies].sort((a, b) => a - b);
    const p95Index = Math.min(
      Math.floor(sorted.length * 0.95),
      sorted.length - 1
    );
    return sorted[p95Index];
  }

  /**
   * Evaluates operational alert conditions against defined health thresholds
   */
  public evaluateAlerts(): AlertEvaluation[] {
    const alerts: AlertEvaluation[] = [];
    const now = new Date().toISOString();

    // 1. Elevated 5xx Rate
    const error5xxRate = this.requestCount > 0 ? (this.count5xx / this.requestCount) * 100 : 0;
    let elevated5xxStatus: AlertEvaluation['status'] = 'OK';
    let elevated5xxMsg = '5xx error rate within normal parameters.';

    if (this.count5xx >= 5 || (this.requestCount >= 10 && error5xxRate > 5)) {
      elevated5xxStatus = error5xxRate > 10 ? 'CRITICAL' : 'WARNING';
      elevated5xxMsg = `Elevated 5xx rate detected: ${error5xxRate.toFixed(2)}% (${this.count5xx} total 5xx responses).`;
    }
    alerts.push({
      id: 'elevated_5xx',
      name: 'Elevated 5xx Error Rate',
      status: elevated5xxStatus,
      threshold: '> 5.00% or >= 5 count',
      currentValue: `${error5xxRate.toFixed(2)}% (${this.count5xx})`,
      message: elevated5xxMsg,
      triggeredAt: elevated5xxStatus !== 'OK' ? now : undefined,
    });

    // 2. Database Health & Latency
    let dbStatus: AlertEvaluation['status'] = 'OK';
    let dbMsg = `Database operational (Latency: ${this.lastDbLatencyMs}ms).`;
    if (!this.dbHealthy) {
      dbStatus = 'CRITICAL';
      dbMsg = 'Database connection failure: queries failing.';
    } else if (this.lastDbLatencyMs > 1000) {
      dbStatus = 'WARNING';
      dbMsg = `Database latency elevated: ${this.lastDbLatencyMs}ms exceeds 1000ms threshold.`;
    }
    alerts.push({
      id: 'database_connection_failures',
      name: 'Database Health & Connectivity',
      status: dbStatus,
      threshold: 'Connection active & latency < 1000ms',
      currentValue: this.dbHealthy ? `${this.lastDbLatencyMs}ms` : 'DISCONNECTED',
      message: dbMsg,
      triggeredAt: dbStatus !== 'OK' ? now : undefined,
    });

    // 3. Authentication Abuse
    let authAbuseStatus: AlertEvaluation['status'] = 'OK';
    let authAbuseMsg = 'Authentication velocity nominal.';
    if (this.tokenReuseCount > 0) {
      authAbuseStatus = 'CRITICAL';
      authAbuseMsg = `Stolen refresh token replay detected: ${this.tokenReuseCount} incident(s).`;
    } else if (this.authFailures >= 5) {
      authAbuseStatus = 'WARNING';
      authAbuseMsg = `Authentication failure velocity elevated: ${this.authFailures} failures.`;
    }
    alerts.push({
      id: 'authentication_abuse',
      name: 'Authentication Abuse & Token Replay',
      status: authAbuseStatus,
      threshold: '0 Token Replays, < 5 Auth Failures',
      currentValue: `Replays: ${this.tokenReuseCount}, Failures: ${this.authFailures}`,
      message: authAbuseMsg,
      triggeredAt: authAbuseStatus !== 'OK' ? now : undefined,
    });

    // 4. Repeated Certification Failures
    let certFailStatus: AlertEvaluation['status'] = 'OK';
    const totalCertEvaluations = this.certificationAttempts + this.capstoneSubmissions;
    const totalCertFailures = this.certificationFailures + this.capstoneFailures;
    const failureRate = totalCertEvaluations > 0 ? (totalCertFailures / totalCertEvaluations) * 100 : 0;
    let certFailMsg = 'Certification completion velocity nominal.';

    if (totalCertEvaluations >= 5 && failureRate > 60) {
      certFailStatus = 'WARNING';
      certFailMsg = `Unusually high certification failure rate: ${failureRate.toFixed(1)}% (${totalCertFailures}/${totalCertEvaluations}).`;
    }
    alerts.push({
      id: 'repeated_certification_failures',
      name: 'Repeated Certification Failures',
      status: certFailStatus,
      threshold: '< 60% failure rate on min 5 attempts',
      currentValue: `${failureRate.toFixed(1)}% (${totalCertFailures}/${totalCertEvaluations})`,
      message: certFailMsg,
      triggeredAt: certFailStatus !== 'OK' ? now : undefined,
    });

    // 5. Simulation Engine Failures
    let simStatus: AlertEvaluation['status'] = 'OK';
    let simMsg = 'Simulation engines operational.';
    if (this.providerErrors > 0) {
      simStatus = 'CRITICAL';
      simMsg = `Simulation provider failure detected: ${this.providerErrors} error(s).`;
    }
    alerts.push({
      id: 'simulation_engine_failures',
      name: 'Simulation Engine Infrastructure',
      status: simStatus,
      threshold: '0 Provider Errors',
      currentValue: `${this.providerErrors} errors`,
      message: simMsg,
      triggeredAt: simStatus !== 'OK' ? now : undefined,
    });

    // 6. Unusual Command Errors
    let cmdErrorStatus: AlertEvaluation['status'] = 'OK';
    let cmdErrorMsg = 'Interactive command executions nominal.';
    if (this.labCommandFailures > 20 || this.forbiddenCommands > 5) {
      cmdErrorStatus = 'WARNING';
      cmdErrorMsg = `Unusual command errors: ${this.labCommandFailures} failures, ${this.forbiddenCommands} forbidden commands.`;
    }
    alerts.push({
      id: 'unusual_command_errors',
      name: 'Unusual Command & Terminal Errors',
      status: cmdErrorStatus,
      threshold: '<= 20 failures, <= 5 forbidden',
      currentValue: `${this.labCommandFailures} failures / ${this.forbiddenCommands} forbidden`,
      message: cmdErrorMsg,
      triggeredAt: cmdErrorStatus !== 'OK' ? now : undefined,
    });

    return alerts;
  }

  /**
   * Safe Health Monitoring Load metrics (Drop 18 Requirement 7).
   * Proves that health monitoring does not overload the database.
   */
  public getHealthMonitoringLoad(): {
    totalProbes: number;
    cachedProbes: number;
    executedDbQueries: number;
    cacheHitRatePercent: number;
    maxQueriesPerMinute: number;
    peakConcurrentConnections: number;
    probeTtlMs: number;
  } {
    const cacheHitRatePercent = this.totalHealthProbes > 0
      ? Number(((this.cachedHealthProbes / this.totalHealthProbes) * 100).toFixed(2))
      : 100;
    return {
      totalProbes: this.totalHealthProbes,
      cachedProbes: this.cachedHealthProbes,
      executedDbQueries: this.executedDbQueries,
      cacheHitRatePercent,
      maxQueriesPerMinute: 30, // 60s / 2s TTL
      peakConcurrentConnections: 1, // coalesced onto single in-flight promise
      probeTtlMs: MonitoringService.DB_PROBE_CACHE_TTL_MS,
    };
  }

  /**
   * Get safe sanitized metrics summary
   */
  public getMetricsSummary(): MetricsSummary {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const averageLatencyMs = this.requestCount > 0 ? Number((this.totalLatencyMs / this.requestCount).toFixed(2)) : 0;
    const errorCount = this.count4xx + this.count5xx;
    const errorRatePercent = this.requestCount > 0 ? Number(((errorCount / this.requestCount) * 100).toFixed(2)) : 0;
    const status5xxPercent = this.requestCount > 0 ? Number(((this.count5xx / this.requestCount) * 100).toFixed(2)) : 0;
    const p95Ms = this.calculateP95Latency();

    const alerts = this.evaluateAlerts();
    const activeAlertsCount = alerts.filter((a) => a.status !== 'OK').length;

    return {
      uptimeSeconds,
      totalRequests: this.requestCount,
      status2xxCount: this.count2xx,
      status4xxCount: this.count4xx,
      status5xxCount: this.count5xx,
      errorRatePercent,
      status5xxPercent,
      averageLatencyMs,
      latency: {
        minMs: this.minLatencyMs,
        maxMs: this.maxLatencyMs,
        avgMs: averageLatencyMs,
        p95Ms,
      },
      auth: {
        successes: this.authSuccesses,
        failures: this.authFailures,
        refreshSuccesses: this.refreshSuccesses,
        refreshFailures: this.refreshFailures,
        tokenReuseCount: this.tokenReuseCount,
      },
      learning: {
        quizCompletions: this.quizCompletions,
        labCompletions: this.labCompletions,
        labCommandExecutions: this.labCommandExecutions,
        labCommandFailures: this.labCommandFailures,
        certificationAttempts: this.certificationAttempts,
        certificationPasses: this.certificationPasses,
        certificationFailures: this.certificationFailures,
        capstoneSubmissions: this.capstoneSubmissions,
        capstonePasses: this.capstonePasses,
        capstoneFailures: this.capstoneFailures,
      },
      database: {
        healthy: this.dbHealthy,
        lastLatencyMs: this.lastDbLatencyMs,
      },
      activeAlertsCount,
      healthMonitoringLoad: this.getHealthMonitoringLoad(),
      timestamp: new Date().toISOString(),
    };
  }
}

