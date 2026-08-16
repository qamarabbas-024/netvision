import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RateLimiterConfig, loadRateLimiterConfig } from './rate-limiter.config';

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  retryAfterSeconds: number;
  reason?: 'IP_LIMIT_EXCEEDED' | 'ACCOUNT_LIMIT_EXCEEDED' | 'BACKOFF_COOLDOWN_ACTIVE';
}

interface WindowBucket {
  count: number;
  expiresAt: number;
}

interface BackoffRecord {
  consecutiveFailures: number;
  cooldownUntil: number;
  lastFailureTime: number;
}

@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);
  private config: RateLimiterConfig;

  // In-memory bucket store: key -> WindowBucket
  private readonly buckets = new Map<string, WindowBucket>();

  // Progressive backoff store: key -> BackoffRecord
  private readonly backoffRecords = new Map<string, BackoffRecord>();

  // Cleanup timer interval reference
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(private readonly configService: ConfigService) {
    this.config = loadRateLimiterConfig(this.configService);
    this.startPeriodicCleanup();
  }

  public getConfig(): RateLimiterConfig {
    return { ...this.config };
  }

  public overrideConfig(override: Partial<RateLimiterConfig>): void {
    this.config = { ...this.config, ...override };
  }

  public reset(keyPrefix?: string): void {
    if (!keyPrefix) {
      this.buckets.clear();
      this.backoffRecords.clear();
      return;
    }
    for (const key of this.buckets.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.buckets.delete(key);
      }
    }
    for (const key of this.backoffRecords.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.backoffRecords.delete(key);
      }
    }
  }

  private startPeriodicCleanup(): void {
    // Run cleanup every 60 seconds to prune expired buckets
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, bucket] of this.buckets.entries()) {
        if (now >= bucket.expiresAt) {
          this.buckets.delete(key);
        }
      }
      for (const [key, record] of this.backoffRecords.entries()) {
        // Prune backoff record if 10 minutes elapsed since last failure and cooldown passed
        if (now >= record.cooldownUntil && now - record.lastFailureTime > 10 * 60 * 1000) {
          this.backoffRecords.delete(key);
        }
      }
    }, 60000);

    if (this.cleanupInterval && typeof this.cleanupInterval.unref === 'function') {
      this.cleanupInterval.unref();
    }
  }

  public onModuleDestroy(): void {
    this.destroy();
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * General-purpose window consumption.
   */
  public consume(key: string, limit: number, ttlMs: number): RateLimitResult {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket || now >= bucket.expiresAt) {
      bucket = {
        count: 1,
        expiresAt: now + ttlMs,
      };
      this.buckets.set(key, bucket);
      return {
        allowed: true,
        limit,
        remaining: Math.max(0, limit - 1),
        resetMs: ttlMs,
        retryAfterSeconds: 0,
      };
    }

    bucket.count += 1;
    const remaining = Math.max(0, limit - bucket.count);
    const resetMs = Math.max(0, bucket.expiresAt - now);
    const retryAfterSeconds = Math.ceil(resetMs / 1000);

    if (bucket.count > limit) {
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetMs,
        retryAfterSeconds,
      };
    }

    return {
      allowed: true,
      limit,
      remaining,
      resetMs,
      retryAfterSeconds: 0,
    };
  }

  /**
   * Check active progressive backoff for an IP and/or email tuple.
   */
  public checkBackoff(ip: string, email?: string): { inCooldown: boolean; retryAfterSeconds: number; cooldownUntil: number } {
    const now = Date.now();
    const normalizedEmail = email?.toLowerCase().trim();

    // Check tuple backoff first (ip:email)
    if (normalizedEmail) {
      const tupleKey = `backoff:tuple:${ip}:${normalizedEmail}`;
      const tupleRecord = this.backoffRecords.get(tupleKey);
      if (tupleRecord && now < tupleRecord.cooldownUntil) {
        const remainingMs = tupleRecord.cooldownUntil - now;
        return {
          inCooldown: true,
          retryAfterSeconds: Math.ceil(remainingMs / 1000),
          cooldownUntil: tupleRecord.cooldownUntil,
        };
      }
    }

    // Check IP backoff
    const ipKey = `backoff:ip:${ip}`;
    const ipRecord = this.backoffRecords.get(ipKey);
    if (ipRecord && now < ipRecord.cooldownUntil) {
      const remainingMs = ipRecord.cooldownUntil - now;
      return {
        inCooldown: true,
        retryAfterSeconds: Math.ceil(remainingMs / 1000),
        cooldownUntil: ipRecord.cooldownUntil,
      };
    }

    return { inCooldown: false, retryAfterSeconds: 0, cooldownUntil: 0 };
  }

  /**
   * Record a failed authentication attempt to increment backoff counter.
   */
  public recordFailedAuth(ip: string, email?: string): { consecutiveFailures: number; cooldownMs: number; retryAfterSeconds: number } {
    const now = Date.now();
    const normalizedEmail = email?.toLowerCase().trim();

    const updateRecord = (key: string): { consecutiveFailures: number; cooldownMs: number } => {
      let record = this.backoffRecords.get(key);
      const failures = record ? record.consecutiveFailures + 1 : 1;

      // Exponential backoff calculation: min(Base * Factor^(failures-1), Max)
      const calculatedCooldown = Math.min(
        this.config.authBackoffBaseMs * Math.pow(this.config.authBackoffFactor, failures - 1),
        this.config.authBackoffMaxMs
      );

      record = {
        consecutiveFailures: failures,
        cooldownUntil: now + calculatedCooldown,
        lastFailureTime: now,
      };
      this.backoffRecords.set(key, record);
      return { consecutiveFailures: failures, cooldownMs: calculatedCooldown };
    };

    // Update IP backoff
    const ipResult = updateRecord(`backoff:ip:${ip}`);

    // If account/email is provided, also update tuple backoff (isolated from other IPs to prevent DoS)
    if (normalizedEmail) {
      updateRecord(`backoff:tuple:${ip}:${normalizedEmail}`);
    }

    return {
      consecutiveFailures: ipResult.consecutiveFailures,
      cooldownMs: ipResult.cooldownMs,
      retryAfterSeconds: Math.ceil(ipResult.cooldownMs / 1000),
    };
  }

  /**
   * Record a successful authentication attempt to clear backoff cooldown.
   */
  public recordSuccessfulAuth(ip: string, email?: string): void {
    this.backoffRecords.delete(`backoff:ip:${ip}`);
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      this.backoffRecords.delete(`backoff:tuple:${ip}:${normalizedEmail}`);
    }
  }

  /**
   * Rate limit check for Public routes.
   */
  public checkPublicLimit(ip: string): RateLimitResult {
    const key = `public:ip:${ip}`;
    return this.consume(key, this.config.publicLimit, this.config.publicTtlMs);
  }

  /**
   * Rate limit check for Authenticated user actions.
   */
  public checkUserLimit(userId: string, ip: string): RateLimitResult {
    // If authenticated userId is present, track by user; otherwise fallback to IP
    const key = userId ? `user:id:${userId}` : `user:ip:${ip}`;
    return this.consume(key, this.config.userLimit, this.config.userTtlMs);
  }

  /**
   * Rate limit check for Authentication routes (login, register, verify-otp, resend-otp).
   */
  public checkAuthLimit(ip: string, email?: string): RateLimitResult {
    // 1. Check progressive backoff cooldown first
    const backoff = this.checkBackoff(ip, email);
    if (backoff.inCooldown) {
      const resetMs = backoff.cooldownUntil - Date.now();
      return {
        allowed: false,
        limit: this.config.authLimit,
        remaining: 0,
        resetMs: Math.max(0, resetMs),
        retryAfterSeconds: backoff.retryAfterSeconds,
        reason: 'BACKOFF_COOLDOWN_ACTIVE',
      };
    }

    // 2. Check per-IP auth rate limit
    const ipKey = `auth:ip:${ip}`;
    const ipRes = this.consume(ipKey, this.config.authLimit, this.config.authTtlMs);
    if (!ipRes.allowed) {
      return { ...ipRes, reason: 'IP_LIMIT_EXCEEDED' };
    }

    // 3. Check per-account auth rate limit if email provided
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const accountKey = `auth:account:${normalizedEmail}`;
      const accountRes = this.consume(accountKey, this.config.authPerAccountLimit, this.config.authTtlMs);
      if (!accountRes.allowed) {
        return { ...accountRes, reason: 'ACCOUNT_LIMIT_EXCEEDED' };
      }
    }

    return ipRes;
  }

  /**
   * Rate limit check for Strict Authentication actions (forgot-password, reset-password).
   */
  public checkStrictAuthLimit(ip: string, email?: string): RateLimitResult {
    // 1. Check progressive backoff cooldown
    const backoff = this.checkBackoff(ip, email);
    if (backoff.inCooldown) {
      const resetMs = backoff.cooldownUntil - Date.now();
      return {
        allowed: false,
        limit: this.config.strictAuthLimit,
        remaining: 0,
        resetMs: Math.max(0, resetMs),
        retryAfterSeconds: backoff.retryAfterSeconds,
        reason: 'BACKOFF_COOLDOWN_ACTIVE',
      };
    }

    // 2. Check per-IP strict auth rate limit
    const ipKey = `strict-auth:ip:${ip}`;
    const ipRes = this.consume(ipKey, this.config.strictAuthLimit, this.config.strictAuthTtlMs);
    if (!ipRes.allowed) {
      return { ...ipRes, reason: 'IP_LIMIT_EXCEEDED' };
    }

    // 3. Check per-account strict auth rate limit
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const accountKey = `strict-auth:account:${normalizedEmail}`;
      const accountRes = this.consume(accountKey, this.config.strictAuthPerAccountLimit, this.config.strictAuthTtlMs);
      if (!accountRes.allowed) {
        return { ...accountRes, reason: 'ACCOUNT_LIMIT_EXCEEDED' };
      }
    }

    return ipRes;
  }
}
