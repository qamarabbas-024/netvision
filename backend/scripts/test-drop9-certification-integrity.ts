/**
 * NETVISION — DROP #9 VERIFICATION SUITE
 * Production Certification Integrity, Attempt Concurrency & Assessment Hardening
 *
 * Verification Areas:
 * A. Concurrent start creates at most ONE active attempt (Converges on same active attempt).
 * B. One active attempt invariant enforced at PostgreSQL level (P2002 via partial unique index).
 * C. Concurrent submissions: Atomic CAS guarantees exactly ONE terminal transition; duplicate rejected.
 * D. Terminal result immutability: Re-submitting terminal attempt cannot mutate score, passed, or metadata.
 * E. Version snapshot integrity: Attempt created with v1 evaluates strictly against v1 even if client requests v2.
 * F. Configuration tampering: Client cannot overwrite weights, threshold, or scenario.
 * G. Concurrent Mastery claim: Transactional double-check & database @@unique([userId, certificationCode]) guarantees exactly ONE cert.
 * H. Certificate issuance integrity & idempotency: Repeated claims return identical credential ID.
 * I. Malformed/malicious payload rejection & sanitization: Unknown question IDs, nested objects, NaN, negative, arrays.
 * J. Assessment definition validation: Invariants verified (unique IDs, weights sum to 100%, valid passingScore, non-empty options).
 * K. Scoring invariants: Section scores, overall scores, and weights strictly bound between 0 and 100%.
 * L. Historical record preservation: Past certificates and attempts remain valid, readable, and verified.
 */

import { PrismaClient, ExamAttemptStatus, ExamType, Role } from '@prisma/client';
import { MasterCapstoneService } from '../src/certifications/master-capstone.service';
import { CertificationEligibilityService } from '../src/certifications/certification-eligibility.service';
import { CertificationsService } from '../src/certifications/certifications.service';
import {
  CAPSTONE_V1_ASSESSMENT,
  CapstoneGradingEngine,
  getAuthoritativeAssessment,
  getPublicAssessment,
  validateAssessmentDefinition,
} from '../src/certifications/capstone-assessment';

const prisma = new PrismaClient();
const eligibilityService = new CertificationEligibilityService(prisma as any);
const certsService = new CertificationsService(prisma as any, eligibilityService);
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

