import { PrismaClient } from '@prisma/client';
import { CookieStateStore } from '../src/auth/stores/cookie-state.store';

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

async function runSecurityHardeningTests() {
  console.log('==================================================');
  console.log('NETVISION PHASE 10 — SECURITY HARDENING TEST SUITE');
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
  // TEST 1: OAUTH COOKIE STATE STORE (ANTI-CSRF)
  // ----------------------------------------------------
  const store = new CookieStateStore();
  let generatedState = '';
  const mockReqStore: any = { res: { cookie: () => {} } };
  store.store(mockReqStore, (err, state) => {
    if (!err && state) generatedState = state;
  });
  assert(generatedState.length === 32, '1. OAuth CookieStateStore generates 32-char hex random state');

  let verifyResult = false;
  const mockReqVerifyValid: any = {
    cookies: { netvision_oauth_state: generatedState },
    res: { clearCookie: () => {} },
  };
  store.verify(mockReqVerifyValid, generatedState, (err, ok) => {
    if (ok) verifyResult = true;
  });
  assert((verifyResult as boolean) === true, '2. OAuth CookieStateStore verifies matching state successfully');

  let verifyInvalidResult = true;
  const mockReqVerifyInvalid: any = {
    cookies: { netvision_oauth_state: generatedState },
    res: { clearCookie: () => {} },
  };
  store.verify(mockReqVerifyInvalid, 'invalid_attacker_state_token', (err, ok) => {
    if (!ok) verifyInvalidResult = false;
  });
  assert((verifyInvalidResult as boolean) === false, '3. OAuth CookieStateStore rejects mismatched state token (Anti-CSRF)');

  // ----------------------------------------------------
  // TEST 2: ELIMINATION OF DEV OTP IN API RESPONSES
  // ----------------------------------------------------
  const testEmail = `sec-user-${Date.now()}@netvision.edu`;
  const regRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: testEmail,
      username: `secu_${Date.now().toString().slice(-8)}`,
      password: 'SecurePassword123!',
      fullName: 'Security Hardening Tester',
    }),
  });

  assert(regRes.ok, '4. Registration request completes successfully');
  assert(regRes.data.devOtpCode === undefined, '5. Registration HTTP response JSON does NOT contain devOtpCode');
  assert(typeof regRes.data.message === 'string' && !regRes.data.message.includes('DEV CODE'), '6. Registration response message does NOT leak plaintext OTP');

  // Verify OTP from database record
  const dbVerificationRecord = await prisma.emailVerification.findFirst({
    where: { email: testEmail },
    orderBy: { createdAt: 'desc' },
  });
  assert(dbVerificationRecord !== null, '7. Verification record exists in PostgreSQL database');

  // ----------------------------------------------------
  // TEST 3: AUTHENTICATED ROUTE RATE LIMITING
  // ----------------------------------------------------
  // Trigger rapid login requests to exceed route limit (20 req/min)
  let rateLimited = false;
  for (let i = 0; i < 22; i++) {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: 'WrongPassword123!' }),
    });
    if (loginRes.status === 429) {
      rateLimited = true;
      break;
    }
  }
  assert(rateLimited === true, '8. Exceeding 20 rapid login requests triggers 429 Too Many Requests rate limiting');

  // Clean up created test user
  await prisma.emailVerification.deleteMany({ where: { email: testEmail } }).catch(() => null);
  await prisma.user.deleteMany({ where: { email: testEmail } }).catch(() => null);
  await prisma.$disconnect();

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedCount} passed, ${failedCount} failed.`);
  console.log('==================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runSecurityHardeningTests();
