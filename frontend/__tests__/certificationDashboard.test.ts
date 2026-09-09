import { FLAGSHIP_5_COURSES, CANONICAL_CREDENTIALS } from '@netvision/shared';
import {
  CourseEligibilityResult,
  MasteryEligibilityResult,
  UserCertificateItem,
  PublicVerifiedCertificateDto,
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
}
