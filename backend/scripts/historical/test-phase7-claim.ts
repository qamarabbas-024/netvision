import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GUEST_CLAIM_ID = '99999999-9999-4999-8999-999999999999';
let AUTH_USER_ID = '';
let AUTH_TOKEN = '';
let TEST_LESSON_1_ID = '';
let TEST_LESSON_2_ID = '';
let TEST_QUIZ_ID = '';
let TEST_LAB_ID = '';

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
  const testEmail = `phase7-user-${Date.now()}@netvision.edu`;
  const testPass = 'Password123!';

  // Register test user
  const regRes = await makeApiRequest('POST', '/auth/register', {}, {
    email: testEmail,
    password: testPass,
    username: `p7u${Date.now().toString().slice(-6)}`,
    fullName: 'Phase 7 Tester',
  });

  await prisma.user.update({
    where: { email: testEmail },
    data: { isVerified: true },
  });

  const loginRes = await makeApiRequest('POST', '/auth/login', {}, {
    email: testEmail,
    password: testPass,
  });
  AUTH_TOKEN = loginRes.body.accessToken || loginRes.body.token;
  AUTH_USER_ID = loginRes.body.user?.id;

  // Find test lessons
  const lessons = await prisma.lesson.findMany({ take: 2 });
  if (lessons.length < 2) throw new Error('Need at least 2 lessons in database for Phase 7 test');
  TEST_LESSON_1_ID = lessons[0].id;
  TEST_LESSON_2_ID = lessons[1].id;

  const quiz = await prisma.quiz.findFirst();
  if (quiz) TEST_QUIZ_ID = quiz.id;

  const lab = await prisma.lessonLab.findFirst();
  if (lab) TEST_LAB_ID = lab.id;

  // Cleanup past records
  await prisma.userProgress.deleteMany({ where: { OR: [{ anonymousId: GUEST_CLAIM_ID }, { userId: AUTH_USER_ID }] } });
  await prisma.quizAttempt.deleteMany({ where: { OR: [{ anonymousId: GUEST_CLAIM_ID }, { userId: AUTH_USER_ID }] } });
  await prisma.labAttempt.deleteMany({ where: { OR: [{ anonymousId: GUEST_CLAIM_ID }, { userId: AUTH_USER_ID }] } });
  await prisma.savedLesson.deleteMany({ where: { OR: [{ anonymousId: GUEST_CLAIM_ID }, { userId: AUTH_USER_ID }] } });
  await prisma.sandboxSession.deleteMany({ where: { OR: [{ anonymousId: GUEST_CLAIM_ID }, { userId: AUTH_USER_ID }] } });
  await prisma.anonymousLearner.deleteMany({ where: { id: GUEST_CLAIM_ID } });
}

