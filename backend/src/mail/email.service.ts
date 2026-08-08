import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: this.configService.get<string>('SMTP_REJECT_UNAUTHORIZED', 'true') === 'true',
        },
      });
      this.logger.log(`SMTP Transport initialized for host: ${smtpHost}:${smtpPort} (User: ${smtpUser})`);
    } else {
      this.logger.warn(
        `⚠️ WARNING: SMTP credentials NOT configured in backend/.env (Missing SMTP_HOST, SMTP_USER, or SMTP_PASS). Emails will NOT reach real inboxes!`
      );
    }
  }

  public isConfigured(): boolean {
    return !!this.transporter;
  }

  public getMissingVariables(): string[] {
    const missing: string[] = [];
    if (!this.configService.get<string>('SMTP_HOST')) missing.push('SMTP_HOST');
    if (!this.configService.get<string>('SMTP_USER')) missing.push('SMTP_USER');
    if (!this.configService.get<string>('SMTP_PASS')) missing.push('SMTP_PASS');
    return missing;
  }

  async sendVerificationOtp(toEmail: string, otp: string): Promise<EmailDeliveryResult> {
    const fromAddress = this.configService.get<string>('SMTP_FROM', '"NetVision Platform" <no-reply@netvision.edu>');

    if (!this.transporter) {
      this.logDevFallback(toEmail, otp, 'VERIFICATION OTP');
      return {
        success: false,
        error: 'SMTP email provider not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in backend/.env',
      };
    }

    try {
      const info = await this.transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject: 'NetVision — 6-Digit Email Verification Code',
        text: `Your NetVision email verification OTP code is: ${otp}. This code will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 24px; border-radius: 16px;">
            <h2 style="color: #00f0ff;">NetVision Account Verification</h2>
            <p style="color: #a1a1aa; font-size: 14px;">Thank you for registering. Use the 6-digit OTP code below to verify your email address:</p>
            <div style="background-color: #121217; border: 1px solid #00f0ff; color: #00f0ff; font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 16px; text-align: center; border-radius: 12px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #71717a; font-size: 12px;">This single-use code expires in 10 minutes. If you did not request this code, please ignore this email.</p>
          </div>
        `,
      });

      this.logger.log(`✓ Verification OTP email successfully delivered via SMTP to ${toEmail} (MsgID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      this.logger.error(`❌ SMTP delivery failure sending OTP to ${toEmail}: ${err.message}`, err.stack);
      return { success: false, error: err.message };
    }
  }

  async sendPasswordResetLink(toEmail: string, resetToken: string): Promise<EmailDeliveryResult> {
    const fromAddress = this.configService.get<string>('SMTP_FROM', '"NetVision Platform" <no-reply@netvision.edu>');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    if (!this.transporter) {
      this.logDevFallback(toEmail, resetUrl, 'PASSWORD RESET LINK');
      return {
        success: false,
        error: 'SMTP email provider not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in backend/.env',
      };
    }

    try {
      const info = await this.transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject: 'NetVision — Password Reset Request',
        text: `Click the following link to reset your NetVision password: ${resetUrl}. This link expires in 15 minutes.`,
        html: `
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
        `,
      });

      this.logger.log(`✓ Password reset email successfully delivered via SMTP to ${toEmail} (MsgID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      this.logger.error(`❌ SMTP delivery failure sending reset link to ${toEmail}: ${err.message}`, err.stack);
      return { success: false, error: err.message };
    }
  }

  async sendTestEmail(toEmail: string): Promise<EmailDeliveryResult> {
    const fromAddress = this.configService.get<string>('SMTP_FROM', '"NetVision Test" <no-reply@netvision.edu>');

    if (!this.transporter) {
      const missing = this.getMissingVariables().join(', ');
      return {
        success: false,
        error: `Cannot send test email. Missing environment variables: ${missing}`,
      };
    }

    try {
      const info = await this.transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject: 'NetVision SMTP Test Email',
        text: 'This is a test email sent from your NetVision platform backend to verify real SMTP email delivery.',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 24px; border-radius: 16px;">
            <h2 style="color: #00f0ff;">NetVision SMTP Connection Test</h2>
            <p style="color: #34d399; font-weight: bold;">✓ Email delivery successful!</p>
            <p style="color: #a1a1aa; font-size: 14px;">Your NetVision backend is correctly connected to your SMTP provider and delivering real emails to external inboxes.</p>
          </div>
        `,
      });

      this.logger.log(`✓ Test email delivered to ${toEmail} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      this.logger.error(`❌ Test email delivery failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  private logDevFallback(toEmail: string, payload: string, type: string) {
    this.logger.warn(`==================================================`);
    this.logger.warn(`📧 [EMAIL SERVICE - DEVELOPMENT CONSOLE FALLBACK]`);
    this.logger.warn(`REASON: SMTP Provider Not Configured in backend/.env`);
    this.logger.warn(`TYPE: ${type}`);
    this.logger.warn(`TO: ${toEmail}`);
    this.logger.warn(`PAYLOAD: ${payload}`);
    this.logger.warn(`==================================================`);
  }
}
