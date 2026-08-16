import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_TIER_KEY = 'RATE_LIMIT_TIER_KEY';
export const SKIP_RATE_LIMIT_KEY = 'SKIP_RATE_LIMIT_KEY';

export type RateLimitTier = 'PUBLIC' | 'USER' | 'AUTH' | 'STRICT_AUTH';

export const PublicRateLimit = () => SetMetadata(RATE_LIMIT_TIER_KEY, 'PUBLIC');
export const UserRateLimit = () => SetMetadata(RATE_LIMIT_TIER_KEY, 'USER');
export const AuthRateLimit = () => SetMetadata(RATE_LIMIT_TIER_KEY, 'AUTH');
export const StrictAuthRateLimit = () => SetMetadata(RATE_LIMIT_TIER_KEY, 'STRICT_AUTH');
export const SkipRateLimit = () => SetMetadata(SKIP_RATE_LIMIT_KEY, true);
