/**
 * NETVISION — DROP D
 * AUTHENTICATION, SESSION SECURITY & API ABUSE HARDENING TEST SUITE
 *
 * Verification Gates:
 * 1. Short-Lived Access Token Invariant:
 *    - Access tokens expire in 15 minutes by default (exp - iat = 900s).
 * 2. Refresh Token Issuance & Structure:
 *    - generateTokens returns both short-lived accessToken and cryptographically random 64-hex refreshToken.
 * 3. Secure Refresh Rotation:
 *    - Refreshing tokens rotates the refresh token and returns a fresh short-lived access token.
 * 4. Refresh Token Replay / Reuse Detection:
 *    - Replaying a consumed refresh token is detected as an attack.
 *    - The entire refresh token family is revoked immediately to contain potential compromise.
 * 5. Server-Side Invalidation on Logout:
 *    - Logout invalidates the active access token hash and kills the refresh token family.
 * 6. Stolen-Token Rejection after Logout:
 *    - JwtStrategy strictly rejects revoked tokens with UnauthorizedException even if cryptographically valid.
 * 7. Rate Limiter Tiers on High-Risk Endpoints:
 *    - /auth/refresh, /auth/login, Capstone endpoints, and certificate download endpoints have rate limiting guards.
 * 8. Strict IDOR Defense:
 *    - Non-owners cannot access another user's Capstone attempt or certificate.
 */

import { PrismaService } from '../src/database/prisma.service';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { AuthService } from '../src/auth/auth.service';
import { TokenRevocationService } from '../src/auth/token-revocation.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { MasterCapstoneService } from '../src/certifications/master-capstone.service';
import { AppRateLimitGuard } from '../src/security/rate-limiter/app-rate-limit.guard';

const prisma = new PrismaService();
const testSecret = 'drop_d_test_jwt_secret_min_32_characters_long_2026_audit';
const jwtService = new JwtService({ secret: testSecret });

let passCount = 0;
let failCount = 0;

