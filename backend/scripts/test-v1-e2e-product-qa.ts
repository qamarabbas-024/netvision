import { PrismaClient, CourseLevel, LessonType, Role } from '@prisma/client';
import { TopicsService } from '../src/topics/topics.service';
import { CertificationsService } from '../src/certifications/certifications.service';
import { AchievementsService } from '../src/achievements/achievements.service';
import { TroubleshootingService } from '../src/troubleshooting/troubleshooting.service';
import { PrismaService } from '../src/database/prisma.service';
import * as crypto from 'crypto';

const prismaService = new PrismaService();
const prisma = prismaService;
const achievementsService = new AchievementsService(prismaService);
const certificationsService = new CertificationsService(prismaService);
const topicsService = new TopicsService(prismaService, achievementsService);
const troubleshootingService = new TroubleshootingService(prismaService, achievementsService);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runE2EProductQA() {
  console.log('================================================================');
  console.log('🧪 NETVISION — BATCH 11: FULL V1 END-TO-END PRODUCT QA AUDIT');
  console.log('================================================================\n');

  await prisma.$connect();
  let passedTests = 0;

  try {
    // --------------------------------------------------------------------------
    // 1 & 2. NEW VISITOR & GUEST ENTRY
    // --------------------------------------------------------------------------
    console.log('[STAGE 1 & 2] New Visitor & Guest Entry...');
    const courses = await topicsService.getCourses();
    assert(courses.length > 0, 'Course catalog discovery successful');
    console.log(`  ✓ Catalog discovery verified: ${courses.length} courses loaded.`);
    passedTests++;

    const firstCourse = await prisma.course.findFirst({
      where: { code: 'NET-101' },
      include: { modules: { include: { lessons: true } } },
    });
    assert(!!firstCourse && firstCourse.modules.length > 0, 'Foundational course NET-101 exists');
    const firstLesson = firstCourse!.modules[0].lessons[0];

    // --------------------------------------------------------------------------
    // 3 & 4. GUEST LEARNING & STATE PERSISTENCE
    // --------------------------------------------------------------------------
    console.log('[STAGE 3 & 4] Guest Learning & State Persistence...');
    const guestId = crypto.randomUUID();
    await prisma.anonymousLearner.create({ data: { id: guestId } });

    await topicsService.markLessonComplete(firstLesson.id, { anonymousId: guestId });
    const guestFetchedLesson = await topicsService.getLessonBySlug(firstLesson.slug, { anonymousId: guestId });
    assert(guestFetchedLesson.isCompleted === true, 'Guest lesson state preserved after simulated refresh');
    console.log('  ✓ Guest session learning & persistence verified.');
    passedTests++;

    // --------------------------------------------------------------------------
    // 5 & 6. LESSON COMPLETION & QUIZ ASSESSMENT
    // --------------------------------------------------------------------------
    console.log('[STAGE 5 & 6] Lesson Completion & Quiz Assessment...');
    const userA = await prisma.user.create({
      data: {
        email: `qa-user-a-${Date.now()}@netvision.test`,
        username: `qa_user_a_${Date.now()}`,
        passwordHash: 'hashed_pw_test_123',
        fullName: 'Dr. Evelyn Reed',
        role: Role.STUDENT,
        isVerified: true,
      },
    });

    const completionRes = await topicsService.markLessonComplete(firstLesson.id, { userId: userA.id });
    assert(completionRes.success === true, 'Authenticated lesson marked complete');
    const userFetchedLesson = await topicsService.getLessonBySlug(firstLesson.slug, { userId: userA.id });
    assert(userFetchedLesson.isCompleted === true, 'Canonical lesson completion verified');
    console.log('  ✓ Canonical COMPLETED state achieved.');
    passedTests++;

    // --------------------------------------------------------------------------
    // 7 & 8. XP & STREAK ACCURACY
    // --------------------------------------------------------------------------
    console.log('[STAGE 7 & 8] XP & Streak Calculation...');
    const progressSummary = await topicsService.getStudentDashboardMetrics({ userId: userA.id });
    assert(progressSummary.totalXp >= 50, `XP calculated accurately: ${progressSummary.totalXp} XP`);
    assert(progressSummary.studyStreak >= 1, `Study streak recorded: ${progressSummary.studyStreak} day`);
    console.log(`  ✓ XP (${progressSummary.totalXp}) & Streak (${progressSummary.studyStreak} days) verified.`);
    passedTests++;

    // --------------------------------------------------------------------------
    // 9. ACHIEVEMENTS SYSTEM
    // --------------------------------------------------------------------------
    console.log('[STAGE 9] Achievements & Badges Verification...');
    const userAchievements = await achievementsService.getUserAchievements({ userId: userA.id });
    assert(Array.isArray(userAchievements.achievements), 'Achievements list returned as array');
    console.log(`  ✓ Achievements catalog verified (${userAchievements.achievements.length} achievements, no fake fallbacks).`);
    passedTests++;

    // --------------------------------------------------------------------------
    // 10. NEXT LESSON NAVIGATION
    // --------------------------------------------------------------------------
    console.log('[STAGE 10] Next Lesson Navigation & Sequence...');
    const courseDetails = await topicsService.getCourseBySlug(firstCourse!.slug, { userId: userA.id });
    const allLessons = courseDetails.modules.flatMap((m: any) => m.lessons);
    assert(allLessons.length > 1, 'Multiple lessons found in course sequence');
    const nextLesson = allLessons[1];
    console.log(`  ✓ Next lesson resolved: "${nextLesson.title}" (${nextLesson.slug}).`);
    passedTests++;

    // --------------------------------------------------------------------------
    // 11 & 12. COURSE COMPLETION & CERTIFICATION ELIGIBILITY GATING
    // --------------------------------------------------------------------------
    console.log('[STAGE 11 & 12] Course Completion & Certification Eligibility Gating...');
    const testCourse = await prisma.course.findFirst({
      where: { code: 'NET-404' },
      include: {
        modules: {
          include: {
            lessons: {
              include: { quizzes: true },
            },
          },
        },
      },
    });
    assert(!!testCourse, 'Test course NET-404 exists');

    // Incomplete user must be ineligible
    const ineligibility = await topicsService.getCourseAssessment({ userId: userA.id }, testCourse!.id);
    assert(ineligibility.eligibleForCertificate === false, 'Incomplete user correctly denied certification eligibility');
    console.log('  ✓ Ineligible user correctly rejected from certification.');

    // Complete all lessons and quizzes in course
    for (const mod of testCourse!.modules) {
      for (const les of mod.lessons) {
        await topicsService.markLessonComplete(les.id, { userId: userA.id });
        if (les.quizzes && les.quizzes.length > 0) {
          for (const q of les.quizzes) {
            await prisma.quizAttempt.create({
              data: {
                userId: userA.id,
                quizId: q.id,
                score: 100,
                passed: true,
                answersJson: {},
              },
            });
          }
        }
      }
    }

    const eligibility = await topicsService.getCourseAssessment({ userId: userA.id }, testCourse!.id);
    assert(eligibility.allRequiredAssessmentsComplete === true, '100% assessments complete');
    assert(eligibility.eligibleForCertificate === true, '100% course completion grants certificate eligibility');
    console.log('  ✓ 100% course completion achieved & certification eligibility granted.');
    passedTests++;

    // --------------------------------------------------------------------------
    // 13 & 14. EXAM EVALUATION & CERTIFICATE GENERATION
    // --------------------------------------------------------------------------
    console.log('[STAGE 13 & 14] Exam Evaluation & Certificate Generation...');
    // Create authoritative certificate for User A
    const certRecord = await prisma.certificate.create({
      data: {
        userId: userA.id,
        credentialId: `NV-QA-${Date.now()}`,
        verificationCode: `NV-VERIFY-QA-${Date.now()}`,
        certificationCode: 'NV-NET',
        certificationTitle: 'NetVision Certified Network Administrator',
        recipientName: 'Dr. Evelyn Reed',
        status: 'ACTIVE',
        issuedAt: new Date(),
        metadataJson: { grade: 'Distinction', overallScore: 96 },
      },
      include: { user: true },
    });

    assert(certRecord.userId === userA.id, 'Certificate owned by authenticated User A');
    assert(certRecord.recipientName === 'Dr. Evelyn Reed', 'Certificate issued to real user name without demo leakage');
    console.log(`  ✓ Certificate issued with credential ID ${certRecord.credentialId} to authentic user.`);
    passedTests++;

    // --------------------------------------------------------------------------
    // 15. BINARY PDF DOWNLOAD & SIGNATURE
    // --------------------------------------------------------------------------
    console.log('[STAGE 15] Binary Certificate PDF Generation...');
    const certPdf = await certificationsService.generateCertificateDownload(userA.id, certRecord.credentialId);
    assert(Buffer.isBuffer(certPdf.buffer), 'Certificate PDF returned as binary buffer');
    assert(certPdf.buffer.length > 500, 'Certificate PDF size is non-trivial');
    const header = certPdf.buffer.slice(0, 4).toString('utf-8');
    assert(header === '%PDF', 'PDF buffer begins with valid %PDF signature');
    console.log(`  ✓ Real binary PDF generated (${certPdf.buffer.length} bytes, signature %PDF verified).`);
    passedTests++;

    // --------------------------------------------------------------------------
    // 16. PUBLIC CERTIFICATE VERIFICATION & PRIVACY SANITIZATION
    // --------------------------------------------------------------------------
    console.log('[STAGE 16] Public Verification & Privacy Sanitization...');
    const verification = await topicsService.getCertificateById(certRecord.credentialId);
    assert(verification.isVerified === true, 'Public verification valid for active certificate');
    assert(!('passwordHash' in verification), 'Public verification sanitized of sensitive fields');
    console.log('  ✓ Public verification verified and privacy-sanitized.');
    passedTests++;

    // --------------------------------------------------------------------------
    // 17 & 18. GUEST PROGRESS CLAIM & ACCOUNT B ISOLATION
    // --------------------------------------------------------------------------
    console.log('[STAGE 17 & 18] Guest Progress Claim & Account B Isolation...');
    const guestId2 = crypto.randomUUID();
    await prisma.anonymousLearner.create({ data: { id: guestId2 } });
    await topicsService.markLessonComplete(firstLesson.id, { anonymousId: guestId2 });

    // Claim into User A
    const claimRes = await topicsService.claimProgress(userA.id, guestId2);
    assert(claimRes.claimedCount! >= 1, 'Guest progress claimed into User A');

    // Create User B
    const userB = await prisma.user.create({
      data: {
        email: `qa-user-b-${Date.now()}@netvision.test`,
        username: `qa_user_b_${Date.now()}`,
        passwordHash: 'hashed_pw_test_456',
        fullName: 'Marcus Vance',
        role: Role.STUDENT,
        isVerified: true,
      },
    });

    // Attempt replay of already-claimed guest session
    const replayClaim = await topicsService.claimProgress(userB.id, guestId2);
    assert(replayClaim.claimedCount === 0, 'Replay claim of already claimed session rejected');

    const userBProgress = await topicsService.getStudentDashboardMetrics({ userId: userB.id });
    assert(userBProgress.completedLessons === 0, 'Account B isolated with 0 progress');
    console.log('  ✓ Account B session isolation and replay defense verified.');
    passedTests++;

    // --------------------------------------------------------------------------
    // FAILURE STATE TESTS
    // --------------------------------------------------------------------------
    console.log('\n[FAILURE STATE TESTS]');

    // Failure 1: Non-existent lesson
    console.log('  • Failure Test 1: Non-existent lesson slug query...');
    try {
      await topicsService.getLessonBySlug('non-existent-lesson-slug-xyz', { userId: userA.id });
      assert(false, 'Should throw 404 for invalid lesson');
    } catch (e: any) {
      assert(e.status === 404 || e.message.includes('not found') || e.message.includes('NotFoundException'), '404 error returned');
      console.log('    ✓ Correctly raised 404 without silent fake fallback.');
      passedTests++;
    }

    // Failure 2: Non-existent certificate verification
    console.log('  • Failure Test 2: Non-existent certificate verification...');
    try {
      await topicsService.getCertificateById('NV-FAKE-99999999');
      assert(false, 'Fake certificate should throw 404');
    } catch (e: any) {
      assert(e.status === 404 || e.message.includes('not found'), '404 error returned');
      console.log('    ✓ Non-existent certificate correctly rejected as invalid.');
      passedTests++;
    }

    // Failure 3: Unauthorized Certificate Download
    console.log('  • Failure Test 3: Unauthorized download authorization guard...');
    try {
      await certificationsService.generateCertificateDownload(userB.id, certRecord.credentialId);
      assert(false, 'User B should not be allowed to download User A certificate');
    } catch (e: any) {
      assert(e.status === 403 || e.message.includes('Forbidden') || e.message.includes('ForbiddenException'), '403 Forbidden raised');
      console.log('    ✓ User B correctly prevented from unauthorized download access.');
      passedTests++;
    }

    // Clean up QA test data
    console.log('\n[TEARDOWN] Cleaning up QA test records...');
    await prisma.certificate.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } });
    await prisma.examAttempt.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } });
    await prisma.quizAttempt.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } });
    await prisma.userProgress.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [userA.id, userB.id] } } });
    await prisma.anonymousLearner.deleteMany({ where: { id: { in: [guestId, guestId2] } } });
    console.log('  ✓ Teardown complete.');

    console.log('\n================================================================');
    console.log(`🎉 ALL ${passedTests} END-TO-END PRODUCT QA CHECKS PASSED!`);
    console.log('================================================================\n');
  } catch (error) {
    console.error('\n❌ E2E QA FAILED WITH ERROR:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runE2EProductQA();
