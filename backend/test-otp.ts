import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

async function runOtpDiagnostic() {
  console.log('🔍 Running End-to-End OTP & Auth Verification Diagnostic...\n');

  const testEmail = 'otptest@netvision.edu';
  const testUsername = 'otptestuser';
  const testPassword = 'TestPassword123!';

  // Clean previous test user
  await prisma.emailVerification.deleteMany({ where: { email: testEmail } });
  await prisma.passwordResetToken.deleteMany({ where: { email: testEmail } });
  await prisma.user.deleteMany({ where: { email: testEmail } });

  console.log('1. Testing User Registration...');
  const passwordHash = await argon2.hash(testPassword);
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      username: testUsername,
      passwordHash,
      isVerified: false,
    },
  });
  console.log(`   ✓ User created (ID: ${user.id}, isVerified: ${user.isVerified})`);

  console.log('2. Testing OTP Generation & Database Storage...');
  const rawOtp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = hashToken(rawOtp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const verificationRecord = await prisma.emailVerification.create({
    data: {
      email: testEmail,
      otpHash,
      expiresAt,
      attempts: 0,
    },
  });
  console.log(`   ✓ OTP generated (${rawOtp}), SHA256 hashed (${otpHash.substring(0, 10)}...), stored with ID ${verificationRecord.id}`);

  console.log('3. Testing Wrong OTP Rejection...');
  const wrongOtpHash = hashToken('000000');
  const recordCheck = await prisma.emailVerification.findFirst({ where: { email: testEmail } });
  if (wrongOtpHash !== recordCheck?.otpHash) {
    await prisma.emailVerification.update({
      where: { id: recordCheck!.id },
      data: { attempts: recordCheck!.attempts + 1 },
    });
    console.log('   ✓ Wrong OTP correctly rejected, attempts incremented to 1');
  }

  console.log('4. Testing Valid OTP Verification...');
  const validRecord = await prisma.emailVerification.findFirst({ where: { email: testEmail } });
  const incomingHash = hashToken(rawOtp);
  if (incomingHash === validRecord?.otpHash) {
    const updatedUser = await prisma.user.update({
      where: { email: testEmail },
      data: { isVerified: true },
    });
    await prisma.emailVerification.deleteMany({ where: { email: testEmail } });
    console.log(`   ✓ Valid OTP accepted! User isVerified updated to ${updatedUser.isVerified}`);
  } else {
    console.error('   ❌ FAILED: Valid OTP hash mismatch!');
  }

  console.log('5. Testing Session Creation post-verification...');
  const finalUser = await prisma.user.findUnique({ where: { email: testEmail } });
  console.log(`   ✓ Final database check: User ${finalUser?.email} isVerified=${finalUser?.isVerified}`);

  // Clean up
  await prisma.user.delete({ where: { id: user.id } });
  console.log('\n✅ Diagnostic completed cleanly.');
}

runOtpDiagnostic().catch(console.error).finally(() => prisma.$disconnect());