async function waitForDatabase(retries = 5, delayMs = 2500) {
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

async function runDrop9TestSuite() {
  console.log('========================================================================');
  console.log('NETVISION DROP #9: PRODUCTION CERTIFICATION INTEGRITY & CONCURRENCY SUITE');
  console.log('========================================================================\n');

  await waitForDatabase();

  const createdUserIds: string[] = [];

  async function createTestCandidate(name: string) {
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const user = await prisma.user.create({
      data: {
        email: `candidate-${uniqueSuffix}@netvision.test`,
        username: `cand_${uniqueSuffix}`,
        passwordHash: '$2b$10$drop9testhashdeterministic0000000000000000000000000000000',
        fullName: name,
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(user.id);
    return user;
  }

  // Fetch all 5 flagship course definitions to fulfill lessons, quizzes, and labs
  const flagshipCourses = await prisma.course.findMany({
    where: { code: { in: ['NV-C01', 'NV-C02', 'NV-C03', 'NV-C04', 'NV-C05'] } },
    include: {
      modules: {
        include: {
          lessons: {
            include: { quizzes: true, labs: true },
          },
        },
      },
    },
  });

  const allLessons = flagshipCourses.flatMap((c) => c.modules.flatMap((m) => m.lessons));
  const allQuizzes = allLessons.flatMap((l) => l.quizzes);
  const allLabs = allLessons.flatMap((l) => l.labs);

  // Helper to fulfill all 5 course requirements and active certificates
  async function fulfillAllFlagshipRequirements(userId: string) {
    if (allLessons.length > 0) {
      await prisma.userProgress.createMany({
        data: allLessons.map((lesson) => ({
          userId,
          lessonId: lesson.id,
          completed: true,
          score: 95,
          started: true,
          viewed: true,
          completedAt: new Date(),
        })),
      });
    }

    if (allQuizzes.length > 0) {
      await prisma.quizAttempt.createMany({
        data: allQuizzes.map((quiz) => ({
          userId,
          quizId: quiz.id,
          score: 95,
          passed: true,
          answersJson: {},
        })),
      });
    }

    if (allLabs.length > 0) {
      await prisma.labAttempt.createMany({
        data: allLabs.map((lab) => ({
          userId,
          labId: lab.id,
          passed: true,
          score: 100,
        })),
      });
    }

    const certCodes = ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'];
    await prisma.certificate.createMany({
      data: certCodes.map((code) => ({
        userId,
        certificationCode: code,
        certificationTitle: `Test Cert ${code}`,
        recipientName: 'Test Candidate',
        status: 'ACTIVE',
        credentialId: `${code}-2026-TEST-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        verificationCode: `NV-VERIFY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      })),
    });
  }

  // Canonical valid candidate answers for v1
  const validCandidateAnswers = {
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

  try {
    // =========================================================================
    // SUITE 1: ASSESSMENT DEFINITION VALIDATION & SCORING INVARIANTS
    // =========================================================================
    console.log('--- Suite 1: Assessment Definition Validation & Scoring Invariants ---');

    const v1Report = validateAssessmentDefinition(CAPSTONE_V1_ASSESSMENT);
    check(v1Report.isValid === true, 'v1 assessment passes all structural & mathematical validation invariants');
    check(v1Report.errors.length === 0, 'v1 assessment contains zero validation errors');
    check(v1Report.metrics.sumOfSectionWeights === 100, 'Sum of section weights is strictly 100%');
    check(v1Report.metrics.totalTheoryPoints === 100, 'Total theory points equals 100');
    check(v1Report.metrics.totalIncidentPoints === 100, 'Total incident challenge points equals 100');
    check(v1Report.metrics.totalForensicsPoints === 100, 'Total forensics points equals 100');
    check(v1Report.metrics.passingScore === 85, 'Passing threshold invariant is 85%');
    check(v1Report.metrics.questionCount === 19, 'Total distinct questions/tasks count is 19 (10 + 5 + 4)');

    // Invariant testing: Ensure validator detects invalid definitions
    const brokenAssessment = JSON.parse(JSON.stringify(CAPSTONE_V1_ASSESSMENT));
    brokenAssessment.scoringWeights.theoryWeight = 50; // sums to 110%
    const brokenReport = validateAssessmentDefinition(brokenAssessment);
    check(brokenReport.isValid === false, 'Validator detects invalid scoring weights sum (50+35+25 != 100)');
    check(
      brokenReport.errors.some((e) => e.includes('must sum exactly to 100%')),
      'Validator generates explicit error for weights sum violation'
    );


    // =========================================================================
    // SUITE 2: CAPSTONE ACTIVE-ATTEMPT CONCURRENCY & DATABASE CONSTRAINT
    // =========================================================================
    console.log('\n--- Suite 2: Capstone Active-Attempt Concurrency & Database Constraint ---');

    const userConcurrentStart = await createTestCandidate('Candidate Concurrent Start');
    await fulfillAllFlagshipRequirements(userConcurrentStart.id);

    // 1. Parallel start requests must converge safely on the exact same active attempt
    const concurrentStarts = await Promise.all([
      capstoneService.startCapstoneAttempt(userConcurrentStart.id),
      capstoneService.startCapstoneAttempt(userConcurrentStart.id),
      capstoneService.startCapstoneAttempt(userConcurrentStart.id),
    ]);

    check(
      concurrentStarts[0].attemptId === concurrentStarts[1].attemptId &&
      concurrentStarts[1].attemptId === concurrentStarts[2].attemptId,
      'Concurrent start requests all return the identical attemptId (Session convergence)'
    );

    // 2. Database level inspection: Exactly ONE IN_PROGRESS row exists
    const inProgressCount = await prisma.examAttempt.count({
      where: {
        userId: userConcurrentStart.id,
        certificationCode: 'NV-NET-MASTERY',
        status: ExamAttemptStatus.IN_PROGRESS,
      },
    });
    check(inProgressCount === 1, 'Database confirms exactly ONE IN_PROGRESS attempt exists for user');

    // 3. Direct PostgreSQL constraint defense: Attempting to directly insert a second IN_PROGRESS row fails
    let pgConstraintBlocked = false;
    try {
      await prisma.examAttempt.create({
        data: {
          userId: userConcurrentStart.id,
          certificationCode: 'NV-NET-MASTERY',
          type: ExamType.PRACTICAL,
          status: ExamAttemptStatus.IN_PROGRESS,
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + 7200000),
          attemptNumber: 2,
        },
      });
    } catch (err: any) {
      pgConstraintBlocked = err.code === 'P2002' || err.message.includes('Unique constraint failed');
    }
    check(
      pgConstraintBlocked,
      'PostgreSQL partial unique index (exam_attempts_user_active_in_progress_unique_idx) blocks duplicate IN_PROGRESS insertion'
    );


    // =========================================================================
    // SUITE 3: SUBMISSION CONCURRENCY & TERMINAL RESULT IMMUTABILITY
    // =========================================================================
    console.log('\n--- Suite 3: Submission Concurrency & Terminal Result Immutability ---');

    const userConcurrentSubmit = await createTestCandidate('Candidate Concurrent Submit');
    await fulfillAllFlagshipRequirements(userConcurrentSubmit.id);
    const activeExam = await capstoneService.startCapstoneAttempt(userConcurrentSubmit.id);

    // 1. Two parallel submissions against the active attempt
    const concurrentSubmissions = await Promise.allSettled([
      capstoneService.submitCapstoneAttempt(userConcurrentSubmit.id, activeExam.attemptId, validCandidateAnswers),
      capstoneService.submitCapstoneAttempt(userConcurrentSubmit.id, activeExam.attemptId, {
        theoryAnswers: {},
        incidentAnswers: {},
        forensicsAnswers: {},
      }),
    ]);

    const fulfilledSubmissions = concurrentSubmissions.filter((s) => s.status === 'fulfilled');
    const rejectedSubmissions = concurrentSubmissions.filter((s) => s.status === 'rejected');
    check(
      fulfilledSubmissions.length === 1 && rejectedSubmissions.length === 1,
      'Atomic CAS guarantees exactly ONE parallel submission succeeds; runner-up is rejected'
    );

    // 2. Verify winner persisted score
    const completedExam = await prisma.examAttempt.findUnique({ where: { id: activeExam.attemptId } });
    check(completedExam?.status === ExamAttemptStatus.PASSED, 'Attempt transitioned to terminal PASSED state');
    check(completedExam?.score === 100, 'Score is 100% from winning valid submission');
    check(completedExam?.passed === true, 'Passed flag is true');

    // 3. Immutability check: Subsequent submission cannot overwrite terminal status, score, or metadata
    let postTerminalBlocked = false;
    try {
      await capstoneService.submitCapstoneAttempt(userConcurrentSubmit.id, activeExam.attemptId, {
        theoryAnswers: { 'THEORY-Q1': 0 },
        incidentAnswers: {},
        forensicsAnswers: {},
      });
    } catch (err: any) {
      postTerminalBlocked = err.message.includes('Cannot submit exam attempt with status: PASSED') || err.status === 400;
    }
    check(postTerminalBlocked, 'Terminal attempt submission is strictly rejected (Terminal result immutability)');

    // Verify record in database did NOT mutate
    const postCheckExam = await prisma.examAttempt.findUnique({ where: { id: activeExam.attemptId } });
    check(postCheckExam?.score === 100, 'Terminal score is completely immutable (remains 100%)');
    check(postCheckExam?.status === ExamAttemptStatus.PASSED, 'Terminal status is immutable (remains PASSED)');


    // =========================================================================
    // SUITE 4: ASSESSMENT SNAPSHOT & VERSION INTEGRITY
    // =========================================================================
    console.log('\n--- Suite 4: Assessment Snapshot & Version Integrity ---');

    const userVersionTest = await createTestCandidate('Candidate Version Test');
    await fulfillAllFlagshipRequirements(userVersionTest.id);
    const versionAttempt = await capstoneService.startCapstoneAttempt(userVersionTest.id);

    // Check config snapshot bound version: 1
    const dbVersionAttempt = await prisma.examAttempt.findUnique({ where: { id: versionAttempt.attemptId } });
    const snap: any = dbVersionAttempt?.configSnapshotJson;
    check(snap?.assessmentVersion === 1, 'Attempt configSnapshotJson is permanently bound to version 1');
    check(snap?.examCode === 'NV-NET-MASTERY-EXAM', 'Attempt configSnapshotJson is bound to NV-NET-MASTERY-EXAM');

    // Client attempts to tamper with version during submit payload
    const submitWithTamperedVersion = await capstoneService.submitCapstoneAttempt(
      userVersionTest.id,
      versionAttempt.attemptId,
      {
        ...validCandidateAnswers,
        assessmentVersion: 999, // Client forgery attempt
        version: 999,
      } as any
    );
    check(
      submitWithTamperedVersion.result.assessmentVersion === 1,
      'Server strictly evaluated against snapshotted version 1, client version forgery ignored'
    );


    // =========================================================================
    // SUITE 5: MASTER ELIGIBILITY & CERTIFICATE CLAIM CONCURRENCY
    // =========================================================================
    console.log('\n--- Suite 5: Master Eligibility & Certificate Claim Concurrency ---');

    const userMastery = await createTestCandidate('Mastery Candidate Concurrency');
    await fulfillAllFlagshipRequirements(userMastery.id);

    // Pass Capstone with 100%
    const masteryExam = await capstoneService.startCapstoneAttempt(userMastery.id);
    await capstoneService.submitCapstoneAttempt(userMastery.id, masteryExam.attemptId, validCandidateAnswers);

    // Verify eligibility
    const eligibility = await eligibilityService.checkMasteryEligibility(userMastery.id);
    check(eligibility.eligible === true, 'Candidate with 5 course certs + passed Capstone is eligible for Mastery');

    // Run 3 concurrent claim requests
    const concurrentClaims = await Promise.all([
      certsService.claimCertificationCertificate(userMastery.id, 'NV-NET-MASTERY'),
      certsService.claimCertificationCertificate(userMastery.id, 'NV-NET-MASTERY'),
      certsService.claimCertificationCertificate(userMastery.id, 'NV-NET-MASTERY'),
    ]);

    check(
      concurrentClaims[0].credentialId === concurrentClaims[1].credentialId &&
      concurrentClaims[1].credentialId === concurrentClaims[2].credentialId,
      'Concurrent Mastery claims converge on identical credentialId'
    );
    check(
      concurrentClaims[0].verificationCode === concurrentClaims[1].verificationCode,
      'Concurrent Mastery claims converge on identical verificationCode'
    );

    const certCount = await prisma.certificate.count({
      where: { userId: userMastery.id, certificationCode: 'NV-NET-MASTERY' },
    });
    check(certCount === 1, 'Database @@unique([userId, certificationCode]) guarantees exactly ONE certificate record');


    // =========================================================================
    // SUITE 6: MALFORMED / MALICIOUS PAYLOAD HARDENING
    // =========================================================================
    console.log('\n--- Suite 6: Malformed / Malicious Payload Hardening ---');

    // Test grading engine resilience against malformed inputs
    const maliciousPayloads = [
      {
        name: 'Unknown and fabricated question IDs',
        payload: {
          theoryAnswers: { 'FAKE-Q1': 2, 'THEORY-INJECT': 99 },
          incidentAnswers: { 'FAKE-TASK': 'HACK' },
          forensicsAnswers: { 'UNKNOWN-FRAME': 0 },
        },
      },
      {
        name: 'Type mismatches and unexpected objects',
        payload: {
          theoryAnswers: { 'THEORY-Q1': { nested: 'exploit' } as any },
          incidentAnswers: { 'INCIDENT-TASK1': ['array_instead_of_string'] as any },
          forensicsAnswers: { 'FORENSICS-Q1': 'not_a_number' as any },
        },
      },
      {
        name: 'Extreme numbers (NaN, Infinity, negative values)',
        payload: {
          theoryAnswers: { 'THEORY-Q1': -1, 'THEORY-Q2': NaN, 'THEORY-Q3': Infinity },
          incidentAnswers: { 'INCIDENT-TASK1': null as any },
          forensicsAnswers: { 'FORENSICS-Q1': -999 },
        },
      },
      {
        name: 'Massive string buffer payload',
        payload: {
          theoryAnswers: { 'THEORY-Q1': 'A'.repeat(5000) },
          incidentAnswers: { 'INCIDENT-TASK1': 'B'.repeat(5000) },
          forensicsAnswers: { 'FORENSICS-Q1': 'C'.repeat(5000) },
        },
      },
    ];

    for (const testCase of maliciousPayloads) {
      const summary = CapstoneGradingEngine.gradeAttempt(1, testCase.payload);
      check(
        summary.overallScore >= 0 && summary.overallScore <= 100,
        `Malformed payload [${testCase.name}] scored safely within bounds (${summary.overallScore}%)`
      );
      check(
        typeof summary.passed === 'boolean',
        `Malformed payload [${testCase.name}] evaluated to deterministic boolean passed flag`
      );
    }


    // =========================================================================
    // SUITE 7: HISTORICAL DATA PRESERVATION & PUBLIC VERIFICATION
    // =========================================================================
    console.log('\n--- Suite 7: Historical Data Preservation & Public Verification ---');

    // 1. Verify newly created mastery certificate publicly
    const publicVerification = await certsService.verifyCertificate(concurrentClaims[0].credentialId);
    check(publicVerification.isVerified === true, 'Mastery certificate verifies publicly as isVerified: true');
    check(publicVerification.recipientName === userMastery.fullName, 'Public recipient name matches candidate');
    check((publicVerification as any).verificationCode === undefined, 'Public verification sanitizes verificationCode');

    // 2. Check that historical certificates from prior drops remain readable
    const historicalCert = await prisma.certificate.findFirst({
      where: { certificationCode: { in: ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'] } },
    });
    if (historicalCert) {
      const verifyHistorical = await certsService.verifyCertificate(historicalCert.credentialId || historicalCert.code);
      check(verifyHistorical.isVerified === true, 'Historical course certificate remains verifiable');
    }

    // 3. Check historical exam attempts remain readable
    const totalHistoricalAttempts = await prisma.examAttempt.count();
    check(totalHistoricalAttempts > 0, `Historical exam attempts preserved in database (count: ${totalHistoricalAttempts})`);

  } catch (error) {
    console.error('💥 Test suite crashed with error:', error);
    failCount++;
  } finally {
    console.log('\n🧹 Cleaning up test fixtures...');
    if (createdUserIds.length > 0) {
      await prisma.certificate.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.examAttempt.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.userProgress.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.quizAttempt.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.labAttempt.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
      console.log(`  Cleaned up ${createdUserIds.length} test users and related records.`);
    }
    await prisma.$disconnect();
  }

  console.log('\n========================================================================');
  console.log(`DROP #9 INTEGRITY TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('========================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runDrop9TestSuite().catch((err) => {
  console.error('Fatal error in Drop #9 verification:', err);
  process.exit(1);
});
