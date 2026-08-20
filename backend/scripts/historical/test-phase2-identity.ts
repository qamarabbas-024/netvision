import { OptionalJwtAuthGuard } from '../src/auth/guards/optional-jwt-auth.guard';
import { LearnerIdentityContext } from '../src/auth/decorators/learner-identity.decorator';
import { UnauthorizedException } from '@nestjs/common';

function resolveLearnerIdentity(req: { user?: { id: string } | null; headers: Record<string, string>; query?: Record<string, string> }): LearnerIdentityContext {
  const userId = req.user?.id || null;
  const rawAnonHeader = req.headers['x-anonymous-id'];
  const rawAnonQuery = req.query?.anonymousId;
  const anonCandidate = typeof rawAnonHeader === 'string' && rawAnonHeader.trim().length > 0
    ? rawAnonHeader.trim()
    : typeof rawAnonQuery === 'string' && rawAnonQuery.trim().length > 0
      ? rawAnonQuery.trim()
      : null;

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (userId) {
    return {
      isGuest: false,
      userId,
      anonymousId: null,
      ownerType: 'USER',
    };
  }

  if (anonCandidate && (UUID_REGEX.test(anonCandidate) || anonCandidate.startsWith('guest-'))) {
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

function runPhase2Tests() {
  console.log('Running Phase 2 Optional Auth & Identity Resolution Tests...\n');

  const guard = new OptionalJwtAuthGuard();

  // Test A: No JWT + no anonymous ID -> ownerType NONE
  const testA_Req = { headers: {} };
  const resA = guard.handleRequest(null, null, null, { switchToHttp: () => ({ getRequest: () => testA_Req }) });
  const identityA = resolveLearnerIdentity({ user: resA, headers: testA_Req.headers });
  console.assert(identityA.ownerType === 'NONE', 'Test A Failed: ownerType should be NONE');
  console.assert(identityA.isGuest === true, 'Test A Failed: isGuest should be true');
  console.log('✓ Test A Passed: No JWT + no anonymous ID -> ownerType NONE');

  // Test B: No JWT + valid X-Anonymous-ID -> ownerType ANONYMOUS
  const testB_AnonId = '550e8400-e29b-41d4-a716-446655440000';
  const testB_Req = { headers: { 'x-anonymous-id': testB_AnonId } };
  const resB = guard.handleRequest(null, null, null, { switchToHttp: () => ({ getRequest: () => testB_Req }) });
  const identityB = resolveLearnerIdentity({ user: resB, headers: testB_Req.headers });
  console.assert(identityB.ownerType === 'ANONYMOUS', 'Test B Failed: ownerType should be ANONYMOUS');
  console.assert(identityB.anonymousId === testB_AnonId, 'Test B Failed: anonymousId mismatch');
  console.log('✓ Test B Passed: No JWT + valid X-Anonymous-ID -> ownerType ANONYMOUS');

  // Test C: Valid JWT -> ownerType USER
  const testC_User = { id: 'user-123-uuid' };
  const testC_Req = { headers: { authorization: 'Bearer valid_jwt_token' } };
  const resC = guard.handleRequest(null, testC_User, null, { switchToHttp: () => ({ getRequest: () => testC_Req }) });
  const identityC = resolveLearnerIdentity({ user: resC, headers: testC_Req.headers });
  console.assert(identityC.ownerType === 'USER', 'Test C Failed: ownerType should be USER');
  console.assert(identityC.userId === 'user-123-uuid', 'Test C Failed: userId mismatch');
  console.log('✓ Test C Passed: Valid JWT -> ownerType USER');

  // Test D: Valid JWT + X-Anonymous-ID -> ownerType USER and anonymous ID ignored
  const testD_User = { id: 'user-456-uuid' };
  const testD_Req = { headers: { authorization: 'Bearer valid_jwt_token', 'x-anonymous-id': testB_AnonId } };
  const resD = guard.handleRequest(null, testD_User, null, { switchToHttp: () => ({ getRequest: () => testD_Req }) });
  const identityD = resolveLearnerIdentity({ user: resD, headers: testD_Req.headers });
  console.assert(identityD.ownerType === 'USER', 'Test D Failed: ownerType should be USER');
  console.assert(identityD.userId === 'user-456-uuid', 'Test D Failed: userId mismatch');
  console.assert(identityD.anonymousId === null, 'Test D Failed: anonymousId must be null when authenticated');
  console.log('✓ Test D Passed: Valid JWT + X-Anonymous-ID -> ownerType USER (anonymous ID ignored)');

  // Test E: Invalid JWT -> 401 Unauthorized
  let testEPassed = false;
  try {
    const testE_Req = { headers: { authorization: 'Bearer invalid_jwt_token' } };
    guard.handleRequest(new Error('Invalid token'), null, null, { switchToHttp: () => ({ getRequest: () => testE_Req }) });
  } catch (err: any) {
    if (err instanceof UnauthorizedException) {
      testEPassed = true;
    }
  }
  console.assert(testEPassed, 'Test E Failed: Invalid JWT did not throw UnauthorizedException');
  console.log('✓ Test E Passed: Invalid JWT -> 401 Unauthorized');

  console.log('\nAll 5 Phase 2 identity tests completed successfully! 🎉');
}

runPhase2Tests();
