import { test, expect } from '@playwright/test';

test.describe('Drop Z: End-to-End Browser Flows, Viewports & Security Gate', () => {

  test('1. Anonymous Browser Flows & Navigation (Desktop Viewport)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // A. Homepage Load & Core Branding
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveTitle(/NetVision/i);
    const brandHeading = page.locator('text=NetVision').first();
    await expect(brandHeading).toBeVisible();

    // B. Course Discovery Flow
    await page.goto('/courses');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // C. Public Verification Flow
    await page.goto('/certificates/verify');
    await page.waitForLoadState('domcontentloaded');
    const verifyInput = page.locator('input[type="text"], input[placeholder*="Credential"], input[placeholder*="ID"]');
    await expect(verifyInput.first()).toBeVisible();

    // D. 404 Error Boundary Handling
    await page.goto('/nonexistent-test-path-404');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText(/404/i).first()).toBeVisible();
  });

  test('2. Multi-Viewport Responsiveness (Tablet 768x1024 & Mobile 375x667)', async ({ page }) => {
    // Tablet Viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=NetVision').first()).toBeVisible();

    // Mobile Viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=NetVision').first()).toBeVisible();

    // Verify zero horizontal scroll overflow on mobile
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // 2px margin of error for subpixel rendering
  });

  test('3. Student Authentication Flows & Route Protection', async ({ page, request }) => {
    // A. Registration Viewport
    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');
    const regEmailInput = page.locator('input[type="email"]');
    const regPasswordInput = page.locator('input[type="password"]');
    await expect(regEmailInput).toBeVisible();
    await expect(regPasswordInput).toBeVisible();

    // B. Login Viewport
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
    const loginEmailInput = page.locator('input[type="email"]');
    const loginPasswordInput = page.locator('input[type="password"]');
    await expect(loginEmailInput).toBeVisible();
    await expect(loginPasswordInput).toBeVisible();

    // C. Route Protection on Dashboard without JWT
    await page.context().clearCookies();
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    const currentUrl = page.url();
    const hasLoginInUrl = currentUrl.includes('/login');
    const hasSignInPrompt = (await page.locator('text=Sign In,text=Log In,a[href*="/login"]').count()) > 0;
    const isGuest = (await page.locator('text=GUEST').count()) > 0;
    expect(hasLoginInUrl || hasSignInPrompt || isGuest).toBe(true);

    // D. API Route Protection (401 Unauthorized)
    const unauthCertsRes = await request.get('http://localhost:4000/api/v1/certificates/mine');
    expect(unauthCertsRes.status()).toBe(401);

    const unauthCapstoneStart = await request.post('http://localhost:4000/api/v1/certifications/capstone/start', {
      data: {},
    });
    expect(unauthCapstoneStart.status()).toBe(401);
  });

  test('4. Assessment Privacy & Capstone Blueprint Invariants', async ({ request }) => {
    const specRes = await request.get('http://localhost:4000/api/v1/certifications/capstone/specification');
    expect(specRes.ok()).toBe(true);
    const spec = await specRes.json();

    expect(spec.examCode).toBe('NV-NET-MASTERY-EXAM');
    expect(spec.certificationCode).toBe('NV-NET-MASTERY');
    expect(spec.durationMinutes).toBe(120);
    expect(spec.scoringWeights.passingScore).toBe(85);

    // Verify zero leaked answers
    const rawText = JSON.stringify(spec);
    expect(rawText).not.toContain('"answerKey"');
    expect(rawText).not.toContain('"correctOption"');
    expect(rawText).not.toContain('"solution"');
  });
});
