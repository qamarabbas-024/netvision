/**
 * NETVISION — DROP 03: AUTHENTICATION, AUTHORIZATION & SESSION SECURITY HARDENING
 * VERIFICATION TEST SUITE
 *
 * Validates:
 * 1. OAuth-user password login never crashes with TypeError (argon2.verify null) and equalizes timing.
 * 2. Non-existent account logins throw uniform 'Invalid credentials' with timing equalization (no user enumeration).
 * 3. Non-existent account forgotPassword & resendOtp return uniform, non-disclosing messages.
 * 4. Timing-safe OTP verification using crypto.timingSafeEqual and sanitized messages.
 * 5. Password reset atomic consumption prevents race conditions and token replay.
 * 6. Distributed multi-instance session revocation via updatedAt token cutoff.
 * 7. In-memory caching in JwtStrategy prevents database query stampedes.
 * 8. Zero-client trust role enforcement (authoritative server role overrides client claims; RolesGuard enforcement).
 * 9. OAuth CookieStateStore constant-time verification.
 */

import { UnauthorizedException, ConflictException, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

import { AuthService } from '../src/auth/auth.service';
import { JwtStrategy, JwtPayload } from '../src/auth/jwt.strategy';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { CookieStateStore } from '../src/auth/stores/cookie-state.store';
import type { Role } from '../src/auth/decorators/roles.decorator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runDrop03SecurityTests() {
  console.log('================================================================');
  console.log('🔒 NETVISION — DROP 03: AUTH & SESSION SECURITY HARDENING SUITE');
  console.log('================================================================\n');

  let testCount = 0;

  // ---------------------------------------------------------------------------
  // TEST 1: OAuth User (null passwordHash) Password Login Protection
  // ---------------------------------------------------------------------------
  console.log('--- TEST 1: OAUTH NULL-PASSWORD CRASH & ENUMERATION PROTECTION ---');
  testCount++;
  {
    let recordedFailedAuth = false;
    let monitoredAuthEvent = '';

    const mockPrisma: any = {
      user: {
        findUnique: async ({ where }: any) => {
          if (where.email === 'oauth_user@example.com') {
            return {
              id: 'user-oauth-123',
              email: 'oauth_user@example.com',
              username: 'oauth_user',
              passwordHash: null, // OAuth-registered user
              role: 'STUDENT',
              isVerified: true,
              updatedAt: new Date(),
            };
          }
          return null;
        },
      },
    };

    const mockRateLimiter: any = {
      recordFailedAuth: () => {
        recordedFailedAuth = true;
      },
      recordSuccessfulAuth: () => {},
    };

    const mockMonitoring: any = {
      recordAuthEvent: (event: string, meta: any) => {
        monitoredAuthEvent = event;
      },
    };

    const mockConfig: any = {
      get: (key: string, def?: any) => def,
    };

    const mockJwt: any = {
      signAsync: async () => 'test_token',
      decode: () => ({ sub: 'user-oauth-123' }),
    };

    const mockEmail: any = {
      isConfigured: () => false,
    };

    const authService = new AuthService(
      mockPrisma,
      mockJwt,
      mockEmail,
      mockConfig,
      mockRateLimiter,
      mockMonitoring
    );

    const startTime = Date.now();
    let caughtError: any = null;
    try {
      await authService.login({
        email: 'oauth_user@example.com',
        password: 'AttackerPassword123!',
      });
    } catch (err) {
      caughtError = err;
    }
    const durationMs = Date.now() - startTime;

    assert(caughtError instanceof UnauthorizedException, 'Throws UnauthorizedException rather than 500 TypeError');
    assert(caughtError?.message === 'Invalid credentials', 'Returns uniform "Invalid credentials" error message');
    assert(recordedFailedAuth, 'Failed authentication recorded in rate limiter');
    assert(monitoredAuthEvent === 'LOGIN_FAILED', 'Auth event recorded in monitoring service');
    assert(durationMs >= 10, `Dummy argon2 verification equalized timing (~${durationMs}ms)`);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Non-Existent Account Login Timing Equalization & Account Enumeration
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 2: NON-EXISTENT USER LOGIN TIMING & ENUMERATION ---');
  testCount++;
  {
    const mockPrisma: any = {
      user: {
        findUnique: async () => null, // User does not exist
      },
    };

    let failedAuthLogged = false;
    const mockRateLimiter: any = {
      recordFailedAuth: () => {
        failedAuthLogged = true;
      },
    };

    const authService = new AuthService(
      mockPrisma,
      {} as any,
      { isConfigured: () => false } as any,
      { get: (_: string, def?: any) => def } as any,
      mockRateLimiter,
      { recordAuthEvent: () => {} } as any
    );

    let caughtError: any = null;
    const start = Date.now();
    try {
      await authService.login({
        email: 'nonexistent_account@example.com',
        password: 'Password999!',
      });
    } catch (err) {
      caughtError = err;
    }
    const duration = Date.now() - start;

    assert(caughtError instanceof UnauthorizedException, 'Non-existent user triggers UnauthorizedException');
    assert(caughtError?.message === 'Invalid credentials', 'Uniform error message matches valid account failure');
    assert(failedAuthLogged, 'Rate limiter records failed attempt');
    assert(duration >= 10, `Argon2 dummy hash equalized response time (~${duration}ms)`);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Non-Disclosing Password Reset & OTP Resend Enumeration Defenses
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 3: ENUMERATION DEFENSE IN FORGOT-PASSWORD & RESEND-OTP ---');
  testCount++;
  {
    const mockPrisma: any = {
      user: {
        findUnique: async () => null, // User not in database
      },
      emailVerification: {
        findFirst: async () => null,
      },
    };

    const mockEmailService: any = {
      isConfigured: () => true,
      sendPasswordResetLink: async () => {},
    };

    const mockConfig: any = {
      get: (key: string, def?: any) => {
        if (key === 'EMAIL_VERIFICATION_ENABLED') return 'true';
        return def;
      },
    };

    const authService = new AuthService(
      mockPrisma,
      {} as any,
      mockEmailService,
      mockConfig
    );

    // forgotPassword for non-existent user
    const forgotRes = await authService.forgotPassword({ email: 'ghost_user@unknown.net' });
    assert(
      forgotRes.message.includes('If your account exists, a password reset link has been dispatched'),
      'forgotPassword returns non-disclosing message for missing user'
    );

    // resendOtp for non-existent user
    const resendRes = await authService.resendOtp({ email: 'ghost_user@unknown.net' });
    assert(
      resendRes.message.includes('If an account exists for this email and requires verification'),
      'resendOtp returns non-disclosing message for missing user'
    );
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Timing-Safe OTP Verification & Sanitized Errors
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 4: TIMING-SAFE OTP VERIFICATION & ERROR SANITIZATION ---');
  testCount++;
  {
    const otpHash = crypto.createHash('sha256').update('849201').digest('hex');
    let attemptCount = 0;

    const mockPrisma: any = {
      emailVerification: {
        findFirst: async ({ where }: any) => {
          if (where.email === 'student@example.com') {
            return {
              id: 'ev-1',
              email: 'student@example.com',
              otpHash,
              expiresAt: new Date(Date.now() + 5 * 60 * 1000),
              attempts: attemptCount,
            };
          }
          return null;
        },
        update: async ({ data }: any) => {
          attemptCount = data.attempts;
        },
        deleteMany: async () => {},
      },
      user: {
        update: async () => ({
          id: 'user-verified-1',
          email: 'student@example.com',
          username: 'student1',
          role: 'STUDENT',
          isVerified: true,
        }),
      },
    };

    const mockConfig: any = {
      get: (k: string, def?: any) => def,
    };

    const mockJwt: any = {
      signAsync: async () => 'sample_access_token',
    };

    const authService = new AuthService(
      mockPrisma,
      mockJwt,
      { isConfigured: () => true } as any,
      mockConfig
    );

    // 4.1 Non-existent verification process should return uniform message
    let caughtNotFound: any = null;
    try {
      await authService.verifyOtp({ email: 'unknown@example.com', otp: '123456' });
    } catch (e) {
      caughtNotFound = e;
    }
    assert(caughtNotFound instanceof UnauthorizedException, 'Non-existent OTP process throws UnauthorizedException');
    assert(
      caughtNotFound?.message === 'Invalid or expired verification OTP code.',
      'Sanitized error message does not disclose account status'
    );

    // 4.2 Wrong OTP should fail safely and increment attempts
    let caughtWrongOtp: any = null;
    try {
      await authService.verifyOtp({ email: 'student@example.com', otp: '999999' });
    } catch (e) {
      caughtWrongOtp = e;
    }
    assert(caughtWrongOtp instanceof UnauthorizedException, 'Invalid OTP throws UnauthorizedException');
    assert(attemptCount === 1, 'Failed attempt incremented');

    // 4.3 Correct OTP should verify successfully
    const successRes = await authService.verifyOtp({ email: 'student@example.com', otp: '849201' });
    assert(successRes.message === 'Account verified successfully!', 'Valid OTP verified');
    assert(successRes.user.isVerified === true, 'User marked as verified');
    assert(typeof successRes.accessToken === 'string', 'JWT access token issued upon verification');
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Atomic Password Reset Consumption & Anti-Race-Condition Enforcement
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 5: ATOMIC PASSWORD RESET TOKEN CONSUMPTION & REPLAY PREVENTION ---');
  testCount++;
  {
    const rawToken = 'secret_reset_token_hex_value_1234567890';
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    let isUsedInDb: boolean = false;
    let userUpdatedAtTouched: boolean = false;

    const mockPrisma: any = {
      passwordResetToken: {
        findFirst: async ({ where }: any) => {
          if (where.tokenHash === tokenHash && !isUsedInDb) {
            return {
              id: 'reset-token-id-1',
              email: 'alice@example.com',
              tokenHash,
              expiresAt: new Date(Date.now() + 10 * 60 * 1000),
              used: false,
            };
          }
          return null;
        },
        updateMany: async ({ where, data }: any) => {
          if (where.id === 'reset-token-id-1' && where.used === false && !isUsedInDb) {
            isUsedInDb = true;
            return { count: 1 };
          }
          return { count: 0 }; // Already used
        },
        deleteMany: async () => {},
      },
      user: {
        update: async ({ data }: any) => {
          if (data.updatedAt) {
            userUpdatedAtTouched = true;
          }
          return { id: 'alice-id', email: 'alice@example.com' };
        },
      },
    };

    const mockTokenRevocation: any = {
      setMonitoringService: () => {},
      revokeToken: () => {},
      revokeUserSessions: () => {},
      revokeUserRefreshTokens: () => {},
    };

    const authService = new AuthService(
      mockPrisma,
      { decode: () => null } as any,
      { isConfigured: () => true } as any,
      { get: (_: string, d?: any) => d } as any,
      { recordFailedAuth: () => {}, recordSuccessfulAuth: () => {} } as any,
      { recordAuthEvent: () => {} } as any,
      mockTokenRevocation
    );

    // First request: Should succeed and atomically mark token used
    const res1 = await authService.resetPassword({
      token: rawToken,
      newPassword: 'BrandNewSecurePassword123!',
    });
    assert(res1.message.includes('Password reset successful'), 'First reset request succeeds');
    assert(Boolean(isUsedInDb), 'Token was atomically marked used');
    assert(Boolean(userUpdatedAtTouched), 'User updatedAt was updated to invalidate all distributed sessions');

    // Second concurrent / replay request: Should be rejected
    let caughtReplay: any = null;
    try {
      await authService.resetPassword({
        token: rawToken,
        newPassword: 'SecondAttemptPassword456!',
      });
    } catch (e) {
      caughtReplay = e;
    }
    assert(caughtReplay instanceof UnauthorizedException, 'Second use of reset token is rejected');
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Multi-Instance Distributed Session Revocation via updatedAt
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 6: MULTI-INSTANCE DISTRIBUTED TOKEN REVOCATION VIA UPDATED-AT ---');
  testCount++;
  {
    const accountUpdatedAt = new Date(Date.now());
    const accountUpdatedSeconds = Math.floor(accountUpdatedAt.getTime() / 1000);

    const mockPrisma: any = {
      user: {
        findUnique: async () => ({
          id: 'user-distributed-42',
          email: 'distributed@example.com',
          username: 'distributed_user',
          role: 'STUDENT',
          isVerified: true,
          updatedAt: accountUpdatedAt,
        }),
      },
    };

    const mockConfig: any = {
      get: (k: string, def?: any) => {
        if (k === 'JWT_SECRET') return 'unit_test_jwt_secret_min_32_characters_long_1234';
        return def;
      },
    };

    const jwtStrategy = new JwtStrategy(mockConfig, mockPrisma);

    // 6.1 Token issued BEFORE updatedAt (e.g. before logout or password reset)
    const oldPayload: JwtPayload = {
      sub: 'user-distributed-42',
      email: 'distributed@example.com',
      role: 'STUDENT',
      iat: accountUpdatedSeconds - 10, // 10 seconds before account update
      exp: accountUpdatedSeconds + 3600,
    };

    let caughtRevoked: any = null;
    try {
      await jwtStrategy.validate(oldPayload);
    } catch (e) {
      caughtRevoked = e;
    }
    assert(caughtRevoked instanceof UnauthorizedException, 'Old token rejected as revoked');
    assert(
      caughtRevoked?.message.includes('Token has been revoked due to session termination'),
      'Clear revocation error message returned'
    );

    // 6.2 Token issued AFTER updatedAt (new session after password reset or login)
    jwtStrategy.evictUserCache();
    const freshPayload: JwtPayload = {
      sub: 'user-distributed-42',
      email: 'distributed@example.com',
      role: 'STUDENT',
      iat: accountUpdatedSeconds + 2,
      exp: accountUpdatedSeconds + 3600,
    };

    const validUser = await jwtStrategy.validate(freshPayload);
    assert(validUser.id === 'user-distributed-42', 'Fresh token validated successfully');
    assert(validUser.role === 'STUDENT', 'User role correctly populated');
  }

  // ---------------------------------------------------------------------------
  // TEST 7: JwtStrategy In-Memory 30s Caching Prevents DB Query Stampede
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 7: DB QUERY STAMPEDE PREVENTION (JWT STRATEGY CACHE) ---');
  testCount++;
  {
    let dbQueryCount = 0;
    const nowTime = new Date();
    const nowSec = Math.floor(nowTime.getTime() / 1000);

    const mockPrisma: any = {
      user: {
        findUnique: async () => {
          dbQueryCount++;
          return {
            id: 'cached-user-99',
            email: 'cached@example.com',
            username: 'cached_user',
            role: 'STUDENT',
            isVerified: true,
            updatedAt: nowTime,
          };
        },
      },
    };

    const mockConfig: any = {
      get: (k: string, def?: any) => {
        if (k === 'JWT_SECRET') return 'unit_test_jwt_secret_min_32_characters_long_1234';
        return def;
      },
    };

    const jwtStrategy = new JwtStrategy(mockConfig, mockPrisma);
    const payload: JwtPayload = {
      sub: 'cached-user-99',
      email: 'cached@example.com',
      role: 'STUDENT',
      iat: nowSec + 1,
      exp: nowSec + 3600,
    };

    // Make 10 consecutive validate requests
    for (let i = 0; i < 10; i++) {
      await jwtStrategy.validate(payload);
    }
    assert(dbQueryCount === 1, `10 requests resulted in only ${dbQueryCount} DB query (cached)`);

    // Evict cache and call again: Should query DB once more
    jwtStrategy.evictUserCache('cached-user-99');
    await jwtStrategy.validate(payload);
    assert(dbQueryCount === 2, 'Cache eviction cleanly triggers fresh DB lookup');
  }

  // ---------------------------------------------------------------------------
  // TEST 8: Zero Client Trust Role Enforcement (Server Authoritative)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 8: ZERO CLIENT TRUST ROLE ENFORCEMENT ---');
  testCount++;
  {
    const nowTime = new Date();
    const nowSec = Math.floor(nowTime.getTime() / 1000);

    // Database authoritatively says role is STUDENT
    const mockPrisma: any = {
      user: {
        findUnique: async () => ({
          id: 'hacker-user-1',
          email: 'hacker@example.com',
          username: 'hacker',
          role: 'STUDENT',
          isVerified: true,
          updatedAt: nowTime,
        }),
      },
    };

    const mockConfig: any = {
      get: (k: string, def?: any) => {
        if (k === 'JWT_SECRET') return 'unit_test_jwt_secret_min_32_characters_long_1234';
        return def;
      },
    };

    const jwtStrategy = new JwtStrategy(mockConfig, mockPrisma);

    // Client modified unverified claim or token claimed 'ADMIN'
    const forgedPayload: JwtPayload = {
      sub: 'hacker-user-1',
      email: 'hacker@example.com',
      role: 'ADMIN', // Forged/stale client payload
      iat: nowSec + 1,
      exp: nowSec + 3600,
    };

    const validatedUser = await jwtStrategy.validate(forgedPayload);
    assert(
      validatedUser.role === 'STUDENT',
      'Database role STUDENT authoritatively overrides client payload claim ADMIN'
    );

    // Test RolesGuard enforcement
    const reflector = new Reflector();
    const rolesGuard = new RolesGuard(reflector);

    // Mock execution context for an ADMIN-only endpoint
    const mockAdminContext = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: validatedUser, // Authoritative student role
        }),
      }),
    } as unknown as ExecutionContext;

    // Spy reflector to simulate @Roles('ADMIN')
    reflector.getAllAndOverride = () => ['ADMIN' as Role];

    const canActivate = rolesGuard.canActivate(mockAdminContext);
    assert(canActivate === false, 'RolesGuard denies STUDENT access to ADMIN endpoint');

    // Test with genuine ADMIN user
    const mockGenuineAdminContext = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'admin-1', role: 'ADMIN' },
        }),
      }),
    } as unknown as ExecutionContext;

    const canActivateAdmin = rolesGuard.canActivate(mockGenuineAdminContext);
    assert(canActivateAdmin === true, 'RolesGuard grants access to verified ADMIN');
  }

  // ---------------------------------------------------------------------------
  // TEST 9: OAuth CookieStateStore Timing-Safe Verification
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 9: OAUTH COOKIE STATE STORE TIMING-SAFE VERIFICATION ---');
  testCount++;
  {
    const stateStore = new CookieStateStore();

    let storedCookie = '';
    const mockRes: any = {
      cookie: (_name: string, val: string) => {
        storedCookie = val;
      },
      clearCookie: () => {},
    };
    const mockReq: any = {
      res: mockRes,
      cookies: {},
    };

    let generatedState = '';
    stateStore.store(mockReq, (_err, state) => {
      generatedState = state!;
    });

    assert(Boolean(generatedState && generatedState.length === 32), 'OAuth state generated (32 hex chars)');
    assert(storedCookie === generatedState, 'State saved into cookie');

    // 9.1 Verification with correct state
    mockReq.cookies['netvision_oauth_state'] = generatedState;
    let verifyOk: boolean = false;
    stateStore.verify(mockReq, generatedState, (_err, ok) => {
      verifyOk = Boolean(ok);
    });
    assert(Boolean(verifyOk), 'Valid OAuth state verified successfully');

    // 9.2 Verification with tampered state
    mockReq.cookies['netvision_oauth_state'] = generatedState;
    let tamperedOk: boolean = true;
    stateStore.verify(mockReq, generatedState.replace('a', 'b'), (_err, ok) => {
      tamperedOk = Boolean(ok);
    });
    assert(!tamperedOk, 'Tampered OAuth state rejected safely');

    // 9.3 Verification with different length (no crash with timingSafeEqual)
    mockReq.cookies['netvision_oauth_state'] = generatedState;
    let shortStateOk: boolean = true;
    stateStore.verify(mockReq, 'short_state', (_err, ok) => {
      shortStateOk = Boolean(ok);
    });
    assert(!shortStateOk, 'Different length OAuth state rejected safely');
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL ${testCount} TEST SUITES PASSED FLAWLESSLY!`);
  console.log('NETVISION DROP 03: AUTH, AUTHORIZATION & SESSION SECURITY CERTIFIED.');
  console.log('================================================================\n');
}

runDrop03SecurityTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
