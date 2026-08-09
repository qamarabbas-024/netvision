import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GUEST_A_ID = '77777777-7777-4777-8777-777777777777';
const GUEST_B_ID = '88888888-8888-4888-8888-888888888888';
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
  const testEmail = `phase6-user-${Date.now()}@netvision.edu`;
  const testPass = 'Password123!';

  // Step 1: Register test user
  const regRes = await makeApiRequest('POST', '/auth/register', {}, {
    email: testEmail,
    password: testPass,
    username: `p6u${Date.now().toString().slice(-6)}`,
    fullName: 'Phase 6 Tester',
  });

  const devOtp = regRes.body?.devOtpCode;
  if (devOtp) {
    // Step 2: Verify OTP
    const verifyRes = await makeApiRequest('POST', '/auth/verify-otp', {}, {
      email: testEmail,
      otp: devOtp,
    });
    if (verifyRes.status === 200) {
      AUTH_TOKEN = verifyRes.body.accessToken || verifyRes.body.token;
      AUTH_USER_ID = verifyRes.body.user?.id;
    }
  }

  if (!AUTH_TOKEN) {
    const loginRes = await makeApiRequest('POST', '/auth/login', {}, {
      email: testEmail,
      password: testPass,
    });
    AUTH_TOKEN = loginRes.body.accessToken || loginRes.body.token;
    AUTH_USER_ID = loginRes.body.user?.id;
  }

  // Find a test lesson
  const lesson = await prisma.lesson.findFirst();
  if (!lesson) throw new Error('No lesson found in database');
  TEST_LESSON_ID = lesson.id;

  // Cleanup past saved lessons for test identities
  await prisma.savedLesson.deleteMany({
    where: {
      OR: [
        { anonymousId: GUEST_A_ID },
        { anonymousId: GUEST_B_ID },
        ...(AUTH_USER_ID ? [{ userId: AUTH_USER_ID }] : []),
      ],
    },
  });
}

