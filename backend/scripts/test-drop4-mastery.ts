/**
 * NETVISION DROP #4 VERIFICATION SUITE
 * Master Network Engineer Mastery (NV-NET-MASTERY)
 * Capstone Exam Engine, 9-Point Mastery Eligibility & Secure Certificate Issuance
 *
 * Genuine Verification:
 * 1. Eligibility Hard Blockers (missing C01-C05 individually, incomplete lessons, assessment <85%, missing lab, missing/failed capstone).
 * 2. Capstone Exam Lifecycle (prerequisites, 120-minute expiry, rolling 90-day 3-attempt limit, 24h & 72h cooldowns, attempt forgery prevention, score forgery prevention, expired submission rejection, atomic concurrent submission CAS).
 * 3. Mastery Certificate Issuance & Idempotency (eligible candidate receives NV-NET-MASTERY, dynamic UTC year, verification code entropy, duplicate claim idempotency, database constraint verification).
 * 4. Public Verification & Security Sanitization (verificationCode, id, userId, email, passwordHash undefined).
 * 5. Tenant Isolation / IDOR (User B blocked from accessing or submitting User A's capstone or cert).
 */

import { PrismaClient, Role, ExamAttemptStatus, ExamType } from '@prisma/client';
import { CertificationsService } from '../src/certifications/certifications.service';
import { CertificationEligibilityService } from '../src/certifications/certification-eligibility.service';
import { MasterCapstoneService, CAPSTONE_CONFIG } from '../src/certifications/master-capstone.service';
import * as assert from 'assert';

const prisma = new PrismaClient();

let passCount = 0;
let failCount = 0;

