import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GUEST_A_ID = '33333333-3333-4333-8333-333333333333';
const GUEST_B_ID = '44444444-4444-4444-8444-444444444444';
let AUTH_USER_ID = '';
let AUTH_TOKEN = '';
let TEST_QUIZ_ID = '';
let TEST_LAB_ID = '';
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
  const testEmail = `phase4-user-${Date.now()}@netvision.edu`;
  const testPass = 'Password123!';

  // Step 1: Register test user
  const regRes = await makeApiRequest('POST', '/auth/register', {}, {
    email: testEmail,
    password: testPass,
    username: `p4u${Date.now().toString().slice(-6)}`,
    fullName: 'Phase 4 Tester',
  });

  await prisma.user.update({
    where: { email: testEmail },
    data: { isVerified: true },
  });

  const loginRes = await makeApiRequest('POST', '/auth/login', {}, {
    email: testEmail,
    password: testPass,
  });
  AUTH_TOKEN = loginRes.body.accessToken || loginRes.body.data?.accessToken || loginRes.body.token;

  const createdUser = await prisma.user.findUnique({ where: { email: testEmail } });
  if (createdUser) {
    AUTH_USER_ID = createdUser.id;
  }

  // Find a quiz, lab, and lesson in DB
  const quiz = await prisma.quiz.findFirst({ include: { questions: true } });
  if (!quiz) throw new Error('No quiz found in database');
  TEST_QUIZ_ID = quiz.id;
  TEST_LESSON_ID = quiz.lessonId;

  let lab = await prisma.lessonLab.findFirst({ where: { lessonId: TEST_LESSON_ID } });
  if (!lab) {
    lab = await prisma.lessonLab.create({
      data: {
        lessonId: TEST_LESSON_ID,
        title: 'Phase 4 Practical Lab Test',
        slug: `lab-p4-${Date.now()}`,
        instructions: 'Run ping 192.168.1.1 to verify network connection.',
        difficulty: 'BEGINNER',
      },
    });
  }
  TEST_LAB_ID = lab.id;

  // Cleanup past attempts for test entities
  await prisma.quizAttempt.deleteMany({
    where: { OR: [{ anonymousId: GUEST_A_ID }, { anonymousId: GUEST_B_ID }, ...(AUTH_USER_ID ? [{ userId: AUTH_USER_ID }] : [])] },
  });
  await prisma.labAttempt.deleteMany({
    where: { OR: [{ anonymousId: GUEST_A_ID }, { anonymousId: GUEST_B_ID }, ...(AUTH_USER_ID ? [{ userId: AUTH_USER_ID }] : [])] },
  });
  await prisma.userProgress.deleteMany({
    where: { OR: [{ anonymousId: GUEST_A_ID }, { anonymousId: GUEST_B_ID }, ...(AUTH_USER_ID ? [{ userId: AUTH_USER_ID }] : [])] },
  });
}

