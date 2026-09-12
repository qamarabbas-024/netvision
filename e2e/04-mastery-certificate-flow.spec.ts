import { test, expect } from '@playwright/test';
import { seedAllE2EData, cleanupE2EData, TEST_USERS, prisma } from './helpers/seed-e2e-data';
import { loginViaUI } from './helpers/auth';

test.describe('E2E: Pinnacle Mastery Credential Claim & Verification', () => {

  test('Fulfill all prerequisites, claim NV-NET-MASTERY, view credential record, and verify public ledger', async ({
    page,
  }) => {
    // 1. Authenticate as candidate who has all 5 certs + passed Master Capstone
    await loginViaUI(page, TEST_USERS.MASTERY_CLAIM.email, TEST_USERS.MASTERY_CLAIM.password);

    // 2. Open Certification Dashboard
    const certsResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certificates/mine') && res.status() === 200,
      { timeout: 60000 }
    );
    await page.goto('/certificates');
    await page.waitForLoadState('domcontentloaded');
    await certsResponsePromise;
    await expect(page.locator('text=Retrieving Cryptographic Credentials...')).not.toBeVisible({ timeout: 45000 });

    // 3. Verify Mastery Section shows ELIGIBLE TO CLAIM
    const masterySection = page.locator('section[aria-labelledby="mastery-heading"]');
    await expect(masterySection).toBeVisible();

    const eligibleBadge = masterySection.locator('text=ELIGIBLE TO CLAIM').first();
    await expect(eligibleBadge).toBeVisible();

    // 4. Verify all 5 prerequisite pillars are satisfied (Course certs, Flagship lessons, Assessments, Labs, Capstone)
    await expect(masterySection.locator('text=5 / 5 Acquired').first()).toBeVisible();
    await expect(masterySection.locator('text=All 5 Required').first()).toBeVisible();

    // 5. Click Claim Mastery Credential button
    const claimMasteryButton = masterySection.locator('button:has-text("Claim Mastery Credential")');
    await expect(claimMasteryButton).toBeVisible();

    const claimResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certifications/NV-NET-MASTERY/claim-certificate') && res.status() === 200
    );

    await claimMasteryButton.click();
    const claimResponse = await claimResponsePromise;
    const claimResult = await claimResponse.json();

    expect(claimResult.credentialId).toBeTruthy();
    expect(claimResult.status).toBe('ACTIVE');
    const masteryCredentialId = claimResult.credentialId;

    // 6. Verify UI transitions to EARNED & VERIFIED
    await expect(masterySection.locator('text=EARNED & VERIFIED').first()).toBeVisible({ timeout: 30000 });

    // 7. Verify Database Persistence: Exactly ONE Mastery certificate exists
    const dbMasteryCerts = await prisma.certificate.findMany({
      where: {
        certificationCode: 'NV-NET-MASTERY',
        credentialId: masteryCredentialId,
      },
    });
    expect(dbMasteryCerts.length).toBe(1);
    expect(dbMasteryCerts[0].recipientName).toBe(TEST_USERS.MASTERY_CLAIM.fullName);

    // 8. Navigate to Owner Certificate Record
    const detailResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certificates') && res.status() === 200,
      { timeout: 60000 }
    ).catch(() => null);
    await page.goto(`/certificates/${encodeURIComponent(masteryCredentialId)}`);
    await page.waitForLoadState('domcontentloaded');
    await detailResponsePromise;
    await expect(page.locator('text=Retrieving Authoritative Credential Record...')).not.toBeVisible({ timeout: 45000 });

    await expect(page.locator(`text=${masteryCredentialId}`).first()).toBeVisible();
    await expect(page.getByText('NV-NET-MASTERY', { exact: true }).first()).toBeVisible();
    await expect(page.locator('text=OFFICIAL CERTIFICATE OF MASTERY').first()).toBeVisible();

    // 9. Open Public Ledger Verification
    await page.goto(`/certificates/verify/${encodeURIComponent(masteryCredentialId)}`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Official NetVision Credential Verified').first()).toBeVisible();
    await expect(page.locator(`text=${masteryCredentialId}`).first()).toBeVisible();
    await expect(page.locator(`text=${TEST_USERS.MASTERY_CLAIM.fullName}`).first()).toBeVisible();

    // 10. Verify duplicate claim cannot create another certificate record
    const token = await page.evaluate(() => localStorage.getItem('netvision_token'));
    const duplicateResponse = await page.request.post(
      `http://localhost:4000/api/v1/certifications/NV-NET-MASTERY/claim-certificate`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(duplicateResponse.ok()).toBeTruthy();
    const dupData = await duplicateResponse.json();
    expect(dupData.credentialId).toBe(masteryCredentialId); // Idempotent convergence

    const totalMasteryCount = await prisma.certificate.count({
      where: {
        userId: dbMasteryCerts[0].userId,
        certificationCode: 'NV-NET-MASTERY',
      },
    });
    expect(totalMasteryCount).toBe(1); // Exactly one certificate row in database
  });
});
