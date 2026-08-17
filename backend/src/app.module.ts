import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TopicsModule } from './topics/topics.module';
import { AdminModule } from './admin/admin.module';
import { SandboxModule } from './sandbox/sandbox.module';
import { AchievementsModule } from './achievements/achievements.module';
import { CertificationsModule } from './certifications/certifications.module';
import { TroubleshootingModule } from './troubleshooting/troubleshooting.module';
import { RateLimiterModule } from './security/rate-limiter/rate-limiter.module';
import { AppRateLimitGuard } from './security/rate-limiter/app-rate-limit.guard';
import { MonitoringModule } from './monitoring/monitoring.module';
import { LoggingInterceptor } from './monitoring/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './monitoring/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MonitoringModule,
    RateLimiterModule,
    DatabaseModule,
    AuthModule,
    TopicsModule,
    AdminModule,
    SandboxModule,
    AchievementsModule,
    CertificationsModule,
    TroubleshootingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppRateLimitGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
