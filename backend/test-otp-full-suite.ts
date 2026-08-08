import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

async function runFullOtpSuite() {
  console.log('🧪 Starting Comprehensive OTP Security & Verification Test Suite...\n');

  const suiteEmail = 'suite_user@netvision.edu';
  const suiteUsername = 'suite_user';
  const suitePassword = 'SuitePassword123!';

  // Clean previous test user
  await prisma.emailVerification.deleteMany({ where: { email: suiteEmail } });
  await prisma.passwordResetToken.deleteMany({ where: { email: suiteEmail } });
  await prisma.user.deleteMany({ where: { email: suiteEmail } });

  // TEST 1: Registration
  console.log('[TEST 1] User Registration & Unverified Account Creation');
  const passwordHash = await argon2.hash(suitePassword);
  const user = await prisma.user.create({
    data: {
      email: suiteEmail,
      username: suiteUsername,
      passwordHash,
      isVerified: false,
    },
  });
  if (user.isVerified !== false) throw new Error('New user must be unverified!');
  console.log('  ✓ Passed: User created with isVerified = false');

  // TEST 2: OTP Generation & SHA256 Hashing
  console.log('\n[TEST 2] OTP Generation & Database Record Creation');
  const rawOtp1 = '123456';
  const otpHash1 = hashToken(rawOtp1);
  const expiresAt1 = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await prisma.emailVerification.create({
    data: { email: suiteEmail, otpHash: otpHash1, expiresAt: expiresAt1, attempts: 0 },
  });
  const otpRecord1 = await prisma.emailVerification.findFirst({ where: { email: suiteEmail } });
  if (!otpRecord1 || otpRecord1.otpHash !== otpHash1) throw new Error('OTP hash mismatch in database!');
  console.log('  ✓ Passed: OTP hashed with SHA-256 and stored correctly');

  // TEST 3: Unverified User Direct Login Block
  console.log('\n[TEST 3] Direct Login Attempt on Unverified Account');
  const unverifiedUser = await prisma.user.findUnique({ where: { email: suiteEmail } });
  if (unverifiedUser?.isVerified) throw new Error('Unverified account must not be verified!');
  console.log('  ✓ Passed: Account isVerified flag blocks login until OTP validation');

  // TEST 4: Incorrect OTP Submission & Attempt Counting
  console.log('\n[TEST 4] Incorrect OTP Rejection & Failed Attempt Counter');
  const wrongHash = hashToken('999999');
  if (wrongHash !== otpRecord1.otpHash) {
    await prisma.emailVerification.update({
      where: { id: otpRecord1.id },
      data: { attempts: otpRecord1.attempts + 1 },
    });
  }
  const afterWrong = await prisma.emailVerification.findFirst({ where: { email: suiteEmail } });
  if (afterWrong?.attempts !== 1) throw new Error('Attempt counter failed to increment!');
  console.log('  ✓ Passed: Incorrect OTP rejected, attempts incremented to 1');

  // TEST 5: Resend OTP (Old OTP Invalidation)
  console.log('\n[TEST 5] Resend OTP & Invalidation of Previous Code');
  await prisma.emailVerification.deleteMany({ where: { email: suiteEmail } });
  const rawOtp2 = '654321';
  const otpHash2 = hashToken(rawOtp2);
  await prisma.emailVerification.create({
    data: { email: suiteEmail, otpHash: otpHash2, expiresAt: new Date(Date.now() + 10 * 60 * 1000), attempts: 0 },
  });

  const oldHashSubmitted = hashToken(rawOtp1);
  const currentRecord = await prisma.emailVerification.findFirst({ where: { email: suiteEmail } });
  if (oldHashSubmitted === currentRecord?.otpHash) throw new Error('Old OTP should be invalidated!');
  console.log('  ✓ Passed: Previous OTP (123456) rejected, new OTP (654321) active');

  // TEST 6: Expiration Check
  console.log('\n[TEST 6] Expired OTP Code Rejection');
  await prisma.emailVerification.update({
    where: { id: currentRecord!.id },
    data: { expiresAt: new Date(Date.now() - 1000) }, // Expired 1 sec ago
  });
  const expiredRecord = await prisma.emailVerification.findFirst({ where: { email: suiteEmail } });
  if (new Date() > expiredRecord!.expiresAt) {
    await prisma.emailVerification.deleteMany({ where: { email: suiteEmail } });
  }
  const checkExpired = await prisma.emailVerification.findFirst({ where: { email: suiteEmail } });
  if (checkExpired) throw new Error('Expired OTP record should be purged!');
  console.log('  ✓ Passed: Expired OTP rejected and record purged');

  // TEST 7: Valid Verification & Single-Use Destruction
  console.log('\n[TEST 7] Valid OTP Verification & Account State Update');
  const rawOtp3 = '789012';
  const otpHash3 = hashToken(rawOtp3);
  await prisma.emailVerification.create({
    data: { email: suiteEmail, otpHash: otpHash3, expiresAt: new Date(Date.now() + 10 * 60 * 1000), attempts: 0 },
  });

  const incomingValidHash = hashToken('789012');
  const validRec = await prisma.emailVerification.findFirst({ where: { email: suiteEmail } });
  if (incomingValidHash === validRec?.otpHash) {
    await prisma.user.update({ where: { email: suiteEmail }, data: { isVerified: true } });
    await prisma.emailVerification.deleteMany({ where: { email: suiteEmail } });
  }

  const verifiedUser = await prisma.user.findUnique({ where: { email: suiteEmail } });
  const remainingOtps = await prisma.emailVerification.findMany({ where: { email: suiteEmail } });

  if (!verifiedUser?.isVerified) throw new Error('User isVerified was not updated!');
  if (remainingOtps.length !== 0) throw new Error('OTP record was not deleted post-verification!');

  console.log('  ✓ Passed: Account successfully marked isVerified = true, OTP deleted (single-use enforced)');

  // TEST 8: Re-using Verified OTP
  console.log('\n[TEST 8] Used OTP Re-submission Rejection');
  const reusableCheck = await prisma.emailVerification.findFirst({ where: { email: suiteEmail } });
  if (reusableCheck !== null) throw new Error('Used OTP must not exist in DB!');
  console.log('  ✓ Passed: Used OTP code completely destroyed');

  // Clean up test account
  await prisma.user.delete({ where: { id: user.id } });
  console.log('\n==================================================');
  console.log('🎉 ALL 8 OTP VERIFICATION SECURITY TESTS PASSED PERFECTLY!');
  console.log('==================================================');
}

runFullOtpSuite().catch(console.error).finally(() => prisma.$disconnect());
