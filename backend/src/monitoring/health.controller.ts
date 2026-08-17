import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MonitoringService } from './monitoring.service';
import { EmailService } from '../mail/email.service';
import { PrismaService } from '../database/prisma.service';

@Controller()
export class HealthController {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * Liveness Probe: Returns whether the application process is running and accepting HTTP connections.
   * Path: /api/v1/health & /api/v1/health/live
   */
  @Get(['health', 'health/live'])
  async getLiveness() {
    let dbStatus = 'healthy';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'unhealthy';
    }

    return {
      status: dbStatus === 'healthy' ? 'ok' : 'degraded',
      service: 'NetVision API',
      database: dbStatus,
      uptimeSeconds: this.monitoringService.getMetricsSummary().uptimeSeconds,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  /**
   * Readiness Probe: Verifies core dependencies (Database, critical subsystems).
   * Returns 200 OK when ready to serve user traffic, 503 Service Unavailable when DB is down.
   * Path: /api/v1/ready & /api/v1/health/ready
   */
  @Get(['ready', 'health/ready'])
  async getReadiness(@Res() res: Response) {
    const dbCheck = await this.monitoringService.checkDatabaseHealth();
    const mailStatus = this.emailService.getProviderStatus();

    const isReady = dbCheck.healthy;
    const responsePayload = {
      status: isReady ? 'ready' : 'unhealthy',
      service: 'NetVision API',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck.healthy ? 'connected' : 'disconnected',
        databaseLatencyMs: dbCheck.latencyMs,
        mailProvider: mailStatus.provider,
        mailConfigured: mailStatus.configured,
      },
    };

    if (!isReady) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        ...responsePayload,
        error: 'Database connection check failed',
      });
    }

    return res.status(HttpStatus.OK).json(responsePayload);
  }

  /**
   * Sanitized telemetry & metrics endpoint.
   * Path: /api/v1/monitoring/metrics
   */
  @Get('monitoring/metrics')
  getMetrics() {
    return this.monitoringService.getMetricsSummary();
  }
}
