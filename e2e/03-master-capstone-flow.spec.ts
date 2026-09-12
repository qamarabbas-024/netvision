import { test, expect } from '@playwright/test';
import { seedAllE2EData, cleanupE2EData, TEST_USERS, prisma } from './helpers/seed-e2e-data';
import { loginViaUI } from './helpers/auth';

test.describe('E2E: Master Capstone Examination Flow & Authoritative Thresholds', () => {

  test('Flow A: Below-threshold submission (80%) results in server-evaluated FAILED status', async ({
    page,
  }) => {
    // 1. Authenticate as Capstone fail candidate (eligible for Capstone)
    await loginViaUI(page, TEST_USERS.CAPSTONE_FAIL.email, TEST_USERS.CAPSTONE_FAIL.password);

    // 2. Open Certification Dashboard
    const certsResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certificates/mine') && res.status() === 200,
      { timeout: 60000 }
    );
    await page.goto('/certificates');
    await page.waitForLoadState('domcontentloaded');
    await certsResponsePromise;
    await expect(page.locator('text=Retrieving Cryptographic Credentials...')).not.toBeVisible({ timeout: 45000 });

    // 3. Navigate to Master Capstone Workspace
    const capstoneLink = page.locator('a[href="/certifications/capstone"]').first();
    await expect(capstoneLink).toBeVisible();

    const capstoneSpecPromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certifications/capstone/spec') && res.status() === 200,
      { timeout: 60000 }
    );
    await capstoneLink.click();
    await expect(page).toHaveURL(/.*\/certifications\/capstone/);
    await capstoneSpecPromise;
    await expect(page.locator('text=Synchronizing Master Capstone Blueprint & Authority...')).not.toBeVisible({ timeout: 45000 });

    // 4. Verify authoritative assessment blueprint (40/35/25, passing: 85%)
    await expect(page.locator('text=NV-NET-MASTERY-EXAM').first()).toBeVisible();
    await expect(page.locator('text=40%').first()).toBeVisible(); // Theory
    await expect(page.locator('text=35%').first()).toBeVisible(); // Incident
    await expect(page.locator('text=25%').first()).toBeVisible(); // Forensics
    await expect(page.locator('text=ELIGIBLE TO ATTEMPT')).toBeVisible();

    // 5. Intercept Start Exam response and verify no answer keys are exposed
    const startResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certifications/capstone/start') && res.status() === 200
    );

    const startButton = page.locator('button:has-text("Start 120-Minute Exam")');
    await expect(startButton).toBeVisible();
    await startButton.click();

    const startResponse = await startResponsePromise;
    const attemptData = await startResponse.json();

    expect(attemptData.attemptId).toBeTruthy();
    expect(attemptData.durationSeconds).toBe(7200);

    // Deep assertion: Ensure public questions contain ZERO answer keys or rubrics
    const assessmentQuestions = attemptData.assessment?.theorySection?.questions || [];
    for (const q of assessmentQuestions) {
      expect(q.correctOption).toBeUndefined();
      expect(q.correctAnswer).toBeUndefined();
      expect(q.rubric).toBeUndefined();
      expect(q.explanation).toBeUndefined();
    }

    // 6. Verify Active Workspace view: Countdown timer is ticking
    const timerElement = page.locator('[role="timer"]');
    await expect(timerElement).toBeVisible();
    await expect(timerElement).toContainText('Server Time Remaining');

    // 7. Submit candidate answers that authoritatively score 80%:
    // Theory: 10/10 correct = 100% * 0.40 = 40 pts
    // Incident: Tasks 1 (20), 2 (25), 5 (15) correct = 60% * 0.35 = 21 pts
    // Forensics: 3/4 correct = 75% * 0.25 = 18.75 pts
    // Total = 40 + 21 + 18.75 = 79.75% -> 80% (FAILED < 85%)
    const belowThresholdPayload = {
      theoryAnswers: {
        'THEORY-Q1': 2,
        'THEORY-Q2': 0,
        'THEORY-Q3': 1,
        'THEORY-Q4': 0,
        'THEORY-Q5': 1,
        'THEORY-Q6': 1,
        'THEORY-Q7': 1,
        'THEORY-Q8': 0,
        'THEORY-Q9': 1,
        'THEORY-Q10': 1,
      },
      incidentAnswers: {
        'INCIDENT-TASK1': 'LAYER_2_DATA_LINK',
        'INCIDENT-TASK2': 'SWITCHING_LOOP_BPDU_FILTER',
        'INCIDENT-TASK3': 'WRONG_ROOT_CAUSE',
        'INCIDENT-TASK4': ['WRONG_CMD'],
        'INCIDENT-TASK5': 'REMOVE_BPDUFILTER_ENABLE_BPDUGUARD',
      },
      forensicsAnswers: {
        'FORENSICS-Q1': 0,
        'FORENSICS-Q2': 0,
        'FORENSICS-Q3': 1,
        'FORENSICS-Q4': 1, // incorrect (correct is 0)
      },
    };

    // Fill answers directly through the official submission endpoint using the active attemptId
    const token = await page.evaluate(() => localStorage.getItem('netvision_token'));
    const submitResponse = await page.request.post(
      `http://localhost:4000/api/v1/certifications/capstone/${attemptData.attemptId}/submit`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: belowThresholdPayload,
      }
    );

    expect(submitResponse.ok()).toBeTruthy();
    const resultData = await submitResponse.json();

    // 8. Assert Authoritative Below-Threshold Scoring
    expect(resultData.score).toBe(80);
    expect(resultData.passed).toBe(false);
    expect(resultData.status).toBe('FAILED');

    // 9. Reload Capstone page and verify Result view reflects the authoritative FAILED status
    await page.goto('/certifications/capstone');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Synchronizing Master Capstone Blueprint & Authority...')).not.toBeVisible({ timeout: 30000 });

    await expect(page.locator('text=Master Capstone Benchmark Not Met')).toBeVisible();
    await expect(page.locator('text=80%').first()).toBeVisible();
    await expect(page.locator('text=FAILED').first()).toBeVisible();

    // 10. Assert terminal attempt cannot be submitted again
    const repeatSubmitResponse = await page.request.post(
      `http://localhost:4000/api/v1/certifications/capstone/${attemptData.attemptId}/submit`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: belowThresholdPayload,
      }
    );
    expect(repeatSubmitResponse.status()).toBe(400); // 400 Bad Request: attempt already submitted
  });

  test('Flow B: Passing submission (100% >= 85%) results in server-evaluated PASSED status', async ({
    page,
  }) => {
    // 1. Authenticate as Capstone pass candidate
    await loginViaUI(page, TEST_USERS.CAPSTONE_PASS.email, TEST_USERS.CAPSTONE_PASS.password);

    // 2. Open Capstone Workspace
    const capstoneSpecPromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certifications/capstone/spec') && res.status() === 200,
      { timeout: 60000 }
    );
    await page.goto('/certifications/capstone');
    await page.waitForLoadState('domcontentloaded');
    await capstoneSpecPromise;
    await expect(page.locator('text=Synchronizing Master Capstone Blueprint & Authority...')).not.toBeVisible({ timeout: 45000 });

    // 3. Start Exam Attempt
    const startButton = page.locator('button:has-text("Start 120-Minute Exam")');
    await expect(startButton).toBeVisible();

    const startResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/v1/certifications/capstone/start') && res.status() === 200
    );
    await startButton.click();
    const startResponse = await startResponsePromise;
    const attemptData = await startResponse.json();

    // 4. Submit legitimate 100% correct answers
    const perfectAnswers = {
      theoryAnswers: {
        'THEORY-Q1': 2,
        'THEORY-Q2': 0,
        'THEORY-Q3': 1,
        'THEORY-Q4': 0,
        'THEORY-Q5': 1,
        'THEORY-Q6': 1,
        'THEORY-Q7': 1,
        'THEORY-Q8': 0,
        'THEORY-Q9': 1,
        'THEORY-Q10': 1,
      },
      incidentAnswers: {
        'INCIDENT-TASK1': 'LAYER_2_DATA_LINK',
        'INCIDENT-TASK2': 'SWITCHING_LOOP_BPDU_FILTER',
        'INCIDENT-TASK3': 'UNMANAGED_SWITCH_LOOP_WITH_BPDU_FILTER',
        'INCIDENT-TASK4': ['CMD_SYSLOG', 'CMD_MAC_TABLE', 'CMD_CDP_NEIGHBOR', 'CMD_INTERFACE_CONFIG'],
        'INCIDENT-TASK5': 'REMOVE_BPDUFILTER_ENABLE_BPDUGUARD',
      },
      forensicsAnswers: {
        'FORENSICS-Q1': 0,
        'FORENSICS-Q2': 0,
        'FORENSICS-Q3': 1,
        'FORENSICS-Q4': 0,
      },
    };

    const token = await page.evaluate(() => localStorage.getItem('netvision_token'));
    const submitResponse = await page.request.post(
      `http://localhost:4000/api/v1/certifications/capstone/${attemptData.attemptId}/submit`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: perfectAnswers,
      }
    );

    expect(submitResponse.ok()).toBeTruthy();
    const resultData = await submitResponse.json();

    // 5. Assert Authoritative Passing Scoring
    expect(resultData.score).toBe(100);
    expect(resultData.passed).toBe(true);
    expect(resultData.status).toBe('PASSED');

    // 6. Reload Capstone page and verify Result view reflects PASSED status
    await page.goto('/certifications/capstone');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Synchronizing Master Capstone Blueprint & Authority...')).not.toBeVisible({ timeout: 30000 });

    await expect(page.locator('text=Master Capstone Examination Passed!')).toBeVisible();
    await expect(page.locator('text=100%').first()).toBeVisible();
    await expect(page.locator('text=PASSED').first()).toBeVisible();
  });
});
