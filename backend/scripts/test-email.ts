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

  console.log(`Checking SMTP Configuration...`);
  if (!emailService.isConfigured()) {
    const missing = emailService.getMissingVariables();
    console.error(`\n❌ ERROR: Real email delivery is disabled because backend/.env is missing SMTP environment variables.`);
    console.error(`Missing variables: ${missing.join(', ')}`);
    console.log('\nTo configure email delivery:');
    console.log('1. Open backend/.env');
    console.log('2. Add your SMTP provider credentials:');
    console.log('   SMTP_HOST=smtp.gmail.com (or smtp.resend.com / smtp.sendgrid.net)');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_USER=your_email_or_username');
    console.log('   SMTP_PASS=your_app_password_or_api_key');
    console.log('   SMTP_FROM="NetVision Platform" <no-reply@yourdomain.com>\n');
    await app.close();
    process.exit(1);
  }

  console.log(`Sending test email to: ${targetEmail}...`);
  const result = await emailService.sendTestEmail(targetEmail);

  if (result.success) {
    console.log(`\n🎉 SUCCESS! Real test email was delivered successfully.`);
    console.log(`Message ID: ${result.messageId}`);
    console.log(`Please check your inbox at ${targetEmail}.`);
  } else {
    console.error(`\n❌ DELIVERY FAILED: ${result.error}`);
    console.error(`Please check your SMTP credentials, port, and provider security settings.`);
  }

  await app.close();
}

main().catch(console.error);
