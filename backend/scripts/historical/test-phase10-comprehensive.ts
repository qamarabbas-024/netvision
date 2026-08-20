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

async function runPhase10ComprehensiveTests() {
  console.log('==================================================');
  console.log('NETVISION PHASE 10 — COMPREHENSIVE E2E VERIFICATION');
  console.log('==================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, failureDetails?: any) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName}${failureDetails ? ` — ${JSON.stringify(failureDetails)}` : ''}`);
      failedCount++;
    }
  }

  // Fetch real lesson & course from database
  const firstLesson = await prisma.lesson.findFirst({
    include: { module: { include: { course: true } } },
  });
  if (!firstLesson) {
    throw new Error('No lessons found in database.');
  }
  const testLessonId = firstLesson.id;
  const testCourseId = firstLesson.module.courseId;

  // ----------------------------------------------------
  // SECTION 1: ENVIRONMENT & HEALTH
  // ----------------------------------------------------
  const healthRes = await request('/auth/me');
  assert(healthRes.status === 401, '1. Environment Health Check: Backend is active & returning expected auth status', healthRes);

  // ----------------------------------------------------
  // SECTION 2: GUEST IDENTITY & ISOLATION
  // ----------------------------------------------------
  const guestA_Id = randomUUID();
  const guestB_Id = randomUUID();

  const gA_Prog1 = await request('/progress', {}, { 'X-Anonymous-ID': guestA_Id });
  assert(gA_Prog1.ok && gA_Prog1.data.completedLessons === 0, '2. Fresh Guest A receives empty progress', gA_Prog1);

  // Guest A marks lesson complete & bookmarks lesson
  const completeRes = await request('/progress/complete', {
    method: 'POST',
    body: JSON.stringify({ lessonId: testLessonId }),
  }, { 'X-Anonymous-ID': guestA_Id });
  assert(completeRes.ok && completeRes.data.completed === true, '3. Guest A marks lesson complete', completeRes);

  const bookmarkRes = await request('/progress/save-lesson', {
    method: 'POST',
    body: JSON.stringify({ lessonId: testLessonId }),
  }, { 'X-Anonymous-ID': guestA_Id });
  assert(bookmarkRes.ok && bookmarkRes.data.saved === true, '4. Guest A bookmarks lesson', bookmarkRes);

  // Guest A creates sandbox session
  const sbSessionRes = await request('/sandbox/sessions', {
    method: 'POST',
    body: JSON.stringify({ providerType: 'SIMULATED', durationMinutes: 30 }),
  }, { 'X-Anonymous-ID': guestA_Id });
  assert((sbSessionRes.status === 201 || sbSessionRes.ok) && sbSessionRes.data.sessionId, '5. Guest A creates sandbox session', sbSessionRes);
  const guestA_SessionId = sbSessionRes.data.sessionId;

  // Guest B isolation checks
  const gB_Prog = await request('/progress', {}, { 'X-Anonymous-ID': guestB_Id });
  assert(gB_Prog.data.completedLessons === 0, '6. Guest B cannot see Guest A progress', gB_Prog);

  const gB_Saved = await request('/progress/saved-lessons', {}, { 'X-Anonymous-ID': guestB_Id });
  assert(Array.isArray(gB_Saved.data) && gB_Saved.data.length === 0, '7. Guest B cannot see Guest A saved bookmarks', gB_Saved);

  if (guestA_SessionId) {
    const gB_SbAccess = await request(`/sandbox/sessions/${guestA_SessionId}`, {}, { 'X-Anonymous-ID': guestB_Id });
    assert(gB_SbAccess.status === 403, '8. Guest B attempting to access Guest A sandbox session is denied (403 Forbidden)', gB_SbAccess);

    const noId_SbAccess = await request(`/sandbox/sessions/${guestA_SessionId}`);
    assert(noId_SbAccess.status === 403, '9. Request without identity header accessing sandbox session is denied (403 Forbidden)', noId_SbAccess);
  } else {
    assert(false, '8. Guest B attempting to access Guest A sandbox session is denied (403 Forbidden)', 'No guestA_SessionId');
    assert(false, '9. Request without identity header accessing sandbox session is denied (403 Forbidden)', 'No guestA_SessionId');
  }

  // ----------------------------------------------------
  // SECTION 3: AUTHENTICATED USER & PRECEDENCE
  // ----------------------------------------------------
  const userEmail = `phase10-user-${Date.now()}@netvision.edu`;
  const registerRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userEmail,
      username: `p10u_${Date.now().toString().slice(-8)}`,
      password: 'SecurePassword123!',
      fullName: 'Phase10 Student',
    }),
  });
  assert(registerRes.ok && registerRes.data.requiresOtp === true, '10. Register user completes and requires OTP verification', registerRes);

  await prisma.user.update({
    where: { email: userEmail },
    data: { isVerified: true },
  });

  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userEmail, password: 'SecurePassword123!' }),
  });
  assert(loginRes.ok && loginRes.data.accessToken, '11. Login returns valid JWT access token for verified user', loginRes);

  const userJwt = loginRes.data.accessToken;

  const meRes = await request('/auth/me', {}, { Authorization: `Bearer ${userJwt}` });
  assert(meRes.ok && meRes.data.email === userEmail, '12. GET /auth/me returns authenticated user profile', meRes);

  // Test Precedence: JWT sent together with Guest A's X-Anonymous-ID
  const precedenceRes = await request('/progress', {}, {
    Authorization: `Bearer ${userJwt}`,
    'X-Anonymous-ID': guestA_Id,
  });
  assert(precedenceRes.ok, '13. Request with JWT + X-Anonymous-ID succeeds', precedenceRes);

  // ----------------------------------------------------
  // SECTION 4: GUEST -> ACCOUNT CLAIM & MERGING
  // ----------------------------------------------------
  const claimRes = await request('/learners/claim', {
    method: 'POST',
    body: JSON.stringify({ anonymousId: guestA_Id }),
  }, { Authorization: `Bearer ${userJwt}` });

  assert(claimRes.ok && claimRes.data.success === true, '14. Claim Guest A progress into authenticated user account', claimRes);

  // Verify claimed progress appears under user
  const userProgAfterClaim = await request('/progress', {}, { Authorization: `Bearer ${userJwt}` });
  assert(userProgAfterClaim.data.completedLessons >= 1, '15. Claimed progress is visible in user account', userProgAfterClaim);

  const userSavedAfterClaim = await request('/progress/saved-lessons', {}, { Authorization: `Bearer ${userJwt}` });
  assert(Array.isArray(userSavedAfterClaim.data) && userSavedAfterClaim.data.length >= 1, '16. Claimed bookmarks merged into user account', userSavedAfterClaim);

  // Idempotent repeat claim
  const repeatClaimRes = await request('/learners/claim', {
    method: 'POST',
    body: JSON.stringify({ anonymousId: guestA_Id }),
  }, { Authorization: `Bearer ${userJwt}` });
  assert(repeatClaimRes.ok && repeatClaimRes.data.claimedCount === 0, '17. Repeated claim is idempotent (claimedCount = 0)', repeatClaimRes);

  // ----------------------------------------------------
  // SECTION 5: CLAIM SECURITY CHECKS
  // ----------------------------------------------------
  const noJwtClaim = await request('/learners/claim', {
    method: 'POST',
    body: JSON.stringify({ anonymousId: randomUUID() }),
  });
  assert(noJwtClaim.status === 401, '18. Claim without JWT returns 401 Unauthorized', noJwtClaim);

  const invalidUuidClaim = await request('/learners/claim', {
    method: 'POST',
    body: JSON.stringify({ anonymousId: 'invalid-non-uuid' }),
  }, { Authorization: `Bearer ${userJwt}` });
  assert(invalidUuidClaim.status === 400, '19. Claim with malformed anonymousId returns 400 Bad Request', invalidUuidClaim);

  // ----------------------------------------------------
  // SECTION 6: CERTIFICATE PROTECTION & 80%+ MASTERY
  // ----------------------------------------------------
  const guestCertClaim = await request('/certificates/claim', {
    method: 'POST',
    body: JSON.stringify({ courseId: testCourseId }),
  }, { 'X-Anonymous-ID': guestA_Id });
  assert(guestCertClaim.status === 401, '20. Guest certificate claim returns 401 Unauthorized', guestCertClaim);

  // Complete all required course lessons for user
  const courseWithLessons = await prisma.course.findUnique({
    where: { id: testCourseId },
    include: { modules: { include: { lessons: true } } },
  });
  const allCourseLessons = courseWithLessons?.modules.flatMap((m) => m.lessons.map((l) => l.id)) || [];

  const userObj = await prisma.user.findUnique({ where: { email: userEmail } });
  const quizzesForCourse = await prisma.quiz.findMany({
    where: { lessonId: { in: allCourseLessons } },
  });
  for (const q of quizzesForCourse) {
    await prisma.quizAttempt.create({
      data: {
        userId: userObj!.id,
        quizId: q.id,
        score: 100,
        passed: true,
        answersJson: {},
      },
    });
  }

  for (const lId of allCourseLessons) {
    await request('/progress/complete', {
      method: 'POST',
      body: JSON.stringify({ lessonId: lId }),
    }, { Authorization: `Bearer ${userJwt}` });
  }

  // Claim certificate for completed course
  const validCertClaim = await request('/certificates/claim', {
    method: 'POST',
    body: JSON.stringify({ courseId: testCourseId }),
  }, { Authorization: `Bearer ${userJwt}` });

  assert((validCertClaim.ok || validCertClaim.status === 201) && validCertClaim.data.code, '21. Authenticated completed user receives valid certificate code', validCertClaim);
  const certCode = validCertClaim.data.code;

  // Duplicate certificate claim idempotency
  const dupCertClaim = await request('/certificates/claim', {
    method: 'POST',
    body: JSON.stringify({ courseId: testCourseId }),
  }, { Authorization: `Bearer ${userJwt}` });
  assert((dupCertClaim.ok || dupCertClaim.status === 201) && dupCertClaim.data.code === certCode, '22. Duplicate certificate claim returns identical certificate', dupCertClaim);

  // Public certificate verification endpoint
  if (certCode) {
    const publicCertRes = await request(`/certificates/${certCode}`);
    assert(publicCertRes.ok && publicCertRes.data.code === certCode, '23. Public certificate verification endpoint works', publicCertRes);
  } else {
    assert(false, '23. Public certificate verification endpoint works', 'No certCode');
  }

  // Clean up created test data safely
  if (meRes.data?.id) {
    await prisma.certificate.deleteMany({ where: { userId: meRes.data.id } }).catch(() => null);
    await prisma.userProgress.deleteMany({ where: { userId: meRes.data.id } }).catch(() => null);
    await prisma.savedLesson.deleteMany({ where: { userId: meRes.data.id } }).catch(() => null);
    await prisma.sandboxSession.deleteMany({ where: { userId: meRes.data.id } }).catch(() => null);
    await prisma.user.delete({ where: { id: meRes.data.id } }).catch(() => null);
  }
  await prisma.$disconnect();

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedCount} passed, ${failedCount} failed.`);
  console.log('==================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runPhase10ComprehensiveTests();
