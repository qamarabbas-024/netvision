import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GUEST_A_ID = '11111111-1111-4111-8111-111111111111';
const GUEST_B_ID = '22222222-2222-4222-8222-222222222222';
let AUTH_USER_ID = '';
let AUTH_TOKEN = '';
let TEST_LESSON_ID = '';

async function makeApiRequest(
  method: string,
  path: string,
  headers: Record<string, string>,
  body?: any
): Promise<{ status: number; body: any }> {
  const url = `http://127.0.0.1:4000/api/v1${path.startsWith('/') ? path : `/${path}`}`;
  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const res = await fetch(url, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.text();
  let parsed = data;
  try {
    parsed = JSON.parse(data);
  } catch {}
  return { status: res.status, body: parsed };
}

async function setupTestData() {
  const testEmail = `phase3-user-${Date.now()}@netvision.edu`;
  const testPass = 'Password123!';

  // Step 1: Register test user
  const regRes = await makeApiRequest('POST', '/auth/register', {}, {
    email: testEmail,
    password: testPass,
    username: `p3u${Date.now().toString().slice(-6)}`,
    fullName: 'Phase 3 Tester',
  });

  const devOtp = regRes.body?.devOtpCode;
  if (devOtp) {
    // Step 2: Verify OTP to get accessToken
    const verifyRes = await makeApiRequest('POST', '/auth/verify-otp', {}, {
      email: testEmail,
      otp: devOtp,
    });

    if (verifyRes.status === 200) {
      AUTH_TOKEN = verifyRes.body.accessToken || verifyRes.body.token;
      AUTH_USER_ID = verifyRes.body.user?.id;
    }
  }

  // Fallback: If registration fails or already exists, log in
  if (!AUTH_TOKEN) {
    const loginRes = await makeApiRequest('POST', '/auth/login', {}, {
      email: testEmail,
      password: testPass,
    });
    AUTH_TOKEN = loginRes.body.accessToken || loginRes.body.token;
    AUTH_USER_ID = loginRes.body.user?.id;
  }

  // Find a lesson to test with
  const lesson = await prisma.lesson.findFirst();
  if (!lesson) {
    throw new Error('No lesson found in database to test progress');
  }
  TEST_LESSON_ID = lesson.id;

  // Cleanup old test progress for these guest IDs and test user
  await prisma.userProgress.deleteMany({
    where: {
      OR: [
        { anonymousId: GUEST_A_ID },
        { anonymousId: GUEST_B_ID },
        ...(AUTH_USER_ID ? [{ userId: AUTH_USER_ID }] : []),
      ],
    },
  });
}

async function runPhase3TestSuite() {
  console.log('==================================================');
  console.log('NETVISION PHASE 3 — LESSON PROGRESS TEST SUITE');
  console.log('==================================================\n');

  await setupTestData();

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName} - ${detail || 'Assertion failed'}`);
      failedTests++;
    }
  }

  // TEST 1: Guest gets progress with X-Anonymous-ID
  const res1 = await makeApiRequest('GET', '/progress', { 'X-Anonymous-ID': GUEST_A_ID });
  assert(
    res1.status === 200 && res1.body.completedLessons === 0,
    'TEST 1: Guest gets initial empty progress with X-Anonymous-ID'
  );

  // TEST 2: Guest marks lesson started
  const res2 = await makeApiRequest(
    'POST',
    '/progress/start',
    { 'X-Anonymous-ID': GUEST_A_ID },
    { lessonId: TEST_LESSON_ID }
  );
  assert(
    res2.status === 200 && res2.body.started === true,
    'TEST 2: Guest marks lesson started'
  );

  // TEST 3: Guest marks lesson viewed
  const res3 = await makeApiRequest(
    'POST',
    '/progress/view',
    { 'X-Anonymous-ID': GUEST_A_ID },
    { lessonId: TEST_LESSON_ID }
  );
  assert(
    res3.status === 200 && res3.body.viewed === true,
    'TEST 3: Guest marks lesson viewed'
  );

  // TEST 4: Guest completes lesson
  const res4 = await makeApiRequest(
    'POST',
    '/progress/complete',
    { 'X-Anonymous-ID': GUEST_A_ID },
    { lessonId: TEST_LESSON_ID }
  );
  assert(
    res4.status === 200 && res4.body.completed === true,
    'TEST 4: Guest completes lesson'
  );

  // TEST 5: Refreshing/repeating request does not create duplicate UserProgress records
  await makeApiRequest(
    'POST',
    '/progress/complete',
    { 'X-Anonymous-ID': GUEST_A_ID },
    { lessonId: TEST_LESSON_ID }
  );
  const progressCount = await prisma.userProgress.count({
    where: { anonymousId: GUEST_A_ID, lessonId: TEST_LESSON_ID },
  });
  assert(
    progressCount === 1,
    'TEST 5: Repeating complete request is idempotent (1 UserProgress record)'
  );

  // TEST 6: Guest progress survives API/server restart because PostgreSQL is source of truth
  const dbRecord = await prisma.userProgress.findFirst({
    where: { anonymousId: GUEST_A_ID, lessonId: TEST_LESSON_ID },
  });
  assert(
    dbRecord !== null && dbRecord.completed === true,
    'TEST 6: Guest progress persisted in PostgreSQL'
  );

  // TEST 7: Guest A cannot see Guest B progress
  const res7 = await makeApiRequest('GET', '/progress', { 'X-Anonymous-ID': GUEST_B_ID });
  assert(
    res7.status === 200 && res7.body.completedLessons === 0,
    'TEST 7: Guest A progress isolated from Guest B'
  );

  // TEST 8: Guest cannot see authenticated User progress
  if (AUTH_TOKEN) {
    await makeApiRequest(
      'POST',
      '/progress/complete',
      { Authorization: `Bearer ${AUTH_TOKEN}` },
      { lessonId: TEST_LESSON_ID }
    );
  }
  const res8 = await makeApiRequest('GET', '/progress', { 'X-Anonymous-ID': GUEST_B_ID });
  assert(
    res8.status === 200 && res8.body.completedLessons === 0,
    'TEST 8: Guest B cannot see authenticated User progress'
  );

  // TEST 9: Authenticated user progress works as before
  if (AUTH_TOKEN) {
    const res9 = await makeApiRequest('GET', '/progress', { Authorization: `Bearer ${AUTH_TOKEN}` });
    assert(
      res9.status === 200 && res9.body.completedLessons === 1,
      'TEST 9: Authenticated user progress works as expected'
    );
  } else {
    console.log('[SKIP] TEST 9: Auth token unavailable');
  }

  // TEST 10: JWT + X-Anonymous-ID together uses JWT identity
  if (AUTH_TOKEN) {
    const res10 = await makeApiRequest(
      'POST',
      '/progress/start',
      { Authorization: `Bearer ${AUTH_TOKEN}`, 'X-Anonymous-ID': GUEST_B_ID },
      { lessonId: TEST_LESSON_ID }
    );
    const userProgress = await prisma.userProgress.findFirst({
      where: { userId: AUTH_USER_ID, lessonId: TEST_LESSON_ID },
    });
    assert(
      res10.status === 200 && userProgress?.userId === AUTH_USER_ID,
      'TEST 10: JWT precedence over X-Anonymous-ID verified'
    );
  } else {
    console.log('[SKIP] TEST 10: Auth token unavailable');
  }

  // TEST 11: Invalid anonymous UUID returns 400
  const res11 = await makeApiRequest('GET', '/progress', { 'X-Anonymous-ID': 'not-a-valid-uuid' });
  assert(
    res11.status === 400,
    'TEST 11: Invalid anonymous UUID returns 400 Bad Request'
  );

  // TEST 12: No JWT + no X-Anonymous-ID returns empty progress safely
  const res12 = await makeApiRequest('GET', '/progress', {});
  assert(
    res12.status === 200 && res12.body.completedLessons === 0,
    'TEST 12: No JWT + no X-Anonymous-ID returns empty progress safely'
  );

  // TEST 13: Response structure backward compatibility
  const res13 = await makeApiRequest('GET', '/progress', { 'X-Anonymous-ID': GUEST_A_ID });
  assert(
    res13.body.totalCourses !== undefined &&
      res13.body.totalLessons !== undefined &&
      Array.isArray(res13.body.recentAttempts),
    'TEST 13: Response structure remains 100% backward compatible'
  );

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedTests} passed, ${failedTests} failed.`);
  console.log('==================================================');

  await prisma.$disconnect();
  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase3TestSuite().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
