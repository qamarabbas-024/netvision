import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
    this.$use(async (params, next) => {
      let retries = 6;
      let delay = 1000;
      while (retries > 0) {
        try {
          return await next(params);
        } catch (error: any) {
          const msg = error?.message || '';
          const isTransient =
            error?.code === 'P1001' ||
            error?.code === 'P1017' ||
            msg.includes('Server has closed the connection') ||
            msg.includes('Connection closed') ||
            msg.includes('connection reset') ||
            msg.includes("Can't reach database server") ||
            msg.includes('connection pool') ||
            msg.includes('timeout') ||
            msg.includes('ETIMEDOUT') ||
            msg.includes('ECONNRESET');

          if (isTransient && retries > 1) {
            retries--;
            this.logger.warn(
              `Retrying transient Prisma DB error (${error?.code || 'NETWORK'}) for ${params.model}.${params.action} in ${delay}ms... (${retries} attempts left)`
            );
            await new Promise((r) => setTimeout(r, delay));
            delay *= 2;
          } else {
            throw error;
          }
        }
      }
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error: any) {
      this.logger.warn(`Database connection deferred / not reachable on init: ${error?.message || error}`);
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

