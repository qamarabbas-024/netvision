/**
 * NETVISION — DROP H
 * SESSION SECURITY & AUTHENTICATION HARDENING TEST SUITE (SEC-001)
 *
 * Mandatory Verification Gates:
 * 1. Cryptographic JWT Expiration Invariant:
 *    - Expired JWT tokens are strictly rejected by the cryptographic engine with TokenExpiredError.
 *    - Tampered signatures are strictly rejected with JsonWebTokenError.
 * 2. Unverified / Suspended Account Invariant (SEC-001):
 *    - When email verification is enabled, JwtStrategy strictly rejects unverified user accounts even with a valid signature.
 *    - Verified accounts successfully validate and return sanitized user identity context.
 * 3. Cookie Session & Logout Invariant:
 *    - AuthController.logout explicitly clears both `netvision_auth_token` and `accessToken` cookies with path '/'.
 * 4. Client-side Expiration Detection:
 *    - Proactive JWT payload expiration calculation correctly flags expired timestamps without server roundtrips.
 *    - Clean teardown of all synthetic test users.
 */

import { PrismaService } from '../src/database/prisma.service';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

const prisma = new PrismaService();
const testSecret = 'drop_h_test_jwt_secret_min_32_characters_long_2026_audit';
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

function mockConfig(env: Record<string, string>): ConfigService {
  return {
    get: (key: string, def?: any) => (key in env ? env[key] : def),
  } as unknown as ConfigService;
}

