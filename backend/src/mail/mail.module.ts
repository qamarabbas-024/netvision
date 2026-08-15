import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { EMAIL_PROVIDER } from './interfaces/email-provider.interface';
import { ResendProvider } from './providers/resend.provider';
import { SmtpProvider } from './providers/smtp.provider';
import { DevConsoleProvider } from './providers/dev-console.provider';

export const emailProviderFactory = {
  provide: EMAIL_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');
    const isProduction = nodeEnv === 'production';

    if (isProduction) {
      // Production on Render Free: HTTPS API via Resend ONLY (SMTP ports 25, 465, 587 are blocked)
      // Production must NEVER initialize or attempt SMTP.
      const resendApiKey = configService.get<string>('RESEND_API_KEY');
      const resendFromEmail = configService.get<string>(
        'RESEND_FROM_EMAIL',
        'NetVision <onboarding@resend.dev>'
      );
      return new ResendProvider(resendApiKey, resendFromEmail);
    }

    // Non-production (development / test):
    const explicitProvider = configService.get<string>('EMAIL_PROVIDER')?.trim().toLowerCase();

    if (explicitProvider === 'resend') {
      const resendApiKey = configService.get<string>('RESEND_API_KEY');
      const resendFromEmail = configService.get<string>(
        'RESEND_FROM_EMAIL',
        'NetVision <onboarding@resend.dev>'
      );
      return new ResendProvider(resendApiKey, resendFromEmail);
    }

    // Default development/test behavior:
    // 1. If SMTP is configured -> SmtpProvider
    // 2. Otherwise -> DevConsoleProvider (safe fallback without sending real emails)
    const smtpHost = configService.get<string>('SMTP_HOST');
    const smtpUser = configService.get<string>('SMTP_USER');
    const smtpPass = configService.get<string>('SMTP_PASS');
    const smtpPort = configService.get<number>('SMTP_PORT', 587);
    const smtpFrom = configService.get<string>(
      'SMTP_FROM',
      '"NetVision Platform" <no-reply@netvision.edu>'
    );
    const smtpRejectUnauthorized =
      configService.get<string>('SMTP_REJECT_UNAUTHORIZED', 'true') === 'true';

    if (explicitProvider === 'smtp' || (smtpHost && smtpUser && smtpPass)) {
      return new SmtpProvider({
        host: smtpHost,
        port: Number(smtpPort),
        user: smtpUser,
        pass: smtpPass,
        from: smtpFrom,
        rejectUnauthorized: smtpRejectUnauthorized,
      });
    }

    return new DevConsoleProvider();
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [emailProviderFactory, EmailService],
  exports: [EmailService, EMAIL_PROVIDER],
})
export class MailModule {}