async function runPhase6TestSuite() {
  console.log('==================================================');
  console.log('NETVISION PHASE 6 — GUEST BOOKMARKS TEST SUITE');
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

  // TEST 1: Guest saves lesson -> saved = true
  const res1 = await makeApiRequest(
    'POST',
    '/progress/save-lesson',
    { 'X-Anonymous-ID': GUEST_A_ID },
    { lessonId: TEST_LESSON_ID }
  );
  assert(
    res1.status === 200 && res1.body.saved === true,
    'TEST 1: Guest saves lesson (saved = true)'
  );

  // TEST 2: Guest fetches saved lessons -> saved lesson appears
  const res2 = await makeApiRequest(
    'GET',
    '/progress/saved-lessons',
    { 'X-Anonymous-ID': GUEST_A_ID }
  );
  assert(
    res2.status === 200 && Array.isArray(res2.body) && res2.body.some((l) => l.lessonId === TEST_LESSON_ID),
    'TEST 2: Guest fetches saved lessons (saved lesson appears in array)'
  );

  // TEST 3: Guest toggles same lesson again -> saved = false
  const res3 = await makeApiRequest(
    'POST',
    '/progress/save-lesson',
    { 'X-Anonymous-ID': GUEST_A_ID },
    { lessonId: TEST_LESSON_ID }
  );
  assert(
    res3.status === 200 && res3.body.saved === false,
    'TEST 3: Guest toggles same lesson again (saved = false)'
  );

  // TEST 4: Guest fetches saved lessons again -> lesson is absent
  const res4 = await makeApiRequest(
    'GET',
    '/progress/saved-lessons',
    { 'X-Anonymous-ID': GUEST_A_ID }
  );
  assert(
    res4.status === 200 && Array.isArray(res4.body) && !res4.body.some((l) => l.lessonId === TEST_LESSON_ID),
    'TEST 4: Guest fetches saved lessons again (lesson is absent)'
  );

  // TEST 5: Authenticated user saves lesson
  let userSaveStatus = false;
  if (AUTH_TOKEN) {
    const res5 = await makeApiRequest(
      'POST',
      '/progress/save-lesson',
      { Authorization: `Bearer ${AUTH_TOKEN}` },
      { lessonId: TEST_LESSON_ID }
    );
    userSaveStatus = res5.status === 200 && res5.body.saved === true;
  }
  assert(
    userSaveStatus,
    'TEST 5: Authenticated user saves lesson (saved = true)'
  );

  // TEST 6: Authenticated user fetches saved lessons
  let userFetchStatus = false;
  if (AUTH_TOKEN) {
    const res6 = await makeApiRequest(
      'GET',
      '/progress/saved-lessons',
      { Authorization: `Bearer ${AUTH_TOKEN}` }
    );
    userFetchStatus = res6.status === 200 && Array.isArray(res6.body) && res6.body.some((l) => l.lessonId === TEST_LESSON_ID);
  }
  assert(
    userFetchStatus,
    'TEST 6: Authenticated user fetches saved lessons (only their lessons appear)'
  );

  // TEST 7: Guest A cannot access Guest B bookmarks
  // Save a bookmark for Guest A
  await makeApiRequest(
    'POST',
    '/progress/save-lesson',
    { 'X-Anonymous-ID': GUEST_A_ID },
    { lessonId: TEST_LESSON_ID }
  );
  const resGuestB = await makeApiRequest(
    'GET',
    '/progress/saved-lessons',
    { 'X-Anonymous-ID': GUEST_B_ID }
  );
  assert(
    resGuestB.status === 200 && Array.isArray(resGuestB.body) && !resGuestB.body.some((l) => l.lessonId === TEST_LESSON_ID),
    'TEST 7: Guest B cannot see Guest A bookmarks'
  );

  // TEST 8: User A cannot access User B bookmarks (isolated per userId)
  const savedLessonsA = await prisma.savedLesson.findMany({ where: { userId: AUTH_USER_ID } });
  assert(
    savedLessonsA.every((s) => s.userId === AUTH_USER_ID && s.anonymousId === null),
    'TEST 8: User A bookmarks isolated to User A userId'
  );

  // TEST 9: Guest request with X-Anonymous-ID but no JWT works
  const res9 = await makeApiRequest(
    'GET',
    '/progress/saved-lessons',
    { 'X-Anonymous-ID': GUEST_A_ID }
  );
  assert(
    res9.status === 200 && Array.isArray(res9.body),
    'TEST 9: Guest request with X-Anonymous-ID but no JWT works successfully'
  );

  // TEST 10: Authenticated request containing both JWT and X-Anonymous-ID uses JWT identity
  if (AUTH_TOKEN) {
    await prisma.savedLesson.deleteMany({ where: { userId: AUTH_USER_ID } });
    const res10 = await makeApiRequest(
      'POST',
      '/progress/save-lesson',
      { Authorization: `Bearer ${AUTH_TOKEN}`, 'X-Anonymous-ID': GUEST_B_ID },
      { lessonId: TEST_LESSON_ID }
    );
    const createdBookmark = await prisma.savedLesson.findFirst({
      where: { userId: AUTH_USER_ID, lessonId: TEST_LESSON_ID },
    });
    assert(
      res10.status === 200 && res10.body.saved === true && createdBookmark?.userId === AUTH_USER_ID && createdBookmark?.anonymousId === null,
      'TEST 10: JWT user takes precedence over X-Anonymous-ID (anonymousId is null)'
    );
  }

  // TEST 11: Request without JWT and without X-Anonymous-ID returns 400 Bad Request
  const res11 = await makeApiRequest(
    'POST',
    '/progress/save-lesson',
    {},
    { lessonId: TEST_LESSON_ID }
  );
  assert(
    res11.status === 400,
    'TEST 11: Request without JWT and without X-Anonymous-ID returns 400 Bad Request'
  );

  // TEST 12: Duplicate bookmark creation is impossible (exactly 1 record created per owner/lesson)
  const countA = await prisma.savedLesson.count({
    where: { anonymousId: GUEST_A_ID, lessonId: TEST_LESSON_ID },
  });
  assert(
    countA <= 1,
    'TEST 12: Duplicate bookmark creation is impossible (count <= 1)'
  );

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedTests} passed, ${failedTests} failed.`);
  console.log('==================================================');

  await prisma.$disconnect();
  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase6TestSuite().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
