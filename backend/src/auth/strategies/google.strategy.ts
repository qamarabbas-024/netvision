import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { CookieStateStore } from '../stores/cookie-state.store';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', 'placeholder_google_id'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', 'placeholder_google_secret'),
      callbackURL: `${configService.get<string>('API_URL', 'http://localhost:4000/api/v1')}/auth/google/callback`,
      scope: ['email', 'profile'],
      store: new CookieStateStore(),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('Google profile did not contain a valid email address'), false);
      }

      const userSession = await this.authService.validateOAuthUser({
        provider: 'google',
        providerAccountId: profile.id,
        email,
        fullName: profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
        avatarUrl: profile.photos?.[0]?.value,
      });

      done(null, userSession);
    } catch (err) {
      done(err, false);
    }
  }
}
