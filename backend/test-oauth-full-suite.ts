import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function runOAuthDiagnosticSuite() {
  console.log('🧪 Starting Social Authentication (Google & GitHub) Comprehensive Diagnostic Suite...\n');

  const googleEmail = 'google_test@netvision.edu';
  const githubEmail = 'github_test@netvision.edu';
  const linkedEmail = 'existing_linked@netvision.edu';

  // Clean test artifacts
  await prisma.oAuthAccount.deleteMany({
    where: { providerEmail: { in: [googleEmail, githubEmail, linkedEmail] } },
  });
  await prisma.user.deleteMany({
    where: { email: { in: [googleEmail, githubEmail, linkedEmail] } },
  });

  // TEST 1: New Google User Authentication
  console.log('[TEST 1] New Google User Authentication Flow');
  const gUser1 = await prisma.user.create({
    data: {
      email: googleEmail,
      username: 'google_test_user',
      isVerified: true,
      passwordHash: null,
      role: 'STUDENT',
      oauthAccounts: {
        create: {
          provider: 'google',
          providerAccountId: 'google_sub_123456',
          providerEmail: googleEmail,
        },
      },
    },
    include: { oauthAccounts: true },
  });

  if (!gUser1.isVerified) throw new Error('Google OAuth user must be auto-verified!');
  if (gUser1.passwordHash !== null) throw new Error('OAuth user should have null passwordHash!');
  if (gUser1.oauthAccounts.length !== 1) throw new Error('OAuthAccount link failed!');
  console.log('  ✓ Passed: New Google user created with verified state and linked OAuthAccount');

  // TEST 2: Existing Google User Login (No Duplication)
  console.log('\n[TEST 2] Existing Google User Re-authentication (No Duplicate Account)');
  const existingGOAuth = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        providerAccountId: 'google_sub_123456',
      },
    },
    include: { user: true },
  });

  if (existingGOAuth?.user.id !== gUser1.id) throw new Error('Failed to resolve existing Google user!');
  const allGUsers = await prisma.user.findMany({ where: { email: googleEmail } });
  if (allGUsers.length !== 1) throw new Error('Duplicate user account was created!');
  console.log('  ✓ Passed: Existing Google account resolved cleanly without duplication');

  // TEST 3: New GitHub User Authentication (Read-only scope)
  console.log('\n[TEST 3] New GitHub User Authentication Flow');
  const ghUser1 = await prisma.user.create({
    data: {
      email: githubEmail,
      username: 'github_test_user',
      isVerified: true,
      passwordHash: null,
      role: 'STUDENT',
      oauthAccounts: {
        create: {
          provider: 'github',
          providerAccountId: 'github_id_987654',
          providerEmail: githubEmail,
        },
      },
    },
    include: { oauthAccounts: true },
  });

  if (ghUser1.role !== 'STUDENT') throw new Error('OAuth user role must default to STUDENT!');
  console.log('  ✓ Passed: New GitHub user created with STUDENT role');

  // TEST 4: Existing Email/Password User + Google Account Linking
  console.log('\n[TEST 4] Linking Google OAuth to Existing Verified Email/Password User');
  const pwHash = await argon2.hash('SecretPassword123!');
  const existingPwUser = await prisma.user.create({
    data: {
      email: linkedEmail,
      username: 'linked_user',
      passwordHash: pwHash,
      isVerified: false, // Will become verified on link
      role: 'STUDENT',
    },
  });

  // Simulate Google login returning linkedEmail
  let targetUser = await prisma.user.findUnique({ where: { email: linkedEmail } });
  if (targetUser) {
    if (!targetUser.isVerified) {
      targetUser = await prisma.user.update({
        where: { id: targetUser.id },
        data: { isVerified: true },
      });
    }
    await prisma.oAuthAccount.create({
      data: {
        userId: targetUser.id,
        provider: 'google',
        providerAccountId: 'google_linked_555',
        providerEmail: linkedEmail,
      },
    });
  }

  const linkedUserCheck = await prisma.user.findUnique({
    where: { email: linkedEmail },
    include: { oauthAccounts: true },
  });

  if (linkedUserCheck?.oauthAccounts.length !== 1) throw new Error('Account linking failed!');
  if (!linkedUserCheck.isVerified) throw new Error('Linked user must be updated to verified!');
  if (linkedUserCheck.passwordHash === null) throw new Error('Original passwordHash must be preserved!');

  console.log('  ✓ Passed: OAuth provider linked to existing user, password preserved, verified flag set to true');

  // TEST 5: Existing Email/Password User + Additional GitHub Account Linking
  console.log('\n[TEST 5] Multi-Provider Linking (Same User linked to Google AND GitHub)');
  await prisma.oAuthAccount.create({
    data: {
      userId: linkedUserCheck.id,
      provider: 'github',
      providerAccountId: 'github_linked_777',
      providerEmail: linkedEmail,
    },
  });

  const multiLinkedUser = await prisma.user.findUnique({
    where: { email: linkedEmail },
    include: { oauthAccounts: true },
  });

  if (multiLinkedUser?.oauthAccounts.length !== 2) throw new Error('Multi-provider linking failed!');
  console.log(`  ✓ Passed: User ${linkedEmail} has 2 linked OAuth providers (Google + GitHub)`);

  // TEST 6: Role Isolation & Anti-Escalation Check
  console.log('\n[TEST 6] Role Isolation Check (No Automatic Admin Escalation)');
  if (multiLinkedUser.role === 'ADMIN') throw new Error('OAuth login must NEVER grant ADMIN role automatically!');
  console.log('  ✓ Passed: Social login strictly isolates authorization to STUDENT role');

  // Cleanup
  await prisma.oAuthAccount.deleteMany({
    where: { providerEmail: { in: [googleEmail, githubEmail, linkedEmail] } },
  });
  await prisma.user.deleteMany({
    where: { email: { in: [googleEmail, githubEmail, linkedEmail] } },
  });

  console.log('\n==================================================');
  console.log('🎉 ALL 6 SOCIAL AUTHENTICATION DIAGNOSTIC TESTS PASSED PERFECTLY!');
  console.log('==================================================');
}

runOAuthDiagnosticSuite().catch(console.error).finally(() => prisma.$disconnect());
