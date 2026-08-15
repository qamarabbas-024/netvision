import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EmailProvider,
  EmailDeliveryResult,
  EmailProviderStatus,
  EMAIL_PROVIDER,
} from './interfaces/email-provider.interface';
import { ResendProvider } from './providers/resend.provider';
import { SmtpProvider } from './providers/smtp.provider';

export { EmailDeliveryResult, EmailProviderStatus, EMAIL_PROVIDER } from './interfaces/email-provider.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,
    @Inject(EMAIL_PROVIDER)
    private readonly provider: EmailProvider
  ) {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    this.isProduction = nodeEnv === 'production';
    this.logger.log(
      `EmailService initialized with provider: ${this.provider.name} (Configured: ${this.provider.isConfigured()})`
    );
  }

  public isConfigured(): boolean {
    return this.provider.isConfigured();
  }

  public getActiveProviderName(): string {
    return this.provider.name;
  }

  public getMissingVariables(): string[] {
    if (this.isProduction) {
      const missing: string[] = [];
      if (!this.configService.get<string>('RESEND_API_KEY')) missing.push('RESEND_API_KEY');
      return missing;
    }

    const explicitProvider = this.configService.get<string>('EMAIL_PROVIDER')?.trim().toLowerCase();
    if (explicitProvider === 'resend') {
      const missing: string[] = [];
      if (!this.configService.get<string>('RESEND_API_KEY')) missing.push('RESEND_API_KEY');
      return missing;
    }

    return this.provider.getMissingVariables();
  }

  public getProviderStatus(): EmailProviderStatus {
    const isConfigured = this.isConfigured();
    let providerName = 'console_fallback';

    if (this.isProduction) {
      providerName = 'resend';
    } else {
      const explicitProvider = this.configService.get<string>('EMAIL_PROVIDER')?.trim().toLowerCase();
      if (explicitProvider === 'resend') {
        providerName = 'resend';
      } else if (this.provider instanceof SmtpProvider || explicitProvider === 'smtp') {
        providerName = 'smtp';
      } else if (this.provider instanceof ResendProvider) {
        providerName = 'resend';
      } else if (this.provider.name.toLowerCase().includes('resend')) {
        providerName = 'resend';
      } else if (this.provider.name.toLowerCase().includes('smtp')) {
        providerName = 'smtp';
      }
    }

    const missing = this.getMissingVariables();

    if (isConfigured || missing.length === 0) {
      return {
        provider: providerName,
        configured: isConfigured,
      };
    }

    return {
      provider: providerName,
      configured: isConfigured,
      missing,
    };
  }

  async sendVerificationOtp(toEmail: string, otp: string): Promise<EmailDeliveryResult> {
    if (!this.provider.isConfigured()) {
      if (!this.isProduction) {
        this.logDevFallback(toEmail, otp, 'VERIFICATION OTP');
      }
      return {
        success: false,
        error: this.isProduction
          ? 'Email provider not configured. RESEND_API_KEY is required in production.'
          : 'Email provider not configured. Set RESEND_API_KEY or SMTP credentials in backend/.env',
      };
    }

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 24px; border-radius: 16px;">
        <h2 style="color: #00f0ff;">NetVision Account Verification</h2>
        <p style="color: #a1a1aa; font-size: 14px;">Thank you for registering. Use the 6-digit OTP code below to verify your email address:</p>
        <div style="background-color: #121217; border: 1px solid #00f0ff; color: #00f0ff; font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 16px; text-align: center; border-radius: 12px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #71717a; font-size: 12px;">This single-use code expires in 10 minutes. If you did not request this code, please ignore this email.</p>
      </div>
    `;

    const text = `Your NetVision email verification OTP code is: ${otp}. This code will expire in 10 minutes.`;

    return this.provider.sendEmail({
      to: toEmail,
      subject: 'NetVision — 6-Digit Email Verification Code',
      text,
      html,
    });
  }

  async sendPasswordResetLink(toEmail: string, resetToken: string): Promise<EmailDeliveryResult> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    if (!this.provider.isConfigured()) {
      if (!this.isProduction) {
        this.logDevFallback(toEmail, resetUrl, 'PASSWORD RESET LINK');
      }
      return {
        success: false,
        error: this.isProduction
          ? 'Email provider not configured. RESEND_API_KEY is required in production.'
          : 'Email provider not configured. Set RESEND_API_KEY or SMTP credentials in backend/.env',
      };
    }

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 24px; border-radius: 16px;">
        <h2 style="color: #00f0ff;">NetVision Password Reset</h2>
        <p style="color: #a1a1aa; font-size: 14px;">We received a request to reset your password. Click the button below to complete the reset:</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #00f0ff; color: #000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Reset Password Now
          </a>
        </div>
        <p style="color: #71717a; font-size: 12px;">Link: ${resetUrl}</p>
        <p style="color: #71717a; font-size: 12px;">This link will expire in 15 minutes. If you did not request a password reset, your account is safe.</p>
      </div>
    `;

    const text = `Click the following link to reset your NetVision password: ${resetUrl}. This link expires in 15 minutes.`;

    return this.provider.sendEmail({
      to: toEmail,
      subject: 'NetVision — Password Reset Request',
      text,
      html,
    });
  }

  async sendTestEmail(toEmail: string): Promise<EmailDeliveryResult> {
    if (!this.provider.isConfigured()) {
      const missing = this.getMissingVariables().join(', ');
      return {
        success: false,
        error: `Cannot send test email. Missing environment variables: ${missing}`,
      };
    }

    const providerName = this.getActiveProviderName();
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 24px; border-radius: 16px;">
        <h2 style="color: #00f0ff;">NetVision Email Delivery Test</h2>
        <p style="color: #34d399; font-weight: bold;">✓ Email delivery successful!</p>
        <p style="color: #a1a1aa; font-size: 14px;">Your NetVision backend is correctly connected to your email provider (${providerName}) and delivering real emails.</p>
      </div>
    `;

    const text = `This is a test email sent from your NetVision platform backend to verify email delivery via ${providerName}.`;

    return this.provider.sendEmail({
      to: toEmail,
      subject: `NetVision Email Delivery Test (${providerName})`,
      text,
      html,
    });
  }

  private logDevFallback(toEmail: string, payload: string, type: string) {
    this.logger.warn(`==================================================`);
    this.logger.warn(`📧 [EMAIL SERVICE - DEVELOPMENT CONSOLE FALLBACK]`);
    this.logger.warn(`REASON: Email Provider Not Configured in backend/.env`);
    this.logger.warn(`TYPE: ${type}`);
    this.logger.warn(`TO: ${toEmail}`);
    this.logger.warn(`PAYLOAD: ${payload}`);
    this.logger.warn(`==================================================`);
  }
}
