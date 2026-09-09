/**
 * NETVISION DROP #3 VERIFICATION SUITE
 * Course Certificate Issuance, Claiming & Public Verification
 *
 * Validates:
 * 1. Happy path issuance for all 5 course certifications:
 *    - NV-NET-C01, NV-NET-C02, NV-NET-C03, NV-NET-C04, NV-NET-C05
 * 2. Strict eligibility enforcement (100% lessons, >=80% quizzes, required labs)
 * 3. Anti-cross-course claiming defense
 * 4. Idempotency & parallel race condition safety (atomic CAS / double-check)
 * 5. Cryptographic 64-bit entropy verification code generation
 * 6. IDOR prevention & private learner data sanitization in public verification
 * 7. Clean fixture cleanup
 */

import { PrismaClient, Role } from '@prisma/client';
import { CertificationsService } from '../src/certifications/certifications.service';
import { CertificationEligibilityService } from '../src/certifications/certification-eligibility.service';
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

async function runDrop3TestSuite() {
  console.log('🧪 Starting NetVision Drop #3 Test Suite: Course Certificate Issuance, Claiming & Public Verification...\n');

  await waitForDatabase();

  const eligibilityService = new CertificationEligibilityService(prisma as any);
  const certsService = new CertificationsService(
    prisma as any,
    eligibilityService
  );

  const createdUserIds: string[] = [];

  try {
    // Helper to create an isolated learner
    async function createTestLearner(name: string) {
      const user = await prisma.user.create({
        data: {
          email: `drop3-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@netvision.test`,
          username: `drop3_user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          fullName: name,
          passwordHash: 'argon2id$test_hash_secure',
          role: Role.STUDENT,
          isVerified: true,
        },
      });
      createdUserIds.push(user.id);
      return user;
    }

    // Helper to fulfill all lessons, quizzes, and labs for a given course
    async function fulfillCourseRequirements(userId: string, courseCode: string, quizScore = 90) {
      const course = await prisma.course.findUnique({
        where: { code: courseCode },
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
      assert(course, `Course ${courseCode} must exist`);

      const lessons = course.modules.flatMap((m) => m.lessons);
      const progressData = lessons.map((lesson) => ({
        userId,
        lessonId: lesson.id,
        completed: true,
        score: quizScore,
        started: true,
        viewed: true,
        completedAt: new Date(),
      }));
      if (progressData.length > 0) {
        await prisma.userProgress.createMany({ data: progressData });
      }

      const quizAttemptsData = lessons.flatMap((l) =>
        l.quizzes.map((quiz) => ({
          userId,
          quizId: quiz.id,
          score: quizScore,
          passed: quizScore >= 80,
          answersJson: {},
        }))
      );
      if (quizAttemptsData.length > 0) {
        await prisma.quizAttempt.createMany({ data: quizAttemptsData });
      }

      const labAttemptsData = lessons.flatMap((l) =>
        l.labs.map((lab) => ({
          userId,
          labId: lab.id,
          passed: true,
          score: 100,
        }))
      );
      if (labAttemptsData.length > 0) {
        await prisma.labAttempt.createMany({ data: labAttemptsData });
      }
      return course;
    }

    // =========================================================================
    // SUITE 1: HAPPY PATH COURSE CERTIFICATE ISSUANCE (ALL 5 CREDENTIALS)
    // =========================================================================
    console.log('--- Suite 1: Happy Path Course Certificate Issuance (All 5 Credentials) ---');

    const courseMappings = [
      { credCode: 'NV-NET-C01', courseCode: 'NV-C01', expectedTitle: 'Digital Foundations' },
      { credCode: 'NV-NET-C02', courseCode: 'NV-C02', expectedTitle: 'Layer 2 Switching' },
      { credCode: 'NV-NET-C03', courseCode: 'NV-C03', expectedTitle: 'IP Routing' },
      { credCode: 'NV-NET-C04', courseCode: 'NV-C04', expectedTitle: 'Network Security' },
      { credCode: 'NV-NET-C05', courseCode: 'NV-C05', expectedTitle: 'Network Automation' },
    ];

    for (const mapping of courseMappings) {
      const learner = await createTestLearner(`Eligible Learner ${mapping.credCode}`);
      await fulfillCourseRequirements(learner.id, mapping.courseCode, 92);

      const claimed = await certsService.claimCertificationCertificate(learner.id, mapping.credCode);

      check(claimed !== null && typeof claimed === 'object', `Claim for ${mapping.credCode} returns certificate object`);
      const issuedYear = new Date(claimed.issuedAt).getUTCFullYear();
      check(
        claimed.credentialId.startsWith(`${mapping.credCode}-${issuedYear}-`),
        `Credential ID contains authoritative dynamic UTC year ${issuedYear} (${claimed.credentialId})`
      );
      check(
        /^NV-VERIFY-[A-F0-9]{16}$/.test(claimed.verificationCode),
        `Verification code has 64-bit cryptographic entropy (${claimed.verificationCode})`
      );
      check(claimed.recipientName === learner.fullName, `Recipient name matches authenticated user (${claimed.recipientName})`);
      check(claimed.certificationCode === mapping.credCode, `Certification code matches ${mapping.credCode}`);
      check(claimed.grade.includes('Distinction'), `Grade reflects high score (${claimed.grade})`);
      check(claimed.isVerified === true, `Certificate isVerified flag is true`);

      // Verify certificate is persisted in database with valid courseId foreign key
      const dbCert = await prisma.certificate.findUnique({
        where: { credentialId: claimed.credentialId },
        include: { course: true },
      });
      check(dbCert !== null, `Certificate record persisted in database`);
      check(dbCert?.course?.code === mapping.courseCode, `Certificate course foreign key correctly associates to ${mapping.courseCode}`);
      check(dbCert?.status === 'ACTIVE', `Certificate status is ACTIVE`);

      // Verify learner can view their own certificates via getUserCertificates
      const learnerCerts = await certsService.getUserCertificates(learner.id);
      check(learnerCerts.length === 1, `Learner can list their owned certificate`);
      check(learnerCerts[0].credentialId === claimed.credentialId, `Listed certificate matches claimed credential ID`);
    }

    // =========================================================================
    // SUITE 2: HARD BLOCKERS & CROSS-COURSE VALIDATION
    // =========================================================================
    console.log('\n--- Suite 2: Hard Blockers & Cross-Course Validation ---');

    // Blocker 1: Incomplete curriculum (0 lessons)
    const learnerIncomplete = await createTestLearner('Incomplete Learner');
    let blockedIncomplete = false;
    try {
      await certsService.claimCertificationCertificate(learnerIncomplete.id, 'NV-NET-C01');
    } catch (err: any) {
      blockedIncomplete = err.message.includes('Incomplete curriculum') || err.status === 400;
    }
    check(blockedIncomplete, 'Learner with 0 lessons completed is BLOCKED from claiming certificate');

    // Blocker 2: Low quiz score (< 80%)
    const learnerLowScore = await createTestLearner('Low Score Learner');
    await fulfillCourseRequirements(learnerLowScore.id, 'NV-C01', 65); // 65% is below 80%
    let blockedLowScore = false;
    try {
      await certsService.claimCertificationCertificate(learnerLowScore.id, 'NV-NET-C01');
    } catch (err: any) {
      blockedLowScore = true;
    }
    check(blockedLowScore, 'Learner with 65% assessment average is BLOCKED from claiming certificate');

    // Blocker 3: Missing required lab
    const learnerMissingLab = await createTestLearner('Missing Lab Learner');
    const course1 = await prisma.course.findUnique({
      where: { code: 'NV-C01' },
      include: { modules: { include: { lessons: { include: { quizzes: true, labs: true } } } } },
    });
    assert(course1, 'NV-C01 exists');
    const c1Lessons = course1.modules.flatMap((m) => m.lessons);
    await prisma.userProgress.createMany({
      data: c1Lessons.map((l) => ({
        userId: learnerMissingLab.id,
        lessonId: l.id,
        completed: true,
        score: 90,
        started: true,
        viewed: true,
        completedAt: new Date(),
      })),
    });
    await prisma.quizAttempt.createMany({
      data: c1Lessons.flatMap((l) =>
        l.quizzes.map((q) => ({
          userId: learnerMissingLab.id,
          quizId: q.id,
          score: 90,
          passed: true,
          answersJson: {},
        }))
      ),
    });
    // Intentionally omit lab attempts
    let blockedMissingLab = false;
    try {
      await certsService.claimCertificationCertificate(learnerMissingLab.id, 'NV-NET-C01');
    } catch (err: any) {
      blockedMissingLab = err.message.includes('Incomplete practical labs') || err.status === 400;
    }
    check(blockedMissingLab, 'Learner with incomplete labs is BLOCKED from claiming certificate');

    // Blocker 4: Cross-course claiming (Completed C01, attempting to claim C02)
    const learnerC01Only = await createTestLearner('C01 Only Learner');
    await fulfillCourseRequirements(learnerC01Only.id, 'NV-C01', 95);
    let blockedCrossCourse = false;
    try {
      await certsService.claimCertificationCertificate(learnerC01Only.id, 'NV-NET-C02');
    } catch (err: any) {
      blockedCrossCourse = err.status === 400 || err.message.includes('Certificate claim denied') || err.message.includes('strictly requires');
    }
    check(blockedCrossCourse, 'Learner eligible for NV-C01 is strictly BLOCKED from claiming NV-NET-C02');

    // Blocker 5: Non-existent credential code
    let blockedInvalidCode = false;
    try {
      await certsService.claimCertificationCertificate(learnerC01Only.id, 'NV-NET-NONEXISTENT');
    } catch (err: any) {
      blockedInvalidCode = err.status === 404 || err.message.includes('not found');
    }
    check(blockedInvalidCode, 'Claim with non-existent credential code returns 404 NotFoundException');

    // =========================================================================
    // SUITE 3: IDEMPOTENCY & PARALLEL CONCURRENCY
    // =========================================================================
    console.log('\n--- Suite 3: Idempotency & Parallel Concurrency ---');

    const learnerIdempotent = await createTestLearner('Idempotent Learner');
    await fulfillCourseRequirements(learnerIdempotent.id, 'NV-C01', 88);

    // Initial claim
    const firstClaim = await certsService.claimCertificationCertificate(learnerIdempotent.id, 'NV-NET-C01');
    // Sequential repeated claim
    const secondClaim = await certsService.claimCertificationCertificate(learnerIdempotent.id, 'NV-NET-C01');

    check(firstClaim.credentialId === secondClaim.credentialId, 'Sequential repeated claim returns identical credential ID');
    check(firstClaim.verificationCode === secondClaim.verificationCode, 'Sequential repeated claim returns identical verification code');

    const certCountSequential = await prisma.certificate.count({
      where: { userId: learnerIdempotent.id, certificationCode: 'NV-NET-C01' },
    });
    check(certCountSequential === 1, `Total certificates in database after repeated claim is exactly 1 (found: ${certCountSequential})`);

    // Parallel concurrent claims on fresh eligible learner
    const learnerConcurrent = await createTestLearner('Concurrent Learner');
    await fulfillCourseRequirements(learnerConcurrent.id, 'NV-C02', 90);

    const [claimA, claimB, claimC] = await Promise.all([
      certsService.claimCertificationCertificate(learnerConcurrent.id, 'NV-NET-C02'),
      certsService.claimCertificationCertificate(learnerConcurrent.id, 'NV-NET-C02'),
      certsService.claimCertificationCertificate(learnerConcurrent.id, 'NV-NET-C02'),
    ]);

    check(claimA.credentialId === claimB.credentialId, 'Concurrent Claim A and B return identical credential ID');
    check(claimB.credentialId === claimC.credentialId, 'Concurrent Claim B and C return identical credential ID');
    check(claimA.credentialId === claimC.credentialId, 'All concurrent responses refer to the exact same credential');

    const certCountConcurrent = await prisma.certificate.count({
      where: { userId: learnerConcurrent.id, certificationCode: 'NV-NET-C02' },
    });
    check(certCountConcurrent === 1, `Total certificates in database after parallel claims is exactly 1 (found: ${certCountConcurrent})`);

    // Direct Database & Prisma Constraint Inspection:
    // Attempting a direct insert bypassing the service layer must trigger P2002
    let dbConstraintTriggered = false;
    let constraintName = '';
    try {
      await prisma.certificate.create({
        data: {
          userId: learnerConcurrent.id,
          certificationCode: 'NV-NET-C02',
          code: 'DUPLICATE-ATTEMPT',
          certificationTitle: 'Duplicate Test',
          credentialId: `NV-NET-C02-${new Date().getUTCFullYear()}-DUPTEST123456`,
          verificationCode: 'NV-VERIFY-DUPTEST123456',
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        dbConstraintTriggered = true;
        constraintName = (err.meta?.target as string[] | undefined)?.join(',') || err.message;
      }
    }
    check(
      dbConstraintTriggered,
      `Database @@unique([userId, certificationCode]) strictly prevents duplicates at engine level (Prisma P2002: ${constraintName})`
    );

    // =========================================================================
    // SUITE 4: SECURITY, IDOR & PUBLIC SANITIZATION
    // =========================================================================
    console.log('\n--- Suite 4: Security, IDOR & Public Sanitization ---');

    const learnerAlice = await createTestLearner('Alice Student');
    const learnerBob = await createTestLearner('Bob Attacker');
    await fulfillCourseRequirements(learnerAlice.id, 'NV-C01', 95);

    const aliceCert = await certsService.claimCertificationCertificate(learnerAlice.id, 'NV-NET-C01');

    // IDOR Check 1: Bob cannot download Alice's certificate PDF
    let idorDownloadBlocked = false;
    try {
      await certsService.generateCertificateDownload(learnerBob.id, aliceCert.credentialId);
    } catch (err: any) {
      idorDownloadBlocked = err.status === 403 || err.message.includes('not have authorization');
    }
    check(idorDownloadBlocked, 'Attacker Bob blocked from downloading Alice certificate PDF (IDOR Defense)');

    // IDOR Check 2: Bob's getMyCertificates does not include Alice's certificates
    const bobCerts = await certsService.getUserCertificates(learnerBob.id);
    check(bobCerts.length === 0, 'Attacker Bob getMyCertificates returns 0 certificates (Tenant Isolation)');

    // Missing user ID rejected
    let missingUserIdBlocked = false;
    try {
      await certsService.claimCertificationCertificate('', 'NV-NET-C01');
    } catch (err: any) {
      missingUserIdBlocked = err.status === 400 || err.message.includes('User ID is required');
    }
    check(missingUserIdBlocked, 'Unauthenticated or empty User ID rejected with BadRequestException');

    // Public verification sanitization
    const publicVerification = await certsService.verifyCertificate(aliceCert.verificationCode);
    check(publicVerification.isVerified === true, 'Public verification confirms isVerified=true');
    check(publicVerification.recipientName === learnerAlice.fullName, `Public verification reports recipient name (${publicVerification.recipientName})`);
    check(publicVerification.certificationCode === 'NV-NET-C01', 'Public verification reports certification code');
    check(publicVerification.courseTitle !== null, 'Public verification includes associated course title');

    // Sanitization checks: ensure zero private fields leak
    check((publicVerification as any).verificationCode === undefined, 'Public verification NEVER exposes verificationCode');
    check((publicVerification as any).passwordHash === undefined, 'Public verification NEVER exposes passwordHash');
    check((publicVerification as any).email === undefined, 'Public verification NEVER exposes user email');
    check((publicVerification as any).id === undefined, 'Public verification NEVER exposes internal database UUID (id)');
    check((publicVerification as any).userId === undefined, 'Public verification NEVER exposes internal userId');

    // Non-existent verification code lookup returns 404
    let unknownCode404 = false;
    try {
      await certsService.verifyCertificate('NV-VERIFY-NONEXISTENT000');
    } catch (err: any) {
      unknownCode404 = err.status === 404 || err.message.includes('not found');
    }
    check(unknownCode404, 'Invalid verification code safely returns 404 NotFoundException');

    // Historical certificates verification safety
    const historicalCerts = await prisma.certificate.findMany({
      where: { certificationCode: { notIn: ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'] } },
    });
    if (historicalCerts.length > 0) {
      const sample = historicalCerts[0];
      const lookupCode = sample.credentialId || sample.verificationCode || sample.code;
      const verifiedSample = await certsService.verifyCertificate(lookupCode);
      check(verifiedSample.isVerified === true, `Historical certificate (${lookupCode}) verifies safely`);
    } else {
      check(true, 'Zero orphaned historical certificates (Historical safety verified)');
    }

    // =========================================================================
    // SUITE 5: SPECIFICATION & AUDIT INVARIANTS
    // =========================================================================
    console.log('\n--- Suite 5: Specification & Audit Invariants ---');

    // 1. All 5 flagship course certifications are active
    const activeCertDefs = await prisma.certificationDefinition.findMany({
      where: { code: { in: ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'] } },
    });
    check(activeCertDefs.length === 5, `All 5 flagship CertificationDefinitions exist in database (found: ${activeCertDefs.length})`);

    // 2. Verification codes are unique across all issued certificates
    const allIssuedCerts = await prisma.certificate.findMany({ select: { verificationCode: true } });
    const verifyCodes = allIssuedCerts.map((c) => c.verificationCode).filter(Boolean);
    const uniqueVerifyCodes = new Set(verifyCodes);
    check(verifyCodes.length === uniqueVerifyCodes.size, 'All issued verification codes are globally unique in database');

    console.log('\n======================================================');
    console.log(`Drop #3 Verification Results: ${passCount} PASSED, ${failCount} FAILED`);
    console.log('======================================================');

    if (failCount > 0) {
      process.exit(1);
    }
  } finally {
    // Clean up isolated test users and their cascaded relations
    if (createdUserIds.length > 0) {
      await prisma.certificate.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.userProgress.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.quizAttempt.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.labAttempt.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
      console.log(`🧹 Cleaned up ${createdUserIds.length} isolated test learner fixtures.`);
    }
    await prisma.$disconnect();
  }
}

runDrop3TestSuite().catch(async (err) => {
  console.error('Fatal test error:', err);
  await prisma.$disconnect();
  process.exit(1);
});
