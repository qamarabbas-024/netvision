import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async getHealthStatus(@Res({ passthrough: true }) res?: Response) {
    let dbStatus = 'healthy';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'unhealthy';
    }

    const isHealthy = dbStatus === 'healthy';
    if (!isHealthy && res) {
      if (typeof res.status === 'function') {
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
      }
      if (typeof res.setHeader === 'function') {
        res.setHeader('Retry-After', '5');
      }
    }

    return {
      status: isHealthy ? 'ok' : 'unhealthy',
      service: 'NetVision API',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      commitSha: process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'local-dev',
    };
  }
}
