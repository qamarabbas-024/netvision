import { PrismaClient, CourseLevel, LessonType, Role, ExamAttemptStatus } from '@prisma/client';
import { TopicsService } from '../src/topics/topics.service';
import { CertificationsService } from '../src/certifications/certifications.service';
import { AchievementsService } from '../src/achievements/achievements.service';
import { PrismaService } from '../src/database/prisma.service';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const prismaService = new PrismaService();
const achievementsService = new AchievementsService(prismaService);
const certificationsService = new CertificationsService(prismaService);
const topicsService = new TopicsService(prismaService, achievementsService);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runAnonymousClaimSecurityTests() {
  console.log('================================================================');
  console.log('🔒 NETVISION — ANONYMOUS CLAIM & CERTIFICATION SECURITY AUDIT');
  console.log('================================================================\n');

  let passedTests = 0;

  const testEmailA = `test-learner-a-${Date.now()}@netvision.test`;
  const testEmailB = `test-learner-b-${Date.now()}@netvision.test`;
  const testAnonId = crypto.randomUUID();

  try {
    // --------------------------------------------------------------------------
    // SETUP: Seed test course & lessons if not present
    // --------------------------------------------------------------------------
    console.log('[SETUP] Verifying test course structure...');
    let course = await prisma.course.findFirst({
      where: { slug: 'networking-fundamentals' },
      include: { modules: { include: { lessons: { include: { quizzes: true } } } } },
    });

    if (!course || course.modules.length === 0 || course.modules[0].lessons.length === 0) {
      course = await prisma.course.findFirst({
        where: { published: true },
        include: { modules: { include: { lessons: { include: { quizzes: true } } } } },
      });
    }

    assert(!!course, 'At least one published course exists in database');
    const allCourseLessons = course!.modules.flatMap((m) => m.lessons);
    assert(allCourseLessons.length > 0, 'Course has at least one lesson');
    const firstLesson = allCourseLessons[0];
    const quiz = firstLesson.quizzes && firstLesson.quizzes.length > 0
      ? firstLesson.quizzes[0]
      : await prisma.quiz.create({
          data: {
            id: `quiz-test-${Date.now()}`,
            lessonId: firstLesson.id,
            title: 'Test Quiz',
            passingScore: 80,
          },
        });

    let createdUserAId = '';

    // --------------------------------------------------------------------------
    // TEST 1: Attack Scenario — Multi-Account Re-Claim Prevention
    // --------------------------------------------------------------------------
    console.log('\n[TEST 1] Attack Scenario: Preventing Re-Claim of Anonymous Progress Across Accounts');
    {
      // 0. Ensure anonymous learner record
      await prisma.anonymousLearner.upsert({
        where: { id: testAnonId },
        update: {},
        create: { id: testAnonId },
      });

      // 1. Guest learner completes lesson & quiz anonymously
      await prisma.userProgress.create({
        data: {
          anonymousId: testAnonId,
          lessonId: firstLesson.id,
          completed: true,
          started: true,
          viewed: true,
          score: 100,
          bestScore: 100,
          completedAt: new Date(),
        },
      });

      await prisma.quizAttempt.create({
        data: {
          anonymousId: testAnonId,
          quizId: quiz.id,
          score: 100,
          passed: true,
          answersJson: {},
        },
      });

      // 2. Account A registers
      const userA = await prisma.user.create({
        data: {
          email: testEmailA,
          username: `userA_${Date.now()}`,
          passwordHash: 'dummy_hash_for_test',
          role: Role.STUDENT,
          isVerified: true,
        },
      });
      createdUserAId = userA.id;

      // 3. Account A claims the anonymous progress
      const claimResA = await topicsService.claimProgress(userA.id, testAnonId);
      assert(claimResA.success === true, '1.1 Account A successfully claims anonymous progress');
      assert(claimResA.claimedCount! > 0, '1.2 Account A claimed at least 1 progress item');

      // Verify Account A has the records now
      const userAProgress = await prisma.userProgress.findMany({ where: { userId: userA.id } });
      const userAQuiz = await prisma.quizAttempt.findMany({ where: { userId: userA.id } });
      assert(userAProgress.length >= 1, '1.3 Account A owns userProgress record');
      assert(userAQuiz.length >= 1, '1.4 Account A owns quizAttempt record');

      // Verify Anonymous records are unlinked (anonymousId is null)
      const remainingAnonProgress = await prisma.userProgress.findMany({ where: { anonymousId: testAnonId } });
      const remainingAnonQuiz = await prisma.quizAttempt.findMany({ where: { anonymousId: testAnonId } });
      assert(remainingAnonProgress.length === 0, '1.5 Zero userProgress records remain under anonymousId');
      assert(remainingAnonQuiz.length === 0, '1.6 Zero quizAttempt records remain under anonymousId');

      // 4. User logs out (client-side clears local state)
      // 5. Account B registers in same browser
      const userB = await prisma.user.create({
        data: {
          email: testEmailB,
          username: `userB_${Date.now()}`,
          passwordHash: 'dummy_hash_for_test',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      // 6. Account B attempts to claim the same anonymousId
      const claimResB = await topicsService.claimProgress(userB.id, testAnonId);
      assert(claimResB.success === true, '1.7 Claim operation completes safely without error');
      assert(claimResB.claimedCount === 0, '1.8 Account B receives EXACTLY 0 claimed items');

      // 7. Verify Account B received NO mastery or progress
      const userBProgress = await prisma.userProgress.findMany({ where: { userId: userB.id } });
      const userBQuiz = await prisma.quizAttempt.findMany({ where: { userId: userB.id } });
      assert(userBProgress.length === 0, '1.9 Account B has ZERO progress records from Account A');
      assert(userBQuiz.length === 0, '1.10 Account B has ZERO quiz attempts from Account A');

      // 8. Verify Account B is DENIED certificate claiming
      let certErrorThrown = false;
      try {
        await topicsService.claimCertificate(userB.id, course!.id);
      } catch (err: any) {
        certErrorThrown = true;
        assert(err.status === 400 || err.message?.includes('eligibility') || err.message?.includes('Missing'), '1.11 Account B certificate claim rejected due to unmet eligibility');
      }
      assert(certErrorThrown, '1.12 Server authoritative gate prevents Account B from obtaining unauthorized certificate');

      console.log('  ✓ Attack scenario successfully prevented: Account B received zero progress and was denied certification.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // TEST 2: Duplicate & Idempotent Claim Handling
    // --------------------------------------------------------------------------
    console.log('\n[TEST 2] Duplicate & Idempotent Claim Operation');
    {
      const freshAnonId = crypto.randomUUID();
      await prisma.anonymousLearner.create({ data: { id: freshAnonId } });

      const userC = await prisma.user.create({
        data: {
          email: `test-learner-c-${Date.now()}@netvision.test`,
          username: `userC_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      await prisma.userProgress.create({
        data: {
          anonymousId: freshAnonId,
          lessonId: firstLesson.id,
          completed: true,
          score: 85,
        },
      });

      const firstClaim = await topicsService.claimProgress(userC.id, freshAnonId);
      assert(firstClaim.success === true && firstClaim.claimedCount! >= 1, '2.1 First claim succeeds with items');

      // Immediate duplicate claim
      const secondClaim = await topicsService.claimProgress(userC.id, freshAnonId);
      assert(secondClaim.success === true && secondClaim.claimedCount === 0, '2.2 Second claim is idempotent and returns 0 items');

      console.log('  ✓ Idempotent claiming verified.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // TEST 3: Concurrent Claim Requests
    // --------------------------------------------------------------------------
    console.log('\n[TEST 3] Concurrent Parallel Claim Requests');
    {
      const freshAnonId = crypto.randomUUID();
      await prisma.anonymousLearner.create({ data: { id: freshAnonId } });

      const userD = await prisma.user.create({
        data: {
          email: `test-learner-d-${Date.now()}@netvision.test`,
          username: `userD_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      await prisma.userProgress.create({
        data: {
          anonymousId: freshAnonId,
          lessonId: firstLesson.id,
          completed: true,
          score: 95,
        },
      });

      // Launch 5 parallel claim requests simultaneously
      const results = await Promise.all([
        topicsService.claimProgress(userD.id, freshAnonId),
        topicsService.claimProgress(userD.id, freshAnonId),
        topicsService.claimProgress(userD.id, freshAnonId),
        topicsService.claimProgress(userD.id, freshAnonId),
        topicsService.claimProgress(userD.id, freshAnonId),
      ]);

      const totalClaimedAcrossParallel = results.reduce((sum, r) => sum + (r.claimedCount || 0), 0);
      assert(totalClaimedAcrossParallel === 1, `3.1 Exactly 1 progress item claimed across parallel requests (got: ${totalClaimedAcrossParallel})`);

      // Verify no duplicate progress records created in DB for userD
      const userDProgress = await prisma.userProgress.findMany({ where: { userId: userD.id, lessonId: firstLesson.id } });
      assert(userDProgress.length === 1, '3.2 Exactly one progress record exists in DB without duplicates');

      console.log('  ✓ Concurrent atomic claim locking verified.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // TEST 4: Invalid & Malicious Anonymous ID Format Rejection
    // --------------------------------------------------------------------------
    console.log('\n[TEST 4] Invalid & Malicious Anonymous ID Format Rejection');
    {
      const userE = await prisma.user.create({
        data: {
          email: `test-learner-e-${Date.now()}@netvision.test`,
          username: `userE_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      const invalidIds = [
        '../malicious/path',
        'SELECT * FROM users;',
        'guest-invalid-12345',
        '<script>alert(1)</script>',
        'not-a-uuid',
      ];

      for (const inv of invalidIds) {
        let rejected = false;
        try {
          await topicsService.claimProgress(userE.id, inv);
        } catch (err: any) {
          rejected = true;
          assert(err.status === 400 || err.message?.includes('UUID') || err.message?.includes('format'), `4.1 Malicious/invalid format "${inv}" rejected with 400 Bad Request`);
        }
        assert(rejected, `4.2 Claim rejected for "${inv}"`);
      }

      console.log('  ✓ Input validation: All invalid and malicious IDs rejected.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // TEST 5: Server-Authoritative Certificate Eligibility (Client State Ignored)
    // --------------------------------------------------------------------------
    console.log('\n[TEST 5] Server-Authoritative Certificate Eligibility');
    {
      const userF = await prisma.user.create({
        data: {
          email: `test-learner-f-${Date.now()}@netvision.test`,
          username: `userF_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      // User F has no DB records. Server check must return eligibleForCertificate: false
      const assessment = await topicsService.getCourseAssessment({ userId: userF.id }, course!.id);
      assert(assessment.eligibleForCertificate === false, '5.1 User with 0 DB records is not eligible for certificate');
      assert(assessment.allRequiredAssessmentsComplete === false, '5.2 allRequiredAssessmentsComplete is false');

      let claimRejected = false;
      try {
        await topicsService.claimCertificate(userF.id, course!.id);
      } catch (err: any) {
        claimRejected = true;
      }
      assert(claimRejected, '5.3 Certificate claim rejected without server records');

      console.log('  ✓ Server-authoritative assessment calculation verified.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // TEST 6: Certificate Ownership & Verification Data Isolation
    // --------------------------------------------------------------------------
    console.log('\n[TEST 6] Certificate Ownership & Public Verification Data Sanitization');
    {
      const userG = await prisma.user.create({
        data: {
          email: `test-learner-g-${Date.now()}@netvision.test`,
          username: `userG_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      // Create verified cert for userG
      const testCert = await prisma.certificate.create({
        data: {
          userId: userG.id,
          credentialId: `NV-NET-2026-TEST-${Date.now().toString().slice(-4)}`,
          verificationCode: `NV-VERIFY-TEST-${Date.now().toString().slice(-4)}`,
          certificationCode: 'NV-NET',
          certificationTitle: 'NetVision Certified Network Administrator',
          recipientName: 'Learner G',
          status: 'ACTIVE',
          metadataJson: {
            grade: 'Pass with Distinction',
            overallScore: 95,
          },
        },
      });

      const pubView = await topicsService.getCertificateById(testCert.credentialId!);
      assert(pubView.recipientName === 'Learner G', '6.1 Recipient name matches');
      assert(pubView.isVerified === true, '6.2 Certificate is active and verified');
      assert((pubView as any).passwordHash === undefined, '6.3 No password hashes exposed in public view');
      assert((pubView as any).email === undefined, '6.4 No sensitive email exposed in public verification');

      console.log('  ✓ Certificate ownership and verification privacy verified.');
      passedTests++;
    }

    console.log('\n================================================================');
    console.log(`🎉 ALL ${passedTests} ANONYMOUS CLAIM & CERTIFICATE SECURITY TESTS PASSED!`);
    console.log('================================================================\n');
  } finally {
    // Cleanup created test accounts
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@netvision.test',
        },
      },
    }).catch(() => null);
  }
}

runAnonymousClaimSecurityTests()
  .catch((err) => {
    console.error('❌ Security Test Suite Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
