import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { MailModule } from '../mail/mail.module';
import { MonitoringModule } from '../monitoring/monitoring.module';

import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    MailModule,
    MonitoringModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const isProd = configService.get<string>('NODE_ENV') === 'production';
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
        return {
          secret: secret || 'super_secret_netvision_jwt_key',
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRATION', '7d'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy, OptionalJwtAuthGuard],
  exports: [AuthService, OptionalJwtAuthGuard],
})
export class AuthModule {}
