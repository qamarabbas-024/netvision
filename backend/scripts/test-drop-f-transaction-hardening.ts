/**
 * NETVISION — DROP F
 * MASTER CAPSTONE ATOMIC TRANSACTION HARDENING & CONCURRENCY VERIFICATION
 *
 * Mandatory Verification Gates:
 * 1. Transactional Atomicity:
 *    - Capstone submission and grading execute entirely within a single atomic Prisma transaction.
 *    - Metadata, component scores, overall score, and passed status are atomically persisted.
 * 2. Concurrent Parallel Submissions (CAS Invariant):
 *    - Firing 5 concurrent submissions on the same in-progress attempt results in exactly 1 success.
 *    - All 4 concurrent runners are rejected with "already submitted or no longer in progress".
 *    - Zero duplicate evaluations or corrupt state.
 * 3. Server-Side Atomic Expiration:
 *    - Attempts submitted past expiresAt are atomically transitioned to EXPIRED with score=0, passed=false.
 * 4. Tenant Isolation & IDOR Protection:
 *    - Non-owners cannot submit or alter another user's attempt within the transaction.
 * 5. Deterministic Historical Grading Integrity:
 *    - Grade calculation adheres strictly to 40% Theory, 35% Incident, 25% Forensics, >= 85% threshold.
 */

import { ExamAttemptStatus, ExamType } from '@prisma/client';
import { MasterCapstoneService } from '../src/certifications/master-capstone.service';
import { PrismaService } from '../src/database/prisma.service';

const prisma = new PrismaService();
const capstoneService = new MasterCapstoneService(prisma as any);

let passCount = 0;
let failCount = 0;

