import { Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailProvider, EmailDeliveryResult, SendEmailOptions } from '../interfaces/email-provider.interface';

export class ResendProvider implements EmailProvider {
  public readonly name = 'Resend (HTTPS API)';
  private readonly logger = new Logger(ResendProvider.name);
  private resendClient: Resend | null = null;
  private readonly defaultFrom: string;
  private readonly apiKeyConfigured: boolean;

  constructor(apiKey?: string, defaultFrom?: string, clientOverride?: Resend) {
    this.defaultFrom = defaultFrom?.trim() || 'NetVision <onboarding@resend.dev>';
    this.apiKeyConfigured = !!(apiKey && apiKey.trim().length > 0);

    if (clientOverride) {
      this.resendClient = clientOverride;
      this.logger.log(`Resend HTTPS Email client initialized with injected instance (From: ${this.defaultFrom})`);
    } else if (this.apiKeyConfigured) {
      this.resendClient = new Resend(apiKey!.trim());
      this.logger.log(`Resend HTTPS Email client initialized (From: ${this.defaultFrom})`);
    } else {
      this.logger.warn(
        `⚠️ WARNING: RESEND_API_KEY is not configured in environment. Outbound HTTPS emails will fail.`
      );
    }
  }

  public isConfigured(): boolean {
    return !!this.resendClient;
  }

  public getDefaultFrom(): string {
    return this.defaultFrom;
  }

  public getMissingVariables(): string[] {
    const missing: string[] = [];
    if (!this.resendClient) {
      missing.push('RESEND_API_KEY');
    }
    return missing;
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailDeliveryResult> {
    if (!this.resendClient) {
      this.logger.error(`❌ Resend delivery failure: RESEND_API_KEY is not configured.`);
      return {
        success: false,
        error: 'Resend API key not configured. Set RESEND_API_KEY environment variable.',
      };
    }

    const from = options.from || this.defaultFrom;
    const recipient = options.to;

    try {
      const response = await this.resendClient.emails.send({
        from,
        to: recipient,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (response.error) {
        const errorMsg = response.error.message || 'Resend API returned an error';
        this.logger.error(
          `❌ Resend HTTPS API delivery failure for recipient domain [${this.extractDomain(recipient)}]: ${errorMsg}`
        );
        return {
          success: false,
          error: errorMsg,
        };
      }

      const messageId = response.data?.id;
      this.logger.log(
        `✓ Email successfully dispatched via Resend HTTPS API to recipient domain [${this.extractDomain(recipient)}] (ID: ${messageId})`
      );
      return {
        success: true,
        messageId,
      };
    } catch (err: any) {
      const safeErrorMsg = err?.message || 'Unknown network error communicating with Resend HTTPS API';
      this.logger.error(
        `❌ Unexpected error during Resend HTTPS API call for recipient domain [${this.extractDomain(recipient)}]: ${safeErrorMsg}`
      );
      return {
        success: false,
        error: safeErrorMsg,
      };
    }
  }

  private extractDomain(email: string): string {
    const parts = email.split('@');
    return parts.length > 1 ? `@${parts[1]}` : 'unknown';
  }
}
