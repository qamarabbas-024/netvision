import { Injectable, UnauthorizedException, Optional } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { TokenRevocationService } from './token-revocation.service';
import { RedisService } from '../redis/redis.service';
import { REDIS_KEYS, DISTRIBUTED_TTL } from '../redis/distributed-state.interface';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface CachedUser {
  id: string;
  email: string;
  username: string;
  role: string;
  isVerified: boolean;
  updatedAt: Date;
  cachedAt: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userCache = new Map<string, CachedUser>();
  private readonly CACHE_TTL_MS = DISTRIBUTED_TTL.USER_QUERY_CACHE_MS; // 30-second bounded cache for query stampede defense

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    @Optional() private readonly tokenRevocationService?: TokenRevocationService,
    @Optional() private readonly redisService?: RedisService
  ) {
    const isProd = configService.get<string>('NODE_ENV') === 'production';
    const secret = configService.get<string>('JWT_SECRET');

    const insecureDefaults = [
      'super_secret_netvision_jwt_key',
      'super_secret_netvision_jwt_key_change_in_production',
      'YOUR_PRODUCTION_JWT_SECRET_MIN_32_CHARS_LONG_CHANGE_THIS',
      'change_me',
      'secret',
    ];

    if (
      isProd &&
      (!secret ||
        insecureDefaults.includes(secret) ||
        secret.toLowerCase().includes('change_in_production') ||
        secret.length < 16)
    ) {
      throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable must be set securely in production!');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: any) => {
          if (req && req.cookies) {
            return req.cookies['netvision_auth_token'] || req.cookies['accessToken'] || null;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret || 'super_secret_netvision_jwt_key',
      passReqToCallback: true,
    });
  }

  evictUserCache(userId?: string): void {
    if (userId) {
      this.userCache.delete(userId);
      if (this.redisService?.isAvailable()) {
        this.redisService.del(REDIS_KEYS.USER_IDENTITY_CACHE(userId)).catch(() => {});
      }
    } else {
      this.userCache.clear();
    }
  }

  async evictUserCacheAsync(userId?: string): Promise<void> {
    if (userId) {
      this.userCache.delete(userId);
      if (this.redisService?.isAvailable()) {
        await this.redisService.del(REDIS_KEYS.USER_IDENTITY_CACHE(userId));
      }
    } else {
      this.userCache.clear();
    }
  }

  private pruneCacheIfNeeded(): void {
    if (this.userCache.size > 10000) {
      const now = Date.now();
      for (const [key, value] of this.userCache.entries()) {
        if (now - value.cachedAt > this.CACHE_TTL_MS) {
          this.userCache.delete(key);
        }
      }
    }
  }

  async validate(reqOrPayload: any, maybePayload?: any) {
    let req: any;
    let payload: JwtPayload;

    if (maybePayload) {
      req = reqOrPayload;
      payload = maybePayload;
    } else {
      payload = reqOrPayload;
      req = null;
    }

    // 1. Check server-side token revocation and logout invalidation
    if (req) {
      const rawToken = ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (r: any) => (r && r.cookies ? r.cookies['netvision_auth_token'] || r.cookies['accessToken'] : null),
      ])(req);

      const isRev = (await this.tokenRevocationService?.isRevokedAsync?.(rawToken || '', payload)) ?? this.tokenRevocationService?.isRevoked(rawToken || '', payload);
      if (isRev) {
        throw new UnauthorizedException('Token has been revoked or session terminated.');
      }
    } else if (payload) {
      const isRev = (await this.tokenRevocationService?.isRevokedAsync?.('', payload)) ?? this.tokenRevocationService?.isRevoked('', payload);
      if (isRev) {
        throw new UnauthorizedException('Token has been revoked or session terminated.');
      }
    }

    // 2. Token expiration verification (defense-in-depth)
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token has expired.');
    }

    // 3. Validate user identity with short-lived multi-layer cache (L1 Memory + L2 Redis, 30s TTL)
    let user = this.userCache.get(payload.sub);
    const now = Date.now();

    // Check L2 Redis cache if L1 is empty or expired
    if (!user || now - user.cachedAt > this.CACHE_TTL_MS) {
      if (this.redisService?.isAvailable()) {
        try {
          const redisCached = await this.redisService.get<CachedUser>(REDIS_KEYS.USER_IDENTITY_CACHE(payload.sub));
          if (redisCached && now - redisCached.cachedAt <= this.CACHE_TTL_MS) {
            user = redisCached;
            this.userCache.set(payload.sub, user);
          }
        } catch {
          // Redis read failure fallback to PostgreSQL
        }
      }
    }

    // Query PostgreSQL if not in L1 or L2
    if (!user || now - user.cachedAt > this.CACHE_TTL_MS) {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isVerified: true,
          updatedAt: true,
        },
      });

      if (!dbUser) {
        this.evictUserCache(payload.sub);
        throw new UnauthorizedException('User not found or token invalid');
      }

      user = {
        ...dbUser,
        cachedAt: now,
      };
      this.pruneCacheIfNeeded();
      this.userCache.set(payload.sub, user);

      // Populate L2 Redis cache with exact 30-second TTL
      if (this.redisService?.isAvailable()) {
        this.redisService.set(
          REDIS_KEYS.USER_IDENTITY_CACHE(payload.sub),
          user,
          DISTRIBUTED_TTL.USER_IDENTITY_CACHE_SEC
        ).catch(() => {});
      }
    }

    // 3. Multi-instance distributed token invalidation:
    // Reject tokens issued prior to the user's last session invalidation / password reset / update
    if (payload.iat && user.updatedAt) {
      const tokenIatSec = payload.iat;
      const userUpdatedSec = Math.floor(new Date(user.updatedAt).getTime() / 1000);
      if (tokenIatSec < userUpdatedSec) {
        throw new UnauthorizedException('Token has been revoked due to session termination or account update.');
      }
    }

    const emailVerificationEnabled = this.configService.get<string>('EMAIL_VERIFICATION_ENABLED', 'false') === 'true';
    if (emailVerificationEnabled && !user.isVerified) {
      throw new UnauthorizedException('User account is unverified.');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
