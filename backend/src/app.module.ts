import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TopicsModule } from './topics/topics.module';
import { AdminModule } from './admin/admin.module';
import { SandboxModule } from './sandbox/sandbox.module';
import { AchievementsModule } from './achievements/achievements.module';
import { CertificationsModule } from './certifications/certifications.module';
import { RateLimiterModule } from './security/rate-limiter/rate-limiter.module';
import { AppRateLimitGuard } from './security/rate-limiter/app-rate-limit.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RateLimiterModule,
    DatabaseModule,
    AuthModule,
    TopicsModule,
    AdminModule,
    SandboxModule,
    AchievementsModule,
    CertificationsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppRateLimitGuard,
    },
  ],
})
export class AppModule {}
