import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { CookieStateStore } from '../stores/cookie-state.store';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID', 'placeholder_github_id'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET', 'placeholder_github_secret'),
      callbackURL: `${configService.get<string>('API_URL', 'http://localhost:4000/api/v1')}/auth/github/callback`,
      scope: ['user:email'],
      store: new CookieStateStore(),
      passReqToCallback: false,
    } as any);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void
  ): Promise<any> {
    try {
      const email = profile.emails?.[0]?.value || profile._json?.email;
      if (!email) {
        return done(new Error('GitHub account must have a verified public or primary email address'), false);
      }

      const userSession = await this.authService.validateOAuthUser({
        provider: 'github',
        providerAccountId: profile.id.toString(),
        email,
        fullName: profile.displayName || profile.username,
        avatarUrl: profile.photos?.[0]?.value || profile._json?.avatar_url,
      });

      done(null, userSession);
    } catch (err) {
      done(err, false);
    }
  }
}
