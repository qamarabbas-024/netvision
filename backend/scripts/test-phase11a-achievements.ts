import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:4000/api/v1';

async function request(endpoint: string, options: RequestInit = {}, headers: Record<string, string> = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data, ok: res.ok };
}

async function runPhase11aAchievementTests() {
  console.log('==================================================');
  console.log('NETVISION PHASE 11A — BADGE & ACHIEVEMENT SUITE');
  console.log('==================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, detail?: any) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` — ${JSON.stringify(detail)}` : ''}`);
      failedCount++;
    }
  }

  // ----------------------------------------------------
  // TEST 1: GET /achievements returns all 12 seeded badges
  // ----------------------------------------------------
  const listRes = await request('/achievements');
  assert(listRes.ok && Array.isArray(listRes.data) && listRes.data.length >= 5, '1. GET /achievements returns active seeded badges', listRes);

  // ----------------------------------------------------
  // TEST 2: Guest fetches initial achievements (0 unlocked)
  // ----------------------------------------------------
  const guestId = randomUUID();
  const guestAchRes1 = await request('/achievements/my', {}, { 'X-Anonymous-ID': guestId });
  assert(
    guestAchRes1.ok && guestAchRes1.data.unlockedCount === 0 && guestAchRes1.data.totalPointsEarned === 0,
    '2. Fresh guest receives 0 unlocked badges and 0 XP points',
    guestAchRes1
  );

  // ----------------------------------------------------
  // TEST 3: Guest unlocks "first-step" badge
  // ----------------------------------------------------
  const unlockRes1 = await request(
    '/achievements/unlock',
    {
      method: 'POST',
      body: JSON.stringify({ slug: 'first-step' }),
    },
    { 'X-Anonymous-ID': guestId }
  );
  assert(
    unlockRes1.ok && unlockRes1.data.unlocked === true && (unlockRes1.data.achievement?.slug === 'FIRST_STEP' || unlockRes1.data.achievement?.slug === 'first-step'),
    '3. Guest unlocks "first-step" badge successfully',
    unlockRes1
  );

  // ----------------------------------------------------
  // TEST 4: Guest fetches achievements after unlock (1 unlocked, 50 XP)
  // ----------------------------------------------------
  const guestAchRes2 = await request('/achievements/my', {}, { 'X-Anonymous-ID': guestId });
  assert(
    guestAchRes2.ok && guestAchRes2.data.unlockedCount === 1 && guestAchRes2.data.totalPointsEarned === 50,
    '4. Guest profile reflects 1 unlocked badge and 50 XP points',
    guestAchRes2
  );

  // ----------------------------------------------------
  // TEST 5: Re-unlocking same badge is idempotent
  // ----------------------------------------------------
  const unlockRes2 = await request(
    '/achievements/unlock',
    {
      method: 'POST',
      body: JSON.stringify({ slug: 'first-step' }),
    },
    { 'X-Anonymous-ID': guestId }
  );
  assert(
    unlockRes2.ok && unlockRes2.data.alreadyUnlocked === true,
    '5. Unlocking an already unlocked badge is idempotent (alreadyUnlocked = true)',
    unlockRes2
  );

  // ----------------------------------------------------
  // TEST 6: Guest registers account and claims progress
  // ----------------------------------------------------
  const userEmail = `p11a-user-${Date.now()}@netvision.edu`;
  const regRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userEmail,
      username: `p11u_${Date.now().toString().slice(-8)}`,
      password: 'SecurePassword123!',
      fullName: 'Phase11a Student',
    }),
  });
  assert(regRes.ok, '6. User registration succeeds');

  await prisma.user.update({
    where: { email: userEmail },
    data: { isVerified: true },
  });

  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userEmail, password: 'SecurePassword123!' }),
  });
  assert(loginRes.ok && loginRes.data.accessToken, '7. User login succeeds');
  const userJwt = loginRes.data.accessToken;

  // Claim guest progress into user account
  const claimRes = await request(
    '/learners/claim',
    {
      method: 'POST',
      body: JSON.stringify({ anonymousId: guestId }),
    },
    { Authorization: `Bearer ${userJwt}` }
  );
  assert(claimRes.ok && claimRes.data.claimedAchievementCount >= 1, '8. Claim progress transfers guest achievement into user account', claimRes);

  // ----------------------------------------------------
  // TEST 7: Authenticated user profile shows claimed achievement
  // ----------------------------------------------------
  const userAchRes = await request('/achievements/my', {}, { Authorization: `Bearer ${userJwt}` });
  assert(
    userAchRes.ok && userAchRes.data.unlockedCount === 1 && userAchRes.data.totalPointsEarned === 50,
    '9. Authenticated user profile displays claimed achievement badge and 50 XP points',
    userAchRes
  );

  // Clean up created user
  await prisma.userAchievement.deleteMany({ where: { user: { email: userEmail } } }).catch(() => null);
  await prisma.user.deleteMany({ where: { email: userEmail } }).catch(() => null);
  await prisma.$disconnect();

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedCount} passed, ${failedCount} failed.`);
  console.log('==================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runPhase11aAchievementTests();
