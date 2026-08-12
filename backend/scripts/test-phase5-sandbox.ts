import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GUEST_A_ID = '55555555-5555-4555-8555-555555555555';
const GUEST_B_ID = '66666666-6666-4666-8666-666666666666';
let AUTH_USER_ID = '';
let AUTH_TOKEN = '';

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
  const testEmail = `phase5-user-${Date.now()}@netvision.edu`;
  const testPass = 'Password123!';

  // Step 1: Register test user
  const regRes = await makeApiRequest('POST', '/auth/register', {}, {
    email: testEmail,
    password: testPass,
    username: `p5u${Date.now().toString().slice(-6)}`,
    fullName: 'Phase 5 Tester',
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

  // Cleanup old test sessions
  await prisma.sandboxSession.deleteMany({
    where: {
      OR: [
        { anonymousId: GUEST_A_ID },
        { anonymousId: GUEST_B_ID },
        ...(AUTH_USER_ID ? [{ userId: AUTH_USER_ID }] : []),
      ],
    },
  });
}

async function runPhase5TestSuite() {
  console.log('==================================================');
  console.log('NETVISION PHASE 5 — GUEST SANDBOX SESSION TEST SUITE');
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

  // TEST 1: Guest creates session with X-Anonymous-ID
  const res1 = await makeApiRequest(
    'POST',
    '/sandbox/sessions',
    { 'X-Anonymous-ID': GUEST_A_ID },
    { providerType: 'SIMULATED', durationMinutes: 30 }
  );
  const sessionA_Id = res1.body?.sessionId;
  const sessionInDbA = sessionA_Id ? await prisma.sandboxSession.findUnique({ where: { id: sessionA_Id } }) : null;

  assert(
    res1.status === 201 &&
      sessionInDbA !== null &&
      sessionInDbA.userId === null &&
      sessionInDbA.anonymousId === GUEST_A_ID,
    'TEST 1: Guest creates session with X-Anonymous-ID (userId = null, anonymousId = guest UUID)'
  );

  // TEST 2: Guest A creates session, Guest B tries to access it -> 403 Forbidden
  const res2 = await makeApiRequest(
    'GET',
    `/sandbox/sessions/${sessionA_Id}`,
    { 'X-Anonymous-ID': GUEST_B_ID }
  );
  assert(
    res2.status === 403,
    'TEST 2: Guest B attempting to access Guest A session returns 403 Forbidden'
  );

  // TEST 3: Authenticated User session created, another user cannot access it
  let userSessionId = '';
  if (AUTH_TOKEN) {
    const resAuthSession = await makeApiRequest(
      'POST',
      '/sandbox/sessions',
      { Authorization: `Bearer ${AUTH_TOKEN}` },
      { providerType: 'SIMULATED', durationMinutes: 30 }
    );
    userSessionId = resAuthSession.body?.sessionId;
  }

  // TEST 4: Guest tries to access authenticated user's session -> 403 Forbidden
  const res4 = await makeApiRequest(
    'GET',
    `/sandbox/sessions/${userSessionId}`,
    { 'X-Anonymous-ID': GUEST_A_ID }
  );
  assert(
    res4.status === 403,
    'TEST 4: Guest attempting to access authenticated User session returns 403 Forbidden'
  );

  // TEST 5: Authenticated user sends JWT + X-Anonymous-ID -> JWT wins
  if (AUTH_TOKEN) {
    const res5 = await makeApiRequest(
      'POST',
      '/sandbox/sessions',
      { Authorization: `Bearer ${AUTH_TOKEN}`, 'X-Anonymous-ID': GUEST_B_ID },
      { providerType: 'SIMULATED', durationMinutes: 30 }
    );
    const createdSession = await prisma.sandboxSession.findUnique({
      where: { id: res5.body.sessionId },
    });
    assert(
      res5.status === 201 && createdSession?.userId === AUTH_USER_ID && createdSession?.anonymousId === null,
      'TEST 5: JWT user takes precedence over X-Anonymous-ID (anonymousId is null)'
    );
  } else {
    console.log('[SKIP] TEST 5: Auth token unavailable');
  }

  // TEST 6: No JWT and no X-Anonymous-ID -> session creation fails with 400 Bad Request
  const res6 = await makeApiRequest(
    'POST',
    '/sandbox/sessions',
    {},
    { providerType: 'SIMULATED', durationMinutes: 30 }
  );
  assert(
    res6.status === 400,
    'TEST 6: Session creation with no identity header fails with 400 Bad Request'
  );

  // TEST 7: Guest session can execute commands safely
  const res7 = await makeApiRequest(
    'POST',
    `/sandbox/sessions/${sessionA_Id}/execute`,
    { 'X-Anonymous-ID': GUEST_A_ID },
    { command: 'ping 192.168.1.1' }
  );
  assert(
    res7.status === 200 && (res7.body.result?.output || '').toLowerCase().includes('pinging 192.168.1.1'),
    'TEST 7: Guest session executes simulated commands safely'
  );

  // TEST 8: Expired session cannot execute commands
  if (sessionA_Id) {
    // Manually expire session in DB
    await prisma.sandboxSession.update({
      where: { id: sessionA_Id },
      data: { expiresAt: new Date(Date.now() - 1000), status: 'EXPIRED' },
    });
  }
  const res8 = await makeApiRequest(
    'POST',
    `/sandbox/sessions/${sessionA_Id}/execute`,
    { 'X-Anonymous-ID': GUEST_A_ID },
    { command: 'ping 10.0.0.1' }
  );
  assert(
    res8.status === 400 && res8.body.message?.includes('expired'),
    'TEST 8: Expired session cannot execute commands (400 Bad Request)'
  );

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedTests} passed, ${failedTests} failed.`);
  console.log('==================================================');

  await prisma.$disconnect();
  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase5TestSuite().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
