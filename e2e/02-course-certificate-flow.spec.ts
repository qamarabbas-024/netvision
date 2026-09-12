import { test, expect } from '@playwright/test';
import { seedAllE2EData, cleanupE2EData, TEST_USERS, prisma } from './helpers/seed-e2e-data';
import { loginViaUI } from './helpers/auth';

test.describe('E2E: Course Certificate Lifecycle & Public Verification', () => {

  test('Claim course certificate, view detail record, verify in public ledger, and prevent duplicate creation', async ({
    page,
  }) => {
    // 1. Authenticate as eligible course candidate
    await loginViaUI(page, TEST_USERS.COURSE_CLAIM.email, TEST_USERS.COURSE_CLAIM.password);

    // 2. Open Certification Dashboard
    const certsResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certificates/mine') && res.status() === 200,
      { timeout: 60000 }
    );
    await page.goto('/certificates');
    await page.waitForLoadState('domcontentloaded');
    await certsResponsePromise;
    await expect(page.locator('text=Retrieving Cryptographic Credentials...')).not.toBeVisible({ timeout: 45000 });

    // 3. Locate NV-NET-C01 card and verify ELIGIBLE TO CLAIM badge
    const c01Card = page.locator('div:has-text("NV-NET-C01")').filter({ hasText: 'ELIGIBLE TO CLAIM' }).first();
    await expect(c01Card).toBeVisible();

    // 4. Click real Claim Certificate button
    const claimButton = page.locator('button:has-text("Claim Certificate")').first();
    await expect(claimButton).toBeVisible();

    // Intercept claim response
    const claimResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certifications/NV-NET-C01/claim-certificate') && res.status() === 200
    );

    await claimButton.click();
    const claimResponse = await claimResponsePromise;
    const claimResult = await claimResponse.json();

    expect(claimResult.credentialId).toBeTruthy();
    expect(claimResult.status).toBe('ACTIVE');
    const mintedCredentialId = claimResult.credentialId;

    // 5. Verify UI updates to earned state
    await expect(page.locator(`text=${mintedCredentialId}`).first()).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=ACTIVE & VERIFIED').first()).toBeVisible({ timeout: 30000 });

    // 6. Verify database persistence: Exactly 1 certificate exists in database
    const dbCerts = await prisma.certificate.findMany({
      where: { credentialId: mintedCredentialId },
    });
    expect(dbCerts.length).toBe(1);
    expect(dbCerts[0].certificationCode).toBe('NV-NET-C01');
    expect(dbCerts[0].status).toBe('ACTIVE');

    // 7. Navigate to Owner Certificate Detail Page
    const detailResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certificates') && res.status() === 200,
      { timeout: 60000 }
    ).catch(() => null);
    await page.goto(`/certificates/${encodeURIComponent(mintedCredentialId)}`);
    await page.waitForLoadState('domcontentloaded');
    await detailResponsePromise;
    await expect(page.locator('text=Retrieving Authoritative Credential Record...')).not.toBeVisible({ timeout: 45000 });

    // Verify credential detail information
    await expect(page.locator(`text=${mintedCredentialId}`).first()).toBeVisible();
    await expect(page.getByText('NV-NET-C01', { exact: true }).first()).toBeVisible();
    await expect(page.locator('text=ACTIVE').first()).toBeVisible();
    await expect(page.locator(`text=${TEST_USERS.COURSE_CLAIM.fullName}`).first()).toBeVisible();

    // 8. Open Public Verification route
    await page.goto(`/certificates/verify/${encodeURIComponent(mintedCredentialId)}`);
    await page.waitForLoadState('domcontentloaded');

    // 9. Verify public certificate details
    await expect(page.locator('text=Official NetVision Credential Verified').first()).toBeVisible();
    await expect(page.locator(`text=${mintedCredentialId}`).first()).toBeVisible();
    await expect(page.locator(`text=${TEST_USERS.COURSE_CLAIM.fullName}`).first()).toBeVisible();

    // 10. Query public verification API directly and verify private/internal fields are SANITIZED
    const publicApiResponse = await page.request.get(
      `http://localhost:4000/api/v1/certificates/verify/${encodeURIComponent(mintedCredentialId)}`
    );
    expect(publicApiResponse.ok()).toBeTruthy();
    const publicData = await publicApiResponse.json();

    // Required public fields
    expect(publicData.isVerified).toBe(true);
    expect(publicData.credentialId).toBe(mintedCredentialId);
    expect(publicData.status).toBe('ACTIVE');
    expect(publicData.recipientName).toBe(TEST_USERS.COURSE_CLAIM.fullName);

    // Private fields that MUST NOT leak in public verification
    expect(publicData.passwordHash).toBeUndefined();
    expect(publicData.verificationCode).toBeUndefined();
    expect(publicData.userId).toBeUndefined();
    expect(publicData.email).toBeUndefined();
    expect(publicData.auditMetadata).toBeUndefined();

    // 11. Verify duplicate claiming cannot create a second certificate
    const duplicateClaimResponse = await page.request.post(
      `http://localhost:4000/api/v1/certifications/NV-NET-C01/claim-certificate`,
      {
        headers: {
          Authorization: `Bearer ${await page.evaluate(() => localStorage.getItem('netvision_token'))}`,
        },
      }
    );
    expect(duplicateClaimResponse.ok()).toBeTruthy();
    const dupResult = await duplicateClaimResponse.json();
    expect(dupResult.credentialId).toBe(mintedCredentialId); // Idempotently converges on existing ID

    const certCountAfterDup = await prisma.certificate.count({
      where: {
        userId: dbCerts[0].userId,
        certificationCode: 'NV-NET-C01',
      },
    });
    expect(certCountAfterDup).toBe(1); // Database row count strictly remains 1
  });
});
