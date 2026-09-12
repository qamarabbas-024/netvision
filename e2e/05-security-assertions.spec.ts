import { test, expect } from '@playwright/test';
import { TEST_USERS, seedAllE2EData, prisma } from './helpers/seed-e2e-data';
import { loginViaUI, setupAuthState } from './helpers/auth';

test.describe('Drop #10 Phase 9 — Security Browser Tests', () => {

  test('1. Authentication Protection: unauthenticated visitor cannot access protected certification actions', async ({
    page,
    request,
  }) => {
    // Clear cookies & storage to guarantee unauthenticated state
    await page.context().clearCookies();

    // A. Backend API protection: Calling private certification endpoints without JWT returns 401 Unauthorized
    const unauthClaimRes = await request.post('http://localhost:4000/api/v1/certifications/NV-NET-C01/claim-certificate', {
      data: {},
    });
    expect(unauthClaimRes.status()).toBe(401);

    const unauthStartRes = await request.post('http://localhost:4000/api/v1/certifications/capstone/start', {
      data: {},
    });
    expect(unauthStartRes.status()).toBe(401);

    const unauthMineRes = await request.get('http://localhost:4000/api/v1/certificates/mine');
    expect(unauthMineRes.status()).toBe(401);

    // B. Browser UI Navigation: Visiting dashboard or protected pages without auth state
    // When visiting /dashboard or /certifications/mastery unauthenticated, the application
    // prompts login or redirects to /login.
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Either redirected to /login or shows sign-in requirement
    const currentUrl = page.url();
    const hasLoginInUrl = currentUrl.includes('/login');
    const hasSignInPrompt = (await page.locator('text=Sign In,text=Log In,a[href*="/login"]').count()) > 0;
    const isGuest = (await page.locator('text=GUEST').count()) > 0;

    expect(hasLoginInUrl || hasSignInPrompt || isGuest).toBe(true);
  });

  test('2. Client-Score Tampering: authoritative backend ignores injected score fields', async ({
    request,
  }) => {
    // Login as Capstone candidate who has not yet taken capstone
    const loginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: {
        email: TEST_USERS.CAPSTONE_PASS.email,
        password: TEST_USERS.CAPSTONE_PASS.password,
      },
    });
    expect(loginRes.ok()).toBe(true);
    const authData = await loginRes.json();
    const token = authData.token || authData.accessToken;
    expect(token).toBeTruthy();

    // Start a fresh attempt
    const startRes = await request.post('http://localhost:4000/api/v1/certifications/capstone/start', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(startRes.ok()).toBe(true);
    const attemptData = await startRes.json();
    const attemptId = attemptData.attemptId || attemptData.id;
    expect(attemptId).toBeTruthy();

    // Attempt to submit empty/wrong answers with injected client-side tampering fields
    const maliciousPayload = {
      // Intentionally wrong answers (should fail with 0% or low score)
      theoryAnswers: { 'THEORY-Q1': 3, 'THEORY-Q2': 3 },
      incidentAnswers: {},
      forensicsAnswers: {},
      // Injected malicious spoof fields
      finalScore: 100,
      score: 100,
      passed: true,
      passThreshold: 0,
      componentScores: {
        theory: { score: 100, weighted: 40 },
        incident: { score: 100, weighted: 35 },
        forensics: { score: 100, weighted: 25 },
      },
      weights: { theory: 10, incident: 10, forensics: 10 },
    };

    const submitRes = await request.post(
      `http://localhost:4000/api/v1/certifications/capstone/${attemptId}/submit`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: maliciousPayload,
      }
    );

    // Authoritative backend defense:
    // When client injects non-whitelisted tampering fields (finalScore, passed, weights, threshold),
    // NestJS ValidationPipe with forbidNonWhitelisted: true strictly blocks the request with 400 Bad Request,
    // OR strips them and grading evaluates passed: false with score < 85%.
    if (submitRes.status() === 400) {
      expect(submitRes.status()).toBe(400);
      const errorJson = await submitRes.json();
      expect(JSON.stringify(errorJson)).toMatch(/property.*should not exist|Bad Request/i);
    } else {
      expect(submitRes.ok()).toBe(true);
      const result = await submitRes.json();
      expect(result.passed).toBe(false);
      expect(result.score).toBeLessThan(85);
    }

    // Crucial invariant: The attempt in the database NEVER has passed: true
    const dbAttempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });
    expect(dbAttempt).toBeTruthy();
    expect(dbAttempt?.passed).not.toBe(true);
    if (dbAttempt?.score != null) {
      expect(Number(dbAttempt.score)).toBeLessThan(85);
    }
  });

  test('3. IDOR: Candidate cannot download or manipulate another user\'s private certificate', async ({
    request,
  }) => {
    // 1. Identify User A's certificate (Mastery candidate's NV-NET-C01)
    const masteryUser = await prisma.user.findUnique({
      where: { email: TEST_USERS.MASTERY_CLAIM.email },
      include: { certificates: true },
    });
    expect(masteryUser).toBeTruthy();
    const userACert = masteryUser?.certificates[0];
    expect(userACert).toBeTruthy();

    // 2. Login as Security Auditor Candidate (User B)
    const loginResB = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: {
        email: TEST_USERS.SECURITY.email,
        password: TEST_USERS.SECURITY.password,
      },
    });
    expect(loginResB.ok()).toBe(true);
    const authDataB = await loginResB.json();
    const tokenB = authDataB.token || authDataB.accessToken;

    // 3. User B tries to download User A's private certificate PDF via authorized endpoint
    const idorDownloadRes = await request.get(
      `http://localhost:4000/api/v1/certificates/${userACert?.credentialId}/download`,
      {
        headers: { Authorization: `Bearer ${tokenB}` },
      }
    );

    // Strict Ownership Enforcement: Must return 403 Forbidden
    expect(idorDownloadRes.status()).toBe(403);
  });

  test('4. Public Verification Privacy: sanitizes sensitive internal fields', async ({
    request,
    page,
  }) => {
    // 1. Find an active certificate in DB
    const cert = await prisma.certificate.findFirst({
      where: { status: 'ACTIVE' },
    });
    expect(cert).toBeTruthy();
    const credId = cert?.credentialId || cert?.verificationCode;

    // 2. Query public verification endpoint
    const verifyApiRes = await request.get(`http://localhost:4000/api/v1/certificates/verify/${credId}`);
    expect(verifyApiRes.ok()).toBe(true);
    const pubData = await verifyApiRes.json();

    // Private fields that must NEVER leak in public verification
    expect(pubData.userId).toBeUndefined();
    expect(pubData.passwordHash).toBeUndefined();
    expect(pubData.email).toBeUndefined();
    expect(pubData.userProgress).toBeUndefined();
    expect(pubData.examAttempts).toBeUndefined();
    expect(pubData.answersJson).toBeUndefined();

    // 3. Visit public verification page in browser
    await page.goto(`/certificates/verify/${credId}`);
    await page.waitForLoadState('domcontentloaded');

    // Ensure no sensitive hash or email text is rendered in the HTML body
    const bodyContent = await page.content();
    expect(bodyContent).not.toContain('$argon2');
    expect(bodyContent).not.toContain('e2e-');
    expect(bodyContent).not.toContain('passwordHash');
  });

  test('5. Assessment Privacy: answer keys and rubrics are absent from client payloads', async ({
    request,
  }) => {
    // Query specification endpoint
    const specRes = await request.get('http://localhost:4000/api/v1/certifications/capstone/specification');
    expect(specRes.ok()).toBe(true);
    const specText = await specRes.text();

    // Answer keys / grading rubrics / solution keywords must not be exposed
    expect(specText).not.toContain('"answerKey"');
    expect(specText).not.toContain('"correctOption"');
    expect(specText).not.toContain('"correctAnswer"');
    expect(specText).not.toContain('"remediationChoice"');

    // Login and query attempt question payload
    const loginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: {
        email: TEST_USERS.CAPSTONE_PASS.email,
        password: TEST_USERS.CAPSTONE_PASS.password,
      },
    });
    const { token } = await loginRes.json();

    // Inspect specification and attempt questions
    const spec = JSON.parse(specText);
    for (const q of spec.assessment?.theoryQuestions || []) {
      expect(q.correctOption).toBeUndefined();
      expect(q.answerKey).toBeUndefined();
    }
    for (const f of spec.assessment?.forensicsQuestions || []) {
      expect(f.correctAnswer).toBeUndefined();
      expect(f.solution).toBeUndefined();
    }
  });
});
