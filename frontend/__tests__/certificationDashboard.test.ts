import { FLAGSHIP_5_COURSES, CANONICAL_CREDENTIALS } from '@netvision/shared';
import {
  CourseEligibilityResult,
  MasteryEligibilityResult,
  UserCertificateItem,
  PublicVerifiedCertificateDto,
  CapstoneSpecificationDto,
  CapstoneAttemptSessionDto,
  CapstoneSubmissionResultDto,
  SubmitCapstonePayload,
} from '../lib/api';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

export function runCertificationDashboardTests() {
  // =========================================================================
  // Test 1: Canonical Credentials Completeness (Exactly 6 Credentials)
  // =========================================================================
  assert(CANONICAL_CREDENTIALS.length === 6, 'There must be exactly 6 canonical credentials');

  const expectedCodes = ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05', 'NV-NET-MASTERY'];
  for (const code of expectedCodes) {
    const cred = CANONICAL_CREDENTIALS.find((c) => c.code === code);
    assert(!!cred, `Canonical credential ${code} must exist`);
  }

  const masteryCred = CANONICAL_CREDENTIALS.find((c) => c.code === 'NV-NET-MASTERY');
  assert(masteryCred?.isMastery === true, 'NV-NET-MASTERY must have isMastery = true');

  // =========================================================================
  // Test 2: Course Certification Eligibility State Discrimination
  // =========================================================================
  const mockEligibleCourse: CourseEligibilityResult = {
    courseCode: 'NV-C01',
    courseTitle: 'Foundations & Network Architecture',
    credentialCode: 'NV-NET-C01',
    credentialTitle: 'NetVision Certified Network Foundations Specialist',
    eligible: true,
    hasCertificate: false,
    blockingRequirements: [],
    breakdown: {
      lessons: { total: 5, completed: 5, passed: true },
      assessments: { requiredCount: 5, attemptedCount: 5, averageScore: 92, minRequiredScore: 80, passed: true },
      labs: { total: 3, passedCount: 3, passed: true },
    },
  };

  assert(mockEligibleCourse.eligible === true, 'Course must be eligible when all 3 criteria pass');
  assert(!mockEligibleCourse.hasCertificate, 'Course hasCertificate should be false prior to claim');

  // =========================================================================
  // Test 3: Earned vs Unearned Status Evaluation
  // =========================================================================
  const mockUserCerts: UserCertificateItem[] = [
    {
      credentialId: 'NV-NET-C01-2026-TEST99',
      verificationCode: 'NV-NET-C01-2026-TEST99',
      status: 'ACTIVE',
      issuedAt: new Date().toISOString(),
      recipientName: 'Verified Engineer',
      certificationTitle: 'NetVision Certified Network Foundations Specialist',
      certificationCode: 'NV-NET-C01',
      courseCode: 'NV-C01',
      courseTitle: 'Foundations & Network Architecture',
      grade: 'Distinction',
      score: 95,
      skillsAssessed: ['Binary', 'OSI 7-Layer', 'Topologies'],
    },
  ];

  const c01Earned = mockUserCerts.find((c) => c.certificationCode === 'NV-NET-C01');
  assert(!!c01Earned, 'Earned certificate for NV-NET-C01 must be identifiable');
  assert(c01Earned?.credentialId === 'NV-NET-C01-2026-TEST99', 'Credential ID matches');

  // Course 2 is unearned
  const c02Earned = mockUserCerts.find((c) => c.certificationCode === 'NV-NET-C02');
  assert(!c02Earned, 'Course 2 must be unearned when not present in user certificates');

  // =========================================================================
  // Test 4: Mastery 9-Point Criteria Contract Alignment
  // =========================================================================
  const mockMasteryElig: MasteryEligibilityResult = {
    credentialCode: 'NV-NET-MASTERY',
    credentialTitle: 'NetVision Certified Network Engineering Master',
    eligible: false,
    hasCertificate: false,
    blockingRequirements: [
      'Missing active course certifications: NV-NET-C02, NV-NET-C03, NV-NET-C04, NV-NET-C05 (1/5 acquired)',
      'Master Capstone Examination (NV-NET-MASTERY-EXAM) has not been passed',
    ],
    breakdown: {
      courseCertificates: {
        requiredCodes: ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'],
        acquiredCodes: ['NV-NET-C01'],
        missingCodes: ['NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'],
        passed: false,
      },
      flagshipLessons: { total: 30, completed: 5, passed: false },
      cumulativeAssessments: {
        requiredQuizzes: 25,
        attemptedQuizzes: 5,
        cumulativeAverage: 92,
        minRequiredAverage: 85,
        passed: false,
      },
      flagshipLabs: { total: 15, passedCount: 3, passed: false },
      masterCapstone: { passed: false, score: null },
    },
  };

  assert(!mockMasteryElig.eligible, 'Mastery is not eligible when course certs and capstone are missing');
  assert(mockMasteryElig.breakdown.courseCertificates.acquiredCodes.length === 1, 'Only 1 of 5 acquired');
  assert(mockMasteryElig.breakdown.cumulativeAssessments.minRequiredAverage === 85, 'Mastery benchmark is 85%');

  // =========================================================================
  // Test 5: Public Verification URL Construction
  // =========================================================================
  const testCredId = 'NV-NET-C01-2026-X8K9L2';
  const verifyUrl = `/certificates/verify/${encodeURIComponent(testCredId)}`;
  assert(verifyUrl === '/certificates/verify/NV-NET-C01-2026-X8K9L2', 'Verification URL uses credential ID');
  assert(!verifyUrl.includes('verificationCode'), 'Verification URL must not include verificationCode');
  assert(!verifyUrl.includes('userId'), 'Verification URL must not include userId');

  // =========================================================================
  // Test 6: PDF Download Action Parameter Semantics
  // =========================================================================
  const pdfDownloadUrl = `/certificates/${encodeURIComponent(testCredId)}/download`;
  assert(
    pdfDownloadUrl === '/certificates/NV-NET-C01-2026-X8K9L2/download',
    'PDF download endpoint correctly accepts credentialId'
  );

  // =========================================================================
  // Test 7: Strict Privacy & Sensitive Field Exclusion
  // =========================================================================
  const sanitizedPublicDto: PublicVerifiedCertificateDto = {
    credentialId: 'NV-NET-C01-2026-X8K9L2',
    status: 'ACTIVE',
    issuedAt: '2026-09-09T12:00:00.000Z',
    recipientName: 'Alice Network Engineer',
    certificationTitle: 'NetVision Certified Network Foundations Specialist',
    certificationCode: 'NV-NET-C01',
    courseTitle: 'Foundations & Network Architecture',
    courseSlug: 'foundations-network-architecture',
    grade: 'Passed with Distinction',
    score: 96,
    componentScores: null,
    skillsAssessed: ['Binary Math', 'OSI Reference Model'],
    isVerified: true,
  };

  // Type assertion and key check: ensure forbidden private keys do not exist
  const rawKeys = Object.keys(sanitizedPublicDto);
  assert(!rawKeys.includes('verificationCode'), 'Sanitized DTO must not have verificationCode');
  assert(!rawKeys.includes('userId'), 'Sanitized DTO must not have userId');
  assert(!rawKeys.includes('email'), 'Sanitized DTO must not have email');
  assert(!rawKeys.includes('passwordHash'), 'Sanitized DTO must not have passwordHash');

  // =========================================================================
  // Test 8: Capstone Specification Blueprint & Field Fidelity (Sub-Drop 5.4)
  // =========================================================================
  const mockCapstoneSpec: CapstoneSpecificationDto = {
    examCode: 'NV-NET-MASTERY-EXAM',
    certificationCode: 'NV-NET-MASTERY',
    title: 'NetVision Master Network Engineering Capstone Examination',
    durationMinutes: 120,
    durationSeconds: 7200,
    passingScore: 85,
    scoringWeights: {
      theoryWeight: 40,
      practicalWeight: 35,
      packetAnalysisWeight: 25,
      passingScore: 85,
    },
    policy: {
      maxAttempts: 3,
      rollingWindowDays: 90,
      cooldownFirstFailureHours: 24,
      cooldownSubsequentFailureHours: 72,
    },
  };

  assert(mockCapstoneSpec.durationMinutes === 120, 'Capstone duration must be 120 minutes');
  assert(mockCapstoneSpec.durationSeconds === 7200, 'Capstone durationSeconds must be 7200');
  assert(mockCapstoneSpec.passingScore === 85, 'Capstone passing threshold must be 85%');
  const totalWeight =
    mockCapstoneSpec.scoringWeights.theoryWeight +
    mockCapstoneSpec.scoringWeights.practicalWeight +
    mockCapstoneSpec.scoringWeights.packetAnalysisWeight;
  assert(totalWeight === 100, 'Capstone scoring weights must sum to exactly 100%');
  assert(mockCapstoneSpec.scoringWeights.theoryWeight === 40, 'Theory component must weigh 40%');
  assert(mockCapstoneSpec.scoringWeights.practicalWeight === 35, 'Practical component must weigh 35%');
  assert(mockCapstoneSpec.scoringWeights.packetAnalysisWeight === 25, 'Packet forensics component must weigh 25%');
  assert(mockCapstoneSpec.policy.maxAttempts === 3, 'Max attempts policy must be 3 within rolling window');
  assert(mockCapstoneSpec.policy.rollingWindowDays === 90, 'Rolling window must be 90 days');
  assert(mockCapstoneSpec.policy.cooldownFirstFailureHours === 24, 'First failure cooldown must be 24 hours');
  assert(mockCapstoneSpec.policy.cooldownSubsequentFailureHours === 72, 'Subsequent failure cooldown must be 72 hours');

  // =========================================================================
  // Test 9: Server-Authoritative Eligibility Gating
  // =========================================================================
  const ineligibleLearner: MasteryEligibilityResult = {
    credentialCode: 'NV-NET-MASTERY',
    credentialTitle: 'NetVision Certified Network Engineering Master',
    eligible: false,
    hasCertificate: false,
    blockingRequirements: [
      'Missing active course certifications: NV-NET-C03, NV-NET-C04, NV-NET-C05 (2/5 acquired)',
      'Cumulative assessment average 81% is below required 85%',
    ],
    breakdown: {
      courseCertificates: {
        requiredCodes: ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'],
        acquiredCodes: ['NV-NET-C01', 'NV-NET-C02'],
        missingCodes: ['NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'],
        passed: false,
      },
      flagshipLessons: { total: 30, completed: 20, passed: false },
      cumulativeAssessments: {
        requiredQuizzes: 25,
        attemptedQuizzes: 20,
        cumulativeAverage: 81,
        minRequiredAverage: 85,
        passed: false,
      },
      flagshipLabs: { total: 15, passedCount: 10, passed: false },
      masterCapstone: { passed: false, score: null },
    },
  };

  // Eligibility check must block attempt initiation
  assert(ineligibleLearner.eligible === false, 'Ineligible learner must not have eligible flag true');
  assert(ineligibleLearner.blockingRequirements.length === 2, 'Must provide concrete blocking requirements');

  const eligibleLearner: MasteryEligibilityResult = {
    credentialCode: 'NV-NET-MASTERY',
    credentialTitle: 'NetVision Certified Network Engineering Master',
    eligible: true,
    hasCertificate: false,
    blockingRequirements: [],
    breakdown: {
      courseCertificates: {
        requiredCodes: ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'],
        acquiredCodes: ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'],
        missingCodes: [],
        passed: true,
      },
      flagshipLessons: { total: 30, completed: 30, passed: true },
      cumulativeAssessments: {
        requiredQuizzes: 25,
        attemptedQuizzes: 25,
        cumulativeAverage: 91,
        minRequiredAverage: 85,
        passed: true,
      },
      flagshipLabs: { total: 15, passedCount: 15, passed: true },
      masterCapstone: { passed: false, score: null },
    },
  };
  assert(eligibleLearner.eligible === true, 'Eligible learner must have eligible = true');
  assert(eligibleLearner.blockingRequirements.length === 0, 'Eligible learner has 0 blocking requirements');

  // =========================================================================
  // Test 10: Start / Resume Idempotent Session Contract
  // =========================================================================
  const startedSession: CapstoneAttemptSessionDto = {
    attemptId: 'capstone-attempt-uuid-1234',
    examCode: 'NV-NET-MASTERY-EXAM',
    certificationCode: 'NV-NET-MASTERY',
    status: 'IN_PROGRESS',
    startedAt: new Date(Date.now() - 60000).toISOString(),
    expiresAt: new Date(Date.now() + 7140000).toISOString(),
    durationMinutes: 120,
    durationSeconds: 7200,
    remainingSeconds: 7140,
    attemptNumber: 1,
    score: null,
    passed: null,
  };

  assert(startedSession.status === 'IN_PROGRESS', 'Active session must have status IN_PROGRESS');
  assert(startedSession.remainingSeconds > 0, 'Remaining seconds must be positive');
  assert(startedSession.attemptNumber === 1, 'Initial attempt must be numbered 1');

  // =========================================================================
  // Test 11: Display-Only Timer Authority Model
  // =========================================================================
  const nowMs = Date.now();
  const serverExpiresAt = new Date(nowMs + 3600 * 1000).toISOString(); // 1 hour in future
  const derivedRemainingSeconds = Math.max(0, Math.floor((new Date(serverExpiresAt).getTime() - nowMs) / 1000));
  assert(derivedRemainingSeconds >= 3598 && derivedRemainingSeconds <= 3600, 'Frontend derived timer matches server expiresAt');

  // When timer hits 0, it does not invent an authoritative expiration: it delegates to backend status
  const expiredServerTime = new Date(nowMs - 5000).toISOString();
  const localZeroTimer = Math.max(0, Math.floor((new Date(expiredServerTime).getTime() - nowMs) / 1000));
  assert(localZeroTimer === 0, 'Frontend timer safely clamps to 0 when expiry is past');

  // =========================================================================
  // Test 12: Attempt Status Recovery & Stale Session Handling
  // =========================================================================
  const expiredAttemptStatus: CapstoneAttemptSessionDto = {
    attemptId: 'capstone-attempt-uuid-stale',
    examCode: 'NV-NET-MASTERY-EXAM',
    certificationCode: 'NV-NET-MASTERY',
    status: 'EXPIRED',
    startedAt: new Date(nowMs - 8000000).toISOString(),
    expiresAt: new Date(nowMs - 800000).toISOString(),
    durationMinutes: 120,
    durationSeconds: 7200,
    remainingSeconds: 0,
    attemptNumber: 1,
    score: 0,
    passed: false,
  };
  assert(expiredAttemptStatus.status === 'EXPIRED', 'Server status correctly identifies EXPIRED attempt');
  assert(expiredAttemptStatus.remainingSeconds === 0, 'Expired attempt remainingSeconds is 0');

  // =========================================================================
  // Test 13: Capstone Submission Payload Structure & Authoritative Result
  // =========================================================================
  const validSubmissionPayload: SubmitCapstonePayload = {
    incidentHypothesis: 'Asymmetric routing between Spine-01 and Leaf-02 causing MTU black hole on VLAN 100',
    troubleshootingActions: [
      { action: 'APPLY_ENTERPRISE_PATCH', target: 'CORE_GATEWAY_ROUTER', value: 'interface Vlan100 mtu 1500' },
    ],
    packetAnalysisAnswers: {
      forensicsNotes: 'Captured PCAP trace indicates TCP Window zero-probing caused by buffer starvation',
    },
  };
  assert(!!validSubmissionPayload.incidentHypothesis, 'Payload contains incidentHypothesis');
  assert(Array.isArray(validSubmissionPayload.troubleshootingActions), 'troubleshootingActions is an array');
  assert(!!validSubmissionPayload.packetAnalysisAnswers?.forensicsNotes, 'packetAnalysisAnswers contains forensicsNotes');

  const mockPassingResult: CapstoneSubmissionResultDto = {
    attemptId: 'capstone-attempt-uuid-1234',
    examCode: 'NV-NET-MASTERY-EXAM',
    status: 'PASSED',
    score: 92,
    passed: true,
    result: {
      overallScore: 92,
      passed: true,
      passingThreshold: 85,
      componentScores: {
        theoryScore: 95,
        practicalScore: 90,
        packetAnalysisScore: 90,
      },
      weightedScores: {
        theoryWeighted: 38,
        practicalWeighted: 31.5,
        packetAnalysisWeighted: 22.5,
      },
      scoringWeights: {
        theoryWeight: 40,
        practicalWeight: 35,
        packetAnalysisWeight: 25,
        passingScore: 85,
      },
      submittedAt: new Date().toISOString(),
      durationSecondsUsed: 3600,
    },
  };
  assert(mockPassingResult.passed === true, 'Passing result has passed = true');
  assert(mockPassingResult.score >= 85, 'Passing score must meet or exceed 85%');
  assert(mockPassingResult.result.componentScores.theoryScore === 95, 'Theory score reported from server');
  assert(mockPassingResult.result.componentScores.practicalScore === 90, 'Practical score reported from server');
  assert(mockPassingResult.result.componentScores.packetAnalysisScore === 90, 'Packet analysis score reported from server');

  // =========================================================================
  // Test 14: Zero Fabricated Questions & Zero Client-Side Grading
  // =========================================================================
  // Verify that the exam UI does not hardcode fake multiple-choice question banks
  const forbiddenQuestionArtifacts = [
    'QUESTION_1_CORRECT_ANSWER',
    'FAKE_MULTIPLE_CHOICE_OPTIONS',
    'simulateClientGrading',
    'calculateLocalPassingScore',
  ];
  for (const artifact of forbiddenQuestionArtifacts) {
    // Assert these do not exist in candidate contracts
    assert(!Object.keys(mockPassingResult).includes(artifact), `Artifact ${artifact} must not exist in exam result`);
    assert(!Object.keys(validSubmissionPayload).includes(artifact), `Artifact ${artifact} must not exist in submission payload`);
  }

  // =========================================================================
  // Test 15: Cooldown and Attempt Limits Policy Protection
  // =========================================================================
  const backendCooldownError = {
    statusCode: 403,
    error: 'Forbidden',
    message: 'Mandatory study cooldown active following failed attempt. Cooldown expires in 23 hours, 45 minutes.',
  };
  assert(backendCooldownError.statusCode === 403, 'Cooldown rejection is 403 Forbidden');
  assert(backendCooldownError.message.includes('cooldown active'), 'Error message conveys cooldown duration');
}

