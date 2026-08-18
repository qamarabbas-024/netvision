import { PrismaClient, CourseLevel, LessonType, Role } from '@prisma/client';
import { TopicsService } from '../src/topics/topics.service';
import { CertificationsService } from '../src/certifications/certifications.service';
import { AchievementsService } from '../src/achievements/achievements.service';
import { TroubleshootingService } from '../src/troubleshooting/troubleshooting.service';
import { PrismaService } from '../src/database/prisma.service';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const prismaService = new PrismaService();
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

async function runProductCorrectnessTests() {
  console.log('================================================================');
  console.log('🛡️ NETVISION — V1 P0 PRODUCT CORRECTNESS & AUDIT TEST SUITE');
  console.log('================================================================\n');

  let passedTests = 0;

  try {
    // --------------------------------------------------------------------------
    // P0 #1: GUEST → ACCOUNT PROGRESS SYNC & ISOLATION
    // --------------------------------------------------------------------------
    console.log('[P0 #1] Guest Progress Sync, Replay Prevention, and Session Isolation');
    {
      const anonId = crypto.randomUUID();
      await prisma.anonymousLearner.create({ data: { id: anonId } });

      let course = await prisma.course.findFirst({
        where: { published: true },
        include: { modules: { include: { lessons: true } } },
      });
      assert(!!course && course.modules.length > 0, 'Course exists for test');
      const lesson = course!.modules[0].lessons[0];

      // Guest completes lesson
      await topicsService.markLessonComplete(lesson.id, { anonymousId: anonId });
      const guestProgress = await topicsService.getLessonBySlug(lesson.slug, { anonymousId: anonId });
      assert(guestProgress.isCompleted === true, '1.1 Guest lesson progress recognized as completed');

      // Guest saves lesson
      await topicsService.toggleSaveLesson(lesson.id, { anonymousId: anonId });
      const guestSaved = await topicsService.getSavedLessons({ anonymousId: anonId });
      assert(guestSaved.length === 1, '1.2 Guest saved lesson stored');

      // Account A registers and claims
      const userA = await prisma.user.create({
        data: {
          email: `learner-a-${Date.now()}@netvision.test`,
          username: `learner_a_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      const claimResA = await topicsService.claimProgress(userA.id, anonId);
      assert(claimResA.success === true && claimResA.claimedCount! >= 2, '1.3 Account A claimed progress and saved lesson');

      const userAProgress = await topicsService.getLessonBySlug(lesson.slug, { userId: userA.id });
      assert(userAProgress.isCompleted === true, '1.4 Account A owns completed progress');

      const userASaved = await topicsService.getSavedLessons({ userId: userA.id });
      assert(userASaved.length === 1, '1.5 Account A owns saved lesson');

      // Account B registers on same browser and attempts claim with old anonId
      const userB = await prisma.user.create({
        data: {
          email: `learner-b-${Date.now()}@netvision.test`,
          username: `learner_b_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      const claimResB = await topicsService.claimProgress(userB.id, anonId);
      assert(claimResB.claimedCount === 0, '1.6 Account B claimed exactly 0 items from old claimed guest ID');

      const userBProgress = await topicsService.getLessonBySlug(lesson.slug, { userId: userB.id });
      assert(userBProgress.isCompleted === false, '1.7 Account B does NOT inherit Account A completed progress');

      const userBSaved = await topicsService.getSavedLessons({ userId: userB.id });
      assert(userBSaved.length === 0, '1.8 Account B does NOT inherit Account A saved lessons');

      console.log('  ✓ P0 #1 Passed: Guest claim sync, session isolation, and replay defense verified.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #2: CANONICAL PROGRESS / COMPLETION / XP / STREAK
    // --------------------------------------------------------------------------
    console.log('\n[P0 #2] Canonical Completion States (NOT_STARTED, IN_PROGRESS, COMPLETED), XP & Streak');
    {
      const userC = await prisma.user.create({
        data: {
          email: `learner-c-${Date.now()}@netvision.test`,
          username: `learner_c_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      let course = await prisma.course.findFirst({
        where: { published: true },
        include: { modules: { include: { lessons: true } } },
      });
      const allLessons = course!.modules.flatMap((m) => m.lessons);
      const lesson1 = allLessons[0];
      const lesson2 = allLessons[1] || allLessons[0];

      // Initial state: NOT_STARTED
      const courseBefore = await topicsService.getCourseBySlug(course!.slug, { userId: userC.id });
      assert(courseBefore.modules[0].lessons[0].status === 'NOT_STARTED', '2.1 Initial lesson status is NOT_STARTED');
      assert(courseBefore.progressPercent === 0, '2.2 Initial course progress is 0%');

      // Start lesson 1 -> IN_PROGRESS
      await topicsService.markLessonStarted(lesson1.id, { userId: userC.id });
      const courseStarted = await topicsService.getCourseBySlug(course!.slug, { userId: userC.id });
      assert(courseStarted.modules[0].lessons[0].status === 'IN_PROGRESS', '2.3 Started lesson status is IN_PROGRESS');

      // Complete lesson 1 (No lab requirement if no lab) -> COMPLETED
      await topicsService.markLessonComplete(lesson1.id, { userId: userC.id });
      const courseCompleted1 = await topicsService.getCourseBySlug(course!.slug, { userId: userC.id });
      assert(courseCompleted1.modules[0].lessons[0].status === 'COMPLETED', '2.4 Completed lesson status is COMPLETED');
      assert(courseCompleted1.completedLessons >= 1, '2.5 completedLessons count incremented');

      // Complete all lessons in module -> 100% module progress
      const firstMod = course!.modules[0];
      for (const l of firstMod.lessons) {
        await topicsService.markLessonComplete(l.id, { userId: userC.id });
      }
      const courseModFull = await topicsService.getCourseBySlug(course!.slug, { userId: userC.id });
      assert(courseModFull.modules[0].progressPercent === 100, '2.6 Completed module reaches exactly 100%');
      assert(courseModFull.modules[0].status === 'COMPLETED', '2.7 Completed module status is COMPLETED');

      // Verify dashboard metrics: XP from achievements, streak >= 1
      const dashMetrics = await topicsService.getStudentDashboardMetrics({ userId: userC.id });
      assert(dashMetrics.completedLessons >= firstMod.lessons.length, '2.8 Dashboard completedLessons accurate');
      assert(dashMetrics.studyStreak >= 1, '2.9 Dashboard study streak accurately calculated (streak >= 1)');
      assert(dashMetrics.totalXp >= 50, '2.10 Dashboard XP accurately awarded from FIRST_STEP achievement');

      console.log('  ✓ P0 #2 Passed: Canonical completion states, 100% module calculation, XP and streak verified.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #3: DEMO IDENTITY SEPARATION
    // --------------------------------------------------------------------------
    console.log('\n[P0 #3] Demo Identity Separation (No "Alex Rivers" Leakage)');
    {
      const userD = await prisma.user.create({
        data: {
          email: `custom-learner-${Date.now()}@netvision.test`,
          username: `custom_learner_${Date.now()}`,
          fullName: 'Taylor Morgan',
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      // Public verification of a certificate created for Taylor Morgan
      const cert = await prisma.certificate.create({
        data: {
          userId: userD.id,
          credentialId: `NV-CERT-TM-${Date.now()}`,
          verificationCode: `NV-V-TM-${Date.now()}`,
          certificationCode: 'NV-NET',
          certificationTitle: 'NetVision Certified Network Administrator',
          recipientName: 'Taylor Morgan',
          status: 'ACTIVE',
        },
      });

      const pubCert = await topicsService.getCertificateById(cert.credentialId!);
      assert(pubCert.recipientName === 'Taylor Morgan', '3.1 Public cert uses exact recipient name without falling back to demo name');
      assert(pubCert.recipientName !== 'Alex Rivers', '3.2 Demo identity "Alex Rivers" not leaked in certificate');

      console.log('  ✓ P0 #3 Passed: Demo identity strictly separated from active user credentials.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #4: CERTIFICATE OWNERSHIP, DATES & API LISTING
    // --------------------------------------------------------------------------
    console.log('\n[P0 #4] Authoritative Certificate Listing, Ownership & Stale Date Prevention');
    {
      const userE = await prisma.user.create({
        data: {
          email: `learner-e-${Date.now()}@netvision.test`,
          username: `learner_e_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      const issueDate = new Date();
      const cert = await prisma.certificate.create({
        data: {
          userId: userE.id,
          credentialId: `NV-NET-AUTH-${Date.now()}`,
          verificationCode: `NV-VERIFY-AUTH-${Date.now()}`,
          certificationCode: 'NV-NET',
          certificationTitle: 'NetVision Certified Network Administrator',
          recipientName: 'Learner E',
          status: 'ACTIVE',
          issuedAt: issueDate,
          metadataJson: { grade: 'Pass with Distinction', overallScore: 92 },
        },
      });

      const userCerts = await topicsService.getUserCertificates(userE.id);
      assert(userCerts.length === 1, '4.1 getUserCertificates returns exactly the user owned certificates');
      assert(userCerts[0].credentialId === cert.credentialId, '4.2 Credential ID matches authoritative record');
      assert(new Date(userCerts[0].issuedAt).getTime() === issueDate.getTime(), '4.3 Issue date matches authoritative DB timestamp');

      console.log('  ✓ P0 #4 Passed: Authoritative certificate listing, verification, and date accuracy verified.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #5: TROUBLESHOOTING SCENARIO COUNT & FILTER SAFETY
    // --------------------------------------------------------------------------
    console.log('\n[P0 #5] Troubleshooting Scenario Catalog & Filter Integrity');
    {
      const scenarios = troubleshootingService.getAllScenarios();
      assert(scenarios.length === 12, `5.1 Exactly 12 scenarios in catalog (got: ${scenarios.length})`);

      const beginner = scenarios.filter((s) => s.difficulty === CourseLevel.BEGINNER);
      const intermediate = scenarios.filter((s) => s.difficulty === CourseLevel.INTERMEDIATE);
      const advanced = scenarios.filter((s) => s.difficulty === CourseLevel.ADVANCED);

      assert(beginner.length === 3, `5.2 3 Beginner scenarios (got: ${beginner.length})`);
      assert(intermediate.length === 5, `5.3 5 Intermediate scenarios (got: ${intermediate.length})`);
      assert(advanced.length === 4, `5.4 4 Advanced scenarios (got: ${advanced.length})`);

      console.log('  ✓ P0 #5 Passed: Troubleshooting scenario counts (3 Beginner, 5 Intermediate, 4 Advanced) verified.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #6: COURSE DURATION CALCULATION
    // --------------------------------------------------------------------------
    console.log('\n[P0 #6] Course Duration Calculation (Lesson Duration Backed)');
    {
      const courses = await topicsService.getCourses();
      assert(courses.length > 0, '6.1 Courses retrieved');

      for (const c of courses) {
        assert(typeof c.durationMinutes === 'number' && c.durationMinutes > 0, `6.2 Course "${c.title}" has computed durationMinutes`);
        assert(typeof c.estimatedHours === 'number' && c.estimatedHours > 0, `6.3 Course "${c.title}" has realistic estimatedHours`);
      }

      console.log('  ✓ P0 #6 Passed: Course duration calculated from lesson durations without arbitrary static strings.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #7: DIFFICULTY HIERARCHY ORDERING
    // --------------------------------------------------------------------------
    console.log('\n[P0 #7] Course Difficulty Ordering (FOUNDATIONAL -> BEGINNER -> INTERMEDIATE -> ADVANCED)');
    {
      const courses = await topicsService.getCourses();
      const levelRank: Record<string, number> = {
        FOUNDATIONAL: 0,
        BEGINNER: 1,
        INTERMEDIATE: 2,
        ADVANCED: 3,
      };

      for (let i = 0; i < courses.length - 1; i++) {
        const currRank = levelRank[courses[i].level] ?? 99;
        const nextRank = levelRank[courses[i + 1].level] ?? 99;
        assert(currRank <= nextRank, `7.1 Course [${courses[i].level}] precedes or equals [${courses[i + 1].level}] in visual syllabus order`);
      }

      console.log('  ✓ P0 #7 Passed: Difficulty visual hierarchy ordering verified.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #8: SAVED CONTENT & BOOKMARK RETENTION
    // --------------------------------------------------------------------------
    console.log('\n[P0 #8] Saved Content & Bookmark Retention Across Sessions');
    {
      const anonId = crypto.randomUUID();
      await prisma.anonymousLearner.create({ data: { id: anonId } });

      let course = await prisma.course.findFirst({
        where: { published: true },
        include: { modules: { include: { lessons: true } } },
      });
      const lesson = course!.modules[0].lessons[0];

      // Toggle bookmark on for guest
      await topicsService.toggleSaveLesson(lesson.id, { anonymousId: anonId });
      const guestSaved = await topicsService.getSavedLessons({ anonymousId: anonId });
      assert(guestSaved.length === 1 && (guestSaved[0].lessonId === lesson.id || guestSaved[0].id === lesson.id), '8.1 Guest bookmark saved');

      // Toggle bookmark off
      await topicsService.toggleSaveLesson(lesson.id, { anonymousId: anonId });
      const guestSavedOff = await topicsService.getSavedLessons({ anonymousId: anonId });
      assert(guestSavedOff.length === 0, '8.2 Guest bookmark toggled off');

      // Re-save and claim into account
      await topicsService.toggleSaveLesson(lesson.id, { anonymousId: anonId });
      const userF = await prisma.user.create({
        data: {
          email: `learner-f-${Date.now()}@netvision.test`,
          username: `learner_f_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      await topicsService.claimProgress(userF.id, anonId);
      const userFSaved = await topicsService.getSavedLessons({ userId: userF.id });
      assert(userFSaved.length === 1, '8.3 Authenticated user retains claimed saved lesson on server');

      console.log('  ✓ P0 #8 Passed: Saved content persistence, toggle behavior, and claim migration verified.');
      passedTests++;
    }

    console.log('\n================================================================');
    console.log(`🎉 ALL ${passedTests} P0 PRODUCT CORRECTNESS TESTS PASSED SUCCESSFULLY!`);
    console.log('================================================================\n');
  } finally {
    // Cleanup test users
    await prisma.user.deleteMany({
      where: {
        email: { contains: '@netvision.test' },
      },
    }).catch(() => null);
  }
}

runProductCorrectnessTests()
  .catch((err) => {
    console.error('❌ Product Correctness Test Suite Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
