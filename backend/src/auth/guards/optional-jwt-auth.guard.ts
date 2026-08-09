import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    // If an Authorization header was explicitly provided, it MUST be valid
    if (authHeader) {
      if (err || !user) {
        throw new UnauthorizedException('Invalid or expired authentication token.');
      }
      return user;
    }

    // If no Authorization header is present, proceed as guest flow
    return null;
  }
}
