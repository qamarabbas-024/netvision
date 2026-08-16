import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { RateLimiterService, RateLimitResult } from './rate-limiter.service';
import {
  RATE_LIMIT_TIER_KEY,
  SKIP_RATE_LIMIT_KEY,
  RateLimitTier,
} from './rate-limit.decorators';

@Injectable()
export class AppRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(AppRateLimitGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimiterService: RateLimiterService
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const isSkipped = this.reflector.getAllAndOverride<boolean>(SKIP_RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isSkipped) {
      return true;
    }

    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const clientIp = this.extractClientIp(req);
    const accountEmail = this.extractAccountIdentifier(req);
    const tier = this.resolveTier(context, req);

    let result: RateLimitResult;

    switch (tier) {
      case 'AUTH':
        result = this.rateLimiterService.checkAuthLimit(clientIp, accountEmail);
        break;
      case 'STRICT_AUTH':
        result = this.rateLimiterService.checkStrictAuthLimit(clientIp, accountEmail);
        break;
      case 'USER':
        const userId = (req as any).user?.id || (req as any).user?.sub || '';
        result = this.rateLimiterService.checkUserLimit(userId, clientIp);
        break;
      case 'PUBLIC':
      default:
        result = this.rateLimiterService.checkPublicLimit(clientIp);
        break;
    }

    // Set standard RateLimit headers if response headers are not sent
    if (res && !res.headersSent && typeof res.setHeader === 'function') {
      res.setHeader('X-RateLimit-Limit', result.limit.toString());
      res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetMs / 1000).toString());
    }

    if (!result.allowed) {
      if (res && !res.headersSent && typeof res.setHeader === 'function') {
        res.setHeader('Retry-After', result.retryAfterSeconds.toString());
      }

      let message = `Too Many Requests: Rate limit exceeded. Please retry in ${result.retryAfterSeconds} second(s).`;
      if (result.reason === 'BACKOFF_COOLDOWN_ACTIVE') {
        message = `Too Many Requests: Progressive authentication cooldown is active after consecutive failed attempts. Please retry in ${result.retryAfterSeconds} second(s).`;
      } else if (result.reason === 'ACCOUNT_LIMIT_EXCEEDED') {
        message = `Too Many Requests: Account-level authentication threshold exceeded. Please wait ${result.retryAfterSeconds} second(s) before trying again.`;
      }

      this.logger.warn(
        `⛔ Rate limit triggered [Tier: ${tier}] from IP: ${clientIp}${
          accountEmail ? `, Account: ${accountEmail}` : ''
        }. Retry after: ${result.retryAfterSeconds}s.`
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message,
          retryAfter: result.retryAfterSeconds,
          tier,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }

  /**
   * Resolves the rate limit tier for this request.
   */
  private resolveTier(context: ExecutionContext, req: Request): RateLimitTier {
    // 1. Check explicit decorator
    const explicitTier = this.reflector.getAllAndOverride<RateLimitTier>(RATE_LIMIT_TIER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (explicitTier) {
      return explicitTier;
    }

    // 2. Check if user is authenticated (JWT user attached)
    if ((req as any).user?.id || (req as any).user?.sub) {
      return 'USER';
    }

    // 3. Check route path
    const url = req.originalUrl || req.url || '';
    if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/verify-otp') || url.includes('/auth/resend-otp')) {
      return 'AUTH';
    }
    if (url.includes('/auth/forgot-password') || url.includes('/auth/reset-password')) {
      return 'STRICT_AUTH';
    }

    return 'PUBLIC';
  }

  /**
   * Extracts clean client IP with reverse-proxy and IPv6-mapped IPv4 support.
   */
  public extractClientIp(req: Request): string {
    // 1. Check req.ips if trust proxy is configured in Express
    if (req.ips && Array.isArray(req.ips) && req.ips.length > 0) {
      return this.cleanIp(req.ips[0]);
    }

    // 2. Check X-Forwarded-For header directly
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      const raw = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
      const firstIp = raw.split(',')[0].trim();
      if (firstIp) return this.cleanIp(firstIp);
    }

    // 3. Fallback to direct connection IP
    const rawIp = req.ip || req.socket?.remoteAddress || (req.connection as any)?.remoteAddress || '127.0.0.1';
    return this.cleanIp(rawIp);
  }

  private cleanIp(ip: string): string {
    if (!ip) return '127.0.0.1';
    const trimmed = ip.trim();
    // Normalize IPv4 mapped to IPv6 (e.g. ::ffff:192.168.1.1 -> 192.168.1.1)
    if (trimmed.startsWith('::ffff:')) {
      return trimmed.substring(7);
    }
    if (trimmed === '::1') {
      return '127.0.0.1';
    }
    return trimmed;
  }

  /**
   * Extracts account/email from request body for per-account rate limiting.
   */
  private extractAccountIdentifier(req: Request): string | undefined {
    if (!req.body || typeof req.body !== 'object') {
      return undefined;
    }
    const email = req.body.email;
    if (typeof email === 'string' && email.trim().length > 0) {
      return email.toLowerCase().trim();
    }
    const username = req.body.username;
    if (typeof username === 'string' && username.trim().length > 0) {
      return username.toLowerCase().trim();
    }
    return undefined;
  }
}
