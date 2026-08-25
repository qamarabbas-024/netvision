import { PrismaService } from '../src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../src/auth/auth.service';
import { EmailService } from '../src/mail/email.service';
import { EmailProvider } from '../src/mail/interfaces/email-provider.interface';
import { DevConsoleProvider } from '../src/mail/providers/dev-console.provider';

const prisma = new PrismaService();
const jwtService = new JwtService({ secret: 'super_secure_beta_test_jwt_secret_32_chars' });

function createMockConfigService(envMap: Record<string, any>): ConfigService {
  return {
    get: (key: string, defaultValue?: any) => {
      if (key in envMap) {
        return envMap[key];
      }
      return defaultValue;
    },
  } as unknown as ConfigService;
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function runBetaAuthTestSuite() {
  console.log('================================================================');
  console.log('🧪 NETVISION PUBLIC BETA — EMAIL OTP DISABLED TEST SUITE');
  console.log('================================================================\n');

  let isConnected = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await prisma.$connect();
      isConnected = true;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (!isConnected) {
    console.warn('⚠️ Database offline in test environment. Skipping live DB auth integration.');
    console.log('\n================================================================');
    console.log('🎉 BETA AUTH TESTS SKIPPED SAFELY (OFFLINE MODE)');
    console.log('================================================================\n');
    return;
  }
  let passedCount = 0;

  // --------------------------------------------------------------------------
  // TEST 1: Registration in Beta Mode (EMAIL_VERIFICATION_ENABLED=false)
  // --------------------------------------------------------------------------
  console.log('[TEST 1] Registration in Public Beta Mode (Immediate Verification & JWT Issuance)');
  {
    let emailDispatched: boolean = false;
    const mockEmailProvider: EmailProvider = {
      name: 'MockEmailProvider',
      isConfigured: () => true,
      getMissingVariables: () => [],
      sendEmail: async () => {
        emailDispatched = true;
        return { success: true };
      },
    };

    const betaConfig = createMockConfigService({
      NODE_ENV: 'production',
      EMAIL_VERIFICATION_ENABLED: 'false',
      JWT_EXPIRATION: '7d',
    });

    const emailService = new EmailService(betaConfig, mockEmailProvider);
    const authService = new AuthService(prisma, jwtService, emailService, betaConfig);

    const testEmail = `beta_user_${Date.now()}@netvision.test`;
    const testUsername = `beta_u_${Date.now().toString().slice(-8)}`;

    const regResult: any = await authService.register({
      email: testEmail,
      username: testUsername,
      password: 'SecurePassword123!',
      fullName: 'Beta Tester',
    });

    assert(regResult.requiresOtp === false, 'Registration response must specify requiresOtp: false');
    assert(regResult.email === testEmail, 'Email returned correctly');
    assert(typeof regResult.accessToken === 'string', 'Access token issued immediately');
    assert(regResult.user.isVerified === true, 'User is marked verified immediately');
    assert(emailDispatched === false, 'Zero emails dispatched during registration in beta mode');

    // Verify database record
    const dbUser = await prisma.user.findUnique({ where: { email: testEmail } });
    assert(dbUser !== null && dbUser.isVerified === true, 'User record in database has isVerified = true');

    const otpRecords = await prisma.emailVerification.findMany({ where: { email: testEmail } });
    assert(otpRecords.length === 0, 'No OTP verification record created in database');

    console.log('  ✓ Passed: Registration completes immediately without OTP and returns JWT credentials');
    passedCount++;

    // --------------------------------------------------------------------------
    // TEST 2: Immediate Login of Newly Registered Beta User
    // --------------------------------------------------------------------------
    console.log('\n[TEST 2] Immediate Login of Newly Registered Beta User');
    const loginResult = await authService.login({
      email: testEmail,
      password: 'SecurePassword123!',
    });

    assert(loginResult.user.email === testEmail, 'Login succeeds for newly registered user');
    assert(loginResult.user.isVerified === true, 'User profile reports isVerified: true');
    assert(typeof loginResult.accessToken === 'string', 'Access token returned on login');

    console.log('  ✓ Passed: Beta user can log in immediately with password');
    passedCount++;

    // Clean up
    await prisma.user.delete({ where: { email: testEmail } });
  }

  // --------------------------------------------------------------------------
  // TEST 3: Existing Unverified User Can Log In During Beta Mode
  // --------------------------------------------------------------------------
  console.log('\n[TEST 3] Existing Unverified User Logs In Without Being Blocked');
  {
    const legacyEmail = `legacy_unverified_${Date.now()}@netvision.test`;
    const betaConfig = createMockConfigService({
      NODE_ENV: 'production',
      EMAIL_VERIFICATION_ENABLED: 'false',
    });
    const emailService = new EmailService(betaConfig, new DevConsoleProvider());
    const authService = new AuthService(prisma, jwtService, emailService, betaConfig);

    // Create user directly with isVerified = false (simulating pre-beta registration)
    const argon2 = await import('argon2');
    const passwordHash = await argon2.hash('LegacyPassword123!');
    const legacyUser = await prisma.user.create({
      data: {
        email: legacyEmail,
        username: `leg_${Date.now().toString().slice(-8)}`,
        passwordHash,
        isVerified: false,
      },
    });

    const loginRes = await authService.login({
      email: legacyEmail,
      password: 'LegacyPassword123!',
    });

    assert(loginRes.user.isVerified === true, 'Login updates and reports isVerified: true');
    assert(typeof loginRes.accessToken === 'string', 'Login issues valid tokens');

    console.log('  ✓ Passed: Existing unverified users are unblocked and authenticated cleanly');
    passedCount++;

    // Clean up
    await prisma.user.delete({ where: { id: legacyUser.id } });
  }

  // --------------------------------------------------------------------------
  // TEST 4: Resend OTP Endpoint Graceful Handling in Beta Mode
  // --------------------------------------------------------------------------
  console.log('\n[TEST 4] Resend OTP Endpoint Informs User of Beta Mode');
  {
    const betaConfig = createMockConfigService({
      EMAIL_VERIFICATION_ENABLED: 'false',
    });
    const authService = new AuthService(prisma, jwtService, new EmailService(betaConfig, new DevConsoleProvider()), betaConfig);

    const resendRes = await authService.resendOtp({ email: 'any@netvision.test' });
    assert(
      resendRes.message.includes('disabled for public beta'),
      'Resend OTP explicitly informs user that verification is disabled'
    );

    console.log('  ✓ Passed: Resend OTP informs callers that verification is disabled for public beta');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 5: Password Reset Behavior When Email Transport is Unconfigured
  // --------------------------------------------------------------------------
  console.log('\n[TEST 5] Password Reset Explicitly Reports Unavailable When Email Provider is Inactive');
  {
    const betaConfig = createMockConfigService({
      NODE_ENV: 'production',
      EMAIL_VERIFICATION_ENABLED: 'false',
    });
    const unconfiguredEmailService = new EmailService(betaConfig, new DevConsoleProvider());
    const authService = new AuthService(prisma, jwtService, unconfiguredEmailService, betaConfig);

    let threwExpectedError = false;
    try {
      await authService.forgotPassword({ email: 'user@example.com' });
    } catch (err: any) {
      if (err.message && err.message.includes('unavailable during public beta')) {
        threwExpectedError = true;
      }
    }

    assert(
      threwExpectedError,
      'ForgotPassword throws BadRequestException explicitly reporting service unavailability'
    );
    console.log('  ✓ Passed: Password reset explicitly reports unavailability rather than silently faking delivery');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 6: Future Re-Enablement (EMAIL_VERIFICATION_ENABLED=true) Preserves Full OTP Flow
  // --------------------------------------------------------------------------
  console.log('\n[TEST 6] Future Re-Enablement (EMAIL_VERIFICATION_ENABLED=true) Enforces Full OTP Flow');
  {
    let otpDispatched: boolean = false;
    let dispatchedOtpCode: string = '';
    const mockEmailProvider: EmailProvider = {
      name: 'MockEmailProvider',
      isConfigured: () => true,
      getMissingVariables: () => [],
      sendEmail: async (opts) => {
        otpDispatched = true;
        const match = opts.text?.match(/\b\d{6}\b/);
        if (match) dispatchedOtpCode = match[0];
        return { success: true, messageId: 'msg_otp_ok' };
      },
    };

    const reEnabledConfig = createMockConfigService({
      NODE_ENV: 'production',
      EMAIL_VERIFICATION_ENABLED: 'true',
      JWT_EXPIRATION: '7d',
    });

    const emailService = new EmailService(reEnabledConfig, mockEmailProvider);
    const authService = new AuthService(prisma, jwtService, emailService, reEnabledConfig);

    const reEnabledEmail = `reenabled_${Date.now()}@netvision.test`;
    const regResult: any = await authService.register({
      email: reEnabledEmail,
      username: `re_${Date.now().toString().slice(-8)}`,
      password: 'SecurePassword123!',
    });

    assert(Boolean(regResult.requiresOtp) === true, 'When re-enabled, registration specifies requiresOtp: true');
    assert(Boolean(otpDispatched) === true, 'When re-enabled, OTP email is dispatched');
    assert(dispatchedOtpCode.length === 6, 'Valid 6-digit OTP code dispatched');

    // Direct login attempt must fail with UnauthorizedException
    let loginBlocked = false;
    try {
      await authService.login({ email: reEnabledEmail, password: 'SecurePassword123!' });
    } catch (err: any) {
      if (err.message && err.message.includes('not verified')) {
        loginBlocked = true;
      }
    }
    assert(loginBlocked, 'Unverified login is blocked when EMAIL_VERIFICATION_ENABLED=true');

    // Complete OTP verification
    const verifyResult = await authService.verifyOtp({
      email: reEnabledEmail,
      otp: dispatchedOtpCode,
    });
    assert(verifyResult.user.isVerified === true, 'Account verified after OTP submission');
    assert(typeof verifyResult.accessToken === 'string', 'JWT issued after OTP verification');

    console.log('  ✓ Passed: Re-enabling feature flag seamlessly restores the complete OTP verification pipeline');
    passedCount++;

    // Clean up
    await prisma.emailVerification.deleteMany({ where: { email: reEnabledEmail } });
    await prisma.user.delete({ where: { email: reEnabledEmail } });
  }

  await prisma.$disconnect();

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedCount} BETA AUTH & EMAIL CONFIGURATION TESTS PASSED!`);
  console.log('================================================================\n');
}

runBetaAuthTestSuite().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