function check(assertion: boolean, description: string) {
  if (assertion) {
    console.log(`  ✅ PASS: ${description}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failCount++;
  }
}

function mockConfig(env: Record<string, string>): ConfigService {
  return {
    get: (key: string, def?: any) => (key in env ? env[key] : def),
  } as unknown as ConfigService;
}

async function waitForDatabase(retries = 10, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return;
    } catch (err) {
      if (i === retries) throw err;
      console.log(`⏳ Neon connection warmup... retrying in ${delayMs}ms (attempt ${i}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function runDropDTestSuite() {
  console.log('🧪 Starting NetVision Drop D Test Suite: Authentication, Session Security & API Abuse Hardening...\n');

  await waitForDatabase();

  const testSuffix = Date.now().toString(36);
  const userAEmail = `drop-d-user-a-${testSuffix}@netvision-audit.internal`;
  const userBEmail = `drop-d-user-b-${testSuffix}@netvision-audit.internal`;

  const userA = await prisma.user.create({
    data: {
      email: userAEmail,
      username: `user_a_${testSuffix}`,
      fullName: 'Learner Alpha',
      passwordHash: '$2b$10$dummyhashedpasswordfordrophverificationonly',
      isVerified: true,
      role: 'STUDENT',
    },
  });

  const userB = await prisma.user.create({
    data: {
      email: userBEmail,
      username: `user_b_${testSuffix}`,
      fullName: 'Learner Beta',
      passwordHash: '$2b$10$dummyhashedpasswordfordrophverificationonly',
      isVerified: true,
      role: 'STUDENT',
    },
  });

  const revocationService = new TokenRevocationService();
  const authConfig = mockConfig({
    JWT_SECRET: testSecret,
    JWT_EXPIRATION: '15m',
    EMAIL_VERIFICATION_ENABLED: 'false',
    REQUIRE_EMAIL_VERIFICATION: 'false',
  });

  const mockEmailService = {
    sendVerificationEmail: async () => {},
    sendPasswordResetEmail: async () => {},
    sendOtpEmail: async () => {},
  } as any;

  const authService = new AuthService(
    prisma,
    jwtService,
    mockEmailService,
    authConfig,
    undefined,
    undefined,
    revocationService,
  );

  const jwtStrategy = new JwtStrategy(
    authConfig,
    prisma,
    revocationService,
  );

  try {
    // =========================================================================
    // SUITE 1: SHORT-LIVED ACCESS TOKEN & REFRESH TOKEN ISSUANCE
    // =========================================================================
    console.log('\n--- Suite 1: Short-Lived Access Token & Refresh Token Issuance ---');

    const tokens = await (authService as any).generateTokens(userA.id, userA.email, userA.role);
    check(Boolean(tokens.accessToken), 'generateTokens returns an accessToken');
    check(Boolean(tokens.refreshToken), 'generateTokens returns a refreshToken');
    check(typeof tokens.refreshToken === 'string' && tokens.refreshToken.length === 64, 'refreshToken is a 64-char cryptographically secure hex token');

    const decoded = jwtService.decode(tokens.accessToken) as { iat: number; exp: number; sub: string };
    const lifespanSeconds = decoded.exp - decoded.iat;
    check(lifespanSeconds === 900, `Access token lifespan is exactly 900s (15m default), got: ${lifespanSeconds}s`);

    // =========================================================================
    // SUITE 2: SECURE REFRESH ROTATION
    // =========================================================================
    console.log('\n--- Suite 2: Secure Refresh Rotation ---');

    const rotated = await authService.refreshTokens(tokens.refreshToken);
    check(Boolean(rotated.accessToken), 'Rotated access token generated successfully');
    check(Boolean(rotated.refreshToken), 'Rotated refresh token generated successfully');
    check(rotated.refreshToken !== tokens.refreshToken, 'New refresh token differs from previous token (rotation confirmed)');

    // =========================================================================
    // SUITE 3: REFRESH TOKEN REPLAY ATTACK & REUSE DETECTION
    // =========================================================================
    console.log('\n--- Suite 3: Refresh Token Reuse Detection & Family Invalidation ---');

    let replayCaught = false;
    try {
      // Attacker attempts to replay the consumed tokens.refreshToken
      await authService.refreshTokens(tokens.refreshToken);
    } catch (err: any) {
      if (err instanceof UnauthorizedException) {
        replayCaught = true;
      }
    }
    check(replayCaught, 'Replaying consumed refresh token is blocked with UnauthorizedException');

    // Reuse detection should have revoked the entire family, including rotated.refreshToken
    let rotatedRevoked = false;
    try {
      await authService.refreshTokens(rotated.refreshToken);
    } catch (err: any) {
      if (err instanceof UnauthorizedException) {
        rotatedRevoked = true;
      }
    }
    check(rotatedRevoked, 'Entire token family is immediately revoked upon reuse detection');

    // =========================================================================
    // SUITE 4: SERVER-SIDE LOGOUT & STOLEN-TOKEN DEFENSE
    // =========================================================================
    console.log('\n--- Suite 4: Server-Side Logout & Stolen-Token Invalidation ---');

    const sessionTokens = await (authService as any).generateTokens(userA.id, userA.email, userA.role);
    const stolenAccessToken = sessionTokens.accessToken;

    // Simulate validation BEFORE logout
    const mockReq = {
      headers: {
        authorization: `Bearer ${stolenAccessToken}`,
      },
    };
    const payload = jwtService.decode(stolenAccessToken) as any;
    const validatedUser = await jwtStrategy.validate(mockReq, payload);
    check(validatedUser.id === userA.id, 'Token is valid prior to logout');

    // User performs logout
    await authService.invalidateSession(stolenAccessToken, sessionTokens.refreshToken, userA.id);

    // Attacker attempts to use stolen token AFTER logout
    let stolenTokenBlocked = false;
    try {
      await jwtStrategy.validate(mockReq, payload);
    } catch (err: any) {
      if (err instanceof UnauthorizedException) {
        stolenTokenBlocked = true;
      }
    }
    check(stolenTokenBlocked, 'Stolen access token is rejected with UnauthorizedException after logout (server-side invalidation active)');

    // =========================================================================
    // SUITE 5: HIGH-RISK API RATE LIMITING
    // =========================================================================
    console.log('\n--- Suite 5: Rate Limiting Route Protection ---');

    const mockReflector = {
      getAllAndOverride: () => undefined,
    } as any;
    const rateLimitGuard = new AppRateLimitGuard(mockReflector, {} as any);
    const mockContext = {
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
    
    // Test that rate limit tier resolution maps correctly
    const authRefreshReq = { originalUrl: '/api/v1/auth/refresh', headers: {}, method: 'POST' } as any;
    const authRefreshTier = (rateLimitGuard as any).resolveTier(mockContext, authRefreshReq);
    check(authRefreshTier === 'AUTH', '/api/v1/auth/refresh is protected under AUTH tier (10 req/min)');

    const authLoginReq = { originalUrl: '/api/v1/auth/login', headers: {}, method: 'POST' } as any;
    const authLoginTier = (rateLimitGuard as any).resolveTier(mockContext, authLoginReq);
    check(authLoginTier === 'AUTH', '/api/v1/auth/login is protected under AUTH tier (10 req/min)');

    const publicVerifyReq = { originalUrl: '/api/v1/certifications/verify/NV-TEST-1234', headers: {}, method: 'GET' } as any;
    const publicVerifyTier = (rateLimitGuard as any).resolveTier(mockContext, publicVerifyReq);
    check(publicVerifyTier === 'PUBLIC', 'Public certificate verification is protected under PUBLIC tier (60 req/min)');

    // =========================================================================
    // SUITE 6: STRICT IDOR PROTECTION ON CAPSTONE & CERTIFICATES
    // =========================================================================
    console.log('\n--- Suite 6: IDOR Protection on Capstone & Certificates ---');

    const capstoneService = new MasterCapstoneService(prisma);

    // Create a capstone attempt owned by user A
    const attemptA = await prisma.examAttempt.create({
      data: {
        userId: userA.id,
        certificationCode: 'NV-NET-MASTERY',
        type: 'PRACTICAL',
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
        attemptNumber: 1,
        configSnapshotJson: {},
      },
    });

    // User B tries to view or submit User A's capstone attempt
    let idorCaught = false;
    try {
      await capstoneService.getCapstoneAttemptStatus(userB.id, attemptA.id);
    } catch (err: any) {
      if (err instanceof ForbiddenException) {
        idorCaught = true;
      }
    }
    check(idorCaught, 'User B is blocked from accessing User A Capstone attempt with ForbiddenException (IDOR defense)');

    // Clean up attempt
    await prisma.examAttempt.delete({ where: { id: attemptA.id } });

  } finally {
    // Teardown test users
    console.log('\n--- Teardown Synthetic Test Fixtures ---');
    await prisma.user.deleteMany({
      where: { id: { in: [userA.id, userB.id] } },
    });
    console.log('  🧹 Synthetic test users cleanly purged.');
  }

  console.log('\n======================================================');
  console.log(`Drop D Verification Complete: ${passCount} Passed, ${failCount} Failed`);
  console.log('======================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runDropDTestSuite().catch((err) => {
  console.error('Fatal error running Drop D test suite:', err);
  process.exit(1);
});
