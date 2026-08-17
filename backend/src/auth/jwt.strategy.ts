import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
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
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or token invalid');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
