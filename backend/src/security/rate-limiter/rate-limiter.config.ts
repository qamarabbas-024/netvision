import { ConfigService } from '@nestjs/config';

export interface RateLimiterConfig {
  publicTtlMs: number;
  publicLimit: number;
  userTtlMs: number;
  userLimit: number;
  authTtlMs: number;
  authLimit: number;
  authPerAccountLimit: number;
  strictAuthTtlMs: number;
  strictAuthLimit: number;
  strictAuthPerAccountLimit: number;
  authBackoffBaseMs: number;
  authBackoffMaxMs: number;
  authBackoffFactor: number;
}

export function loadRateLimiterConfig(configService: ConfigService): RateLimiterConfig {
  const isTest = process.env.NODE_ENV === 'test' || configService.get('NODE_ENV') === 'test';

  const getNum = (key: string, fallback: number): number => {
    const val = configService.get<string | number>(key);
    if (val === undefined || val === null || val === '') return fallback;
    const parsed = typeof val === 'number' ? val : parseInt(val, 10);
    return isNaN(parsed) ? fallback : parsed;
  };

  const getFloat = (key: string, fallback: number): number => {
    const val = configService.get<string | number>(key);
    if (val === undefined || val === null || val === '') return fallback;
    const parsed = typeof val === 'number' ? val : parseFloat(val.toString());
    return isNaN(parsed) ? fallback : parsed;
  };

  return {
    publicTtlMs: getNum('RATE_LIMIT_PUBLIC_TTL', 60000),
    publicLimit: getNum('RATE_LIMIT_PUBLIC_LIMIT', isTest ? 10000 : 100),
    userTtlMs: getNum('RATE_LIMIT_USER_TTL', 60000),
    userLimit: getNum('RATE_LIMIT_USER_LIMIT', isTest ? 10000 : 300),
    authTtlMs: getNum('RATE_LIMIT_AUTH_TTL', 60000),
    authLimit: getNum('RATE_LIMIT_AUTH_LIMIT', isTest ? 5000 : 10),
    authPerAccountLimit: getNum('RATE_LIMIT_AUTH_PER_ACCOUNT_LIMIT', isTest ? 5000 : 5),
    strictAuthTtlMs: getNum('RATE_LIMIT_STRICT_AUTH_TTL', 60000),
    strictAuthLimit: getNum('RATE_LIMIT_STRICT_AUTH_LIMIT', isTest ? 5000 : 5),
    strictAuthPerAccountLimit: getNum('RATE_LIMIT_STRICT_AUTH_PER_ACCOUNT_LIMIT', isTest ? 5000 : 3),
    authBackoffBaseMs: getNum('RATE_LIMIT_AUTH_BACKOFF_BASE_MS', 1000),
    authBackoffMaxMs: getNum('RATE_LIMIT_AUTH_BACKOFF_MAX_MS', 30000),
    authBackoffFactor: getFloat('RATE_LIMIT_AUTH_BACKOFF_FACTOR', 2.0),
  };
}
