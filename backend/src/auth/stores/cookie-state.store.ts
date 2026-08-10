import { Request, Response } from 'express';
import * as crypto from 'crypto';

export class CookieStateStore {
  private readonly cookieName = 'netvision_oauth_state';

  store(req: Request, callback: (err: Error | null, state?: string) => void): void {
    try {
      const state = crypto.randomBytes(16).toString('hex');
      const res = (req as any).res as Response;

      if (res && typeof res.cookie === 'function') {
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie(this.cookieName, state, {
          httpOnly: true,
          secure: isProd,
          sameSite: 'lax',
          maxAge: 10 * 60 * 1000, // 10 minutes lifetime
          path: '/',
        });
      }

      callback(null, state);
    } catch (err: any) {
      callback(err);
    }
  }

  verify(req: Request, state: string, callback: (err: Error | null, ok?: boolean, info?: any) => void): void {
    try {
      const storedState = req.cookies?.[this.cookieName];
      const res = (req as any).res as Response;

      if (res && typeof res.clearCookie === 'function') {
        res.clearCookie(this.cookieName, { path: '/' });
      }

      if (!storedState || !state || storedState !== state) {
        return callback(null, false, { message: 'Invalid or missing OAuth state parameter.' });
      }

      callback(null, true);
    } catch (err: any) {
      callback(err);
    }
  }
}