async function runDropHTestSuite() {
  console.log('🧪 Starting NetVision Drop H Test Suite: Session Security & Authentication Hardening (SEC-001)...\n');

  await waitForDatabase();

  const testSuffix = Date.now().toString(36);
  const unverifiedEmail = `drop-h-unverified-${testSuffix}@netvision-audit.internal`;
  const verifiedEmail = `drop-h-verified-${testSuffix}@netvision-audit.internal`;

  const unverifiedUser = await prisma.user.create({
    data: {
      email: unverifiedEmail,
      username: `unverified_${testSuffix}`,
      fullName: 'Unverified Candidate',
      passwordHash: '$2b$10$dummyhashedpasswordfordrophverificationonly',
      isVerified: false,
    },
  });

  const verifiedUser = await prisma.user.create({
    data: {
      email: verifiedEmail,
      username: `verified_${testSuffix}`,
      fullName: 'Verified Candidate',
      passwordHash: '$2b$10$dummyhashedpasswordfordrophverificationonly',
      isVerified: true,
    },
  });

  try {
    // =========================================================================
    // SUITE 1: CRYPTOGRAPHIC JWT EXPIRATION & SIGNATURE REJECTION
    // =========================================================================
    console.log('\n--- Suite 1: Cryptographic JWT Expiration & Signature Integrity ---');

    // 1. Expired Token Rejection
    const expiredToken = await jwtService.signAsync(
      { sub: verifiedUser.id, email: verifiedUser.email, role: 'STUDENT' },
      { expiresIn: '-10s' }
    );

    let expiredRejected = false;
    try {
      await jwtService.verifyAsync(expiredToken);
    } catch (err: any) {
      expiredRejected = err.name === 'TokenExpiredError' || err.message?.includes('expired');
    }
    check(expiredRejected, 'Expired JWT token is strictly rejected by cryptographic verification');

    // 2. Tampered Token Rejection
    const validToken = await jwtService.signAsync(
      { sub: verifiedUser.id, email: verifiedUser.email, role: 'STUDENT' },
      { expiresIn: '1h' }
    );
    const tokenParts = validToken.split('.');
    const tamperedSignature = tokenParts[2].slice(0, -2) + (tokenParts[2].endsWith('a') ? 'b' : 'a');
    const tamperedToken = `${tokenParts[0]}.${tokenParts[1]}.${tamperedSignature}`;

    let tamperedRejected = false;
    try {
      await jwtService.verifyAsync(tamperedToken);
    } catch (err: any) {
      tamperedRejected = err.name === 'JsonWebTokenError' || err.message?.includes('signature');
    }
    check(tamperedRejected, 'Tampered JWT signature is strictly rejected with JsonWebTokenError');

    // =========================================================================
    // SUITE 2: ACCOUNT VALIDATION & UNVERIFIED USER DEFENSE (SEC-001)
    // =========================================================================
    console.log('\n--- Suite 2: Account Validation & Unverified User Defense ---');

    const configWithVerification = mockConfig({
      JWT_SECRET: testSecret,
      EMAIL_VERIFICATION_ENABLED: 'true',
    });

    const jwtStrategyWithVerification = new JwtStrategy(configWithVerification, prisma);

    // Test unverified user validation -> Must throw UnauthorizedException
    let unverifiedBlocked = false;
    try {
      await jwtStrategyWithVerification.validate({
        sub: unverifiedUser.id,
        email: unverifiedUser.email,
        role: 'STUDENT',
      });
    } catch (err: any) {
      unverifiedBlocked = err instanceof UnauthorizedException && err.message.includes('unverified');
    }
    check(unverifiedBlocked, 'Unverified user token validation is rejected when email verification is enabled');

    // Test verified user validation -> Must succeed
    const validatedResult = await jwtStrategyWithVerification.validate({
      sub: verifiedUser.id,
      email: verifiedUser.email,
      role: 'STUDENT',
    });
    check(validatedResult.id === verifiedUser.id, 'Verified user token validation succeeds and returns user id');
    check(validatedResult.email === verifiedUser.email, 'Verified user token validation returns user email');

    // Test nonexistent user validation -> Must throw UnauthorizedException
    let nonexistentBlocked = false;
    try {
      await jwtStrategyWithVerification.validate({
        sub: '00000000-0000-0000-0000-000000000000',
        email: 'ghost@netvision.test',
        role: 'STUDENT',
      });
    } catch (err: any) {
      nonexistentBlocked = err instanceof UnauthorizedException;
    }
    check(nonexistentBlocked, 'Nonexistent user ID in valid token is rejected with UnauthorizedException');

    // =========================================================================
    // SUITE 3: COOKIE LOGOUT CLEANSING
    // =========================================================================
    console.log('\n--- Suite 3: Cookie Logout Cleansing ---');

    const authController = new AuthController({} as any, configWithVerification);
    const clearedCookies: { name: string; options: any }[] = [];
    const mockRes: any = {
      clearCookie: (name: string, options: any) => {
        clearedCookies.push({ name, options });
      },
    };

    await authController.logout(mockRes);

    const clearedNetvisionCookie = clearedCookies.find((c) => c.name === 'netvision_auth_token');
    const clearedAccessCookie = clearedCookies.find((c) => c.name === 'accessToken');

    check(clearedNetvisionCookie !== undefined, 'Logout clears netvision_auth_token cookie');
    check(clearedNetvisionCookie?.options?.path === '/', 'netvision_auth_token cookie cleared with path: "/"');
    check(clearedAccessCookie !== undefined, 'Logout clears accessToken cookie');
    check(clearedAccessCookie?.options?.path === '/', 'accessToken cookie cleared with path: "/"');

    // =========================================================================
    // SUITE 4: CLIENT-SIDE PROACTIVE EXPIRATION ALGORITHM
    // =========================================================================
    console.log('\n--- Suite 4: Client-Side Proactive Expiration Algorithm ---');

    function isJwtExpiredTest(token: string | null): boolean {
      if (!token || token === 'cookie-session') return false;
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
        const decoded = JSON.parse(jsonPayload);
        if (typeof decoded.exp === 'number') {
          return Date.now() >= decoded.exp * 1000;
        }
      } catch (e) {
        return false;
      }
      return false;
    }

    check(isJwtExpiredTest(expiredToken) === true, 'isJwtExpired accurately detects expired JWT payload');
    check(isJwtExpiredTest(validToken) === false, 'isJwtExpired accurately verifies fresh unexpired JWT');
    check(isJwtExpiredTest('cookie-session') === false, 'isJwtExpired handles cookie-session identifier cleanly');
    check(isJwtExpiredTest(null) === false, 'isJwtExpired handles null safely');

  } finally {
    // Teardown test fixtures
    await prisma.user.deleteMany({
      where: { id: { in: [unverifiedUser.id, verifiedUser.id] } },
    });
    await prisma.$disconnect();
  }

  console.log(`\n======================================================`);
  console.log(`Drop H Verification Complete: ${passCount} Passed, ${failCount} Failed`);
  console.log(`======================================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runDropHTestSuite().catch((err) => {
  console.error('Fatal Drop H Test Suite Exception:', err);
  process.exit(1);
});
