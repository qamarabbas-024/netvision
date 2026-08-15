import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { EmailService } from '../src/mail/email.service';

async function main() {
  const targetEmail = process.argv[2];

  console.log('📧 NetVision Email Delivery Verification Tool\n');

  if (!targetEmail) {
    console.error('❌ Error: Please specify a recipient email address.');
    console.log('Usage: npx ts-node scripts/test-email.ts recipient@example.com');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const emailService = app.get(EmailService);

  const activeProvider = emailService.getActiveProviderName();
  console.log(`Active Provider: ${activeProvider}`);

  if (!emailService.isConfigured()) {
    const missing = emailService.getMissingVariables();
    console.error(`\n❌ ERROR: Email delivery is disabled because required environment variables are missing.`);
    console.error(`Missing variables: ${missing.join(', ')}`);
    console.log('\nTo configure email delivery:');
    console.log('1. Open backend/.env');
    console.log('2. In Production (Render Free):');
    console.log('   RESEND_API_KEY=re_your_api_key');
    console.log('   RESEND_FROM_EMAIL="NetVision <onboarding@resend.dev>" (or your verified domain)');
    console.log('3. In Local Development (optional SMTP or explicit Resend):');
    console.log('   EMAIL_PROVIDER=resend (to test Resend locally)');
    console.log('   OR:');
    console.log('   SMTP_HOST=smtp.gmail.com');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_USER=your_user');
    console.log('   SMTP_PASS=your_pass\n');
    await app.close();
    process.exit(1);
  }

  console.log(`Sending test email to: ${targetEmail} via ${activeProvider}...`);
  const result = await emailService.sendTestEmail(targetEmail);

  if (result.success) {
    console.log(`\n🎉 SUCCESS! Test email was delivered successfully via ${activeProvider}.`);
    console.log(`Message ID: ${result.messageId}`);
    console.log(`Please check your inbox at ${targetEmail}.`);
  } else {
    console.error(`\n❌ DELIVERY FAILED: ${result.error}`);
    console.error(`Please verify your ${activeProvider} credentials and settings.`);
  }

  await app.close();
}

main().catch(console.error);
