import { test, expect } from '@playwright/test';
import { prisma, E2E_PASSWORD, E2E_PASSWORD_HASH } from './helpers/seed-e2e-data';

test.describe('E2E: Concurrent Multi-Browser Isolated Sessions', () => {
  const user1Email = 'concurrent-student-1@netvision.test';
  const user2Email = 'concurrent-student-2@netvision.test';
  const adminEmail = 'concurrent-admin@netvision.test';

  test.beforeAll(async () => {
    // Ensure test users exist in database
    await prisma.user.upsert({
      where: { email: user1Email },
      update: { passwordHash: E2E_PASSWORD_HASH, fullName: 'Student One', role: 'STUDENT' },
      create: {
        email: user1Email,
        username: 'concurrent_student_1',
        passwordHash: E2E_PASSWORD_HASH,
        fullName: 'Student One',
        role: 'STUDENT',
      },
    });

    await prisma.user.upsert({
      where: { email: user2Email },
      update: { passwordHash: E2E_PASSWORD_HASH, fullName: 'Student Two', role: 'STUDENT' },
      create: {
        email: user2Email,
        username: 'concurrent_student_2',
        passwordHash: E2E_PASSWORD_HASH,
        fullName: 'Student Two',
        role: 'STUDENT',
      },
    });

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash: E2E_PASSWORD_HASH, fullName: 'Admin Auditor', role: 'ADMIN' },
      create: {
        email: adminEmail,
        username: 'concurrent_admin_auditor',
        passwordHash: E2E_PASSWORD_HASH,
        fullName: 'Admin Auditor',
        role: 'ADMIN',
      },
    });
  });

  test.afterAll(async () => {
    const emails = [user1Email, user2Email, adminEmail];
    const users = await prisma.user.findMany({ where: { email: { in: emails } }, select: { id: true } });
    const ids = users.map((u) => u.id);
    if (ids.length > 0) {
      await prisma.userProgress.deleteMany({ where: { userId: { in: ids } } });
      await prisma.certificate.deleteMany({ where: { userId: { in: ids } } });
      await prisma.examAttempt.deleteMany({ where: { userId: { in: ids } } });
      await prisma.quizAttempt.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
  });

  test('5 Simultaneous Isolated Browser Contexts without State or Token Contamination', async ({ browser }) => {
    // Create 5 distinct browser contexts to simulate 5 independent physical devices / users
    const [contextA, contextB, contextC, contextD, contextE] = await Promise.all([
      browser.newContext({ viewport: { width: 1280, height: 800 } }),
      browser.newContext({ viewport: { width: 1024, height: 768 } }),
      browser.newContext({ viewport: { width: 390, height: 844 } }), // Mobile guest
      browser.newContext({ viewport: { width: 1280, height: 800 } }), // Admin
      browser.newContext({ viewport: { width: 768, height: 1024 } }), // Tablet public verifier
    ]);

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();
    const pageC = await contextC.newPage();
    const pageD = await contextD.newPage();
    const pageE = await contextE.newPage();

    // Context A: Student 1 Login
    await pageA.goto('/login');
    await pageA.locator('input[type="email"]').fill(user1Email);
    await pageA.locator('input[type="password"]').fill(E2E_PASSWORD);
    await pageA.locator('button[type="submit"]').click();
    await expect(pageA).toHaveURL(/.*\/dashboard/, { timeout: 15000 });

    // Context B: Student 2 Login (Simultaneously)
    await pageB.goto('/login');
    await pageB.locator('input[type="email"]').fill(user2Email);
    await pageB.locator('input[type="password"]').fill(E2E_PASSWORD);
    await pageB.locator('button[type="submit"]').click();
    await expect(pageB).toHaveURL(/.*\/dashboard/, { timeout: 15000 });

    // Context C: Anonymous Learner (Guest access on Courses)
    await pageC.goto('/courses');
    await pageC.waitForLoadState('domcontentloaded');

    // Context D: Admin Login
    await pageD.goto('/login');
    await pageD.locator('input[type="email"]').fill(adminEmail);
    await pageD.locator('input[type="password"]').fill(E2E_PASSWORD);
    await pageD.locator('button[type="submit"]').click();
    await expect(pageD).toHaveURL(/.*\/dashboard/, { timeout: 15000 });

    // Context E: Public Verification Page (Unauthenticated)
    await pageE.goto('/certificates/verify/NV-TEST-INVALID-CODE');
    await pageE.waitForLoadState('domcontentloaded');

    // --- VERIFY SESSION ISOLATION & ZERO TOKEN CONTAMINATION ---
    const tokenA = await pageA.evaluate(() => localStorage.getItem('netvision_token'));
    const tokenB = await pageB.evaluate(() => localStorage.getItem('netvision_token'));
    const tokenC = await pageC.evaluate(() => localStorage.getItem('netvision_token'));
    const tokenD = await pageD.evaluate(() => localStorage.getItem('netvision_token'));
    const tokenE = await pageE.evaluate(() => localStorage.getItem('netvision_token'));

    // Assert tokens exist for authenticated sessions and are strictly distinct
    expect(tokenA).toBeTruthy();
    expect(tokenB).toBeTruthy();
    expect(tokenD).toBeTruthy();
    expect(tokenA).not.toBe(tokenB);
    expect(tokenA).not.toBe(tokenD);
    expect(tokenB).not.toBe(tokenD);

    // Assert Context C (Guest) and Context E (Public) have NO authenticated tokens
    expect(tokenC).toBeNull();
    expect(tokenE).toBeNull();

    // Verify Context E displays truthful verification failure for invalid certificate
    const invalidVerificationBadge = pageE.locator('text=Credential Not Verified').or(pageE.locator('text=Certificate Not Found'));
    await expect(invalidVerificationBadge.first()).toBeVisible({ timeout: 15000 });

    // Concurrent Operations: Student A & Student B browsing courses in parallel
    await Promise.all([
      pageA.goto('/courses'),
      pageB.goto('/courses'),
      pageC.goto('/'),
      pageD.goto('/settings'),
    ]);

    await Promise.all([
      expect(pageA).toHaveURL(/.*\/courses/),
      expect(pageB).toHaveURL(/.*\/courses/),
      expect(pageC).toHaveURL(/.*\/$/),
      expect(pageD).toHaveURL(/.*\/settings/),
    ]);

    // Clean up contexts
    await Promise.all([
      contextA.close(),
      contextB.close(),
      contextC.close(),
      contextD.close(),
      contextE.close(),
    ]);
  });
});
