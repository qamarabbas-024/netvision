import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { classifyDatabaseError } from './database-error.util';
import { redactSensitiveData } from '../monitoring/utils/redaction.util';

export interface PrismaRetryConfig {
  maxTransientRetries: number;
  initialDelayMs: number;
  maxTotalBudgetMs: number;
}

export const DEFAULT_RETRY_CONFIG: PrismaRetryConfig = {
  maxTransientRetries: 2,
  initialDelayMs: 100,
  maxTotalBudgetMs: 500,
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private retryConfig: PrismaRetryConfig = { ...DEFAULT_RETRY_CONFIG };

  constructor() {
    super();

    // Bounded Request Resilience Middleware
    this.$use(async (params, next) => {
      // Health check and raw point-in-time probes must fail fast with 0 retries
      const isHealthProbe = params.action === 'queryRaw' || params.action === 'executeRaw';
      if (isHealthProbe) {
        return next(params);
      }

      const startTime = Date.now();
      let attemptsRemaining = this.retryConfig.maxTransientRetries;
      let currentDelay = this.retryConfig.initialDelayMs;

      while (true) {
        try {
          return await next(params);
        } catch (error: any) {
          const elapsedMs = Date.now() - startTime;
          const classified = classifyDatabaseError(error);

          // Permanent or non-retryable errors must fail immediately (0 retries)
          if (!classified.isRetryable || attemptsRemaining <= 0 || elapsedMs >= this.retryConfig.maxTotalBudgetMs) {
            if (classified.isRetryable && attemptsRemaining <= 0) {
              this.logger.warn(
                `Transient retry budget exhausted for ${params.model || 'DB'}.${params.action} (${elapsedMs}ms elapsed). Failing fast.`
              );
            }
            throw error;
          }

          attemptsRemaining--;
          const jitter = Math.floor(Math.random() * 30);
          const effectiveDelay = currentDelay + jitter;

          this.logger.warn(
            `Transient error (${error?.code || 'NETWORK'}) on ${params.model || 'DB'}.${params.action}. ` +
            `Retrying in ${effectiveDelay}ms... (${attemptsRemaining} retries left, budget: ${this.retryConfig.maxTotalBudgetMs - elapsedMs}ms)`
          );

          await new Promise((resolve) => setTimeout(resolve, effectiveDelay));
          currentDelay *= 2;
        }
      }
    });
  }

  public setRetryConfig(config: Partial<PrismaRetryConfig>) {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  public getRetryConfig(): PrismaRetryConfig {
    return { ...this.retryConfig };
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connection established successfully.');
    } catch (error: any) {
      const sanitized = redactSensitiveData(error?.message || String(error));
      this.logger.warn(`Database connection deferred / not reachable on init: ${sanitized}`);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {
      // Safe teardown
    }
  }
}
