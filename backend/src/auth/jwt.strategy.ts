import { Injectable, UnauthorizedException, Optional } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { TokenRevocationService } from './token-revocation.service';

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
  private readonly CACHE_TTL_MS = 30 * 1000; // 30-second cache to prevent DB query stampede

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    @Optional() private readonly tokenRevocationService?: TokenRevocationService
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

      if (rawToken && this.tokenRevocationService?.isRevoked(rawToken, payload)) {
        throw new UnauthorizedException('Token has been revoked or session terminated.');
      }
    } else if (payload && this.tokenRevocationService?.isRevoked('', payload)) {
      throw new UnauthorizedException('Token has been revoked or session terminated.');
    }

    // 2. Validate user identity with short-lived cache (prevents DB query stampede)
    let user = this.userCache.get(payload.sub);
    const now = Date.now();
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
        this.userCache.delete(payload.sub);
        throw new UnauthorizedException('User not found or token invalid');
      }

      user = {
        ...dbUser,
        cachedAt: now,
      };
      this.pruneCacheIfNeeded();
      this.userCache.set(payload.sub, user);
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
