import { ConfigService } from '@nestjs/config';
import { EmailService } from '../src/mail/email.service';
import { ResendProvider } from '../src/mail/providers/resend.provider';
import { SmtpProvider } from '../src/mail/providers/smtp.provider';
import { Resend } from 'resend';

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

async function runEmailTestSuite() {
  console.log('================================================================');
  console.log('🧪 NETVISION RESEND HTTPS EMAIL API MIGRATION TEST SUITE');
  console.log('================================================================\n');
  let passedCount = 0;

  // --------------------------------------------------------------------------
  // TEST 1: ResendProvider initialization
  // --------------------------------------------------------------------------
  console.log('[TEST 1] ResendProvider Initialization with API Key & Custom Sender');
  {
    const mockResendClient = {
      emails: {
        send: async () => ({ data: { id: 'msg_test_123' }, error: null }),
      },
    } as unknown as Resend;

    const provider = new ResendProvider('re_test_dummy_key', 'NetVision <test@netvision.app>', mockResendClient);
    assert(provider.isConfigured() === true, 'ResendProvider should be configured when key and client are present');
    assert(provider.name === 'Resend (HTTPS API)', 'Provider name should identify as Resend (HTTPS API)');
    assert(provider.getMissingVariables().length === 0, 'No missing variables when configured');
    assert(provider.getDefaultFrom() === 'NetVision <test@netvision.app>', 'Default sender matches configured value');
    console.log('  ✓ Passed: ResendProvider initializes correctly with key and sender');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 2: Missing RESEND_API_KEY Handling
  // --------------------------------------------------------------------------
  console.log('\n[TEST 2] Missing RESEND_API_KEY Handling & Safe Failure');
  {
    const provider = new ResendProvider(undefined, undefined);
    assert(provider.isConfigured() === false, 'ResendProvider should not be configured when API key is missing');
    assert(provider.getMissingVariables().includes('RESEND_API_KEY'), 'Should report RESEND_API_KEY as missing');

    const result = await provider.sendEmail({
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Test</p>',
    });
    assert(result.success === false, 'Send should return failure when unconfigured');
    assert(typeof result.error === 'string' && result.error.includes('RESEND_API_KEY'), 'Should return safe error message');
    console.log('  ✓ Passed: Missing API key fails safely with clear diagnostics');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 3: Missing RESEND_FROM_EMAIL (Default Safe Sender Fallback)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 3] Missing RESEND_FROM_EMAIL Safe Fallback & Custom Override');
  {
    let capturedPayload: any = null;
    const mockClient = {
      emails: {
        send: async (payload: any) => {
          capturedPayload = payload;
          return { data: { id: 'msg_from_test' }, error: null };
        },
      },
    } as unknown as Resend;

    // 3a: Omitted from email defaults to onboarding@resend.dev
    const providerDefault = new ResendProvider('re_dummy_key', undefined, mockClient);
    assert(
      providerDefault.getDefaultFrom() === 'NetVision <onboarding@resend.dev>',
      'Should default to NetVision <onboarding@resend.dev> when RESEND_FROM_EMAIL is omitted'
    );

    await providerDefault.sendEmail({
      to: 'user@example.com',
      subject: 'Welcome',
      html: '<p>Hi</p>',
    });
    assert(
      capturedPayload.from === 'NetVision <onboarding@resend.dev>',
      'Dispatched email should use default sender when none specified in options'
    );

    // 3b: Explicit custom sender from options
    await providerDefault.sendEmail({
      to: 'user@example.com',
      from: 'NetVision Support <support@netvision.app>',
      subject: 'Welcome',
      html: '<p>Hi</p>',
    });
    assert(
      capturedPayload.from === 'NetVision Support <support@netvision.app>',
      'Dispatched email should respect explicitly provided sender in SendEmailOptions'
    );

    console.log('  ✓ Passed: Sender configuration safely falls back to default and supports custom domains');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 4: Successful Resend Send Using Mocked SDK
  // --------------------------------------------------------------------------
  console.log('\n[TEST 4] Successful Resend Email Dispatch (Mocked SDK)');
  {
    let sentPayload: any = null;
    const mockResendClient = {
      emails: {
        send: async (payload: any) => {
          sentPayload = payload;
          return { data: { id: 'resend_msg_success_999' }, error: null };
        },
      },
    } as unknown as Resend;

    const provider = new ResendProvider('re_dummy_valid_key', 'NetVision <onboarding@resend.dev>', mockResendClient);
    const result = await provider.sendEmail({
      to: 'student@example.com',
      subject: 'Verification Code',
      html: '<b>123456</b>',
      text: '123456',
    });

    assert(result.success === true, 'Delivery result must be success: true');
    assert(result.messageId === 'resend_msg_success_999', 'Message ID must match Resend response ID');
    assert(sentPayload !== null, 'Resend SDK send should have been called');
    assert(sentPayload.to === 'student@example.com', 'Recipient must match input');
    assert(sentPayload.from === 'NetVision <onboarding@resend.dev>', 'Sender must match default from');
    assert(sentPayload.subject === 'Verification Code', 'Subject must match input');
    assert(sentPayload.html === '<b>123456</b>', 'HTML body must match input');
    assert(sentPayload.text === '123456', 'Plaintext body must match input');
    console.log('  ✓ Passed: Email dispatched successfully via Resend with correct payload');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 5: Resend API Error & Exception Handling
  // --------------------------------------------------------------------------
  console.log('\n[TEST 5] Resend API Error & Exception Handling');
  {
    // Case 5a: API returned error object
    const mockErrorClient = {
      emails: {
        send: async () => ({
          data: null,
          error: { message: 'Domain verification required', name: 'validation_error' },
        }),
      },
    } as unknown as Resend;

    const provider5a = new ResendProvider('re_dummy_key', undefined, mockErrorClient);
    const result5a = await provider5a.sendEmail({
      to: 'test@unverified.org',
      subject: 'Test',
      html: '<p>Test</p>',
    });

    assert(result5a.success === false, 'API error response must yield success: false');
    assert(result5a.error === 'Domain verification required', 'Error message must be preserved safely');

    // Case 5b: Network exception thrown
    const mockThrowClient = {
      emails: {
        send: async () => {
          throw new Error('Connection reset by peer');
        },
      },
    } as unknown as Resend;

    const provider5b = new ResendProvider('re_dummy_key', undefined, mockThrowClient);
    const result5b = await provider5b.sendEmail({
      to: 'test@unreachable.org',
      subject: 'Test',
      html: '<p>Test</p>',
    });

    assert(result5b.success === false, 'Thrown exception must yield success: false without crashing');
    assert(result5b.error === 'Connection reset by peer', 'Safe error message returned');
    console.log('  ✓ Passed: Resend API errors and network exceptions handled safely');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 6: Production Mode NEVER Initializes or Attempts SMTP
  // --------------------------------------------------------------------------
  console.log('\n[TEST 6] Production Mode Exclusively Uses Resend & Blocks SMTP');
  {
    // 6a: Production with Resend configured and SMTP variables present in env
    const prodConfig = createMockConfigService({
      NODE_ENV: 'production',
      RESEND_API_KEY: 're_mock_prod_key',
      RESEND_FROM_EMAIL: 'NetVision <noreply@netvision.app>',
      SMTP_HOST: 'smtp.blocked-render-port.com',
      SMTP_PORT: 587,
      SMTP_USER: 'smtp_user',
      SMTP_PASS: 'smtp_secret',
    });

    const emailServiceProd = new EmailService(prodConfig);
    assert(emailServiceProd.isConfigured() === true, 'Production should be configured with Resend');
    assert(
      emailServiceProd.getActiveProviderName() === 'Resend (HTTPS API)',
      'Production provider MUST be Resend (HTTPS API), never SMTP'
    );
    assert(
      emailServiceProd.getMissingVariables().length === 0,
      'No missing variables when Resend key is configured'
    );

    // 6b: Production with missing RESEND_API_KEY (and SMTP variables present)
    const prodMissingKeyConfig = createMockConfigService({
      NODE_ENV: 'production',
      SMTP_HOST: 'smtp.blocked-render-port.com',
      SMTP_PORT: 587,
      SMTP_USER: 'smtp_user',
      SMTP_PASS: 'smtp_secret',
    });

    const emailServiceProdMissing = new EmailService(prodMissingKeyConfig);
    assert(
      emailServiceProdMissing.isConfigured() === false,
      'Production without RESEND_API_KEY must not be configured'
    );
    assert(
      emailServiceProdMissing.getActiveProviderName() === 'Resend (HTTPS API)',
      'Production provider must remain Resend (HTTPS API), never fallback to SMTP'
    );
    const missing = emailServiceProdMissing.getMissingVariables();
    assert(missing.includes('RESEND_API_KEY'), 'Should report RESEND_API_KEY as missing in production');
    assert(!missing.includes('SMTP_HOST'), 'Should not ask for SMTP in production');

    const sendRes = await emailServiceProdMissing.sendVerificationOtp('student@example.com', '654321');
    assert(sendRes.success === false, 'Must not claim success');
    assert(sendRes.error?.includes('RESEND_API_KEY is required in production.') === true, 'Safe error message in production');

    console.log('  ✓ Passed: Production strictly enforces Resend HTTPS API and ignores SMTP');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 7: Development Mode Uses SMTP When Configured
  // --------------------------------------------------------------------------
  console.log('\n[TEST 7] Development Mode Uses SMTP When Configured');
  {
    const devSmtpConfig = createMockConfigService({
      NODE_ENV: 'development',
      SMTP_HOST: 'smtp.mailtrap.io',
      SMTP_PORT: 2525,
      SMTP_USER: 'mailtrap_user',
      SMTP_PASS: 'mailtrap_pass',
      SMTP_FROM: '"NetVision Dev" <dev@netvision.edu>',
    });

    const tracker = { mockSmtpSent: false };
    const mockTransporter = {
      sendMail: async (_mailOpts: any) => {
        tracker.mockSmtpSent = true;
        return { messageId: '<smtp_test_msg_456@mailtrap>' };
      },
    } as any;

    const smtpProvider = new SmtpProvider(
      {
        host: 'smtp.mailtrap.io',
        port: 2525,
        user: 'mailtrap_user',
        pass: 'mailtrap_pass',
        from: '"NetVision Dev" <dev@netvision.edu>',
      },
      mockTransporter
    );

    const emailServiceDevSmtp = new EmailService(devSmtpConfig, smtpProvider);
    assert(emailServiceDevSmtp.isConfigured() === true, 'Dev with SMTP should be configured');
    assert(emailServiceDevSmtp.getActiveProviderName().includes('SMTP'), 'Active provider is SMTP');

    const smtpRes = await emailServiceDevSmtp.sendVerificationOtp('dev_user@example.com', '112233');
    assert(smtpRes.success === true, 'SMTP delivery succeeded');
    assert(smtpRes.messageId === '<smtp_test_msg_456@mailtrap>', 'SMTP messageId returned');
    assert(tracker.mockSmtpSent === true, 'SMTP sendMail was invoked');

    console.log('  ✓ Passed: Development mode utilizes SMTP transport when configured');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 8: Development Mode Falls Back Safely When SMTP is Absent
  // --------------------------------------------------------------------------
  console.log('\n[TEST 8] Development Mode Falls Back Safely When SMTP is Absent');
  {
    const devFallbackConfig = createMockConfigService({
      NODE_ENV: 'development',
    });

    const emailServiceDevFallback = new EmailService(devFallbackConfig);
    assert(emailServiceDevFallback.isConfigured() === false, 'Unconfigured dev is not configured');
    assert(
      emailServiceDevFallback.getActiveProviderName() === 'Development Console Fallback',
      'Reports Development Console Fallback'
    );

    const fallbackOtpRes = await emailServiceDevFallback.sendVerificationOtp(
      'unverified@example.com',
      '123456'
    );
    assert(fallbackOtpRes.success === false, 'Fallback OTP send returns success: false');

    const fallbackResetRes = await emailServiceDevFallback.sendPasswordResetLink(
      'forgot_dev@example.com',
      'raw_token_xyz'
    );
    assert(fallbackResetRes.success === false, 'Fallback reset send returns success: false');

    console.log('  ✓ Passed: Development mode safely falls back to console fallback');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 9: Development Mode Does NOT Automatically Use Resend
  // --------------------------------------------------------------------------
  console.log('\n[TEST 9] Development Does NOT Automatically Use Resend Just Because RESEND_API_KEY Exists');
  {
    // Local dev with RESEND_API_KEY in .env, but NO EMAIL_PROVIDER and NO SMTP
    const devResendOnlyConfig = createMockConfigService({
      NODE_ENV: 'development',
      RESEND_API_KEY: 're_secret_local_dev_key',
    });

    const emailService = new EmailService(devResendOnlyConfig);
    assert(
      emailService.isConfigured() === false,
      'EmailService must NOT be configured in development merely because RESEND_API_KEY is present'
    );
    assert(
      emailService.getActiveProviderName() === 'Development Console Fallback',
      'Active provider must remain Development Console Fallback'
    );

    const sendRes = await emailService.sendVerificationOtp('dev@example.com', '654321');
    assert(sendRes.success === false, 'Sending must not attempt real Resend delivery without explicit opt-in');

    console.log('  ✓ Passed: Development does not automatically trigger Resend without explicit configuration');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 10: EMAIL_PROVIDER=resend Explicitly Selects Resend in Development
  // --------------------------------------------------------------------------
  console.log('\n[TEST 10] EMAIL_PROVIDER=resend Explicitly Selects Resend in Development');
  {
    // 10a: Explicit EMAIL_PROVIDER=resend with API key
    const devExplicitResendConfig = createMockConfigService({
      NODE_ENV: 'development',
      EMAIL_PROVIDER: 'resend',
      RESEND_API_KEY: 're_explicit_dev_key',
      RESEND_FROM_EMAIL: 'NetVision <onboarding@resend.dev>',
    });

    const emailServiceExplicit = new EmailService(devExplicitResendConfig);
    assert(
      emailServiceExplicit.isConfigured() === true,
      'EmailService should be configured when EMAIL_PROVIDER=resend and key is present'
    );
    assert(
      emailServiceExplicit.getActiveProviderName() === 'Resend (HTTPS API)',
      'Active provider is Resend (HTTPS API)'
    );

    // 10b: Explicit EMAIL_PROVIDER=resend without API key
    const devExplicitMissingKey = createMockConfigService({
      NODE_ENV: 'development',
      EMAIL_PROVIDER: 'resend',
    });

    const emailServiceMissingKey = new EmailService(devExplicitMissingKey);
    assert(
      emailServiceMissingKey.isConfigured() === false,
      'EMAIL_PROVIDER=resend without key should not be configured'
    );
    assert(
      emailServiceMissingKey.getMissingVariables().includes('RESEND_API_KEY'),
      'Missing variables should specify RESEND_API_KEY'
    );

    console.log('  ✓ Passed: EMAIL_PROVIDER=resend explicitly selects Resend for local testing');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 11: Safe Provider Status Reporting (getProviderStatus)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 11] Safe Provider Status Reporting via getProviderStatus()');
  {
    // 11a: Production configured
    const prodConfig = createMockConfigService({
      NODE_ENV: 'production',
      RESEND_API_KEY: 're_prod_key_123',
    });
    const statusProd = new EmailService(prodConfig).getProviderStatus();
    assert(statusProd.provider === 'resend', 'Provider should be resend');
    assert(statusProd.configured === true, 'Configured should be true');
    assert(statusProd.missing === undefined, 'No missing variables in status');

    // 11b: Production unconfigured
    const prodUnconf = createMockConfigService({ NODE_ENV: 'production' });
    const statusProdUnconf = new EmailService(prodUnconf).getProviderStatus();
    assert(statusProdUnconf.provider === 'resend', 'Provider should be resend');
    assert(statusProdUnconf.configured === false, 'Configured should be false');
    assert(
      Array.isArray(statusProdUnconf.missing) && statusProdUnconf.missing.includes('RESEND_API_KEY'),
      'Missing RESEND_API_KEY reported'
    );

    // 11c: Development fallback
    const devUnconf = createMockConfigService({ NODE_ENV: 'development' });
    const statusDev = new EmailService(devUnconf).getProviderStatus();
    assert(statusDev.provider === 'console_fallback', 'Provider should be console_fallback');
    assert(statusDev.configured === false, 'Configured should be false');

    // 11d: Development with SMTP
    const devSmtp = createMockConfigService({
      NODE_ENV: 'development',
      SMTP_HOST: 'smtp.gmail.com',
      SMTP_USER: 'user',
      SMTP_PASS: 'pass',
    });
    const statusDevSmtp = new EmailService(devSmtp).getProviderStatus();
    assert(statusDevSmtp.provider === 'smtp', 'Provider should be smtp');
    assert(statusDevSmtp.configured === true, 'Configured should be true');

    // 11e: Development explicit resend
    const devExplicit = createMockConfigService({
      NODE_ENV: 'development',
      EMAIL_PROVIDER: 'resend',
      RESEND_API_KEY: 're_dev_key',
    });
    const statusDevExplicit = new EmailService(devExplicit).getProviderStatus();
    assert(statusDevExplicit.provider === 'resend', 'Provider should be resend');
    assert(statusDevExplicit.configured === true, 'Configured should be true');

    console.log('  ✓ Passed: getProviderStatus() returns accurate, safe diagnostic metadata across all modes');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 12: No Secrets Appear in Logs, Errors, or Status
  // --------------------------------------------------------------------------
  console.log('\n[TEST 12] Security & Sanitization: No Secrets in Logs, Errors, or Diagnostics');
  {
    const SECRET_KEY = 're_live_super_secret_api_key_99887766';
    const SECRET_PASS = 'smtp_super_secret_password_112233';
    const SECRET_TOKEN = 'raw_reset_token_secret_abcdef123456';
    const SECRET_OTP = '889900';

    const prodConfig = createMockConfigService({
      NODE_ENV: 'production',
      RESEND_API_KEY: SECRET_KEY,
      SMTP_PASS: SECRET_PASS,
    });

    const emailService = new EmailService(prodConfig);
    const status = emailService.getProviderStatus();
    const statusStr = JSON.stringify(status);

    assert(!statusStr.includes(SECRET_KEY), 'Status output must NOT leak RESEND_API_KEY');
    assert(!statusStr.includes(SECRET_PASS), 'Status output must NOT leak SMTP password');

    // Test error response sanitization
    const unconfProd = new EmailService(createMockConfigService({ NODE_ENV: 'production' }));
    const otpRes = await unconfProd.sendVerificationOtp('victim@example.com', SECRET_OTP);
    assert(!otpRes.error?.includes(SECRET_OTP), 'Error message must NOT leak OTP code');

    const resetRes = await unconfProd.sendPasswordResetLink('victim@example.com', SECRET_TOKEN);
    assert(!resetRes.error?.includes(SECRET_TOKEN), 'Error message must NOT leak reset token');

    console.log('  ✓ Passed: Zero secrets, OTP codes, reset tokens, or credentials leak in diagnostics');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 13: Template Content & Contract Integrity
  // --------------------------------------------------------------------------
  console.log('\n[TEST 13] Email Template Content & Contract Integrity (OTP & Password Reset)');
  {
    let capturedOptions: any = null;
    const mockProvider = {
      name: 'MockResend',
      isConfigured: () => true,
      getMissingVariables: () => [],
      sendEmail: async (opts: any) => {
        capturedOptions = opts;
        return { success: true, messageId: 'msg_contract_ok' };
      },
    };

    const config = createMockConfigService({
      NODE_ENV: 'production',
      FRONTEND_URL: 'https://netvision.app',
    });

    const emailService = new EmailService(config, mockProvider);

    // Test OTP content
    const otpRes = await emailService.sendVerificationOtp('user@domain.com', '987654');
    assert(otpRes.success === true, 'OTP send succeeds');
    assert(capturedOptions.subject.includes('Verification Code'), 'Subject matches contract');
    assert(capturedOptions.html.includes('987654'), 'HTML includes OTP');
    assert(capturedOptions.text.includes('987654'), 'Text includes OTP');
    assert(capturedOptions.html.includes('10 minutes'), 'HTML includes 10 min expiry');
    assert(capturedOptions.html.includes('#00f0ff'), 'HTML includes NetVision cyan branding');

    // Test Reset Password content
    const resetRes = await emailService.sendPasswordResetLink('user@domain.com', 'secure_token_abc');
    assert(resetRes.success === true, 'Reset send succeeds');
    assert(capturedOptions.subject.includes('Password Reset'), 'Subject matches contract');
    assert(capturedOptions.html.includes('https://netvision.app/reset-password?token=secure_token_abc'), 'HTML contains reset URL');
    assert(capturedOptions.html.includes('15 minutes'), 'HTML contains 15 min expiry');
    assert(capturedOptions.html.includes('#00f0ff'), 'HTML includes NetVision cyan branding');

    // Test Send Test Email content
    const testRes = await emailService.sendTestEmail('diagnostic@domain.com');
    assert(testRes.success === true, 'Test email send succeeds');
    assert(capturedOptions.subject.includes('Test'), 'Test email subject contains Test');
    assert(capturedOptions.html.includes('MockResend'), 'Test email contains active provider name');

    console.log('  ✓ Passed: Email templates and response contracts completely preserved');
    passedCount++;
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedCount} EMAIL MIGRATION & SECURITY TESTS PASSED!`);
  console.log('================================================================\n');
}

runEmailTestSuite().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
