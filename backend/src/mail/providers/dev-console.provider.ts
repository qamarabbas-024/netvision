import { Logger } from '@nestjs/common';
import { EmailProvider, EmailDeliveryResult, SendEmailOptions } from '../interfaces/email-provider.interface';

export class DevConsoleProvider implements EmailProvider {
  public readonly name = 'Development Console Fallback';
  private readonly logger = new Logger(DevConsoleProvider.name);

  public isConfigured(): boolean {
    return false;
  }

  public getMissingVariables(): string[] {
    return ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailDeliveryResult> {
    this.logger.warn(`==================================================`);
    this.logger.warn(`📧 [EMAIL SERVICE - DEVELOPMENT CONSOLE FALLBACK]`);
    this.logger.warn(`REASON: Email Provider Not Configured in backend/.env`);
    this.logger.warn(`TO: ${options.to}`);
    this.logger.warn(`SUBJECT: ${options.subject}`);
    this.logger.warn(`TEXT: ${options.text || '(HTML only)'}`);
    this.logger.warn(`==================================================`);

    return {
      success: false,
      error: 'Email provider not configured. Set RESEND_API_KEY or SMTP credentials in backend/.env',
    };
  }
}
