import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RateLimiterService } from './rate-limiter.service';
import { AppRateLimitGuard } from './app-rate-limit.guard';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RateLimiterService, AppRateLimitGuard],
  exports: [RateLimiterService, AppRateLimitGuard],
})
export class RateLimiterModule {}
