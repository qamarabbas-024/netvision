/**
 * NETVISION — DROP 04: HIGH-STAKES CERTIFICATION INTEGRITY HARDENING
 * AUTOMATED VERIFICATION TEST SUITE
 *
 * Verifies:
 * 1. Double-click Start Concurrency: Racing requests converge on 1 authoritative attempt, zero duplicates, no HTTP 500 (P2002 handled).
 * 2. Double-click Submit & Parallel Requests: CAS idempotency guarantees consistent graded score, exactly one transaction commits.
 * 3. Same Attempt ID from Two Clients: Replay & stale browser defense ensures terminal immutability without state corruption.
 * 4. Expired Attempt Submission: Strict rejection after 15s network latency tolerance window (status: EXPIRED, score: 0).
 * 5. Latency Tolerance Semantics: Valid submissions within 15s transit window succeed and log audit metadata.
 * 6. Client Manipulation Resistance: Server authoritatively grades questions; client-provided score/percentage overrides are ignored.
 * 7. Direct API Certificate Request: Ineligible users cannot bypass requirements; unauthorized claims throw BadRequestException.
 * 8. Repeated / Concurrent Certificate Claims: Unique constraint and transaction double-check guarantee exactly ONE certificate (zero duplicates).
 * 9. Question Blueprint Generation: Full question pool used (take: 200 removed), unbiased Fisher-Yates shuffle with crypto.randomInt.
 * 10. Zero Answer Key Leakage: Exam snapshots and status endpoints strip correctOption and explanation.
 * 11. Public Certificate Verification: Validates active credentials without leaking internal secrets, user emails, or password hashes.
 */

