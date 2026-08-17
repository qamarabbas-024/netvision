import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { HealthController } from './health.controller';
import { RequestCorrelationMiddleware } from './middleware/request-correlation.middleware';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { DatabaseModule } from '../database/database.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [HealthController],
  providers: [
    MonitoringService,
    LoggingInterceptor,
    AllExceptionsFilter,
  ],
  exports: [MonitoringService, LoggingInterceptor, AllExceptionsFilter],
})
export class MonitoringModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestCorrelationMiddleware).forRoutes('*');
  }
}
