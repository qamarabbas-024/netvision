import { test, expect } from '@playwright/test';
import { seedAllE2EData, cleanupE2EData, TEST_USERS } from './helpers/seed-e2e-data';
import { loginViaUI } from './helpers/auth';

test.describe('E2E: Certification Dashboard', () => {

  test('Learner authenticates and views all 6 canonical credentials with real backend state', async ({ page }) => {
    // Intercept backend API calls to ensure requests are hitting real backend
    const certsApiPromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certificates/mine') && res.status() === 200
    );
    const masteryApiPromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certifications/mastery/eligibility') && res.status() === 200
    );

    // 1. Authenticate via real UI login form
    await loginViaUI(page, TEST_USERS.DASHBOARD.email, TEST_USERS.DASHBOARD.password);

    // 2. Navigate to Certification Dashboard
    await page.goto('/certificates');
    await page.waitForLoadState('domcontentloaded');

    // 3. Verify real API responses were received
    const certsResponse = await certsApiPromise;
    const certsData = await certsResponse.json();
    expect(Array.isArray(certsData)).toBeTruthy();
    expect(certsData.length).toBe(0); // Clean dashboard user has 0 earned certificates

    const masteryResponse = await masteryApiPromise;
    const masteryData = await masteryResponse.json();
    expect(masteryData.eligible).toBe(false);
    expect(masteryData.credentialCode || masteryData.certificationCode).toBe('NV-NET-MASTERY');

    // Wait for the certificate catalog to finish loading all criteria
    await expect(page.locator('text=Retrieving Cryptographic Credentials...')).not.toBeVisible({ timeout: 30000 });

    // 4. Verify all six canonical credentials are represented on the page
    const credentials = [
      'NV-NET-C01',
      'NV-NET-C02',
      'NV-NET-C03',
      'NV-NET-C04',
      'NV-NET-C05',
      'NV-NET-MASTERY',
    ];

    for (const cred of credentials) {
      const credBadge = page.locator(`text=${cred}`).first();
      await expect(credBadge).toBeVisible();
    }

    // 5. Verify Mastery Credential Section
    const masteryHeading = page.locator('#mastery-heading');
    await expect(masteryHeading).toBeVisible();
    await expect(masteryHeading).toContainText('Master Network Engineer Credential');

    // 6. Verify 0 / 6 Active badge reflects database state
    const activeCount = page.locator('text=0 / 6 Active');
    await expect(activeCount).toBeVisible();

    // 7. Verify no hardcoded state: "No Certificates Claimed Yet" is displayed
    const emptyStateHeading = page.locator('h3:has-text("No Certificates Claimed Yet")');
    await expect(emptyStateHeading).toBeVisible();
  });
});