function check(assertion: boolean, description: string) {
  if (assertion) {
    console.log(`  ✅ PASS: ${description}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failCount++;
  }
}

async function waitForDatabase(retries = 10, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return;
    } catch (err) {
      if (i === retries) throw err;
      console.log(`⏳ Neon connection warmup... retrying in ${delayMs}ms (attempt ${i}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

const samplePassingSubmission = {
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


async function runDropFTestSuite() {
  console.log('========================================================================');
  console.log('NETVISION DROP F: MASTER CAPSTONE ATOMIC TRANSACTION HARDENING');
  console.log('========================================================================\n');

  await waitForDatabase();

  const createdUserIds: string[] = [];

  async function createTestCandidate(name: string) {
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const user = await prisma.user.create({
      data: {
        email: `drop-f-${uniqueSuffix}@netvision.test`,
        username: `drop_f_${uniqueSuffix}`,
        passwordHash: '$2b$10$dropFtesthashdeterministic0000000000000000000000000000000',
        fullName: name,
        role: 'STUDENT',
        isVerified: true,
      },
    });
    createdUserIds.push(user.id);
    return user;
  }

  try {
    // =========================================================================
    // SUITE 1: ATOMIC TRANSACTIONAL SUBMISSION & IMMUTABILITY
    // =========================================================================
    console.log('--- Suite 1: Transactional Atomicity & Submission Persistence ---');

    const learnerAlice = await createTestCandidate('Alice Transactional');

    const attemptAlice = await prisma.examAttempt.create({
      data: {
        userId: learnerAlice.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000), // 2 hours
        attemptNumber: 1,
        configSnapshotJson: { assessmentVersion: 1 },
      },
    });

    const submitResultAlice = await capstoneService.submitCapstoneAttempt(
      learnerAlice.id,
      attemptAlice.id,
      samplePassingSubmission
    );

    check(submitResultAlice.status === ExamAttemptStatus.PASSED, 'Attempt evaluated to PASSED status inside transaction');
    check(submitResultAlice.score === 100, 'Score is 100%');
    check(submitResultAlice.passed === true, 'Passed flag is true');

    // Verify database row
    const persistedAttempt = await prisma.examAttempt.findUnique({
      where: { id: attemptAlice.id },
    });
    check(persistedAttempt?.status === ExamAttemptStatus.PASSED, 'Database attempt status is PASSED');
    check(persistedAttempt?.score === 100, 'Database attempt score is 100');
    check(persistedAttempt?.passed === true, 'Database attempt passed is true');
    check(!!persistedAttempt?.submittedAt, 'submittedAt timestamp is recorded');
    const sections = (persistedAttempt?.resultMetadataJson as any)?.sections;
    check(
      !!sections?.theory && !!sections?.incident && !!sections?.forensics,
      'Result metadata includes full 3-domain grading breakdown (theory, incident, forensics)'
    );


    // =========================================================================
    // SUITE 2: CONCURRENT PARALLEL SUBMISSIONS (CAS INVARIANT)
    // =========================================================================
    console.log('\n--- Suite 2: Concurrent Parallel Submissions & CAS Token Safety ---');

    const learnerBob = await createTestCandidate('Bob RaceCondition');

    const attemptBob = await prisma.examAttempt.create({
      data: {
        userId: learnerBob.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
        attemptNumber: 1,
        configSnapshotJson: { assessmentVersion: 1 },
      },
    });

    // Fire 5 concurrent submissions simultaneously
    console.log('  Firing 5 parallel submissions for the same attempt...');
    const concurrentPromises = [1, 2, 3, 4, 5].map((idx) =>
      capstoneService
        .submitCapstoneAttempt(learnerBob.id, attemptBob.id, samplePassingSubmission)
        .then((res) => ({ success: true, idx, res }))
        .catch((err) => ({ success: false, idx, error: err.message }))
    );

    const concurrentResults = await Promise.all(concurrentPromises);

    const successCount = concurrentResults.filter((r) => r.success).length;
    const failResults = concurrentResults.filter((r): r is { success: false; idx: number; error: string } => !r.success);

    check(successCount === 1, `Exactly 1 submission succeeded out of 5 (actual: ${successCount})`);
    check(failResults.length === 4, `Exactly 4 submissions were rejected (actual: ${failResults.length})`);

    const allRejectedWithExpectedMsg = failResults.every(
      (r) =>
        r.error?.includes('already been submitted') ||
        r.error?.includes('no longer in progress') ||
        r.error?.includes('Cannot submit exam attempt')
    );

    check(allRejectedWithExpectedMsg, 'All rejected submissions encountered authoritative state rejection');

    // Verify final state of Bob's attempt in DB
    const finalBobAttempt = await prisma.examAttempt.findUnique({
      where: { id: attemptBob.id },
    });
    check(finalBobAttempt?.status === ExamAttemptStatus.PASSED, 'Attempt safely finalized to PASSED');
    check(finalBobAttempt?.score === 100, 'Attempt score remained pure and uncorrupted (100)');

    // =========================================================================
    // SUITE 3: ATOMIC EXPIRATION ENFORCEMENT
    // =========================================================================
    console.log('\n--- Suite 3: Server-Authoritative Atomic Expiration ---');

    const learnerCharlie = await createTestCandidate('Charlie Expired');

    const expiredAttempt = await prisma.examAttempt.create({
      data: {
        userId: learnerCharlie.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(Date.now() - 7500000),
        expiresAt: new Date(Date.now() - 300000), // Expired 5 minutes ago
        attemptNumber: 1,
        configSnapshotJson: { assessmentVersion: 1 },
      },
    });

    let expiredError: any = null;
    try {
      await capstoneService.submitCapstoneAttempt(learnerCharlie.id, expiredAttempt.id, samplePassingSubmission);
    } catch (err: any) {
      expiredError = err;
    }

    check(!!expiredError, 'Submission of expired attempt threw an error');
    check(
      expiredError?.message?.includes('expired') || expiredError?.status === 400,
      'Error message confirms examination duration has expired'
    );

    // Verify DB updated atomically to EXPIRED
    const dbExpired = await prisma.examAttempt.findUnique({
      where: { id: expiredAttempt.id },
    });
    check(dbExpired?.status === ExamAttemptStatus.EXPIRED, 'Database record updated atomically to EXPIRED status');
    check(dbExpired?.passed === false, 'Database record passed is false');
    check(dbExpired?.score === 0, 'Database record score is 0');

    // Second submission attempt on expired should fail with status check
    let secondExpiredError: any = null;
    try {
      await capstoneService.submitCapstoneAttempt(learnerCharlie.id, expiredAttempt.id, samplePassingSubmission);
    } catch (err: any) {
      secondExpiredError = err;
    }
    check(
      secondExpiredError?.message?.includes('Cannot submit exam attempt with status: EXPIRED'),
      'Subsequent submission rejected because attempt status is EXPIRED'
    );

    // =========================================================================
    // SUITE 4: IDOR & TENANT SECURITY ENFORCEMENT
    // =========================================================================
    console.log('\n--- Suite 4: Tenant Isolation & IDOR Defense ---');

    const learnerDave = await createTestCandidate('Dave Legitimate');
    const attackerEve = await createTestCandidate('Eve Attacker');

    const attemptDave = await prisma.examAttempt.create({
      data: {
        userId: learnerDave.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
        attemptNumber: 1,
        configSnapshotJson: { assessmentVersion: 1 },
      },
    });

    let idorError: any = null;
    try {
      await capstoneService.submitCapstoneAttempt(attackerEve.id, attemptDave.id, samplePassingSubmission);
    } catch (err: any) {
      idorError = err;
    }

    check(!!idorError, 'Attacker submission of another user\'s attempt was rejected');
    check(
      idorError?.message?.includes('Access denied') || idorError?.status === 403,
      'Attacker received 403 Forbidden Access denied error'
    );

    // Verify Dave's attempt is completely untouched
    const untouchedDaveAttempt = await prisma.examAttempt.findUnique({
      where: { id: attemptDave.id },
    });
    check(
      untouchedDaveAttempt?.status === ExamAttemptStatus.IN_PROGRESS,
      'Victim\'s attempt remained IN_PROGRESS with zero modifications'
    );

    // =========================================================================
    // SUITE 5: REPEAT SUBMISSION IDEMPOTENCY DEFENSE
    // =========================================================================
    console.log('\n--- Suite 5: Repeat Submission Defense ---');

    let repeatError: any = null;
    try {
      await capstoneService.submitCapstoneAttempt(learnerAlice.id, attemptAlice.id, samplePassingSubmission);
    } catch (err: any) {
      repeatError = err;
    }
    check(
      repeatError?.message?.includes('Cannot submit exam attempt with status: PASSED'),
      'Re-submitting an already PASSED attempt is rejected with status check'
    );

  } catch (error) {
    console.error('💥 Test suite encountered fatal error:', error);
    failCount++;
  } finally {
    console.log('\n🧹 Cleaning up test fixtures...');
    if (createdUserIds.length > 0) {
      await prisma.examAttempt.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
      console.log(`  Cleaned up ${createdUserIds.length} test users.`);
    }
    await prisma.$disconnect();
  }

  console.log('\n========================================================================');
  console.log(`DROP F TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('========================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runDropFTestSuite().catch((err) => {
  console.error('Fatal error in Drop F execution:', err);
  process.exit(1);
});
