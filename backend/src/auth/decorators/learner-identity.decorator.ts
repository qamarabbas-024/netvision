import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export interface LearnerIdentityContext {
  isGuest: boolean;
  userId: string | null;
  anonymousId: string | null;
  ownerType: 'USER' | 'ANONYMOUS' | 'NONE';
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const LearnerIdentity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): LearnerIdentityContext => {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.user?.id || null;
    const rawAnonHeader = req.headers['x-anonymous-id'];
    const rawAnonQuery = req.query?.anonymousId;
    const anonCandidate = typeof rawAnonHeader === 'string' && rawAnonHeader.trim().length > 0
      ? rawAnonHeader.trim()
      : typeof rawAnonQuery === 'string' && rawAnonQuery.trim().length > 0
        ? rawAnonQuery.trim()
        : null;

    // Rule 1: Valid authenticated User takes precedence over X-Anonymous-ID
    if (userId) {
      return {
        isGuest: false,
        userId,
        anonymousId: null,
        ownerType: 'USER',
      };
    }

    if (anonCandidate) {
      if (!UUID_REGEX.test(anonCandidate) && !anonCandidate.startsWith('guest-')) {
        throw new BadRequestException(`Invalid X-Anonymous-ID header format "${anonCandidate}". Must be a valid UUID.`);
      }
      return {
        isGuest: true,
        userId: null,
        anonymousId: anonCandidate,
        ownerType: 'ANONYMOUS',
      };
    }

    return {
      isGuest: true,
      userId: null,
      anonymousId: null,
      ownerType: 'NONE',
    };
  }
);