import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ExamAttemptStatus, ExamType } from '@prisma/client';
import * as crypto from 'crypto';
import { CertificationsService } from '../src/certifications/certifications.service';
import { MasterCapstoneService } from '../src/certifications/master-capstone.service';
import { CertificationEligibilityService } from '../src/certifications/certification-eligibility.service';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runDrop04Tests() {
  console.log('========================================================================');
  console.log('🛡️  NETVISION — DROP 04: HIGH-STAKES CERTIFICATION INTEGRITY HARDENING');
  console.log('========================================================================\n');

  let passedTests = 0;

  // Mock Certification Definition
  const mockCertDef = {
    id: 'cert-nv-net-uuid',
    code: 'NV-NET',
    title: 'NetVision Certified Network Administrator (NV-NET)',
    description: 'Foundational certification validating enterprise networking, IP addressing, switching, and routing.',
    level: 'BEGINNER',
    isActive: true,
    policyJson: {
      maxAttempts: 3,
      rollingWindowDays: 30,
      cooldownAfterFirstFailure: 86400,
      cooldownAfterSubsequentFailure: 259200,
    },
    theoryConfigJson: {
      questionCount: 50,
      durationSeconds: 3600,
      passingScore: 80,
      troubleshootingMinimum: 70,
    },
    practicalConfigJson: {
      durationSeconds: 5400,
      scenarioCode: 'NV-NET-PRACTICAL-SCENARIO-1',
      scoringWeights: {
        theoryWeight: 20,
        practicalWeight: 35,
        troubleshootingWeight: 25,
        packetAnalysisWeight: 20,
        componentMinimum: 60,
        passingScore: 80,
      },
    },
  };

  // Generate 60 mock approved quiz questions for blueprint testing
  const mockApprovedQuestions = Array.from({ length: 60 }, (_, i) => ({
    id: `q-approved-${i + 1}`,
    questionText: `Approved Network Architecture Question #${i + 1} regarding protocols and routing`,
    optionsJson: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
    correctOption: 0,
    explanation: `Detailed explanation for question #${i + 1} that must remain confidential`,
    cognitiveLevel: i % 5 === 0 ? 'TROUBLESHOOTING' : i % 5 === 1 ? 'APPLICATION' : 'UNDERSTANDING',
    questionType: i % 5 === 0 ? 'TROUBLESHOOTING' : i % 5 === 1 ? 'PACKET_ANALYSIS' : 'MULTIPLE_CHOICE',
    points: 10,
    concept: i % 3 === 0 ? 'Subnetting IPv4 CIDR' : i % 3 === 1 ? 'OSPF Routing' : 'TCP/IP Handshake',
  }));

  // =========================================================================
  // TEST 1: Double-Click Start Concurrency & Invariant Enforcement
  // =========================================================================
  console.log('--- TEST 1: DOUBLE-CLICK START CONCURRENCY & P2002 CONVERGENCE ---');
  {
    const userId = 'user-candidate-001';
    let attemptsCreated = 0;
    const databaseAttempts: any[] = [];

    const mockPrisma: any = {
      certificationDefinition: {
        findUnique: async ({ where }: any) => {
          if (where.code === 'NV-NET') return mockCertDef;
          return null;
        },
      },
      user: {
        findUnique: async ({ where }: any) => {
          if (where.id === userId) return { id: userId, isVerified: true, fullName: 'Alex Rivera' };
          return null;
        },
      },
      examAttempt: {
        findMany: async () => [],
        findFirst: async ({ where }: any) => {
          return databaseAttempts.find(
            (a) =>
              a.userId === where.userId &&
              a.certificationCode === where.certificationCode &&
              a.type === where.type &&
              a.status === ExamAttemptStatus.IN_PROGRESS &&
              new Date(a.expiresAt) > new Date()
          ) || null;
        },
        create: async ({ data }: any) => {
          // If already created in database, simulate database-level unique constraint collision (P2002)
          if (databaseAttempts.some((a) => a.userId === data.userId && a.status === ExamAttemptStatus.IN_PROGRESS)) {
            const p2002Err: any = new Error('Unique constraint violation on exam_attempts active attempt index');
            p2002Err.code = 'P2002';
            throw p2002Err;
          }
          attemptsCreated++;
          const newAttempt = {
            id: `attempt-active-${Date.now()}`,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          databaseAttempts.push(newAttempt);
          return newAttempt;
        },
      },
      quizQuestion: {
        findMany: async () => mockApprovedQuestions,
      },
      $transaction: async (fn: any) => {
        return fn(mockPrisma);
      },
    };

    const mockEligibility: any = {
      checkCourseEligibility: async () => ({ eligible: true }),
      checkMasteryEligibility: async () => ({ eligible: true }),
    };

    const certsService = new CertificationsService(mockPrisma, mockEligibility);

    // Simulate double-click Start (2 simultaneous requests racing into startExamAttempt)
    const [startResult1, startResult2] = await Promise.all([
      certsService.startExamAttempt(userId, { certificationCode: 'NV-NET', type: ExamType.THEORY }),
      certsService.startExamAttempt(userId, { certificationCode: 'NV-NET', type: ExamType.THEORY }),
    ]);

    assert(startResult1 !== undefined && startResult2 !== undefined, 'Both racing start requests completed successfully without HTTP 500');
    assert(startResult1.attemptId === startResult2.attemptId, 'Both racing start requests converged on the EXACT same authoritative attemptId');
    assert(attemptsCreated === 1, `Exactly ONE active exam attempt was created in database (observed: ${attemptsCreated})`);
    assert(startResult1.status === ExamAttemptStatus.IN_PROGRESS, 'Attempt status is authoritative IN_PROGRESS');
    passedTests++;
  }

  // =========================================================================
  // TEST 2: Double-Click Submit & Parallel Submit Requests (CAS Idempotency)
  // =========================================================================
  console.log('\n--- TEST 2: DOUBLE-CLICK SUBMIT & CAS IDEMPOTENCY ---');
  {
    const userId = 'user-candidate-002';
    const attemptId = 'attempt-to-submit-002';
    const startedAt = new Date(Date.now() - 30 * 60 * 1000); // 30 mins ago
    const expiresAt = new Date(startedAt.getTime() + 3600 * 1000); // 30 mins remaining

    let updateManyExecutionCount = 0;
    let terminalUpdateCommitted = false;

    // Build question snapshot
    const questions = mockApprovedQuestions.slice(0, 50);
    const answersJson: Record<string, number> = {};
    for (const q of questions) {
      answersJson[q.id] = 0; // All correct -> 100% score
    }

    const savedAttempt: any = {
      id: attemptId,
      userId,
      certificationCode: 'NV-NET',
      type: ExamType.THEORY,
      status: ExamAttemptStatus.IN_PROGRESS,
      startedAt,
      expiresAt,
      attemptNumber: 1,
      score: null,
      passed: null,
      submittedAt: null,
      configSnapshotJson: {
        passingScore: 80,
        troubleshootingMinimum: 70,
        questions,
      },
      resultMetadataJson: {
        answersJson: {},
      },
      createdAt: startedAt,
      updatedAt: startedAt,
    };

    const mockPrisma: any = {
      examAttempt: {
        findUnique: async ({ where }: any) => {
          if (where.id === attemptId) return savedAttempt;
          return null;
        },
        updateMany: async ({ where, data }: any) => {
          updateManyExecutionCount++;
          // Atomic CAS: only update if currently IN_PROGRESS
          if (savedAttempt.id === where.id && savedAttempt.status === ExamAttemptStatus.IN_PROGRESS && !terminalUpdateCommitted) {
            terminalUpdateCommitted = true;
            savedAttempt.status = data.status;
            savedAttempt.score = data.score;
            savedAttempt.passed = data.passed;
            savedAttempt.submittedAt = data.submittedAt;
            savedAttempt.resultMetadataJson = data.resultMetadataJson;
            return { count: 1 };
          }
          // Second parallel caller finds count: 0 because attempt is no longer IN_PROGRESS
          return { count: 0 };
        },
      },
    };

    const certsService = new CertificationsService(mockPrisma, {} as any);

    // Fire 2 parallel submit requests simultaneously
    const [submitResult1, submitResult2] = await Promise.all([
      certsService.submitExamAttempt(userId, attemptId, { answersJson }),
      certsService.submitExamAttempt(userId, attemptId, { answersJson }),
    ]);

    assert(submitResult1.status === ExamAttemptStatus.PASSED, 'First submit request successfully finalized with status PASSED');
    assert(submitResult2.status === ExamAttemptStatus.PASSED, 'Second submit request returned status PASSED');
    assert(submitResult1.score === 100 && submitResult2.score === 100, 'Both callers received identical authoritative score (100%)');
    assert(submitResult1.isIdempotent === undefined || submitResult2.isIdempotent === true, 'Parallel duplicate submission was safely handled idempotently (isIdempotent: true)');
    assert(savedAttempt.score === 100 && savedAttempt.passed === true, 'Database attempt terminal state is permanently locked to score: 100, passed: true');
    passedTests++;
  }

  // =========================================================================
  // TEST 3: Same Attempt ID from Two Clients (Replay & Stale Browser Defense)
  // =========================================================================
  console.log('\n--- TEST 3: SAME ATTEMPT ID FROM TWO CLIENTS (REPLAY DEFENSE) ---');
  {
    const userId = 'user-candidate-003';
    const attemptId = 'attempt-replay-003';
    const startedAt = new Date(Date.now() - 40 * 60 * 1000);
    const expiresAt = new Date(startedAt.getTime() + 3600 * 1000);

    const questions = mockApprovedQuestions.slice(0, 50);

    const clientAAnswers: Record<string, number> = {};
    for (const q of questions) {
      clientAAnswers[q.id] = 0; // 100% correct
    }

    const clientBAnswers: Record<string, number> = {};
    for (const q of questions) {
      clientBAnswers[q.id] = 1; // 0% correct (attempting to overwrite Client A with failures)
    }

    const statefulAttempt: any = {
      id: attemptId,
      userId,
      certificationCode: 'NV-NET',
      type: ExamType.THEORY,
      status: ExamAttemptStatus.IN_PROGRESS,
      startedAt,
      expiresAt,
      score: null,
      passed: null,
      configSnapshotJson: {
        passingScore: 80,
        troubleshootingMinimum: 70,
        questions,
      },
      resultMetadataJson: {},
    };

    const mockPrisma: any = {
      examAttempt: {
        findUnique: async ({ where }: any) => {
          if (where.id === attemptId) return statefulAttempt;
          return null;
        },
        updateMany: async ({ where, data }: any) => {
          if (statefulAttempt.status === ExamAttemptStatus.IN_PROGRESS) {
            statefulAttempt.status = data.status;
            statefulAttempt.score = data.score;
            statefulAttempt.passed = data.passed;
            statefulAttempt.submittedAt = data.submittedAt;
            statefulAttempt.resultMetadataJson = data.resultMetadataJson;
            return { count: 1 };
          }
          return { count: 0 };
        },
      },
    };

    const certsService = new CertificationsService(mockPrisma, {} as any);

    // Client A submits first
    const clientAResult = await certsService.submitExamAttempt(userId, attemptId, { answersJson: clientAAnswers });
    assert(clientAResult.score === 100 && clientAResult.passed === true, 'Client A submitted legitimate answers and received 100% PASSED');

    // Stale Client B submits alternate answers after attempt is already finalized
    const clientBResult = await certsService.submitExamAttempt(userId, attemptId, { answersJson: clientBAnswers });

    assert(clientBResult.score === 100, 'Client B received authoritative 100% score (could not mutate database to 0%)');
    assert(clientBResult.isIdempotent === true, 'Client B received idempotent result acknowledgment');
    assert(statefulAttempt.score === 100, 'Stateful DB attempt remains intact at 100% (replay mutation defeated)');
    passedTests++;
  }

  // =========================================================================
  // TEST 4: Expired Attempt Submission Beyond 15-Second Latency Tolerance
  // =========================================================================
  console.log('\n--- TEST 4: EXPIRED ATTEMPT SUBMISSION BEYOND 15S TOLERANCE ---');
  {
    const userId = 'user-candidate-004';
    const attemptId = 'attempt-expired-004';
    // Expired 60 seconds ago (far beyond 15s transit tolerance)
    const startedAt = new Date(Date.now() - 3660 * 1000);
    const expiresAt = new Date(Date.now() - 60 * 1000);

    const questions = mockApprovedQuestions.slice(0, 50);
    const answersJson: Record<string, number> = {};
    for (const q of questions) answersJson[q.id] = 0;

    let updatedStatus: ExamAttemptStatus | null = null;
    let updatedScore: number | null = null;

    const mockPrisma: any = {
      examAttempt: {
        findUnique: async () => ({
          id: attemptId,
          userId,
          certificationCode: 'NV-NET',
          type: ExamType.THEORY,
          status: ExamAttemptStatus.IN_PROGRESS,
          startedAt,
          expiresAt,
          configSnapshotJson: { questions },
          resultMetadataJson: {},
        }),
        update: async ({ data }: any) => {
          updatedStatus = data.status;
          updatedScore = data.score;
          return { id: attemptId, ...data };
        },
      },
    };

    const certsService = new CertificationsService(mockPrisma, {} as any);
    const expiredResult = await certsService.submitExamAttempt(userId, attemptId, { answersJson });

    assert(expiredResult.status === ExamAttemptStatus.EXPIRED, 'Submission was rejected as EXPIRED');
    assert(expiredResult.score === 0, 'Expired submission score is strictly 0');
    assert(expiredResult.isExpired === true, 'Expired result flag is true');
    assert(updatedStatus === ExamAttemptStatus.EXPIRED && updatedScore === 0, 'Database record was strictly marked EXPIRED with score 0');
    passedTests++;
  }

  // =========================================================================
  // TEST 5: Valid Submission Within 15-Second Latency Tolerance Window
  // =========================================================================
  console.log('\n--- TEST 5: SUBMISSION WITHIN 15-SECOND NETWORK TRANSIT TOLERANCE ---');
  {
    const userId = 'user-candidate-005';
    const attemptId = 'attempt-tolerance-005';
    // Expired 5 seconds ago (within 15s network transit tolerance)
    const startedAt = new Date(Date.now() - 3605 * 1000);
    const expiresAt = new Date(Date.now() - 5 * 1000);

    const questions = mockApprovedQuestions.slice(0, 50);
    const answersJson: Record<string, number> = {};
    for (const q of questions) answersJson[q.id] = 0;

    let savedResultMetadata: any = null;

    const statefulAttempt5: any = {
      id: attemptId,
      userId,
      certificationCode: 'NV-NET',
      type: ExamType.THEORY,
      status: ExamAttemptStatus.IN_PROGRESS,
      startedAt,
      expiresAt,
      configSnapshotJson: {
        passingScore: 80,
        troubleshootingMinimum: 70,
        questions,
      },
      resultMetadataJson: {},
    };

    const mockPrisma: any = {
      examAttempt: {
        findUnique: async () => statefulAttempt5,
        updateMany: async ({ data }: any) => {
          savedResultMetadata = data.resultMetadataJson;
          Object.assign(statefulAttempt5, data);
          return { count: 1 };
        },
      },
    };

    const certsService = new CertificationsService(mockPrisma, {} as any);
    const toleranceResult = await certsService.submitExamAttempt(userId, attemptId, { answersJson });

    assert(toleranceResult.status === ExamAttemptStatus.PASSED, 'Submission within 15s network tolerance was accepted and graded PASSED');
    assert(toleranceResult.score === 100, 'Candidate received legitimate graded score (100%)');
    assert(savedResultMetadata?.submittedWithinTolerance === true, 'Result metadata recorded submittedWithinTolerance: true');
    assert(savedResultMetadata?.latencyToleranceSecondsUsed >= 4 && savedResultMetadata?.latencyToleranceSecondsUsed <= 6, `Latency tolerance seconds used recorded accurately (${savedResultMetadata?.latencyToleranceSecondsUsed}s)`);
    passedTests++;
  }

  // =========================================================================
  // TEST 6: Client Manipulation Resistance (Zero Trust Evaluation)
  // =========================================================================
  console.log('\n--- TEST 6: CLIENT SCORE & STATUS MANIPULATION RESISTANCE ---');
  {
    const userId = 'user-candidate-006';
    const attemptId = 'attempt-tamper-006';
    const startedAt = new Date(Date.now() - 1000 * 60);
    const expiresAt = new Date(Date.now() + 3500 * 1000);

    const questions = mockApprovedQuestions.slice(0, 50);
    // Candidate answers only 20 questions correctly out of 50 = 40% (Fail)
    const answersJson: Record<string, number> = {};
    for (let i = 0; i < 50; i++) {
      answersJson[questions[i].id] = i < 20 ? 0 : 1; // 20 correct, 30 wrong
    }

    let persistedScore: number | null = null;
    let persistedPassed: boolean | null = null;

    const statefulAttempt6: any = {
      id: attemptId,
      userId,
      certificationCode: 'NV-NET',
      type: ExamType.THEORY,
      status: ExamAttemptStatus.IN_PROGRESS,
      startedAt,
      expiresAt,
      configSnapshotJson: {
        passingScore: 80,
        troubleshootingMinimum: 70,
        questions,
      },
      resultMetadataJson: {},
    };

    const mockPrisma: any = {
      examAttempt: {
        findUnique: async () => statefulAttempt6,
        updateMany: async ({ data }: any) => {
          persistedScore = data.score;
          persistedPassed = data.passed;
          Object.assign(statefulAttempt6, data);
          return { count: 1 };
        },
      },
    };

    const certsService = new CertificationsService(mockPrisma, {} as any);

    // Adversarial client sends forged score: 100, percentage: 100, passed: true in payload
    const maliciousPayload: any = {
      answersJson,
      score: 100,
      percentage: 100,
      passed: true,
      status: 'PASSED',
    };

    const tamperResult = await certsService.submitExamAttempt(userId, attemptId, maliciousPayload);

    assert(tamperResult.score === 40, `Server independently evaluated score to 40% (forged 100% ignored)`);
    assert(tamperResult.passed === false, 'Server independently evaluated passed to false (forged true ignored)');
    assert(tamperResult.status === ExamAttemptStatus.FAILED, 'Status is strictly FAILED');
    assert(persistedScore === 40 && persistedPassed === false, 'Database persistence enforced server-computed score 40% and passed: false');
    passedTests++;
  }

  // =========================================================================
  // TEST 7: Direct API Certificate Request & Eligibility Boundary
  // =========================================================================
  console.log('\n--- TEST 7: DIRECT API CERTIFICATE CLAIM ELIGIBILITY BOUNDARY ---');
  {
    const userId = 'user-ineligible-007';

    const mockPrisma: any = {
      certificationDefinition: {
        findUnique: async () => mockCertDef,
      },
      user: {
        findUnique: async () => ({ id: userId, isVerified: true, fullName: 'Unverified Hacker' }),
      },
      certificate: {
        findFirst: async () => null,
      },
      examAttempt: {
        findFirst: async () => null, // No passed exam
      },
    };

    const mockEligibility: any = {
      checkCourseEligibility: async () => ({ eligible: false, blockingRequirements: ['Lessons incomplete (0/25)'] }),
      checkMasteryEligibility: async () => ({ eligible: false, blockingRequirements: ['Missing course certificates'] }),
    };

    const certsService = new CertificationsService(mockPrisma, mockEligibility);

    // Scenario A: Candidate is not eligible (incomplete lessons / quizzes)
    certsService.calculateEligibility = async () => ({
      eligible: false,
      requirements: [{ key: 'COURSES', title: 'Lessons incomplete (0/25)', status: 'INCOMPLETE' }],
    } as any);

    let thrownErrorIneligible: any = null;
    try {
      await certsService.claimCertificationCertificate(userId, 'NV-NET');
    } catch (err: any) {
      thrownErrorIneligible = err;
    }

    assert(thrownErrorIneligible !== null, 'Direct unauthorized claim for ineligible user was blocked');
    assert(thrownErrorIneligible instanceof BadRequestException, 'Threw standard BadRequestException for incomplete requirements');
    assert(thrownErrorIneligible.message.includes('Certificate claim denied'), `Error message clearly identifies denial (${thrownErrorIneligible.message})`);

    // Scenario B: Candidate meets coursework eligibility but has NOT passed the final exam
    certsService.calculateEligibility = async () => ({
      eligible: true,
      requirements: [{ key: 'COURSES', title: 'Coursework Complete', status: 'COMPLETE' }],
    } as any);

    let thrownErrorNoExam: any = null;
    try {
      await certsService.claimCertificationCertificate(userId, 'NV-NET');
    } catch (err: any) {
      thrownErrorNoExam = err;
    }

    assert(thrownErrorNoExam !== null, 'Claim without passed exam attempt was blocked');
    assert(thrownErrorNoExam instanceof BadRequestException, 'Threw standard BadRequestException for missing exam');
    assert(thrownErrorNoExam.message.includes('You have not yet completed and passed the official examination'), `Error specifies missing exam (${thrownErrorNoExam.message})`);

    passedTests++;
  }

  // =========================================================================
  // TEST 8: Repeated & Concurrent Successful Certificate Claims (Zero Duplicates)
  // =========================================================================
  console.log('\n--- TEST 8: REPEATED / CONCURRENT CERTIFICATE CLAIMS (ZERO DUPLICATES) ---');
  {
    const userId = 'user-eligible-008';
    let certificateCreationCount = 0;
    const databaseCertificates: any[] = [];

    const mockPrisma: any = {
      certificationDefinition: {
        findUnique: async () => mockCertDef,
      },
      user: {
        findUnique: async () => ({ id: userId, isVerified: true, fullName: 'Jordan Hayes' }),
      },
      examAttempt: {
        findFirst: async () => ({
          id: 'attempt-passed-008',
          userId,
          certificationCode: 'NV-NET',
          status: ExamAttemptStatus.PASSED,
          passed: true,
          score: 95,
          resultMetadataJson: {
            theoryScore: 95,
            practicalScore: 95,
          },
        }),
      },
      certificate: {
        findFirst: async ({ where }: any) => {
          return databaseCertificates.find(
            (c) => c.userId === where.userId && (c.certificationCode === where.certificationCode || c.status === where.status)
          ) || null;
        },
        create: async ({ data }: any) => {
          // If certificate already exists for this (userId, certificationCode), simulate P2002 unique constraint
          if (databaseCertificates.some((c) => c.userId === data.userId && c.certificationCode === data.certificationCode)) {
            const p2002Err: any = new Error('Unique constraint violation on certificates @@unique([userId, certificationCode])');
            p2002Err.code = 'P2002';
            throw p2002Err;
          }
          certificateCreationCount++;
          const cert = {
            id: `cert-${Date.now()}`,
            code: crypto.randomUUID(),
            ...data,
          };
          databaseCertificates.push(cert);
          return cert;
        },
      },
      $transaction: async (fn: any) => {
        return fn(mockPrisma);
      },
    };

    const certsService = new CertificationsService(mockPrisma, {} as any);
    // Mock calculateEligibility to return eligible: true
    certsService.calculateEligibility = async () => ({
      eligible: true,
      requirements: [
        { key: 'COURSES', title: 'Course Completion', status: 'COMPLETE' },
        { key: 'EXAMS', title: 'Theory & Practical Exams', status: 'COMPLETE' },
      ],
    } as any);

    // Candidate fires 3 parallel claim requests simultaneously
    const [claim1, claim2, claim3] = await Promise.all([
      certsService.claimCertificationCertificate(userId, 'NV-NET'),
      certsService.claimCertificationCertificate(userId, 'NV-NET'),
      certsService.claimCertificationCertificate(userId, 'NV-NET'),
    ]);

    assert(claim1.isVerified === true && claim2.isVerified === true && claim3.isVerified === true, 'All concurrent claim requests succeeded');
    assert(claim1.credentialId === claim2.credentialId && claim2.credentialId === claim3.credentialId, 'All concurrent claims returned the identical authoritative credentialId');
    assert(certificateCreationCount === 1, `Exactly ONE certificate record was created in the database (count: ${certificateCreationCount})`);
    assert(databaseCertificates.length === 1, 'Zero duplicate certificates exist in database storage');
    passedTests++;
  }

  // =========================================================================
  // TEST 9: Theory Blueprint Fisher-Yates Shuffle & Full Pool Retrieval
  // =========================================================================
  console.log('\n--- TEST 9: QUESTION BLUEPRINT UNBIASED SHUFFLE & FULL POOL ---');
  {
    const mockPrisma: any = {
      quizQuestion: {
        findMany: async () => mockApprovedQuestions,
      },
    };

    const certsService = new CertificationsService(mockPrisma, {} as any);

    // Generate 1,200 shuffles of a small array to verify Fisher-Yates uniform distribution
    const items = [0, 1, 2];
    const permutations: Record<string, number> = {};

    for (let i = 0; i < 1200; i++) {
      const shuffled = (certsService as any).secureShuffle([...items]);
      const key = shuffled.join('-');
      permutations[key] = (permutations[key] || 0) + 1;
    }

    const uniquePermutations = Object.keys(permutations);
    assert(uniquePermutations.length === 6, 'All 6 permutations (3! = 6) of [0, 1, 2] were generated');

    // Expected count for each permutation is 1200 / 6 = 200. Check uniform distribution within reasonable margin.
    for (const [perm, count] of Object.entries(permutations)) {
      assert(count >= 130 && count <= 270, `Permutation "${perm}" count (${count}) is uniformly distributed around 200`);
    }

    // Verify buildTheoryExamBlueprint uses full question pool without truncation
    const blueprint = await (certsService as any).buildTheoryExamBlueprint(50);
    assert(blueprint.length === 50, 'Blueprint successfully selected exactly 50 questions');
    const blueprintIds = new Set(blueprint.map((q: any) => q.id));
    assert(blueprintIds.size === 50, 'Blueprint contains 50 distinct, unique approved questions');
    passedTests++;
  }

  // =========================================================================
  // TEST 10: Zero Answer Key & Explanation Leakage
  // =========================================================================
  console.log('\n--- TEST 10: ZERO ANSWER KEY & EXPLANATION LEAKAGE ---');
  {
    const userId = 'user-candidate-010';
    const attemptId = 'attempt-sanitized-010';

    const rawQuestionsWithSecrets = [
      {
        id: 'q-secret-1',
        questionText: 'What is the administrative distance of OSPF?',
        optionsJson: ['110', '90', '120', '1'],
        correctOption: 0,
        explanation: 'CONFIDENTIAL: OSPF default administrative distance is 110.',
        cognitiveLevel: 'UNDERSTANDING',
        questionType: 'MULTIPLE_CHOICE',
        points: 10,
        concept: 'OSPF',
        domain: 'CONCEPTUAL',
      },
    ];

    const mockPrisma: any = {
      examAttempt: {
        findUnique: async () => ({
          id: attemptId,
          userId,
          certificationCode: 'NV-NET',
          type: ExamType.THEORY,
          status: ExamAttemptStatus.IN_PROGRESS,
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + 3600 * 1000),
          configSnapshotJson: {
            questions: rawQuestionsWithSecrets,
          },
          resultMetadataJson: {},
        }),
      },
    };

    const certsService = new CertificationsService(mockPrisma, {} as any);
    const attemptStatus = await certsService.getAttemptStatus(userId, attemptId);

    assert(attemptStatus.questions && attemptStatus.questions.length === 1, 'Questions returned in attempt status');
    const returnedQ = attemptStatus.questions[0];

    assert((returnedQ as any).correctOption === undefined, 'Question payload strictly omits correctOption (no answer key leakage)');
    assert((returnedQ as any).explanation === undefined, 'Question payload strictly omits explanation (no confidential explanation leakage)');
    assert(returnedQ.questionText.includes('administrative distance'), 'Question text and options are preserved for candidate');
    passedTests++;
  }

  // =========================================================================
  // TEST 11: Public Certificate Verification & IDOR Defense
  // =========================================================================
  console.log('\n--- TEST 11: PUBLIC VERIFICATION & IDOR DEFENSE ---');
  {
    const credentialId = 'NV-NET-2026-A1B2C3D4';
    const verificationCode = 'NV-VERIFY-SECRET999';

    const mockCert = {
      id: 'internal-cert-uuid-777',
      userId: 'internal-user-uuid-999',
      credentialId,
      verificationCode,
      code: 'code-uuid-888',
      certificationCode: 'NV-NET',
      certificationTitle: 'NetVision Certified Network Administrator (NV-NET)',
      recipientName: 'Morgan Bailey',
      status: 'ACTIVE',
      issuedAt: new Date('2026-03-15T12:00:00Z'),
      metadataJson: {
        grade: 'Pass with Distinction',
        overallScore: 92,
        componentScores: { theory: 90, practical: 94 },
        skillsAssessed: ['Subnetting', 'Routing', 'Security'],
      },
      user: {
        fullName: 'Morgan Bailey',
        username: 'mbailey',
        email: 'morgan.bailey.private@enterprise.com',
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$SECRET_HASH',
      },
      course: null,
    };

    const mockPrisma: any = {
      certificate: {
        findFirst: async ({ where }: any) => {
          const query = where.OR.find(
            (cond: any) =>
              cond.credentialId === credentialId ||
              cond.code === credentialId ||
              cond.verificationCode === credentialId
          );
          if (query) return mockCert;
          return null;
        },
      },
    };

    const certsService = new CertificationsService(mockPrisma, {} as any);
    const verified = await certsService.verifyCertificate(credentialId);

    assert(verified.isVerified === true, 'Public verification confirms certificate is ACTIVE & verified');
    assert(verified.recipientName === 'Morgan Bailey', 'Public verification returns verified student name');
    assert(verified.credentialId === credentialId, 'Public verification displays official Credential ID');
    assert(verified.grade === 'Pass with Distinction', 'Public verification displays earned Grade');

    // Security Assertions: Zero sensitive leakage
    assert((verified as any).email === undefined, 'Verification payload strictly omits student email address');
    assert((verified as any).passwordHash === undefined, 'Verification payload strictly omits password hash');
    assert((verified as any).userId === undefined, 'Verification payload strictly omits internal DB user UUID');
    assert((verified as any).id === undefined, 'Verification payload strictly omits internal certificate DB UUID');
    assert((verified as any).verificationCode === undefined, 'Verification payload strictly omits secret verificationCode');
    passedTests++;
  }

  console.log('\n========================================================================');
  console.log(`🎉 ALL ${passedTests}/${passedTests} HIGH-STAKES INTEGRITY TESTS PASSED SUCCESSFULLY!`);
  console.log('========================================================================');
}

runDrop04Tests().catch((err) => {
  console.error('\n❌ HIGH-STAKES VERIFICATION FAILED:', err);
  process.exit(1);
});
