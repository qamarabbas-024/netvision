import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailProvider, EmailDeliveryResult, SendEmailOptions } from '../interfaces/email-provider.interface';

export interface SmtpConfigOptions {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  from?: string;
  rejectUnauthorized?: boolean;
}

export class SmtpProvider implements EmailProvider {
  public readonly name = 'SMTP Transport';
  private readonly logger = new Logger(SmtpProvider.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly defaultFrom: string;
  private readonly missingVars: string[] = [];

  constructor(config: SmtpConfigOptions, transporterOverride?: nodemailer.Transporter) {
    this.defaultFrom = config.from || '"NetVision Platform" <no-reply@netvision.edu>';

    if (!config.host) this.missingVars.push('SMTP_HOST');
    if (!config.user) this.missingVars.push('SMTP_USER');
    if (!config.pass) this.missingVars.push('SMTP_PASS');

    if (transporterOverride) {
      this.transporter = transporterOverride;
      this.logger.log(`SMTP Transport initialized with injected transporter (From: ${this.defaultFrom})`);
    } else if (config.host && config.user && config.pass) {
      const port = Number(config.port) || 587;
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port,
        secure: port === 465,
        auth: {
          user: config.user,
          pass: config.pass,
        },
        tls: {
          rejectUnauthorized: config.rejectUnauthorized ?? true,
        },
      });
      this.logger.log(`SMTP Transport initialized for host: ${config.host}:${port} (User: ${config.user})`);
    } else {
      this.logger.warn(
        `⚠️ WARNING: SMTP credentials incomplete (Missing: ${this.missingVars.join(', ')}). SMTP transport inactive.`
      );
    }
  }

  public isConfigured(): boolean {
    return !!this.transporter;
  }

  public getMissingVariables(): string[] {
    return [...this.missingVars];
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailDeliveryResult> {
    if (!this.transporter) {
      return {
        success: false,
        error: `SMTP transport not configured. Missing environment variables: ${this.missingVars.join(', ')}`,
      };
    }

    const from = options.from || this.defaultFrom;

    try {
      const info = await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      this.logger.log(`✓ Email successfully delivered via SMTP to ${options.to} (MsgID: ${info.messageId})`);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (err: any) {
      this.logger.error(`❌ SMTP delivery failure sending to ${options.to}: ${err.message}`, err.stack);
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
