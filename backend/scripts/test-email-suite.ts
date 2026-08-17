import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MailModule, emailProviderFactory } from '../src/mail/mail.module';
import { EmailService } from '../src/mail/email.service';
import { EMAIL_PROVIDER, EmailProvider } from '../src/mail/interfaces/email-provider.interface';
import { ResendProvider } from '../src/mail/providers/resend.provider';
import { SmtpProvider } from '../src/mail/providers/smtp.provider';
import { DevConsoleProvider } from '../src/mail/providers/dev-console.provider';
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
  console.log('🧪 NETVISION RESEND HTTPS EMAIL API MIGRATION & NEST DI TEST SUITE');
  console.log('================================================================\n');
  let passedCount = 0;

  // --------------------------------------------------------------------------
  // TEST 1: NestJS Dependency Injection Resolution for EMAIL_PROVIDER & EmailService
  // --------------------------------------------------------------------------
  console.log('[TEST 1] NestJS Dependency Injection Resolution & Factory Verification');
  {
    const oldEmailProvider = process.env.EMAIL_PROVIDER;
    const oldResendApiKey = process.env.RESEND_API_KEY;
    const oldNodeEnv = process.env.NODE_ENV;

    process.env.NODE_ENV = 'development';
    process.env.EMAIL_PROVIDER = 'resend';
    process.env.RESEND_API_KEY = 're_test_key_di';

    try {
      const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [
              () => ({
                NODE_ENV: 'development',
                RESEND_API_KEY: 're_test_key_di',
                EMAIL_PROVIDER: 'resend',
              }),
            ],
          }),
          MailModule,
        ],
      }).compile();

      const emailService = moduleRef.get<EmailService>(EmailService);
      const emailProvider = moduleRef.get<EmailProvider>(EMAIL_PROVIDER);

      assert(emailService !== null && emailService !== undefined, 'EmailService resolved from Nest DI container');
      assert(emailProvider !== null && emailProvider !== undefined, 'EMAIL_PROVIDER token resolved from Nest DI container');
      assert(emailService.getActiveProviderName() === 'Resend (HTTPS API)', 'EmailService successfully delegates to injected ResendProvider');
      assert(emailService.isConfigured() === true, 'EmailService reports configured status');

      await moduleRef.close();
      console.log('  ✓ Passed: NestJS DI container resolves EmailService and EMAIL_PROVIDER token without Object/unknown errors');
      passedCount++;
    } finally {
      if (oldEmailProvider !== undefined) process.env.EMAIL_PROVIDER = oldEmailProvider;
      else delete process.env.EMAIL_PROVIDER;

      if (oldResendApiKey !== undefined) process.env.RESEND_API_KEY = oldResendApiKey;
      else delete process.env.RESEND_API_KEY;

      if (oldNodeEnv !== undefined) process.env.NODE_ENV = oldNodeEnv;
      else delete process.env.NODE_ENV;
    }
  }

  // --------------------------------------------------------------------------
  // TEST 2: EmailProviderFactory Selection Matrix
  // --------------------------------------------------------------------------
  console.log('\n[TEST 2] EmailProviderFactory Decision Matrix (Production, SMTP, Dev Fallback, Explicit)');
  {
    // 2a: Production -> ResendProvider
    const prodConfig = createMockConfigService({
      NODE_ENV: 'production',
      RESEND_API_KEY: 're_prod_factory_key',
      RESEND_FROM_EMAIL: 'NetVision <noreply@netvision.app>',
    });
    const prodProvider = emailProviderFactory.useFactory(prodConfig);
    assert(prodProvider instanceof ResendProvider, 'Production strictly creates ResendProvider');
    assert(prodProvider.isConfigured() === true, 'Production ResendProvider is configured');
    assert(prodProvider.name === 'Resend (HTTPS API)', 'Provider name identifies as Resend (HTTPS API)');

    // 2b: Production with missing key -> Unconfigured ResendProvider (NEVER SMTP)
    const prodMissingConfig = createMockConfigService({
      NODE_ENV: 'production',
      SMTP_HOST: 'smtp.render-blocked.com',
      SMTP_USER: 'user',
      SMTP_PASS: 'pass',
    });
    const prodMissingProvider = emailProviderFactory.useFactory(prodMissingConfig);
    assert(prodMissingProvider instanceof ResendProvider, 'Production with missing key still creates ResendProvider (NEVER SMTP)');
    assert(prodMissingProvider.isConfigured() === false, 'Production ResendProvider is unconfigured');

    // 2c: Development with SMTP -> SmtpProvider
    const devSmtpConfig = createMockConfigService({
      NODE_ENV: 'development',
      SMTP_HOST: 'smtp.mailtrap.io',
      SMTP_USER: 'smtp_user',
      SMTP_PASS: 'smtp_pass',
    });
    const devSmtpProvider = emailProviderFactory.useFactory(devSmtpConfig);
    assert(devSmtpProvider instanceof SmtpProvider, 'Development with SMTP credentials creates SmtpProvider');
    assert(devSmtpProvider.isConfigured() === true, 'Development SmtpProvider is configured');

    // 2d: Development unconfigured -> DevConsoleProvider
    const devUnconfConfig = createMockConfigService({
      NODE_ENV: 'development',
    });
    const devUnconfProvider = emailProviderFactory.useFactory(devUnconfConfig);
    assert(devUnconfProvider instanceof DevConsoleProvider, 'Unconfigured development creates DevConsoleProvider');
    assert(devUnconfProvider.isConfigured() === false, 'DevConsoleProvider is not configured');
    assert(devUnconfProvider.name === 'Development Console Fallback', 'Reports Development Console Fallback');

    // 2e: Development with RESEND_API_KEY but NO EMAIL_PROVIDER -> DevConsoleProvider (Safe default!)
    const devResendOnlyConfig = createMockConfigService({
      NODE_ENV: 'development',
      RESEND_API_KEY: 're_dev_key',
    });
    const devResendOnlyProvider = emailProviderFactory.useFactory(devResendOnlyConfig);
    assert(
      devResendOnlyProvider instanceof DevConsoleProvider,
      'Development with RESEND_API_KEY but no EMAIL_PROVIDER creates DevConsoleProvider (safe default)'
    );

    // 2f: Development with explicit EMAIL_PROVIDER=resend -> ResendProvider
    const devExplicitConfig = createMockConfigService({
      NODE_ENV: 'development',
      EMAIL_PROVIDER: 'resend',
      RESEND_API_KEY: 're_dev_explicit_key',
    });
    const devExplicitProvider = emailProviderFactory.useFactory(devExplicitConfig);
    assert(devExplicitProvider instanceof ResendProvider, 'Development with EMAIL_PROVIDER=resend creates ResendProvider');
    assert(devExplicitProvider.isConfigured() === true, 'Explicit ResendProvider is configured');

    console.log('  ✓ Passed: EmailProviderFactory accurately selects the correct provider across all environment configurations');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 3: ResendProvider Initialization with API Key & Custom Sender
  // --------------------------------------------------------------------------
  console.log('\n[TEST 3] ResendProvider Initialization with API Key & Custom Sender');
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
  // TEST 4: Missing RESEND_API_KEY Handling & Safe Failure
  // --------------------------------------------------------------------------
  console.log('\n[TEST 4] Missing RESEND_API_KEY Handling & Safe Failure');
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
  // TEST 5: Missing RESEND_FROM_EMAIL Safe Fallback & Custom Override
  // --------------------------------------------------------------------------
  console.log('\n[TEST 5] Missing RESEND_FROM_EMAIL Safe Fallback & Custom Override');
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

    // 5a: Omitted from email defaults to onboarding@resend.dev
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

    // 5b: Explicit custom sender from options
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
  // TEST 6: Successful Resend Email Dispatch (Mocked SDK)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 6] Successful Resend Email Dispatch (Mocked SDK)');
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
  // TEST 7: Resend API Error & Exception Handling
  // --------------------------------------------------------------------------
  console.log('\n[TEST 7] Resend API Error & Exception Handling');
  {
    // Case 7a: API returned error object
    const mockErrorClient = {
      emails: {
        send: async () => ({
          data: null,
          error: { message: 'Domain verification required', name: 'validation_error' },
        }),
      },
    } as unknown as Resend;

    const provider7a = new ResendProvider('re_dummy_key', undefined, mockErrorClient);
    const result7a = await provider7a.sendEmail({
      to: 'test@unverified.org',
      subject: 'Test',
      html: '<p>Test</p>',
    });

    assert(result7a.success === false, 'API error response must yield success: false');
    assert(result7a.error === 'Domain verification required', 'Error message must be preserved safely');

    // Case 7b: Network exception thrown
    const mockThrowClient = {
      emails: {
        send: async () => {
          throw new Error('Connection reset by peer');
        },
      },
    } as unknown as Resend;

    const provider7b = new ResendProvider('re_dummy_key', undefined, mockThrowClient);
    const result7b = await provider7b.sendEmail({
      to: 'test@unreachable.org',
      subject: 'Test',
      html: '<p>Test</p>',
    });

    assert(result7b.success === false, 'Thrown exception must yield success: false without crashing');
    assert(result7b.error === 'Connection reset by peer', 'Safe error message returned');
    console.log('  ✓ Passed: Resend API errors and network exceptions handled safely');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 8: Production Mode Exclusively Uses Resend & Blocks SMTP
  // --------------------------------------------------------------------------
  console.log('\n[TEST 8] Production Mode Exclusively Uses Resend & Blocks SMTP');
  {
    // 8a: Production with Resend configured
    const prodConfig = createMockConfigService({
      NODE_ENV: 'production',
      RESEND_API_KEY: 're_mock_prod_key',
      RESEND_FROM_EMAIL: 'NetVision <noreply@netvision.app>',
    });
    const prodProvider = emailProviderFactory.useFactory(prodConfig);
    const emailServiceProd = new EmailService(prodConfig, prodProvider);

    assert(emailServiceProd.isConfigured() === true, 'Production should be configured with Resend');
    assert(
      emailServiceProd.getActiveProviderName() === 'Resend (HTTPS API)',
      'Production provider MUST be Resend (HTTPS API), never SMTP'
    );
    assert(
      emailServiceProd.getMissingVariables().length === 0,
      'No missing variables when Resend key is configured'
    );

    // 8b: Production with missing RESEND_API_KEY (and SMTP variables present)
    const prodMissingKeyConfig = createMockConfigService({
      NODE_ENV: 'production',
      SMTP_HOST: 'smtp.blocked-render-port.com',
      SMTP_PORT: 587,
      SMTP_USER: 'smtp_user',
      SMTP_PASS: 'smtp_secret',
    });
    const prodMissingProvider = emailProviderFactory.useFactory(prodMissingKeyConfig);
    const emailServiceProdMissing = new EmailService(prodMissingKeyConfig, prodMissingProvider);

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
  // TEST 9: Development Mode Uses SMTP When Configured
  // --------------------------------------------------------------------------
  console.log('\n[TEST 9] Development Mode Uses SMTP When Configured');
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
  // TEST 10: Development Mode Falls Back Safely to DevConsoleProvider
  // --------------------------------------------------------------------------
  console.log('\n[TEST 10] Development Mode Falls Back Safely to DevConsoleProvider When SMTP is Absent');
  {
    const devFallbackConfig = createMockConfigService({
      NODE_ENV: 'development',
    });
    const fallbackProvider = emailProviderFactory.useFactory(devFallbackConfig);
    const emailServiceDevFallback = new EmailService(devFallbackConfig, fallbackProvider);

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

    console.log('  ✓ Passed: Development mode safely falls back to console provider without sending real emails');
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
    const prodProv = emailProviderFactory.useFactory(prodConfig);
    const statusProd = new EmailService(prodConfig, prodProv).getProviderStatus();
    assert(statusProd.provider === 'resend', 'Provider should be resend');
    assert(statusProd.configured === true, 'Configured should be true');
    assert(statusProd.missing === undefined, 'No missing variables in status');

    // 11b: Production unconfigured
    const prodUnconf = createMockConfigService({ NODE_ENV: 'production' });
    const prodUnconfProv = emailProviderFactory.useFactory(prodUnconf);
    const statusProdUnconf = new EmailService(prodUnconf, prodUnconfProv).getProviderStatus();
    assert(statusProdUnconf.provider === 'resend', 'Provider should be resend');
    assert(statusProdUnconf.configured === false, 'Configured should be false');
    assert(
      Array.isArray(statusProdUnconf.missing) && statusProdUnconf.missing.includes('RESEND_API_KEY'),
      'Missing RESEND_API_KEY reported'
    );

    // 11c: Development fallback
    const devUnconf = createMockConfigService({ NODE_ENV: 'development' });
    const devUnconfProv = emailProviderFactory.useFactory(devUnconf);
    const statusDev = new EmailService(devUnconf, devUnconfProv).getProviderStatus();
    assert(statusDev.provider === 'console_fallback', 'Provider should be console_fallback');
    assert(statusDev.configured === false, 'Configured should be false');

    // 11d: Development with SMTP
    const devSmtp = createMockConfigService({
      NODE_ENV: 'development',
      SMTP_HOST: 'smtp.gmail.com',
      SMTP_USER: 'user',
      SMTP_PASS: 'pass',
    });
    const devSmtpProv = emailProviderFactory.useFactory(devSmtp);
    const statusDevSmtp = new EmailService(devSmtp, devSmtpProv).getProviderStatus();
    assert(statusDevSmtp.provider === 'smtp', 'Provider should be smtp');
    assert(statusDevSmtp.configured === true, 'Configured should be true');

    // 11e: Development explicit resend
    const devExplicit = createMockConfigService({
      NODE_ENV: 'development',
      EMAIL_PROVIDER: 'resend',
      RESEND_API_KEY: 're_dev_key',
    });
    const devExplicitProv = emailProviderFactory.useFactory(devExplicit);
    const statusDevExplicit = new EmailService(devExplicit, devExplicitProv).getProviderStatus();
    assert(statusDevExplicit.provider === 'resend', 'Provider should be resend');
    assert(statusDevExplicit.configured === true, 'Configured should be true');

    console.log('  ✓ Passed: getProviderStatus() returns accurate, safe diagnostic metadata across all modes');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 12: Security & Sanitization: No Secrets in Logs, Errors, or Diagnostics
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
    const prov = emailProviderFactory.useFactory(prodConfig);
    const emailService = new EmailService(prodConfig, prov);
    const status = emailService.getProviderStatus();
    const statusStr = JSON.stringify(status);

    assert(!statusStr.includes(SECRET_KEY), 'Status output must NOT leak RESEND_API_KEY');
    assert(!statusStr.includes(SECRET_PASS), 'Status output must NOT leak SMTP password');

    // Test error response sanitization
    const unconfProdConfig = createMockConfigService({ NODE_ENV: 'production' });
    const unconfProv = emailProviderFactory.useFactory(unconfProdConfig);
    const unconfProd = new EmailService(unconfProdConfig, unconfProv);

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
    const mockProvider: EmailProvider = {
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

  // --------------------------------------------------------------------------
  // TEST 14: Full Nest Application Context Bootstrap (Production E2E DI Validation)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 14] Full Nest Application Bootstrap & MailModule DI Context');
  {
    const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
    const resolvedEmailService = app.get(EmailService);
    const resolvedProvider = app.get<EmailProvider>(EMAIL_PROVIDER);

    assert(resolvedEmailService instanceof EmailService, 'EmailService instantiated by full NestJS application');
    assert(resolvedProvider !== undefined && resolvedProvider !== null, 'EMAIL_PROVIDER resolved by full NestJS application');
    assert(typeof resolvedEmailService.getActiveProviderName() === 'string', 'EmailService has active provider');

    await app.close();
    console.log('  ✓ Passed: Nest Application bootstraps cleanly without dependency injection errors');
    passedCount++;
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedCount} EMAIL MIGRATION, NEST DI & BOOTSTRAP TESTS PASSED!`);
  console.log('================================================================\n');
}

runEmailTestSuite().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