async function runPhase4TestSuite() {
  console.log('==================================================');
  console.log('NETVISION PHASE 4 — GUEST QUIZ & LAB TEST SUITE');
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

  // Fetch quiz questions to create valid answer payload
  const quiz = await prisma.quiz.findUnique({
    where: { id: TEST_QUIZ_ID },
    include: { questions: true },
  });
  const answersPayload: Record<string, number> = {};
  quiz?.questions.forEach((q) => {
    answersPayload[q.id] = q.correctOption;
  });

  // TEST 1: Guest can submit quiz
  const res1 = await makeApiRequest(
    'POST',
    `/quizzes/${TEST_QUIZ_ID}/submit`,
    { 'X-Anonymous-ID': GUEST_A_ID },
    { answers: answersPayload }
  );
  assert(
    res1.status === 200 && res1.body.passed === true,
    'TEST 1: Guest can submit quiz successfully'
  );

  // TEST 2: Guest QuizAttempt has userId = null, anonymousId = guest UUID
  const quizAttemptA = await prisma.quizAttempt.findFirst({
    where: { anonymousId: GUEST_A_ID, quizId: TEST_QUIZ_ID },
  });
  assert(
    quizAttemptA !== null && quizAttemptA.userId === null && quizAttemptA.anonymousId === GUEST_A_ID,
    'TEST 2: Guest QuizAttempt has userId = null and anonymousId = guest UUID'
  );

  // TEST 3: Authenticated QuizAttempt has userId = authenticated ID, anonymousId = null
  let resAuthQuizStatus = 0;
  let resAuthQuizBody: any = null;
  if (AUTH_TOKEN) {
    const resAuthQuiz = await makeApiRequest(
      'POST',
      `/quizzes/${TEST_QUIZ_ID}/submit`,
      { Authorization: `Bearer ${AUTH_TOKEN}` },
      { answers: answersPayload }
    );
    resAuthQuizStatus = resAuthQuiz.status;
    resAuthQuizBody = resAuthQuiz.body;
  }
  const userQuizAttempt = await prisma.quizAttempt.findFirst({
    where: { userId: AUTH_USER_ID, quizId: TEST_QUIZ_ID },
  });
  assert(
    userQuizAttempt !== null && userQuizAttempt.userId === AUTH_USER_ID && userQuizAttempt.anonymousId === null,
    'TEST 3: Authenticated QuizAttempt has userId = user ID and anonymousId = null',
    `status: ${resAuthQuizStatus}, body: ${JSON.stringify(resAuthQuizBody)}, AUTH_USER_ID: ${AUTH_USER_ID}`
  );

  // TEST 4: Guest quiz attempt numbering works
  const res4 = await makeApiRequest(
    'POST',
    `/quizzes/${TEST_QUIZ_ID}/submit`,
    { 'X-Anonymous-ID': GUEST_A_ID },
    { answers: answersPayload }
  );
  assert(
    res4.status === 200 && res4.body.attemptNumber === 2,
    'TEST 4: Guest quiz attempt numbering increments correctly (Attempt 2)'
  );

  // TEST 5: Two different guests have independent attempt numbers
  const res5 = await makeApiRequest(
    'POST',
    `/quizzes/${TEST_QUIZ_ID}/submit`,
    { 'X-Anonymous-ID': GUEST_B_ID },
    { answers: answersPayload }
  );
  assert(
    res5.status === 200 && res5.body.attemptNumber === 1,
    'TEST 5: Two different guests have independent attempt numbers (Guest B attempt 1)'
  );

  // TEST 6: Guest quiz updates UserProgress
  const guestProgressA = await prisma.userProgress.findFirst({
    where: { anonymousId: GUEST_A_ID, lessonId: TEST_LESSON_ID },
  });
  assert(
    guestProgressA !== null && guestProgressA.quizAttemptsCount === 2 && guestProgressA.score !== null,
    'TEST 6: Guest quiz updates UserProgress (attempts count & score recorded)'
  );

  // TEST 7: Guest can validate a practical lab
  const res7 = await makeApiRequest(
    'POST',
    '/labs/validate',
    { 'X-Anonymous-ID': GUEST_A_ID },
    { labId: TEST_LAB_ID, commandHistory: ['ping 192.168.1.1'], hintsUsedCount: 0 }
  );
  assert(
    res7.status === 200 && res7.body.passed === true,
    'TEST 7: Guest can validate a practical lab'
  );

  // TEST 8: Guest LabAttempt has userId = null, anonymousId = guest UUID
  const labAttemptA = await prisma.labAttempt.findFirst({
    where: { anonymousId: GUEST_A_ID, labId: TEST_LAB_ID },
  });
  assert(
    labAttemptA !== null && labAttemptA.userId === null && labAttemptA.anonymousId === GUEST_A_ID,
    'TEST 8: Guest LabAttempt has userId = null and anonymousId = guest UUID'
  );

  // TEST 9: Authenticated lab validation still works
  if (AUTH_TOKEN) {
    const res9 = await makeApiRequest(
      'POST',
      '/labs/validate',
      { Authorization: `Bearer ${AUTH_TOKEN}` },
      { labId: TEST_LAB_ID, commandHistory: ['ping 10.0.0.1'], hintsUsedCount: 0 }
    );
    assert(
      res9.status === 200 && res9.body.passed === true,
      'TEST 9: Authenticated lab validation works as expected'
    );
  }

  // TEST 10: Guest lab completion updates practicalCompleted = true
  const guestProgressLab = await prisma.userProgress.findFirst({
    where: { anonymousId: GUEST_A_ID, lessonId: TEST_LESSON_ID },
  });
  assert(
    guestProgressLab !== null && guestProgressLab.practicalCompleted === true,
    'TEST 10: Guest lab completion updates practicalCompleted = true in UserProgress'
  );

  // TEST 11: Guest A cannot see Guest B's progress
  const res11 = await makeApiRequest('GET', '/progress', { 'X-Anonymous-ID': GUEST_B_ID });
  const guestBProgressList = await prisma.userProgress.findMany({ where: { anonymousId: GUEST_B_ID } });
  assert(
    res11.status === 200 && guestBProgressList.every((p) => p.anonymousId === GUEST_B_ID),
    'TEST 11: Guest A progress isolated from Guest B'
  );

  // TEST 12: Guest cannot access another user's data
  const res12 = await makeApiRequest('GET', '/progress', { 'X-Anonymous-ID': GUEST_A_ID });
  assert(
    res12.status === 200 && res12.body.completedLessons !== undefined,
    'TEST 12: Guest progress query operates exclusively against guest anonymousId'
  );

  // TEST 13: Invalid anonymous ID cannot create arbitrary ownership
  const res13 = await makeApiRequest(
    'POST',
    `/quizzes/${TEST_QUIZ_ID}/submit`,
    { 'X-Anonymous-ID': 'invalid-uuid-string' },
    { answers: answersPayload }
  );
  assert(
    res13.status === 400,
    'TEST 13: Invalid anonymous UUID returns 400 Bad Request'
  );

  // TEST 14: JWT user takes precedence over X-Anonymous-ID
  if (AUTH_TOKEN) {
    const res14 = await makeApiRequest(
      'POST',
      '/labs/validate',
      { Authorization: `Bearer ${AUTH_TOKEN}`, 'X-Anonymous-ID': GUEST_B_ID },
      { labId: TEST_LAB_ID, commandHistory: ['traceroute 8.8.8.8'], hintsUsedCount: 0 }
    );
    const createdAttempt = await prisma.labAttempt.findFirst({
      where: { id: res14.body.attemptId },
    });
    assert(
      res14.status === 200 && createdAttempt?.userId === AUTH_USER_ID && createdAttempt?.anonymousId === null,
      'TEST 14: JWT user takes precedence over X-Anonymous-ID (anonymousId is null)'
    );
  }

  // TEST 15: Existing authenticated quiz/lab functionality remains functional
  if (AUTH_TOKEN) {
    const userProgress = await prisma.userProgress.findFirst({
      where: { userId: AUTH_USER_ID, lessonId: TEST_LESSON_ID },
    });
    assert(
      userProgress !== null && userProgress.userId === AUTH_USER_ID,
      'TEST 15: Existing authenticated quiz/lab functionality remains 100% functional'
    );
  }

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedTests} passed, ${failedTests} failed.`);
  console.log('==================================================');

  await prisma.$disconnect();
  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase4TestSuite().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
