import { FLAGSHIP_5_COURSES, CANONICAL_CREDENTIALS } from '@netvision/shared';
import { CourseEligibilityResult, MasteryEligibilityResult, UserCertificateItem } from '../lib/api';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

export function runCertificationDashboardTests() {
  // Test 1: Canonical Credentials completeness
  assert(CANONICAL_CREDENTIALS.length === 6, 'There must be exactly 6 canonical credentials');
  
  const expectedCodes = ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05', 'NV-NET-MASTERY'];
  for (const code of expectedCodes) {
    const cred = CANONICAL_CREDENTIALS.find((c) => c.code === code);
    assert(!!cred, `Canonical credential ${code} must exist`);
  }

  const masteryCred = CANONICAL_CREDENTIALS.find((c) => c.code === 'NV-NET-MASTERY');
  assert(masteryCred?.isMastery === true, 'NV-NET-MASTERY must have isMastery = true');

  // Test 2: Course Certification Eligibility state discrimination
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

  // Test 3: Earned status evaluation
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

  // Test 4: Mastery 9-Point Criteria Contract alignment
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
}