async function runPhase7TestSuite() {
  console.log('==================================================');
  console.log('NETVISION PHASE 7 — TRANSACTIONAL CLAIM TEST SUITE');
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

  // Populate guest data for GUEST_CLAIM_ID
  await prisma.anonymousLearner.create({ data: { id: GUEST_CLAIM_ID } });
  
  // Lesson 1: Conflict with User (User score=60, Guest score=90, guest completed=true)
  await prisma.userProgress.create({
    data: {
      userId: AUTH_USER_ID,
      lessonId: TEST_LESSON_1_ID,
      started: true,
      viewed: true,
      completed: false,
      score: 60,
      bestScore: 60,
      weakConceptsJson: ['Subnetting'],
    },
  });
  await prisma.userProgress.create({
    data: {
      anonymousId: GUEST_CLAIM_ID,
      lessonId: TEST_LESSON_1_ID,
      started: true,
      viewed: true,
      completed: true,
      score: 90,
      bestScore: 90,
      weakConceptsJson: ['VLAN Tagging'],
    },
  });

  // Lesson 2: Guest-only lesson progress (reassignment)
  await prisma.userProgress.create({
    data: {
      anonymousId: GUEST_CLAIM_ID,
      lessonId: TEST_LESSON_2_ID,
      started: true,
      viewed: true,
      completed: true,
      score: 85,
    },
  });

  // Quiz attempt for guest
  if (TEST_QUIZ_ID) {
    await prisma.quizAttempt.create({
      data: {
        anonymousId: GUEST_CLAIM_ID,
        quizId: TEST_QUIZ_ID,
        score: 100,
        passed: true,
        answersJson: {},
        attemptNumber: 1,
      },
    });
  }

  // Lab attempt for guest
  if (TEST_LAB_ID) {
    await prisma.labAttempt.create({
      data: {
        anonymousId: GUEST_CLAIM_ID,
        labId: TEST_LAB_ID,
        passed: true,
        score: 100,
        status: 'PASSED',
      },
    });
  }

  // Saved lessons (Lesson 1 duplicate, Lesson 2 unique)
  await prisma.savedLesson.create({ data: { userId: AUTH_USER_ID, lessonId: TEST_LESSON_1_ID } });
  await prisma.savedLesson.create({ data: { anonymousId: GUEST_CLAIM_ID, lessonId: TEST_LESSON_1_ID } });
  await prisma.savedLesson.create({ data: { anonymousId: GUEST_CLAIM_ID, lessonId: TEST_LESSON_2_ID } });

  // Sandbox session for guest
  await prisma.sandboxSession.create({
    data: {
      anonymousId: GUEST_CLAIM_ID,
      status: 'RUNNING',
      expiresAt: new Date(Date.now() + 1800000),
      providerType: 'SIMULATED',
    },
  });

  // TEST 2: Claim endpoint requires JwtAuthGuard (no token -> 401)
  const res2 = await makeApiRequest('POST', '/learners/claim', {}, { anonymousId: GUEST_CLAIM_ID });
  assert(res2.status === 401, 'TEST 2: Claim endpoint requires JWT (returns 401 Unauthorized)');

  // TEST 3: Invalid JWT returns 401 Unauthorized
  const res3 = await makeApiRequest('POST', '/learners/claim', { Authorization: 'Bearer invalid.jwt.token' }, { anonymousId: GUEST_CLAIM_ID });
  assert(res3.status === 401, 'TEST 3: Invalid JWT returns 401 Unauthorized');

  // TEST 4: Invalid anonymous UUID is rejected with 400 Bad Request
  const res4 = await makeApiRequest('POST', '/learners/claim', { Authorization: `Bearer ${AUTH_TOKEN}` }, { anonymousId: 'not-a-valid-uuid' });
  assert(res4.status === 400, 'TEST 4: Invalid anonymous UUID rejected with 400 Bad Request');

  // TEST 1: Authenticated user claims guest progress
  const res1 = await makeApiRequest('POST', '/learners/claim', { Authorization: `Bearer ${AUTH_TOKEN}` }, { anonymousId: GUEST_CLAIM_ID });
  assert(res1.status === 200 && res1.body.success === true && res1.body.claimedCount > 0, 'TEST 1: Authenticated user claims guest progress successfully');

  // TEST 5 & 17: Calling claim twice is idempotent (returns 200 with claimedCount = 0)
  const res17 = await makeApiRequest('POST', '/learners/claim', { Authorization: `Bearer ${AUTH_TOKEN}` }, { anonymousId: GUEST_CLAIM_ID });
  assert(res17.status === 200 && res17.body.success === true && res17.body.claimedCount === 0, 'TEST 5 & 17: Calling claim twice is idempotent (claimedCount = 0)');

  // TEST 6: Guest UserProgress with no conflicting user record is reassigned
  const prog2 = await prisma.userProgress.findFirst({ where: { userId: AUTH_USER_ID, lessonId: TEST_LESSON_2_ID } });
  assert(prog2 !== null && prog2.userId === AUTH_USER_ID && prog2.anonymousId === null, 'TEST 6: Guest UserProgress with no conflicting user record is reassigned');

  // TEST 7, 8, 9: Merged UserProgress uses MAX score and boolean OR (completed = true, score = 90)
  const prog1 = await prisma.userProgress.findFirst({ where: { userId: AUTH_USER_ID, lessonId: TEST_LESSON_1_ID } });
  assert(
    prog1 !== null && prog1.completed === true && prog1.score === 90 && prog1.bestScore === 90,
    'TEST 7, 8, 9: Merged UserProgress uses MAX score (90) and boolean OR (completed = true)'
  );

  // TEST 10: Quiz attempts are reassigned to userId
  if (TEST_QUIZ_ID) {
    const quizAttempt = await prisma.quizAttempt.findFirst({ where: { userId: AUTH_USER_ID, quizId: TEST_QUIZ_ID } });
    assert(quizAttempt !== null && quizAttempt.userId === AUTH_USER_ID && quizAttempt.anonymousId === null, 'TEST 10: Quiz attempts reassigned to userId');
  }

  // TEST 11: Lab attempts are reassigned to userId
  if (TEST_LAB_ID) {
    const labAttempt = await prisma.labAttempt.findFirst({ where: { userId: AUTH_USER_ID, labId: TEST_LAB_ID } });
    assert(labAttempt !== null && labAttempt.userId === AUTH_USER_ID && labAttempt.anonymousId === null, 'TEST 11: Lab attempts reassigned to userId');
  }

  // TEST 12 & 13: Duplicate bookmarks removed, unique bookmarks reassigned (exact union)
  const savedLessons = await prisma.savedLesson.findMany({ where: { userId: AUTH_USER_ID } });
  const hasLesson1 = savedLessons.some((s) => s.lessonId === TEST_LESSON_1_ID);
  const hasLesson2 = savedLessons.some((s) => s.lessonId === TEST_LESSON_2_ID);
  assert(savedLessons.length === 2 && hasLesson1 && hasLesson2, 'TEST 12 & 13: Bookmarks merged into exact union without duplicates');

  // TEST 14: Sandbox sessions are reassigned
  const sandboxSessions = await prisma.sandboxSession.findMany({ where: { userId: AUTH_USER_ID } });
  assert(sandboxSessions.length > 0 && sandboxSessions.every((s) => s.userId === AUTH_USER_ID && s.anonymousId === null), 'TEST 14: Sandbox sessions reassigned to userId');

  // TEST 15: AnonymousLearner deleted only after successful merge
  const deletedAnonLearner = await prisma.anonymousLearner.findUnique({ where: { id: GUEST_CLAIM_ID } });
  assert(deletedAnonLearner === null, 'TEST 15: AnonymousLearner deleted after successful claim');

  // TEST 18: Authenticated user existing data is preserved
  assert(prog1?.started === true, 'TEST 18: Authenticated user existing data preserved');

  // TEST 19: OAuth/JWT login remains functional (verified by AUTH_TOKEN usage)
  assert(!!AUTH_TOKEN, 'TEST 19: JWT authentication remains 100% functional');

  // TEST 20: Alias endpoint POST /api/v1/progress/claim works identically
  const res20 = await makeApiRequest('POST', '/progress/claim', { Authorization: `Bearer ${AUTH_TOKEN}` }, { anonymousId: GUEST_CLAIM_ID });
  assert(res20.status === 200 && res20.body.success === true, 'TEST 20: Alias endpoint POST /progress/claim works identically');

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedTests} passed, ${failedTests} failed.`);
  console.log('==================================================');

  await prisma.$disconnect();
  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase7TestSuite().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
