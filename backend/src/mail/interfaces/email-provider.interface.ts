export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface EmailProvider {
  readonly name: string;
  isConfigured(): boolean;
  getMissingVariables(): string[];
  sendEmail(options: SendEmailOptions): Promise<EmailDeliveryResult>;
}

export interface EmailProviderStatus {
  provider: string;
  configured: boolean;
  missing?: string[];
}

export const EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER');

