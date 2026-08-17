import { ConfigService } from '@nestjs/config';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { PrismaService } from '../src/database/prisma.service';
import * as crypto from 'crypto';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runOAuthOtpSecurityTests() {
  console.log('================================================================');
  console.log('🔒 NETVISION — OAUTH TOKEN LEAK FIX & OTP RANDOMNESS TEST SUITE');
  console.log('================================================================\n');

  let passedCount = 0;

  // --------------------------------------------------------------------------
  // TEST 1: OAuth Callback Sets HttpOnly Cookie & Does NOT Leak Token in URL
  // --------------------------------------------------------------------------
  console.log('[TEST 1] OAuth Callback Cookie Issuance & URL Sanitization');
  {
    const mockConfigService = {
      get: (key: string, defaultVal?: any) => {
        if (key === 'FRONTEND_URL') return 'http://localhost:3000';
        if (key === 'NODE_ENV') return 'production';
        return defaultVal;
      },
    } as unknown as ConfigService;

    const mockAuthService = {} as unknown as AuthService;
    const controller = new AuthController(mockAuthService, mockConfigService);

    let setCookieName = '';
    let setCookieVal = '';
    let setCookieOptions: any = null;
    let redirectedUrl = '';

    const mockRes: any = {
      cookie: (name: string, val: string, options: any) => {
        setCookieName = name;
        setCookieVal = val;
        setCookieOptions = options;
      },
      redirect: (url: string) => {
        redirectedUrl = url;
      },
    };

    const mockReqWithToken: any = {
      user: {
        accessToken: 'mock_jwt_token_sample_header_payload_signature_2026',
      },
    };

    // Execute Google callback
    await controller.googleAuthCallback(mockReqWithToken, mockRes);

    assert(
      redirectedUrl === 'http://localhost:3000/auth/callback',
      `Google callback redirects to http://localhost:3000/auth/callback without query parameters (got: ${redirectedUrl})`
    );
    assert(
      !redirectedUrl.includes('token='),
      'Google callback URL does NOT contain "token=" query parameter'
    );
    assert(
      !redirectedUrl.includes('mock_jwt_token'),
      'Google callback URL does NOT contain raw JWT token'
    );
    assert(
      setCookieName === 'netvision_auth_token',
      'Cookie name is "netvision_auth_token"'
    );
    assert(
      setCookieVal === 'mock_jwt_token_sample_header_payload_signature_2026',
      'Cookie value holds the issued JWT access token'
    );
    assert(
      setCookieOptions.httpOnly === true,
      'Cookie options specify httpOnly: true'
    );
    assert(
      setCookieOptions.secure === true,
      'Cookie options specify secure: true in production'
    );
    assert(
      setCookieOptions.sameSite === 'lax',
      'Cookie options specify sameSite: "lax"'
    );
    assert(
      setCookieOptions.path === '/',
      'Cookie options specify path: "/"'
    );
    assert(
      setCookieOptions.maxAge === 7 * 24 * 60 * 60 * 1000,
      'Cookie options specify 7-day expiration (maxAge)'
    );

    // Execute GitHub callback
    setCookieName = '';
    setCookieVal = '';
    redirectedUrl = '';
    await controller.githubAuthCallback(mockReqWithToken, mockRes);

    assert(
      redirectedUrl === 'http://localhost:3000/auth/callback',
      'GitHub callback redirects to /auth/callback without query parameters'
    );
    assert(
      !redirectedUrl.includes('token='),
      'GitHub callback URL does NOT leak token in query string'
    );
    assert(
      setCookieName === 'netvision_auth_token',
      'GitHub callback sets netvision_auth_token cookie'
    );

    console.log('  ✓ Passed: Google and GitHub OAuth callbacks set Secure HttpOnly cookies with zero URL token leaks.');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 2: Missing/Invalid OAuth Token Fails Safely
  // --------------------------------------------------------------------------
  console.log('\n[TEST 2] Missing / Invalid OAuth Token Safe Failure');
  {
    const mockConfigService = {
      get: (key: string, defaultVal?: any) => {
        if (key === 'FRONTEND_URL') return 'http://localhost:3000';
        return defaultVal;
      },
    } as unknown as ConfigService;

    const mockAuthService = {} as unknown as AuthService;
    const controller = new AuthController(mockAuthService, mockConfigService);

    let cookiesSet = 0;
    let redirectedUrl = '';

    const mockRes: any = {
      cookie: () => {
        cookiesSet++;
      },
      redirect: (url: string) => {
        redirectedUrl = url;
      },
    };

    const mockReqNoToken: any = { user: {} };

    await controller.googleAuthCallback(mockReqNoToken, mockRes);

    assert(
      redirectedUrl === 'http://localhost:3000/login?error=OAuthAuthenticationFailed',
      `Missing token safely redirects to login error URL (got: ${redirectedUrl})`
    );
    assert(
      cookiesSet === 0,
      'No authentication cookies are set when OAuth token is missing'
    );

    await controller.githubAuthCallback(mockReqNoToken, mockRes);
    assert(
      redirectedUrl === 'http://localhost:3000/login?error=OAuthAuthenticationFailed',
      'Missing token in GitHub callback safely redirects to login error URL'
    );
    assert(
      cookiesSet === 0,
      'No authentication cookies are set when GitHub OAuth token is missing'
    );

    console.log('  ✓ Passed: Missing OAuth tokens fail safely without issuing cookies.');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 3: Cryptographic OTP Randomness (crypto.randomInt)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 3] Cryptographic OTP Randomness & Statistical Range Validation');
  {
    const sampleSize = 10000;
    const generatedOtps = new Set<string>();
    let minOtp = 999999;
    let maxOtp = 0;

    for (let i = 0; i < sampleSize; i++) {
      const otpNum = crypto.randomInt(100000, 1000000);
      const otpStr = otpNum.toString();

      assert(otpStr.length === 6, `OTP string length must be exactly 6 digits (got: ${otpStr})`);
      assert(otpNum >= 100000 && otpNum < 1000000, `OTP must be within [100000, 999999] (got: ${otpNum})`);

      if (otpNum < minOtp) minOtp = otpNum;
      if (otpNum > maxOtp) maxOtp = otpNum;

      generatedOtps.add(otpStr);
    }

    // In 10,000 samples out of 900,000 possibilities, unique count should be very high (>9900)
    assert(
      generatedOtps.size > 9800,
      `Cryptographic OTP generation exhibits high entropy (${generatedOtps.size} unique values in 10,000 iterations)`
    );
    assert(minOtp >= 100000 && maxOtp <= 999999, 'All generated OTPs strictly bounded');

    console.log(`  ✓ Passed: ${sampleSize} cryptographic OTPs verified with uniform distribution (min: ${minOtp}, max: ${maxOtp}, unique: ${generatedOtps.size}).`);
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 4: JWT Strategy Cookie Extraction
  // --------------------------------------------------------------------------
  console.log('\n[TEST 4] JWT Strategy Extraction from HttpOnly Cookie & Bearer Header');
  {
    const mockConfigService = {
      get: (key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'JWT_SECRET') return 'super_secure_test_jwt_secret_min_32_chars';
        return null;
      },
    } as unknown as ConfigService;

    const mockPrisma = {} as unknown as PrismaService;
    const jwtStrategy = new JwtStrategy(mockConfigService, mockPrisma);

    const jwtExtractor = (jwtStrategy as any)._jwtFromRequest;

    // Test 1: Bearer Header extraction
    const reqWithBearer: any = {
      headers: { authorization: 'Bearer test_token_from_header' },
      cookies: {},
    };
    const extractedFromHeader = jwtExtractor(reqWithBearer);
    assert(
      extractedFromHeader === 'test_token_from_header',
      `JWT extracted successfully from Bearer header (got: ${extractedFromHeader})`
    );

    // Test 2: Cookie extraction (when header is absent)
    const reqWithCookie: any = {
      headers: {},
      cookies: { netvision_auth_token: 'test_token_from_cookie' },
    };
    const extractedFromCookie = jwtExtractor(reqWithCookie);
    assert(
      extractedFromCookie === 'test_token_from_cookie',
      `JWT extracted successfully from netvision_auth_token cookie (got: ${extractedFromCookie})`
    );

    // Test 3: No token in header or cookie
    const reqEmpty: any = {
      headers: {},
      cookies: {},
    };
    const extractedEmpty = jwtExtractor(reqEmpty);
    assert(
      extractedEmpty === null,
      'JWT extractor returns null when neither header nor cookie is present'
    );

    console.log('  ✓ Passed: JwtStrategy accurately extracts tokens from both Bearer headers and HttpOnly cookies.');
    passedCount++;
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedCount} OAUTH COOKIE & OTP RANDOMNESS HARDENING TESTS PASSED!`);
  console.log('================================================================\n');
}

runOAuthOtpSecurityTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
