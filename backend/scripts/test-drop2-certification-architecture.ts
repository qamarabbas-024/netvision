import { PrismaClient, Role, ExamAttemptStatus, ExamType } from '@prisma/client';
import { CertificationEligibilityService } from '../src/certifications/certification-eligibility.service';
import { MasterCapstoneService, CAPSTONE_CONFIG } from '../src/certifications/master-capstone.service';
import { CertificationsService } from '../src/certifications/certifications.service';
import { PrismaService } from '../src/database/prisma.service';
import * as assert from 'assert';

const prisma = new PrismaClient();
const prismaService = prisma as unknown as PrismaService;
const eligibilityService = new CertificationEligibilityService(prismaService);
const capstoneService = new MasterCapstoneService(prismaService);
const certificationsService = new CertificationsService(prismaService, eligibilityService);

let passed = 0;
let failed = 0;

function check(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runDrop2Tests() {
  console.log('🧪 Starting NetVision Drop #2 Test Suite: Certification Architecture, Eligibility & Master Capstone...');
  const createdUserIds: string[] = [];

  try {
    // =========================================================================
    // SUITE 1: COURSE CERTIFICATION ELIGIBILITY (NV-C01 through NV-C05)
    // =========================================================================
    console.log('\n--- Suite 1: Course Certification Eligibility (Server-Side) ---');

    // Case 1: Incomplete Lessons -> Blocked
    const userIncomplete = await prisma.user.create({
      data: {
        email: `drop2-incomplete-${Date.now()}@netvision.test`,
        username: `drop2_incomplete_${Date.now()}`,
        fullName: 'Incomplete Learner',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userIncomplete.id);

    const resIncomplete = await eligibilityService.checkCourseEligibility(userIncomplete.id, 'NV-C01');
    check(resIncomplete.eligible === false, 'Learner with 0 lessons completed is NOT eligible');
    check(resIncomplete.blockingRequirements.some((r) => r.includes('Incomplete curriculum')), 'Incomplete curriculum blocker reported');
    check(resIncomplete.breakdown.lessons.passed === false, 'Lesson breakdown passed=false');

    // Case 2: Full satisfaction (100% lessons, >=80% quiz average, all labs) -> Eligible
    const userEligible = await prisma.user.create({
      data: {
        email: `drop2-eligible-${Date.now()}@netvision.test`,
        username: `drop2_eligible_${Date.now()}`,
        fullName: 'Eligible Learner C01',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userEligible.id);

    // Fetch all lessons, quizzes, labs for NV-C01
    const course1 = await prisma.course.findUnique({
      where: { code: 'NV-C01' },
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
    assert(course1, 'NV-C01 course exists');
    const c1Lessons = course1.modules.flatMap((m) => m.lessons);

    // Complete all lessons with score 85
    for (const l of c1Lessons) {
      await prisma.userProgress.create({
        data: {
          userId: userEligible.id,
          lessonId: l.id,
          completed: true,
          score: 90,
          started: true,
          viewed: true,
          completedAt: new Date(),
        },
      });
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({
          data: {
            userId: userEligible.id,
            quizId: q.id,
            score: 90,
            passed: true,
            answersJson: {},
          },
        });
      }
      for (const lab of l.labs) {
        await prisma.labAttempt.create({
          data: {
            userId: userEligible.id,
            labId: lab.id,
            passed: true,
            score: 100,
          },
        });
      }
    }

    const resEligible = await eligibilityService.checkCourseEligibility(userEligible.id, 'NV-C01');
    check(resEligible.eligible === true, 'Learner with 100% lessons, 90% quizzes, and all labs is ELIGIBLE');
    check(resEligible.blockingRequirements.length === 0, 'No blocking requirements for eligible learner');
    check(resEligible.breakdown.lessons.passed === true, 'Lessons breakdown passed=true');
    check(resEligible.breakdown.assessments.passed === true, 'Assessments breakdown passed=true');
    check(resEligible.breakdown.labs.passed === true, 'Labs breakdown passed=true');

    // Case 3: Assessment < 80% -> Blocked
    const userLowScore = await prisma.user.create({
      data: {
        email: `drop2-lowscore-${Date.now()}@netvision.test`,
        username: `drop2_lowscore_${Date.now()}`,
        fullName: 'Low Score Learner',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userLowScore.id);

    for (const l of c1Lessons) {
      await prisma.userProgress.create({
        data: {
          userId: userLowScore.id,
          lessonId: l.id,
          completed: true,
          score: 70,
        },
      });
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({
          data: {
            userId: userLowScore.id,
            quizId: q.id,
            score: 65, // < 80%
            passed: false,
            answersJson: {},
          },
        });
      }
      for (const lab of l.labs) {
        await prisma.labAttempt.create({
          data: {
            userId: userLowScore.id,
            labId: lab.id,
            passed: true,
            score: 100,
          },
        });
      }
    }

    const resLowScore = await eligibilityService.checkCourseEligibility(userLowScore.id, 'NV-C01');
    check(resLowScore.eligible === false, 'Learner with 65% quiz score is NOT eligible');
    check(resLowScore.blockingRequirements.some((r) => r.includes('below the minimum required 80%')), 'Low score blocker reported');

    // Case 4: Missing lab -> Blocked
    const userMissingLab = await prisma.user.create({
      data: {
        email: `drop2-missinglab-${Date.now()}@netvision.test`,
        username: `drop2_missinglab_${Date.now()}`,
        fullName: 'Missing Lab Learner',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userMissingLab.id);

    for (const l of c1Lessons) {
      await prisma.userProgress.create({
        data: {
          userId: userMissingLab.id,
          lessonId: l.id,
          completed: true,
          score: 90,
        },
      });
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({
          data: {
            userId: userMissingLab.id,
            quizId: q.id,
            score: 90,
            passed: true,
            answersJson: {},
          },
        });
      }
      // Zero labs passed
    }

    const resMissingLab = await eligibilityService.checkCourseEligibility(userMissingLab.id, 'NV-C01');
    if (resMissingLab.breakdown.labs.total > 0) {
      check(resMissingLab.eligible === false, 'Learner with missing lab is NOT eligible');
      check(resMissingLab.blockingRequirements.some((r) => r.includes('Incomplete practical labs')), 'Incomplete labs blocker reported');
    }

    // Case 5: Empty User ID rejected
    let rejectedNoUser = false;
    try {
      await eligibilityService.checkCourseEligibility('', 'NV-C01');
    } catch (e: any) {
      rejectedNoUser = e.status === 400 || e.message?.includes('User ID is required');
    }
    check(rejectedNoUser, 'Empty user ID rejected with BadRequestException');

    // =========================================================================
    // SUITE 2: MASTERY ELIGIBILITY (NV-NET-MASTERY)
    // =========================================================================
    console.log('\n--- Suite 2: Mastery Eligibility Hard Blockers ---');

    const userMasteryTest = await prisma.user.create({
      data: {
        email: `drop2-mastery-${Date.now()}@netvision.test`,
        username: `drop2_mastery_${Date.now()}`,
        fullName: 'Mastery Candidate',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userMasteryTest.id);

    // Initial check: 0 of 5 certificates, 0 capstone -> Blocked
    const masteryInitial = await eligibilityService.checkMasteryEligibility(userMasteryTest.id);
    check(masteryInitial.eligible === false, 'Initial candidate is NOT eligible for Mastery');
    check(masteryInitial.blockingRequirements.some((r) => r.includes('Missing active course certifications')), 'Missing course certs reported as blocker');
    check(masteryInitial.blockingRequirements.some((r) => r.includes('Master Capstone Examination')), 'Missing capstone reported as blocker');

    // Issue only 4 course certs (missing NV-NET-C05)
    for (let i = 1; i <= 4; i++) {
      await prisma.certificate.create({
        data: {
          userId: userMasteryTest.id,
          certificationCode: `NV-NET-C0${i}`,
          certificationTitle: `Course ${i} Cert`,
          credentialId: `NV-TEST-C0${i}-${Date.now()}`,
          status: 'ACTIVE',
        },
      });
    }

    const mastery4Certs = await eligibilityService.checkMasteryEligibility(userMasteryTest.id);
    check(mastery4Certs.eligible === false, 'Candidate with 4/5 course certificates is NOT eligible');
    check(mastery4Certs.blockingRequirements.some((r) => r.includes('NV-NET-C05')), 'Missing NV-NET-C05 explicitly identified in blockers');

    // Now issue 5th certificate (NV-NET-C05)
    await prisma.certificate.create({
      data: {
        userId: userMasteryTest.id,
        certificationCode: 'NV-NET-C05',
        certificationTitle: 'Course 5 Cert',
        credentialId: `NV-TEST-C05-${Date.now()}`,
        status: 'ACTIVE',
      },
    });

    // Populate all flagship course lessons with completed progress, quiz scores 90%, and passed labs
    const flagshipCourses = await prisma.course.findMany({
      where: { code: { in: ['NV-C01', 'NV-C02', 'NV-C03', 'NV-C04', 'NV-C05'] } },
      include: { modules: { include: { lessons: { include: { quizzes: true, labs: true } } } } },
    });
    const allFlagshipLessons = flagshipCourses.flatMap((c) => c.modules.flatMap((m) => m.lessons));

    for (const l of allFlagshipLessons) {
      await prisma.userProgress.create({
        data: {
          userId: userMasteryTest.id,
          lessonId: l.id,
          completed: true,
          score: 90,
        },
      });
      for (const q of l.quizzes) {
        await prisma.quizAttempt.create({
          data: {
            userId: userMasteryTest.id,
            quizId: q.id,
            score: 90,
            passed: true,
            answersJson: {},
          },
        });
      }
      for (const lab of l.labs) {
        await prisma.labAttempt.create({
          data: {
            userId: userMasteryTest.id,
            labId: lab.id,
            passed: true,
            score: 100,
          },
        });
      }
    }

    // Now all 5 certs exist, 100% lessons complete, quiz average 90%, labs passed, but capstone NOT yet passed
    const masteryPendingCapstone = await eligibilityService.checkMasteryEligibility(userMasteryTest.id);
    check(masteryPendingCapstone.eligible === false, 'Candidate without passed Capstone is NOT eligible');
    check(masteryPendingCapstone.breakdown.courseCertificates.passed === true, 'All 5 course certificates verified');
    check(masteryPendingCapstone.breakdown.flagshipLessons.passed === true, '100% flagship lessons verified');
    check(masteryPendingCapstone.breakdown.cumulativeAssessments.passed === true, 'Cumulative assessment >= 85% verified');

    // Create a failed capstone attempt (score: 80% < 85%)
    await prisma.examAttempt.create({
      data: {
        userId: userMasteryTest.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.FAILED,
        score: 80,
        passed: false,
        expiresAt: new Date(Date.now() + 7200000),
      },
    });

    const masteryFailedCapstone = await eligibilityService.checkMasteryEligibility(userMasteryTest.id);
    check(masteryFailedCapstone.eligible === false, 'Candidate with failed capstone (80%) is NOT eligible');

    // Now record PASSED capstone attempt (score: 92% >= 85%)
    await prisma.examAttempt.create({
      data: {
        userId: userMasteryTest.id,
        certificationCode: 'NV-NET-MASTERY',
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.PASSED,
        score: 92,
        passed: true,
        expiresAt: new Date(Date.now() + 7200000),
        submittedAt: new Date(),
      },
    });

    const masteryComplete = await eligibilityService.checkMasteryEligibility(userMasteryTest.id);
    check(masteryComplete.eligible === true, 'Candidate with all 5 certs, 100% curriculum, 90% quizzes, and 92% capstone is ELIGIBLE for Mastery');
    check(masteryComplete.blockingRequirements.length === 0, 'Zero blockers remaining for full mastery candidate');

    // =========================================================================
    // SUITE 3: MASTER CAPSTONE FOUNDATION (NV-NET-MASTERY-EXAM)
    // =========================================================================
    console.log('\n--- Suite 3: Master Capstone Foundation & Timed Rules ---');

    // 1. Prerequisite gate
    const userNoCerts = await prisma.user.create({
      data: {
        email: `drop2-nocerts-${Date.now()}@netvision.test`,
        username: `drop2_nocerts_${Date.now()}`,
        fullName: 'No Certs Learner',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userNoCerts.id);

    let blockedWithoutCerts = false;
    try {
      await capstoneService.startCapstoneAttempt(userNoCerts.id);
    } catch (e: any) {
      blockedWithoutCerts = e.status === 403 && e.message?.includes('Missing: NV-NET-C01');
    }
    check(blockedWithoutCerts, 'Starting Master Capstone without all 5 course certificates is strictly FORBIDDEN (403)');

    // 2. Start Capstone attempt for qualified user
    const userCapstone = await prisma.user.create({
      data: {
        email: `drop2-capstone-${Date.now()}@netvision.test`,
        username: `drop2_capstone_${Date.now()}`,
        fullName: 'Capstone Candidate',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userCapstone.id);

    // Give userCapstone all 5 course certs
    for (let i = 1; i <= 5; i++) {
      await prisma.certificate.create({
        data: {
          userId: userCapstone.id,
          certificationCode: `NV-NET-C0${i}`,
          certificationTitle: `Course ${i} Cert`,
          credentialId: `NV-TEST-CAP-C0${i}-${Date.now()}`,
          status: 'ACTIVE',
        },
      });
    }

    const startRes = await capstoneService.startCapstoneAttempt(userCapstone.id);
    check(!!startRes.attemptId, 'Capstone attempt successfully initiated with attempt ID');
    check(startRes.durationMinutes === 120, 'Capstone duration is exactly 120 minutes');
    check(startRes.durationSeconds === 7200, 'Capstone duration is exactly 7,200 seconds');

    const expectedExpiry = new Date(new Date(startRes.startedAt).getTime() + 7200 * 1000).getTime();
    const actualExpiry = new Date(startRes.expiresAt).getTime();
    check(Math.abs(expectedExpiry - actualExpiry) < 2000, 'Server-calculated expiresAt matches startedAt + 120 minutes');

    // 3. Status check with remaining seconds
    const statusRes = await capstoneService.getCapstoneAttemptStatus(userCapstone.id, startRes.attemptId);
    check(statusRes.status === ExamAttemptStatus.IN_PROGRESS, 'Attempt status is IN_PROGRESS');
    check(statusRes.remainingSeconds > 7150 && statusRes.remainingSeconds <= 7200, 'Server-side remaining time accurately calculated');

    // 4. Scoring Weights: Theory=40%, Practical=35%, Packet=25%
    // Pass case: Theory 90, Practical 90, Packet 90 -> overall 90% (>=85% -> PASSED)
    const submitPassRes = await capstoneService.submitCapstoneAttempt(userCapstone.id, startRes.attemptId, {
      componentScores: {
        theoryScore: 90,
        practicalScore: 90,
        packetAnalysisScore: 90,
      },
    });
    check(submitPassRes.passed === true, 'Candidate with 90% weighted score PASSES Capstone');
    check(submitPassRes.score === 90, 'Calculated overall score is 90%');
    check(submitPassRes.status === ExamAttemptStatus.PASSED, 'Attempt status updated to PASSED');

    // 5. Test Cooldown Enforcement on Failure (Dedicated user with exactly 1 failed attempt)
    const userCooldown = await prisma.user.create({
      data: {
        email: `drop2-cooldown-${Date.now()}@netvision.test`,
        username: `drop2_cooldown_${Date.now()}`,
        fullName: 'Cooldown Tester',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userCooldown.id);

    for (let i = 1; i <= 5; i++) {
      await prisma.certificate.create({
        data: {
          userId: userCooldown.id,
          certificationCode: `NV-NET-C0${i}`,
          certificationTitle: `Course ${i} Cert`,
          credentialId: `NV-COOL-C0${i}-${Date.now()}`,
          status: 'ACTIVE',
        },
      });
    }

    const coolAttempt1 = await prisma.examAttempt.create({
      data: {
        userId: userCooldown.id,
        certificationCode: CAPSTONE_CONFIG.certificationCode,
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
      },
    });

    // Fail attempt 1: Theory 60, Practical 60, Packet 60 -> overall 60% (<85% -> FAILED)
    const submitFailRes = await capstoneService.submitCapstoneAttempt(userCooldown.id, coolAttempt1.id, {
      componentScores: {
        theoryScore: 60,
        practicalScore: 60,
        packetAnalysisScore: 60,
      },
    });
    check(submitFailRes.passed === false, 'Candidate with 60% fails capstone');
    check(submitFailRes.status === ExamAttemptStatus.FAILED, 'Attempt status updated to FAILED');

    // Immediately attempting to start again must trigger cooldown blocker
    let cooldownTriggered = false;
    try {
      await capstoneService.startCapstoneAttempt(userCooldown.id);
    } catch (e: any) {
      cooldownTriggered = e.status === 400 && e.message?.includes('cooldown active');
    }
    check(cooldownTriggered, 'Immediate retake after failure is rejected by server-side cooldown enforcement');

    // 6. Test 90-day 3-Attempt Rolling Limit
    const userLimit = await prisma.user.create({
      data: {
        email: `drop2-limit-${Date.now()}@netvision.test`,
        username: `drop2_limit_${Date.now()}`,
        fullName: 'Attempt Limit Tester',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userLimit.id);

    for (let i = 1; i <= 5; i++) {
      await prisma.certificate.create({
        data: {
          userId: userLimit.id,
          certificationCode: `NV-NET-C0${i}`,
          certificationTitle: `Course ${i} Cert`,
          credentialId: `NV-LIM-C0${i}-${Date.now()}`,
          status: 'ACTIVE',
        },
      });
    }

    // Pre-create 3 attempts within 90 days
    for (let attemptNum = 1; attemptNum <= 3; attemptNum++) {
      await prisma.examAttempt.create({
        data: {
          userId: userLimit.id,
          certificationCode: CAPSTONE_CONFIG.certificationCode,
          type: ExamType.PRACTICAL,
          status: ExamAttemptStatus.PASSED,
          attemptNumber: attemptNum,
          startedAt: new Date(Date.now() - attemptNum * 86400000),
          expiresAt: new Date(),
        },
      });
    }

    let limitTriggered = false;
    try {
      await capstoneService.startCapstoneAttempt(userLimit.id);
    } catch (e: any) {
      limitTriggered = e.status === 400 && e.message?.includes('Maximum Capstone attempt limit');
    }
    check(limitTriggered, 'Attempt 4 within 90-day rolling window is strictly rejected (max 3 attempts rule)');

    // 7. Test Expiration Enforcement (cannot submit expired exam)
    const expiredAttempt = await prisma.examAttempt.create({
      data: {
        userId: userCapstone.id,
        certificationCode: CAPSTONE_CONFIG.certificationCode,
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(Date.now() - 8000 * 1000),
        expiresAt: new Date(Date.now() - 800 * 1000), // Expired 800s ago
      },
    });

    let expiredRejected = false;
    try {
      await capstoneService.submitCapstoneAttempt(userCapstone.id, expiredAttempt.id, {
        componentScores: { theoryScore: 100, practicalScore: 100, packetAnalysisScore: 100 },
      });
    } catch (e: any) {
      expiredRejected = e.status === 400 && e.message?.includes('duration has expired');
    }
    check(expiredRejected, 'Submitting an exam attempt after 120-minute expiration is strictly rejected');

    // 8. Test Forged Score Rejection (client passing score: 100, passed: true is strictly ignored)
    const forgedAttempt = await prisma.examAttempt.create({
      data: {
        userId: userCapstone.id,
        certificationCode: CAPSTONE_CONFIG.certificationCode,
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
      },
    });

    const forgedRes = await capstoneService.submitCapstoneAttempt(userCapstone.id, forgedAttempt.id, {
      ...({ score: 100, passed: true, overallScore: 100 } as any),
    });
    check(forgedRes.passed === false, 'Client-forged passing score is strictly ignored (passed=false)');
    check(forgedRes.score === 0, 'Client-forged score evaluated as 0% when no work performed');

    // 9. Test Repeated Submission Rejection
    let repeatedSubmissionBlocked = false;
    try {
      await capstoneService.submitCapstoneAttempt(userCapstone.id, forgedAttempt.id, {
        componentScores: { theoryScore: 90, practicalScore: 90, packetAnalysisScore: 90 },
      });
    } catch (e: any) {
      repeatedSubmissionBlocked = e.status === 400 && e.message?.includes('Cannot submit exam attempt with status');
    }
    check(repeatedSubmissionBlocked, 'Repeated submission on finalized attempt is strictly rejected');

    // 10. Test Parallel Submission Race Condition (Atomic CAS Update)
    const parallelAttempt = await prisma.examAttempt.create({
      data: {
        userId: userCapstone.id,
        certificationCode: CAPSTONE_CONFIG.certificationCode,
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
      },
    });

    const [parallel1, parallel2] = await Promise.allSettled([
      capstoneService.submitCapstoneAttempt(userCapstone.id, parallelAttempt.id, {
        componentScores: { theoryScore: 90, practicalScore: 90, packetAnalysisScore: 90 },
      }),
      capstoneService.submitCapstoneAttempt(userCapstone.id, parallelAttempt.id, {
        componentScores: { theoryScore: 90, practicalScore: 90, packetAnalysisScore: 90 },
      }),
    ]);

    const oneFulfilled = (parallel1.status === 'fulfilled' && parallel2.status === 'rejected') ||
      (parallel2.status === 'fulfilled' && parallel1.status === 'rejected');
    check(oneFulfilled, 'Parallel submission race condition resolved atomically (exactly 1 succeeds, 1 rejected)');

    // =========================================================================
    // SUITE 4: SECURITY, TENANT ISOLATION & SAFE ISSUANCE BOUNDARY
    // =========================================================================
    console.log('\n--- Suite 4: Security, Tenant Isolation & Safe Issuance ---');

    const userAlice = await prisma.user.create({
      data: {
        email: `drop2-alice-${Date.now()}@netvision.test`,
        username: `drop2_alice_${Date.now()}`,
        fullName: 'Alice Walker',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userAlice.id);

    const userBob = await prisma.user.create({
      data: {
        email: `drop2-bob-${Date.now()}@netvision.test`,
        username: `drop2_bob_${Date.now()}`,
        fullName: 'Bob Smith',
        passwordHash: 'dummy',
        role: Role.STUDENT,
        isVerified: true,
      },
    });
    createdUserIds.push(userBob.id);

    // Create active capstone attempt for Alice
    const aliceAttempt = await prisma.examAttempt.create({
      data: {
        userId: userAlice.id,
        certificationCode: CAPSTONE_CONFIG.certificationCode,
        type: ExamType.PRACTICAL,
        status: ExamAttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 7200000),
      },
    });

    // Bob tries to inspect Alice's attempt status -> ForbiddenException (403)
    let bobStatusBlocked = false;
    try {
      await capstoneService.getCapstoneAttemptStatus(userBob.id, aliceAttempt.id);
    } catch (e: any) {
      bobStatusBlocked = e.status === 403 && e.message?.includes('Access denied');
    }
    check(bobStatusBlocked, 'User B blocked from inspecting User A Capstone attempt (IDOR Defense)');

    // Bob tries to submit Alice's attempt -> ForbiddenException (403)
    let bobSubmitBlocked = false;
    try {
      await capstoneService.submitCapstoneAttempt(userBob.id, aliceAttempt.id, {
        componentScores: { theoryScore: 100, practicalScore: 100, packetAnalysisScore: 100 },
      });
    } catch (e: any) {
      bobSubmitBlocked = e.status === 403;
    }
    check(bobSubmitBlocked, 'User B blocked from submitting User A Capstone attempt');

    // Bob tries to claim NV-NET-C01 without fulfilling requirements -> Blocked
    let bobClaimBlocked = false;
    try {
      await certificationsService.claimCertificationCertificate(userBob.id, 'NV-NET-C01');
    } catch (e: any) {
      bobClaimBlocked = e.status === 400 && e.message?.includes('Certificate claim denied');
    }
    check(bobClaimBlocked, 'Claiming certification without meeting server-side requirements is REJECTED');

    // Eligible user claims certificate -> Issued successfully
    const claimedCert1 = await certificationsService.claimCertificationCertificate(userEligible.id, 'NV-NET-C01');
    check(!!claimedCert1.credentialId, 'Certificate successfully issued with credential ID');
    check(claimedCert1.status === 'ACTIVE', 'Certificate status is ACTIVE');

    // Duplicate claim check -> Idempotent, returns same certificate without creating second row
    const claimedCert2 = await certificationsService.claimCertificationCertificate(userEligible.id, 'NV-NET-C01');
    check(claimedCert2.credentialId === claimedCert1.credentialId, 'Duplicate claim returns existing credential ID');

    const totalUserCerts = await prisma.certificate.count({
      where: { userId: userEligible.id, certificationCode: 'NV-NET-C01' },
    });
    check(totalUserCerts === 1, 'Duplicate certificate claims strictly prevented (total count = 1)');

    // Concurrent claim race condition check
    const [concurrentClaim1, concurrentClaim2] = await Promise.all([
      certificationsService.claimCertificationCertificate(userEligible.id, 'NV-NET-C01'),
      certificationsService.claimCertificationCertificate(userEligible.id, 'NV-NET-C01'),
    ]);
    check(concurrentClaim1.credentialId === concurrentClaim2.credentialId, 'Concurrent claim requests return identical credential ID');

    // Public Verification Privacy check
    const verifiedData = await certificationsService.verifyCertificate(claimedCert1.credentialId!);
    check(verifiedData.isVerified === true, 'Public verification reports isVerified=true');
    check(verifiedData.recipientName === userEligible.fullName, 'Public verification reports candidate full name');
    check(!('passwordHash' in verifiedData), 'Public verification never exposes passwordHash');
    check(!('email' in verifiedData), 'Public verification never exposes user email');

    // Eligible Mastery Candidate claims Mastery Certificate -> Issued
    const claimedMastery = await certificationsService.claimCertificationCertificate(userMasteryTest.id, 'NV-NET-MASTERY');
    check(!!claimedMastery.credentialId, 'Mastery Certificate successfully issued');
    check(claimedMastery.certificationCode === 'NV-NET-MASTERY', 'Mastery credential code is NV-NET-MASTERY');

    // Duplicate claim check on Mastery
    const claimedMastery2 = await certificationsService.claimCertificationCertificate(userMasteryTest.id, 'NV-NET-MASTERY');
    check(claimedMastery2.credentialId === claimedMastery.credentialId, 'Mastery claim is idempotent');
    const totalMasteryCerts = await prisma.certificate.count({
      where: { userId: userMasteryTest.id, certificationCode: 'NV-NET-MASTERY' },
    });
    check(totalMasteryCerts === 1, 'Duplicate Mastery certificate strictly prevented (total count = 1)');

    // =========================================================================
    // SUITE 5: SPECIFICATION & METADATA VERIFICATION
    // =========================================================================
    console.log('\n--- Suite 5: Specification & Blueprint Invariants ---');
    const spec = capstoneService.getSpecification();
    check(spec.durationMinutes === 120, 'Blueprint duration is 120 minutes');
    check(spec.scoringWeights.theoryWeight === 40, 'Theory weight is exactly 40%');
    check(spec.scoringWeights.practicalWeight === 35, 'Multi-layer topology practical weight is exactly 35%');
    check(spec.scoringWeights.packetAnalysisWeight === 25, 'Packet forensics weight is exactly 25%');
    check(spec.scoringWeights.passingScore === 85, 'Passing threshold is exactly 85%');
    check(spec.policy.maxAttempts === 3, 'Maximum attempts is 3');
    check(spec.policy.rollingWindowDays === 90, 'Rolling window is 90 days');
    check(spec.prerequisites.length === 5, 'Requires all 5 course certifications');

    // =========================================================================
    // SUMMARY
    // =========================================================================
    console.log('\n======================================================');
    console.log(`Drop #2 Verification Results: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    // Clean up all isolated test data
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
      console.log(`🧹 Cleaned up ${createdUserIds.length} isolated test learner fixtures.`);
    }
    await prisma.$disconnect();
  }
}

runDrop2Tests().catch(async (err) => {
  console.error('Unexpected error during Drop #2 verification:', err);
  await prisma.$disconnect();
  process.exit(1);
});
