import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GUEST_CERT_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
let AUTH_USER_ID = '';
let AUTH_TOKEN = '';
let TEST_COURSE_ID = '';
let TEST_COURSE_LESSON_IDS: string[] = [];

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
  const testEmail = `phase8-user-${Date.now()}@netvision.edu`;
  const testPass = 'Password123!';

  // Step 1: Register test user
  const regRes = await makeApiRequest('POST', '/auth/register', {}, {
    email: testEmail,
    password: testPass,
    username: `p8u${Date.now().toString().slice(-6)}`,
    fullName: 'Phase 8 Certificate Tester',
  });

  const devOtp = regRes.body?.devOtpCode;
  if (devOtp) {
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

  // Find a course with lessons
  const course = await prisma.course.findFirst({
    include: { modules: { include: { lessons: true } } },
  });

  if (!course) throw new Error('No course found in database for Phase 8 test');
  TEST_COURSE_ID = course.id;
  TEST_COURSE_LESSON_IDS = course.modules.flatMap((m) => m.lessons.map((l) => l.id));

  // Cleanup past certificates & user progress for test user & guest
  await prisma.certificate.deleteMany({
    where: { OR: [{ userId: AUTH_USER_ID }, { courseId: TEST_COURSE_ID }] },
  });
  await prisma.userProgress.deleteMany({
    where: { OR: [{ userId: AUTH_USER_ID }, { anonymousId: GUEST_CERT_ID }] },
  });
}

async function runPhase8TestSuite() {
  console.log('==================================================');
  console.log('NETVISION PHASE 8 — CERTIFICATE PROTECTION TEST SUITE');
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

  // TEST 1: Guest request without JWT returns 401 Unauthorized
  const res1 = await makeApiRequest('POST', '/certificates/claim', {}, { courseId: TEST_COURSE_ID });
  assert(res1.status === 401, 'TEST 1: Guest request without JWT returns 401 Unauthorized');

  // TEST 2: Guest request with X-Anonymous-ID but no JWT returns 401 Unauthorized
  const res2 = await makeApiRequest(
    'POST',
    '/certificates/claim',
    { 'X-Anonymous-ID': GUEST_CERT_ID },
    { courseId: TEST_COURSE_ID }
  );
  assert(res2.status === 401, 'TEST 2: Guest request with X-Anonymous-ID but no JWT returns 401 Unauthorized');

  // TEST 3: Invalid JWT returns 401 Unauthorized
  const res3 = await makeApiRequest(
    'POST',
    '/certificates/claim',
    { Authorization: 'Bearer invalid.jwt.token' },
    { courseId: TEST_COURSE_ID }
  );
  assert(res3.status === 401, 'TEST 3: Invalid JWT returns 401 Unauthorized');

  // TEST 4: Authenticated user with incomplete course -> certificate is NOT issued (400 Bad Request)
  const res4 = await makeApiRequest(
    'POST',
    '/certificates/claim',
    { Authorization: `Bearer ${AUTH_TOKEN}` },
    { courseId: TEST_COURSE_ID }
  );
  assert(
    res4.status === 400 && res4.body.message?.includes('eligibility not met'),
    'TEST 4: Incomplete course claim rejected with 400 Bad Request'
  );

  // TEST 12: Anonymous progress alone cannot generate a certificate directly
  await prisma.anonymousLearner.upsert({
    where: { id: GUEST_CERT_ID },
    update: {},
    create: { id: GUEST_CERT_ID },
  });
  for (const lessonId of TEST_COURSE_LESSON_IDS) {
    await prisma.userProgress.create({
      data: {
        anonymousId: GUEST_CERT_ID,
        lessonId,
        started: true,
        viewed: true,
        completed: true,
        score: 100,
      },
    });
  }
  const res12 = await makeApiRequest(
    'POST',
    '/certificates/claim',
    { 'X-Anonymous-ID': GUEST_CERT_ID },
    { courseId: TEST_COURSE_ID }
  );
  assert(
    res12.status === 401,
    'TEST 12: Anonymous progress alone cannot generate a certificate directly (401 Unauthorized)'
  );

  // TEST 5: Authenticated user completes all lessons in PostgreSQL -> certificate is issued
  for (const lessonId of TEST_COURSE_LESSON_IDS) {
    await prisma.userProgress.create({
      data: {
        userId: AUTH_USER_ID,
        lessonId,
        started: true,
        viewed: true,
        completed: true,
        score: 100,
      },
    });
  }
  const res5 = await makeApiRequest(
    'POST',
    '/certificates/claim',
    { Authorization: `Bearer ${AUTH_TOKEN}` },
    { courseId: TEST_COURSE_ID }
  );
  const issuedCertId = res5.body?.id;
  const issuedCertCode = res5.body?.code;
  assert(
    res5.status === 200 && !!issuedCertId && !!issuedCertCode,
    'TEST 5: Authenticated user with valid course completion receives certificate'
  );

  // TEST 6: Certificate belongs to authenticated user's ID
  const certInDb = issuedCertId
    ? await prisma.certificate.findUnique({ where: { id: issuedCertId } })
    : null;
  assert(
    certInDb !== null && certInDb.userId === AUTH_USER_ID,
    'TEST 6: Certificate belongs exclusively to authenticated user ID'
  );

  // TEST 7: Client cannot supply another user's ID in payload
  const res7 = await makeApiRequest(
    'POST',
    '/certificates/claim',
    { Authorization: `Bearer ${AUTH_TOKEN}` },
    { courseId: TEST_COURSE_ID, userId: 'arbitrary-victim-id' }
  );
  const clientCannotHijackId =
    res7.status === 400 ||
    (res7.status === 200 && (res7.body?.user?.id === AUTH_USER_ID || res7.body?.userId === AUTH_USER_ID));
  assert(
    clientCannotHijackId,
    'TEST 7: Client cannot choose another user ID (destination is derived strictly from JWT)'
  );

  // TEST 8: Repeated certificate claim does not create duplicates
  const res8 = await makeApiRequest(
    'POST',
    '/certificates/claim',
    { Authorization: `Bearer ${AUTH_TOKEN}` },
    { courseId: TEST_COURSE_ID }
  );
  const totalCertsInDb = await prisma.certificate.count({
    where: { userId: AUTH_USER_ID, courseId: TEST_COURSE_ID },
  });
  assert(
    res8.status === 200 && res8.body.id === issuedCertId && totalCertsInDb === 1,
    'TEST 8: Repeated certificate claim is idempotent (returns existing certificate, 1 record in DB)'
  );

  // TEST 9: Existing certificate can still be retrieved via GET /certificates/:id
  const res9 = await makeApiRequest('GET', `/certificates/${issuedCertCode}`, {});
  assert(
    res9.status === 200 && res9.body.id === issuedCertId,
    'TEST 9: Public retrieval of certificate by code works as expected'
  );

  // TEST 10: JWT authentication remains functional
  assert(!!AUTH_TOKEN && !!AUTH_USER_ID, 'TEST 10: JWT authentication remains 100% functional');

  // TEST 11: Guest learning endpoints remain accessible
  const res11 = await makeApiRequest('GET', '/progress', { 'X-Anonymous-ID': GUEST_CERT_ID });
  assert(res11.status === 200, 'TEST 11: Guest learning endpoints remain fully accessible');

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedTests} passed, ${failedTests} failed.`);
  console.log('==================================================');

  await prisma.$disconnect();
  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase8TestSuite().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