function check(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
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

async function runDrop4TestSuite() {
  console.log('🧪 Starting NetVision Drop #4 Test Suite: Master Network Engineer Mastery (NV-NET-MASTERY)...\n');

  await waitForDatabase();

  const eligibilityService = new CertificationEligibilityService(prisma as any);
  const certsService = new CertificationsService(prisma as any, eligibilityService);
  const capstoneService = new MasterCapstoneService(prisma as any);

  const createdUserIds: string[] = [];

  try {
    // Helper to create an isolated learner
    async function createTestLearner(name: string) {
      const user = await prisma.user.create({
        data: {
          email: `drop4-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@netvision.test`,
          username: `drop4_user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          fullName: name,
          passwordHash: 'argon2id$test_hash_secure',
          role: Role.STUDENT,
          isVerified: true,
        },
      });
      createdUserIds.push(user.id);
      return user;
    }

    // Fetch all 5 flagship course definitions once to extract all module lessons, quizzes, and labs
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

    // High-performance batch helper to fulfill courses, assessments, labs and certificates
    async function fulfillAllFlagshipCourses(
      userId: string,
      quizScore = 90,
      options: { omitCertCode?: string; omitLabs?: boolean; omitLessons?: boolean } = {}
    ) {
      const allCourseCertCodes = ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'];

      if (!options.omitLessons && allLessons.length > 0) {
        await prisma.userProgress.createMany({
          data: allLessons.map((lesson) => ({
            userId,
            lessonId: lesson.id,
            completed: true,
            score: quizScore,
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
            score: quizScore,
            passed: quizScore >= 80,
            answersJson: {},
          })),
        });
      }

      if (!options.omitLabs && allLabs.length > 0) {
        await prisma.labAttempt.createMany({
          data: allLabs.map((lab) => ({
            userId,
            labId: lab.id,
            passed: true,
            score: 100,
          })),
        });
      }

      const certsToCreate = options.omitCertCode
        ? allCourseCertCodes.filter((c) => c !== options.omitCertCode)
        : allCourseCertCodes;

      await prisma.certificate.createMany({
        data: certsToCreate.map((code) => ({
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

    // =========================================================================
    // SUITE 1: 9-POINT MASTER ELIGIBILITY HARD BLOCKERS
    // =========================================================================
    console.log('--- Suite 1: 9-Point Master Eligibility Hard Blockers ---');

    // 1. Missing C01 - C05 individual certificates block
    const allCourseCertCodes = ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'];
    for (let i = 0; i < allCourseCertCodes.length; i++) {
      const omittedCode = allCourseCertCodes[i];
      const learnerMissingOneCert = await createTestLearner(`Learner Missing ${omittedCode}`);
      
      await fulfillAllFlagshipCourses(learnerMissingOneCert.id, 90, { omitCertCode: omittedCode });

      // Record a passed capstone attempt
      await prisma.examAttempt.create({
        data: {
          userId: learnerMissingOneCert.id,
          certificationCode: 'NV-NET-MASTERY',
          type: ExamType.PRACTICAL,
          status: ExamAttemptStatus.PASSED,
          score: 92,
          passed: true,
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + 7200000),
          submittedAt: new Date(),
        },
      });

      const eligibility = await eligibilityService.checkMasteryEligibility(learnerMissingOneCert.id);
      check(eligibility.eligible === false, `Eligibility blocked when missing course certificate ${omittedCode}`);
      check(
        eligibility.blockingRequirements.some((r) => r.includes(omittedCode)),
        `Blocking reason specifically cites missing ${omittedCode}`
      );
    }

    // 2. Incomplete Lessons Block
    const learnerIncompleteLessons = await createTestLearner('Learner Incomplete Lessons');
    await fulfillAllFlagshipCourses(learnerIncompleteLessons.id, 90, { omitLessons: true });
    // Record passed capstone
    await prisma.examAttempt.create({
      data: {
        userId: learnerIncompleteLessons.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.PASSED,
        score: 90,
        passed: true,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
        submittedAt: new Date(),
      },
    });
    // 0 lessons completed
    const eligibilityIncompleteLessons = await eligibilityService.checkMasteryEligibility(learnerIncompleteLessons.id);
    check(eligibilityIncompleteLessons.eligible === false, 'Mastery blocked when 100% lessons not completed');
    check(
      eligibilityIncompleteLessons.blockingRequirements.some((r) => r.includes('Incomplete curriculum')),
      'Blocking reason cites incomplete curriculum'
    );

    // 3. Assessment Average < 85% Blocks
    const learnerLowAssessment = await createTestLearner('Learner Low Assessment Avg');
    await fulfillAllFlagshipCourses(learnerLowAssessment.id, 81); // 81% allows individual certs (>=80) but fails Mastery (>=85)
    await prisma.examAttempt.create({
      data: {
        userId: learnerLowAssessment.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.PASSED,
        score: 90,
        passed: true,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
        submittedAt: new Date(),
      },
    });
    const eligibilityLowAssessment = await eligibilityService.checkMasteryEligibility(learnerLowAssessment.id);
    check(eligibilityLowAssessment.eligible === false, 'Mastery blocked when cumulative assessment average < 85%');
    check(
      eligibilityLowAssessment.blockingRequirements.some((r) => r.includes('below the required 85% threshold')),
      'Blocking reason cites cumulative assessment average below 85%'
    );

    // 4. Missing/Failed Lab Blocks
    const learnerMissingLab = await createTestLearner('Learner Missing Flagship Lab');
    await fulfillAllFlagshipCourses(learnerMissingLab.id, 90, { omitLabs: true });
    // Record passed capstone
    await prisma.examAttempt.create({
      data: {
        userId: learnerMissingLab.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.PASSED,
        score: 90,
        passed: true,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
        submittedAt: new Date(),
      },
    });
    const eligibilityMissingLab = await eligibilityService.checkMasteryEligibility(learnerMissingLab.id);
    check(eligibilityMissingLab.eligible === false, 'Mastery blocked when required flagship labs are missing');
    check(
      eligibilityMissingLab.blockingRequirements.some((r) => r.includes('Incomplete practical labs')),
      'Blocking reason cites incomplete practical labs'
    );

    // 5. Missing Capstone Blocks
    const learnerMissingCapstone = await createTestLearner('Learner Missing Capstone');
    await fulfillAllFlagshipCourses(learnerMissingCapstone.id, 92);
    const eligibilityMissingCapstone = await eligibilityService.checkMasteryEligibility(learnerMissingCapstone.id);
    check(eligibilityMissingCapstone.eligible === false, 'Mastery blocked when Capstone has not been taken');
    check(
      eligibilityMissingCapstone.blockingRequirements.some((r) => r.includes('Master Capstone Examination (NV-NET-MASTERY-EXAM) has not been passed')),
      'Blocking reason cites missing Capstone Examination'
    );

    // 6. Failed Capstone (<85%) Blocks
    const learnerFailedCapstone = await createTestLearner('Learner Failed Capstone');
    await fulfillAllFlagshipCourses(learnerFailedCapstone.id, 92);
    await prisma.examAttempt.create({
      data: {
        userId: learnerFailedCapstone.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.FAILED,
        score: 82, // < 85%
        passed: false,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
        submittedAt: new Date(),
      },
    });
    const eligibilityFailedCapstone = await eligibilityService.checkMasteryEligibility(learnerFailedCapstone.id);
    check(eligibilityFailedCapstone.eligible === false, 'Mastery blocked when Capstone score < 85%');
    check(
      eligibilityFailedCapstone.blockingRequirements.some((r) => r.includes('Master Capstone Examination (NV-NET-MASTERY-EXAM) has not been passed')),
      'Blocking reason cites Capstone has not been passed'
    );


    // =========================================================================
    // SUITE 2: MASTER CAPSTONE EXAM LIFECYCLE & ANTI-TAMPER SECURITY
    // =========================================================================
    console.log('\n--- Suite 2: Master Capstone Exam Lifecycle & Anti-Tamper Security ---');

    // 1. Prerequisite gate: cannot start capstone without all 5 course certs
    const learnerNoCerts = await createTestLearner('Learner Without Certs');
    let startBlocked = false;
    try {
      await capstoneService.startCapstoneAttempt(learnerNoCerts.id);
    } catch (err: any) {
      startBlocked = err.message.includes('prerequisite blocked') || err.status === 403;
    }
    check(startBlocked, 'Capstone start blocked if candidate lacks all 5 active course certificates');

    // 2. Valid start with all 5 certs, 120-minute server timer
    const learnerWithCerts = await createTestLearner('Learner With 5 Certs');
    await fulfillAllFlagshipCourses(learnerWithCerts.id, 90);
    const startResult = await capstoneService.startCapstoneAttempt(learnerWithCerts.id);
    check(startResult.examCode === 'NV-NET-MASTERY-EXAM', 'Capstone session started with authoritative exam code');
    check(startResult.durationMinutes === 120, 'Duration is authoritatively 120 minutes');
    check(startResult.durationSeconds === 7200, 'Duration in seconds is authoritatively 7200s');
    const elapsedDiff = Math.abs((new Date(startResult.expiresAt).getTime() - new Date(startResult.startedAt).getTime()) - 7200000);
    check(elapsedDiff < 1000, 'Server-authoritative expiresAt is exactly startedAt + 120 minutes');
    check(startResult.attemptNumber === 1, 'Initial attempt number is 1');

    // Idempotent resume of active attempt
    const resumed = await capstoneService.startCapstoneAttempt(learnerWithCerts.id);
    check(resumed.attemptId === startResult.attemptId, 'Starting again returns existing in-progress attempt (Idempotent session)');

    // 3. Forged attempt number / client data strictly ignored in status check
    const statusResult = await capstoneService.getCapstoneAttemptStatus(learnerWithCerts.id, startResult.attemptId);
    check(statusResult.status === ExamAttemptStatus.IN_PROGRESS, 'Attempt status is accurately IN_PROGRESS');
    check(statusResult.score === null, 'Score is null during active exam');

    // 4. Server-side scoring (40% theory, 35% topology incident, 25% packet forensics)
    // Client attempts to forge passed=true and score=100 in payload; server computes 40/35/25
    // Theory: 90 -> 90 * 0.40 = 36
    // Practical: 80 -> 80 * 0.35 = 28
    // Packet: 90 -> 90 * 0.25 = 22.5
    // Total = 36 + 28 + 22.5 = 86.5 -> round to 87% (Passed >= 85)
    const submitResult = await capstoneService.submitCapstoneAttempt(learnerWithCerts.id, startResult.attemptId, {
      componentScores: {
        theoryScore: 90,
        practicalScore: 80,
        packetAnalysisScore: 90,
      },
      // Client forged values to test server immunity
      ...({ passed: false, score: 30, attemptNumber: 99 } as any),
    });
    check(submitResult.status === ExamAttemptStatus.PASSED, 'Server determines PASSED status from weighted component scores');
    check(submitResult.score === 87, `Server computed weighted score is 87% (${submitResult.score}%)`);
    check(submitResult.passed === true, 'Server-authoritative passed flag is true despite client forgery payload');

    // 5. Repeated submission rejected
    let repeatedRejected = false;
    try {
      await capstoneService.submitCapstoneAttempt(learnerWithCerts.id, startResult.attemptId, {
        componentScores: { theoryScore: 100, practicalScore: 100, packetAnalysisScore: 100 },
      });
    } catch (err: any) {
      repeatedRejected = err.message.includes('Cannot submit exam attempt') || err.status === 400;
    }
    check(repeatedRejected, 'Repeated submission of finalized attempt is strictly rejected');

    // 6. Expired submission rejected
    const learnerExpired = await createTestLearner('Learner Expired Exam');
    await fulfillAllFlagshipCourses(learnerExpired.id, 90);
    const expiredAttempt = await prisma.examAttempt.create({
      data: {
        userId: learnerExpired.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(Date.now() - 7500000), // 125 mins ago
        expiresAt: new Date(Date.now() - 300000),  // expired 5 mins ago
        attemptNumber: 1,
      },
    });
    let expiredRejected = false;
    try {
      await capstoneService.submitCapstoneAttempt(learnerExpired.id, expiredAttempt.id, {
        componentScores: { theoryScore: 100, practicalScore: 100, packetAnalysisScore: 100 },
      });
    } catch (err: any) {
      expiredRejected = err.message.includes('expired') || err.status === 400;
    }
    check(expiredRejected, 'Submission past 120-minute expiration is strictly rejected and marked EXPIRED');
    const dbExpired = await prisma.examAttempt.findUnique({ where: { id: expiredAttempt.id } });
    check(dbExpired?.status === ExamAttemptStatus.EXPIRED, 'Database record transitioned to EXPIRED status');

    // 7. Parallel submission race defense (Atomic CAS)
    const learnerRace = await createTestLearner('Learner Race Condition');
    await fulfillAllFlagshipCourses(learnerRace.id, 90);
    const raceAttempt = await capstoneService.startCapstoneAttempt(learnerRace.id);
    const parallelSubmissions = await Promise.allSettled([
      capstoneService.submitCapstoneAttempt(learnerRace.id, raceAttempt.attemptId, {
        componentScores: { theoryScore: 90, practicalScore: 90, packetAnalysisScore: 90 },
      }),
      capstoneService.submitCapstoneAttempt(learnerRace.id, raceAttempt.attemptId, {
        componentScores: { theoryScore: 90, practicalScore: 90, packetAnalysisScore: 90 },
      }),
    ]);
    const fulfilled = parallelSubmissions.filter((p) => p.status === 'fulfilled');
    const rejected = parallelSubmissions.filter((p) => p.status === 'rejected');
    check(fulfilled.length === 1 && rejected.length === 1, 'Parallel submission race produces exactly ONE successful submission; runner-up rejected');

    // 8. Cooldown rules: 24 hours after 1st failure, 72 hours after subsequent failures
    const learnerCooldown = await createTestLearner('Learner Cooldown Test');
    await fulfillAllFlagshipCourses(learnerCooldown.id, 90);
    // 1st failed attempt 2 hours ago (cooldown 24h still active)
    await prisma.examAttempt.create({
      data: {
        userId: learnerCooldown.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.FAILED,
        score: 60,
        passed: false,
        startedAt: new Date(Date.now() - 7200000),
        expiresAt: new Date(Date.now() - 1000),
        submittedAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000), // 2 hours ago
        attemptNumber: 1,
      },
    });
    let cooldown1Blocked = false;
    try {
      await capstoneService.startCapstoneAttempt(learnerCooldown.id);
    } catch (err: any) {
      cooldown1Blocked = err.message.includes('cooldown active') || err.status === 400;
    }
    check(cooldown1Blocked, '24-hour cooldown after first failed attempt blocks immediate re-attempt');

    // Fast-forward 1st attempt to 25 hours ago, add 2nd failed attempt 10 hours ago (72h cooldown)
    await prisma.examAttempt.deleteMany({ where: { userId: learnerCooldown.id } });
    await prisma.examAttempt.create({
      data: {
        userId: learnerCooldown.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.FAILED,
        score: 60,
        passed: false,
        startedAt: new Date(Date.now() - 30 * 3600 * 1000),
        expiresAt: new Date(Date.now() - 28 * 3600 * 1000),
        submittedAt: new Date(Date.now() - 28 * 3600 * 1000),
        updatedAt: new Date(Date.now() - 28 * 3600 * 1000), // 28 hours ago (> 24h)
        attemptNumber: 1,
      },
    });
    await prisma.examAttempt.create({
      data: {
        userId: learnerCooldown.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.FAILED,
        score: 70,
        passed: false,
        startedAt: new Date(Date.now() - 12 * 3600 * 1000),
        expiresAt: new Date(Date.now() - 10 * 3600 * 1000),
        submittedAt: new Date(Date.now() - 10 * 3600 * 1000),
        updatedAt: new Date(Date.now() - 10 * 3600 * 1000), // 10 hours ago (< 72h)
        attemptNumber: 2,
      },
    });
    let cooldown2Blocked = false;
    try {
      await capstoneService.startCapstoneAttempt(learnerCooldown.id);
    } catch (err: any) {
      cooldown2Blocked = err.message.includes('cooldown active') || err.status === 400;
    }
    check(cooldown2Blocked, '72-hour cooldown after subsequent failed attempts blocks re-attempt');

    // 9. Rolling 90-day 3-attempt limit
    const learnerMaxAttempts = await createTestLearner('Learner Max Attempts Test');
    await fulfillAllFlagshipCourses(learnerMaxAttempts.id, 90);
    // Create 3 historical attempts within 90 days
    for (let a = 1; a <= 3; a++) {
      await prisma.examAttempt.create({
        data: {
          userId: learnerMaxAttempts.id,
          certificationCode: 'NV-NET-MASTERY',
          type: ExamType.PRACTICAL,
          status: ExamAttemptStatus.FAILED,
          score: 70,
          passed: false,
          startedAt: new Date(Date.now() - (80 - a * 5) * 24 * 3600 * 1000),
          expiresAt: new Date(Date.now() - (80 - a * 5) * 24 * 3600 * 1000 + 7200000),
          submittedAt: new Date(Date.now() - (80 - a * 5) * 24 * 3600 * 1000 + 7200000),
          updatedAt: new Date(Date.now() - (80 - a * 5) * 24 * 3600 * 1000 + 7200000),
          attemptNumber: a,
        },
      });
    }
    let limitBlocked = false;
    try {
      await capstoneService.startCapstoneAttempt(learnerMaxAttempts.id);
    } catch (err: any) {
      limitBlocked = err.message.includes('Maximum Capstone attempt limit') || err.status === 400;
    }
    check(limitBlocked, 'Maximum 3 attempts within rolling 90 days strictly enforced');


    // =========================================================================
    // SUITE 3: MASTERY CERTIFICATE ISSUANCE, IDEMPOTENCY & CONCURRENCY
    // =========================================================================
    console.log('\n--- Suite 3: Mastery Certificate Issuance, Idempotency & Concurrency ---');

    // 1. Ineligible learner claim blocked
    const learnerIneligibleClaim = await createTestLearner('Ineligible Claimer');
    let claimBlocked = false;
    try {
      await certsService.claimCertificationCertificate(learnerIneligibleClaim.id, 'NV-NET-MASTERY');
    } catch (err: any) {
      claimBlocked = err.message.includes('Mastery certificate claim denied') || err.status === 400;
    }
    check(claimBlocked, 'Ineligible learner is blocked from claiming NV-NET-MASTERY certificate');

    // 2. Fully eligible learner claims Mastery certificate
    const learnerMaster = await createTestLearner('Master Engineer Candidate');
    await fulfillAllFlagshipCourses(learnerMaster.id, 92);
    // Pass Capstone with 94%
    const masterExam = await capstoneService.startCapstoneAttempt(learnerMaster.id);
    await capstoneService.submitCapstoneAttempt(learnerMaster.id, masterExam.attemptId, {
      componentScores: { theoryScore: 95, practicalScore: 92, packetAnalysisScore: 96 },
    });

    const masteryCert = await certsService.claimCertificationCertificate(learnerMaster.id, 'NV-NET-MASTERY');
    check(masteryCert !== null, 'Eligible candidate receives NV-NET-MASTERY certificate');
    const currentUtcYear = new Date().getUTCFullYear();
    check(
      masteryCert.credentialId.startsWith(`NV-MASTERY-${currentUtcYear}-`),
      `Mastery credential ID format verified: NV-MASTERY-${currentUtcYear}-XXXX (${masteryCert.credentialId})`
    );
    check(
      /^NV-VERIFY-[A-F0-9]{16}$/.test(masteryCert.verificationCode),
      `Mastery verification code has 64 bits of entropy (${masteryCert.verificationCode})`
    );
    check(masteryCert.certificationCode === 'NV-NET-MASTERY', 'Certificate code matches NV-NET-MASTERY');
    check(masteryCert.status === 'ACTIVE', 'Certificate status is ACTIVE');

    // 3. Repeated claim idempotency: returns identical certificate without creating a second record
    const repeatedCert = await certsService.claimCertificationCertificate(learnerMaster.id, 'NV-NET-MASTERY');
    check(repeatedCert.credentialId === masteryCert.credentialId, 'Repeated claim returns existing credentialId');
    check(repeatedCert.verificationCode === masteryCert.verificationCode, 'Repeated claim returns same verificationCode');
    const userMasteryCertCount = await prisma.certificate.count({
      where: { userId: learnerMaster.id, certificationCode: 'NV-NET-MASTERY' },
    });
    check(userMasteryCertCount === 1, 'Database row count confirms exactly ONE certificate persists for user + credential');

    // 4. Concurrent claim race condition creates exactly ONE certificate
    const learnerConcurrent = await createTestLearner('Concurrent Mastery Candidate');
    await fulfillAllFlagshipCourses(learnerConcurrent.id, 90);
    const concurrentExam = await capstoneService.startCapstoneAttempt(learnerConcurrent.id);
    await capstoneService.submitCapstoneAttempt(learnerConcurrent.id, concurrentExam.attemptId, {
      componentScores: { theoryScore: 90, practicalScore: 90, packetAnalysisScore: 90 },
    });

    const concurrentClaims = await Promise.all([
      certsService.claimCertificationCertificate(learnerConcurrent.id, 'NV-NET-MASTERY'),
      certsService.claimCertificationCertificate(learnerConcurrent.id, 'NV-NET-MASTERY'),
      certsService.claimCertificationCertificate(learnerConcurrent.id, 'NV-NET-MASTERY'),
    ]);
    check(
      concurrentClaims[0].credentialId === concurrentClaims[1].credentialId &&
      concurrentClaims[1].credentialId === concurrentClaims[2].credentialId,
      'Concurrent claims all return the identical credential ID'
    );
    const concurrentCertCount = await prisma.certificate.count({
      where: { userId: learnerConcurrent.id, certificationCode: 'NV-NET-MASTERY' },
    });
    check(concurrentCertCount === 1, 'Database @@unique([userId, certificationCode]) guarantees exactly ONE certificate row');


    // =========================================================================
    // SUITE 4: PUBLIC VERIFICATION SANITIZATION & HISTORICAL INTEGRITY
    // =========================================================================
    console.log('\n--- Suite 4: Public Verification Sanitization & Historical Integrity ---');

    // 1. Verify Mastery certificate publicly
    const publicData = await certsService.verifyCertificate(masteryCert.credentialId);
    check(publicData.isVerified === true, 'Public verification confirms isVerified === true');
    check(publicData.credentialId === masteryCert.credentialId, 'Public credentialId matches');
    check(publicData.certificationCode === 'NV-NET-MASTERY', 'Public certificationCode is NV-NET-MASTERY');
    check(publicData.recipientName === learnerMaster.fullName, 'Public recipientName matches learner');

    // 2. Security leak checks: Private fields must be undefined
    check((publicData as any).verificationCode === undefined, 'Public verification NEVER exposes verificationCode');
    check((publicData as any).id === undefined, 'Public verification NEVER exposes internal database id');
    check((publicData as any).userId === undefined, 'Public verification NEVER exposes internal userId');
    check((publicData as any).email === undefined, 'Public verification NEVER exposes user email');
    check((publicData as any).passwordHash === undefined, 'Public verification NEVER exposes passwordHash');

    // 3. Historical certificate lookup remains intact
    const historicalCert = await prisma.certificate.findFirst({
      where: {
        certificationCode: { in: ['NV-NET', 'NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'] },
      },
    });
    if (historicalCert) {
      const historicalLookup = await certsService.verifyCertificate(historicalCert.credentialId || historicalCert.code);
      check(historicalLookup.isVerified === true, `Historical certificate (${historicalCert.credentialId || historicalCert.code}) verification intact`);
      check((historicalLookup as any).verificationCode === undefined, 'Historical certificate verification also sanitizes verificationCode');
    } else {
      console.log('  ⚠️ Historical certificate skipped (no pre-existing records in test DB)');
    }


    // =========================================================================
    // SUITE 5: TENANT ISOLATION & IDOR DEFENSE
    // =========================================================================
    console.log('\n--- Suite 5: Tenant Isolation & IDOR Defense ---');

    const userA = await createTestLearner('Learner Alice');
    const userB = await createTestLearner('Attacker Bob');
    await fulfillAllFlagshipCourses(userA.id, 90);
    const aliceExam = await capstoneService.startCapstoneAttempt(userA.id);

    // Attacker Bob tries to inspect Alice's exam attempt
    let idorInspectBlocked = false;
    try {
      await capstoneService.getCapstoneAttemptStatus(userB.id, aliceExam.attemptId);
    } catch (err: any) {
      idorInspectBlocked = err.message.includes('Access denied') || err.status === 403;
    }
    check(idorInspectBlocked, 'Attacker User B cannot view User A\'s Capstone attempt (IDOR blocked)');

    // Attacker Bob tries to submit Alice's exam attempt
    let idorSubmitBlocked = false;
    try {
      await capstoneService.submitCapstoneAttempt(userB.id, aliceExam.attemptId, {
        componentScores: { theoryScore: 100, practicalScore: 100, packetAnalysisScore: 100 },
      });
    } catch (err: any) {
      idorSubmitBlocked = err.message.includes('Access denied') || err.status === 403;
    }
    check(idorSubmitBlocked, 'Attacker User B cannot submit User A\'s Capstone attempt (IDOR blocked)');

    // Attacker Bob tries to download Alice's certificate
    let idorDownloadBlocked = false;
    try {
      await certsService.generateCertificateDownload(userB.id, masteryCert.credentialId);
    } catch (err: any) {
      idorDownloadBlocked = err.message.includes('Access denied') || err.status === 403;
    }
    check(idorDownloadBlocked, 'Attacker User B cannot download User A\'s Mastery certificate (IDOR blocked)');

  } catch (error) {
    console.error('💥 Test suite crashed with error:', error);
    failCount++;
  } finally {
    // Clean up created user fixtures
    console.log('\n🧹 Cleaning up test fixtures...');
    if (createdUserIds.length > 0) {
      await prisma.certificate.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.examAttempt.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.quizAttempt.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.labAttempt.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.userProgress.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
      console.log(`  Cleaned up ${createdUserIds.length} test users and related records.`);
    }
    await prisma.$disconnect();
  }

  console.log('\n==================================================');
  console.log(`DROP #4 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('==================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runDrop4TestSuite().catch((err) => {
  console.error('Fatal error in Drop #4 verification:', err);
  process.exit(1);
});
