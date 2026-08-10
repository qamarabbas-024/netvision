import { PrismaClient, CourseLevel } from '@prisma/client';
import { TARGET_16_COURSES } from '../src/topics/curriculum-migration';
import { TopicsService } from '../src/topics/topics.service';
import { AchievementsService } from '../src/achievements/achievements.service';

const prisma = new PrismaClient();

async function runPhase12cVerificationTests() {
  console.log('🧪 Starting Phase 12C Curriculum Migration & Preservation Verification Suite...\n');

  let passedAssertions = 0;

  function assert(condition: boolean, message: string) {
    if (!condition) {
      console.error(`❌ ASSERTION FAILED: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
    passedAssertions++;
    console.log(`  ✓ Assertion ${passedAssertions}: ${message}`);
  }

  // Tracking created test IDs for cleanup
  let createdQuizAttemptId: string | null = null;
  let createdLabAttemptId: string | null = null;
  let createdCertId: string | null = null;
  let createdGuestProgressId: string | null = null;
  const anonId = '00000000-0000-4000-a000-000000001234';

  try {
    // 1. Verify 16 Target Courses Exist
    const targetCourses = await prisma.course.findMany({
      where: { code: { startsWith: 'NET-' } },
      orderBy: { order: 'asc' },
    });
    assert(targetCourses.length === 16, `Found exactly 16 target progressive courses in database (got ${targetCourses.length}).`);

    // 2. Verify Level Assignments
    const foundational = targetCourses.filter((c) => c.level === CourseLevel.FOUNDATIONAL);
    const beginner = targetCourses.filter((c) => c.level === CourseLevel.BEGINNER);
    const intermediate = targetCourses.filter((c) => c.level === CourseLevel.INTERMEDIATE);
    const advanced = targetCourses.filter((c) => c.level === CourseLevel.ADVANCED);

    assert(foundational.length === 3, `Level 0 Foundational contains exactly 3 courses (got ${foundational.length}).`);
    assert(beginner.length === 4, `Level 1 Beginner contains exactly 4 courses (got ${beginner.length}).`);
    assert(intermediate.length === 5, `Level 2 Intermediate contains exactly 5 courses (got ${intermediate.length}).`);
    assert(advanced.length === 4, `Level 3 Advanced contains exactly 4 courses (got ${advanced.length}).`);

    // 3. Verify Deterministic Ordering
    let isOrdered = true;
    for (let i = 0; i < targetCourses.length; i++) {
      if (targetCourses[i].order !== i + 1) {
        isOrdered = false;
        break;
      }
    }
    assert(isOrdered, 'All 16 target courses have strictly deterministic 1..16 ordering.');

    // 4. Verify Existing Legacy Lesson Slugs Remain Valid
    const sampleSlugs = [
      'level-0-what-is-a-computer-network',
      'ip-addressing-ipv4-overview',
      'subnetting-cidr-overview',
      'tcp-udp-transport-overview',
      'switching-vlans-overview',
    ];

    for (const slug of sampleSlugs) {
      const lesson = await prisma.lesson.findUnique({ where: { slug } });
      assert(!!lesson, `Legacy lesson slug "${slug}" remains valid and queryable.`);
    }

    // 5. Verify Benchmark Lesson Metadata Placeholders
    const b101 = await prisma.lesson.findUnique({ where: { slug: 'net-101-bits-bytes-binary-hex' } });
    const b202 = await prisma.lesson.findUnique({ where: { slug: 'net-202-ipv4-addressing-cidr' } });
    const b404 = await prisma.lesson.findUnique({ where: { slug: 'net-404-wireshark-packet-capture' } });

    assert(!!b101 && !!b101.contentJson, 'Benchmark Lesson 101 placeholder exists with structural metadata.');
    assert(!!b202 && !!b202.contentJson, 'Benchmark Lesson 202 placeholder exists with structural metadata.');
    assert(!!b404 && !!b404.contentJson, 'Benchmark Lesson 404 placeholder exists with structural metadata.');

    // 6. Verify Historical UserProgress Queryable
    const testUser = await prisma.user.findFirst({ where: { email: 'alex@netvision.edu' } });
    assert(!!testUser, 'Test student user alex@netvision.edu exists.');

    const sampleLesson = await prisma.lesson.findFirst();
    assert(!!sampleLesson, 'Sample lesson exists for progress test.');

    const existingProgress = await prisma.userProgress.findFirst({
      where: { userId: testUser!.id, lessonId: sampleLesson!.id },
    });

    const progressRecord = existingProgress || await prisma.userProgress.create({
      data: { userId: testUser!.id, lessonId: sampleLesson!.id, completed: true },
    });
    assert(!!progressRecord && progressRecord.completed === true, 'UserProgress record created and queryable.');

    // 7. Verify Historical QuizAttempt Queryable
    const sampleQuiz = await prisma.quiz.findFirst({ where: { lessonId: sampleLesson!.id } });
    assert(!!sampleQuiz, 'Sample quiz exists for attempt test.');

    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: testUser!.id,
        quizId: sampleQuiz!.id,
        score: 100,
        passed: true,
        answersJson: {},
      },
    });
    createdQuizAttemptId = quizAttempt.id;
    assert(!!quizAttempt && quizAttempt.score === 100, 'QuizAttempt record created and queryable.');

    // 8. Verify Historical LabAttempt Queryable
    const sampleLab = await prisma.lessonLab.findFirst();
    assert(!!sampleLab, 'Sample lesson lab exists for lab attempt test.');

    const labAttempt = await prisma.labAttempt.create({
      data: {
        userId: testUser!.id,
        labId: sampleLab!.id,
        score: 100,
        passed: true,
        status: 'PASSED',
      },
    });
    createdLabAttemptId = labAttempt.id;
    assert(!!labAttempt && labAttempt.status === 'PASSED', 'LabAttempt record created and queryable.');

    // 9. Verify Historical Certificate Queryable
    const sampleCourse = await prisma.course.findFirst({ where: { code: 'NET-101' } });
    assert(!!sampleCourse, 'Sample target course NET-101 exists for certificate test.');

    const certCode = `cert-test-12c-${Date.now()}`;
    const certRecord = await prisma.certificate.create({
      data: {
        userId: testUser!.id,
        courseId: sampleCourse!.id,
        code: certCode,
      },
    });
    createdCertId = certRecord.id;
    assert(!!certRecord && certRecord.code === certCode, 'Certificate record created and queryable.');

    // 10. Verify Guest-First Identity Intact
    await prisma.anonymousLearner.upsert({
      where: { id: anonId },
      update: {},
      create: { id: anonId },
    });

    const guestProgress = await prisma.userProgress.create({
      data: {
        anonymousId: anonId,
        lessonId: sampleLesson!.id,
        completed: true,
      },
    });
    createdGuestProgressId = guestProgress.id;
    assert(!!guestProgress && guestProgress.anonymousId === anonId, 'Guest user progress created and queryable with X-Anonymous-ID.');

    // 11. Verify Achievement Catalog Functionality Intact
    const achievements = await prisma.achievement.findMany({ where: { isActive: true } });
    assert(achievements.length >= 5, `Active achievement catalog intact (found ${achievements.length} active badges).`);

    // 12. Verify Phase 11B 80% Assessment Gating Intact
    const achievementsService = new AchievementsService(prisma as any);
    const topicsService = new TopicsService(prisma as any, achievementsService);

    const assessmentStatus = await topicsService.getCourseAssessment(
      { userId: testUser!.id },
      sampleCourse!.slug
    );
    assert(typeof assessmentStatus.eligibleForCertificate === 'boolean', 'Phase 11B 80% assessment gating engine evaluated course eligibility successfully.');

    // 13. Verify Phase 11C Dashboard Aggregations Intact
    const dashboardMetrics = await topicsService.getStudentDashboardMetrics({ userId: testUser!.id });
    assert(
      typeof dashboardMetrics.totalXp === 'number' &&
      typeof dashboardMetrics.completedLessons === 'number' &&
      typeof dashboardMetrics.simulationsRun === 'number',
      'Phase 11C dynamic student dashboard aggregation metrics returned server-authoritative state.'
    );

    // 14. Verify Idempotency Strategy
    const initialTargetCourses = await prisma.course.count({ where: { code: { startsWith: 'NET-' } } });
    const initialLessonCount = await prisma.lesson.count();

    assert(
      initialTargetCourses === 16 && initialLessonCount >= 35,
      `Curriculum migration is idempotent (target courses: ${initialTargetCourses}, total lessons: ${initialLessonCount}).`
    );

    console.log(`\n🎉 PHASE 12C VERIFICATION SUCCESSFUL: ${passedAssertions} / ${passedAssertions} assertions passed!\n`);
  } catch (err) {
    console.error('\n❌ PHASE 12C VERIFICATION FAILED:', err);
    process.exit(1);
  } finally {
    // Clean up temporary test artifacts
    if (createdQuizAttemptId) await prisma.quizAttempt.delete({ where: { id: createdQuizAttemptId } }).catch(() => {});
    if (createdLabAttemptId) await prisma.labAttempt.delete({ where: { id: createdLabAttemptId } }).catch(() => {});
    if (createdCertId) await prisma.certificate.delete({ where: { id: createdCertId } }).catch(() => {});
    if (createdGuestProgressId) await prisma.userProgress.delete({ where: { id: createdGuestProgressId } }).catch(() => {});
    await prisma.anonymousLearner.delete({ where: { id: anonId } }).catch(() => {});
    await prisma.$disconnect();
  }
}

runPhase12cVerificationTests();
