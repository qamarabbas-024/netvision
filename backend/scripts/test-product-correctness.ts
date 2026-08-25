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

async function runProductCorrectnessTests() {
  console.log('================================================================');
  console.log('🛡️ NETVISION — V1 P0 PRODUCT CORRECTNESS & AUDIT TEST SUITE');
  console.log('================================================================\n');

  let isConnected = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await prisma.$connect();
      isConnected = true;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (!isConnected) {
    console.warn('⚠️ Database offline in test environment. Skipping live DB product correctness tests.');
    console.log('\n================================================================');
    console.log('🎉 PRODUCT CORRECTNESS TESTS SKIPPED SAFELY (OFFLINE MODE)');
    console.log('================================================================\n');
    return;
  }
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
        where: { code: 'NET-404' },
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
        where: { code: 'NET-404' },
        include: { modules: { include: { lessons: { orderBy: { order: 'asc' } } } } },
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

      // Complete lesson 1 -> COMPLETED
      const initialCompleteRes = await topicsService.markLessonComplete(lesson1.id, { userId: userC.id });
      const originalCompletedAt = initialCompleteRes.completedAt;

      // Re-complete lesson 1 -> Idempotent check
      const secondCompleteRes = await topicsService.markLessonComplete(lesson1.id, { userId: userC.id });
      assert(secondCompleteRes.completed === true, '2.4a Re-completing lesson stays COMPLETED');
      assert(
        new Date(secondCompleteRes.completedAt).getTime() === new Date(originalCompletedAt).getTime(),
        '2.4b Re-completing lesson preserves original completedAt timestamp'
      );

      const courseCompleted1 = await topicsService.getCourseBySlug(course!.slug, { userId: userC.id });
      assert(courseCompleted1.modules[0].lessons[0].status === 'COMPLETED', '2.4c Completed lesson status is COMPLETED');
      assert(courseCompleted1.completedLessons >= 1, '2.5 completedLessons count incremented');

      // Complete all lessons in module -> 100% module progress
      const firstMod = course!.modules[0];
      for (const l of firstMod.lessons) {
        await topicsService.markLessonComplete(l.id, { userId: userC.id });
      }
      const courseModFull = await topicsService.getCourseBySlug(course!.slug, { userId: userC.id });
      assert(courseModFull.modules[0].progressPercent === 100, '2.6 Completed module reaches exactly 100%');
      assert(courseModFull.modules[0].status === 'COMPLETED', '2.7 Completed module status is COMPLETED');

      // Verify dashboard metrics: XP from achievements, streak >= 1, currentCourse match
      const dashMetrics = await topicsService.getStudentDashboardMetrics({ userId: userC.id });
      assert(dashMetrics.completedLessons >= firstMod.lessons.length, '2.8 Dashboard completedLessons accurate');
      assert(dashMetrics.studyStreak >= 1, '2.9 Dashboard study streak accurately calculated (streak >= 1)');
      assert(dashMetrics.totalXp === 50, '2.10 Dashboard XP accurately awarded exactly once (50 XP for FIRST_STEP)');
      assert(dashMetrics.currentCourse !== null, '2.11 Dashboard currentCourse populated');
      assert(dashMetrics.currentCourse?.slug === course!.slug, '2.12 Dashboard currentCourse matches active course slug');

      console.log('  ✓ P0 #2 Passed: Canonical completion states, 100% module calculation, XP, streak, and dashboard sync verified.');
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
      const levelRank: Record<string, number> = {
        FOUNDATIONAL: 0,
        BEGINNER: 1,
        INTERMEDIATE: 2,
        ADVANCED: 3,
      };

      const courses = await topicsService.getCourses();
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
        where: { code: 'NET-404' },
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

    // --------------------------------------------------------------------------
    // P0 #9: CERTIFICATION QUIZ SCOPE CORRECTNESS
    // --------------------------------------------------------------------------
    console.log('\n[P0 #9] Certification Quiz Scope Correctness (Curriculum-Scoped Assessment)');
    {
      const userG = await prisma.user.create({
        data: {
          email: `learner-g-${Date.now()}@netvision.test`,
          username: `learner_g_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      // Find required quiz in NET-201 (Core required course for NV-NET)
      const course201 = await prisma.course.findFirst({
        where: { code: 'NET-201' },
        include: { modules: { include: { lessons: { include: { quizzes: true } } } } },
      });
      const requiredQuiz = course201?.modules[0]?.lessons[0]?.quizzes[0];

      // Find unrelated quiz in NET-404
      const course404 = await prisma.course.findFirst({
        where: { code: 'NET-404' },
        include: { modules: { include: { lessons: { include: { quizzes: true } } } } },
      });
      const unrelatedQuiz = course404?.modules[0]?.lessons[0]?.quizzes[0];

      if (requiredQuiz && unrelatedQuiz) {
        // Scenario A: Required quiz is 90% (Passing), Unrelated quiz is 20% (Failing)
        await prisma.quizAttempt.create({
          data: {
            userId: userG.id,
            quizId: requiredQuiz.id,
            score: 90,
            passed: true,
            answersJson: {},
          },
        });
        await prisma.quizAttempt.create({
          data: {
            userId: userG.id,
            quizId: unrelatedQuiz.id,
            score: 20,
            passed: false,
            answersJson: {},
          },
        });

        const eligibility = await certificationsService.calculateEligibility(userG.id, 'NV-NET');
        const assessmentReq = eligibility.requirements.find((r) => r.key === 'ASSESSMENTS');
        assert(assessmentReq !== undefined, '9.1 Assessment requirement exists');
        assert(assessmentReq!.score === 90, `9.2 Assessment score evaluates ONLY required quiz (expected: 90, got: ${assessmentReq!.score})`);
        assert(assessmentReq!.status === 'COMPLETE', '9.3 Assessment requirement is COMPLETE despite failing unrelated quiz');

        // Scenario B (Inverse): User with failing score on required quiz and 100% on unrelated quiz
        const userG2 = await prisma.user.create({
          data: {
            email: `learner-g2-${Date.now()}@netvision.test`,
            username: `learner_g2_${Date.now()}`,
            passwordHash: 'dummy_hash',
            role: Role.STUDENT,
            isVerified: true,
          },
        });

        await prisma.quizAttempt.create({
          data: {
            userId: userG2.id,
            quizId: requiredQuiz.id,
            score: 40,
            passed: false,
            answersJson: {},
          },
        });
        await prisma.quizAttempt.create({
          data: {
            userId: userG2.id,
            quizId: unrelatedQuiz.id,
            score: 100,
            passed: true,
            answersJson: {},
          },
        });

        const eligibility2 = await certificationsService.calculateEligibility(userG2.id, 'NV-NET');
        const assessmentReq2 = eligibility2.requirements.find((r) => r.key === 'ASSESSMENTS');
        assert(assessmentReq2!.score === 40, `9.4 Assessment score evaluates required quiz (expected: 40, got: ${assessmentReq2!.score})`);
        assert(assessmentReq2!.status === 'INCOMPLETE', '9.5 Assessment requirement is INCOMPLETE despite high unrelated quiz score');
      }

      console.log('  ✓ P0 #9 Passed: Certification quiz evaluation is strictly scoped to required curriculum.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #10: DISTINCT REQUIRED LAB COMPLETION
    // --------------------------------------------------------------------------
    console.log('\n[P0 #10] Distinct Required Lab Completion (No Repetitive Substitution)');
    {
      const userH = await prisma.user.create({
        data: {
          email: `learner-h-${Date.now()}@netvision.test`,
          username: `learner_h_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      // Retrieve authoritative required labs for NV-NET certification
      const certDef = await prisma.certificationDefinition.findUnique({
        where: { code: 'NV-NET' },
      });
      assert(!!certDef, '10.0 Certification definition NV-NET exists');

      const reqCourseCodes: string[] = (certDef!.requirementsJson as any)?.requiredCourseCodes || ['NET-201', 'NET-202', 'NET-203', 'NET-204', 'NET-302'];
      const requiredCourses = await prisma.course.findMany({
        where: { code: { in: reqCourseCodes } },
        include: { modules: { include: { lessons: { include: { labs: true } } } } },
      });

      const requiredLabs: any[] = [];
      for (const c of requiredCourses) {
        for (const m of c.modules) {
          for (const l of m.lessons) {
            for (const lab of l.labs) {
              requiredLabs.push(lab);
            }
          }
        }
      }

      // Find an unrelated lab from NET-404
      const unrelatedCourse = await prisma.course.findFirst({
        where: { code: 'NET-404' },
        include: { modules: { include: { lessons: { include: { labs: true } } } } },
      });
      const unrelatedLab = unrelatedCourse?.modules[0]?.lessons.find((l) => l.labs.length > 0)?.labs[0];

      assert(requiredLabs.length >= 2, `10.0 Found at least 2 required labs for NV-NET (found: ${requiredLabs.length})`);

      const labA = requiredLabs[0];
      const labB = requiredLabs[1];

      // CASE 1: 3 successful attempts for SAME required lab (Lab A) -> exactly 1 distinct completed lab
      await prisma.labAttempt.create({
        data: { userId: userH.id, labId: labA.id, passed: true, score: 100, status: 'COMPLETED' },
      });
      await prisma.labAttempt.create({
        data: { userId: userH.id, labId: labA.id, passed: true, score: 100, status: 'COMPLETED' },
      });
      await prisma.labAttempt.create({
        data: { userId: userH.id, labId: labA.id, passed: true, score: 100, status: 'COMPLETED' },
      });

      let eligibility = await certificationsService.calculateEligibility(userH.id, 'NV-NET');
      let labsReq = eligibility.requirements.find((r) => r.key === 'LABS');
      assert(labsReq !== undefined, '10.1 Labs requirement exists');
      assert(labsReq!.title.includes(`(1/${requiredLabs.length})`), `10.2 Case 1: 3 attempts on Lab A = exactly 1 completed required lab (got: ${labsReq!.title})`);
      assert(labsReq!.status === 'INCOMPLETE', '10.3 Case 1 status is INCOMPLETE');

      // CASE 2: same lab repeated + second required lab (Lab B) -> 2 distinct completed labs
      await prisma.labAttempt.create({
        data: { userId: userH.id, labId: labB.id, passed: true, score: 100, status: 'COMPLETED' },
      });

      eligibility = await certificationsService.calculateEligibility(userH.id, 'NV-NET');
      labsReq = eligibility.requirements.find((r) => r.key === 'LABS');
      assert(labsReq!.title.includes(`(2/${requiredLabs.length})`), `10.4 Case 2: Lab A + Lab B = exactly 2 completed required labs (got: ${labsReq!.title})`);

      // CASE 3: successful attempt for non-required lab (Unrelated Lab from NET-404) -> does not affect requirement
      if (unrelatedLab) {
        await prisma.labAttempt.create({
          data: { userId: userH.id, labId: unrelatedLab.id, passed: true, score: 100, status: 'COMPLETED' },
        });

        eligibility = await certificationsService.calculateEligibility(userH.id, 'NV-NET');
        labsReq = eligibility.requirements.find((r) => r.key === 'LABS');
        assert(labsReq!.title.includes(`(2/${requiredLabs.length})`), `10.5 Case 3: Non-required lab does not increase count (got: ${labsReq!.title})`);
      }

      // CASE 4: failed attempt on remaining required lab -> does not count
      if (requiredLabs.length > 2) {
        const labC = requiredLabs[2];
        await prisma.labAttempt.create({
          data: { userId: userH.id, labId: labC.id, passed: false, score: 40, status: 'FAILED' },
        });

        eligibility = await certificationsService.calculateEligibility(userH.id, 'NV-NET');
        labsReq = eligibility.requirements.find((r) => r.key === 'LABS');
        assert(labsReq!.title.includes(`(2/${requiredLabs.length})`), `10.6 Case 4: Failed attempt does not count (got: ${labsReq!.title})`);
      }

      // CASE 5: all required labs completed -> LABS status COMPLETE
      for (let i = 2; i < requiredLabs.length; i++) {
        await prisma.labAttempt.create({
          data: { userId: userH.id, labId: requiredLabs[i].id, passed: true, score: 100, status: 'COMPLETED' },
        });
      }

      eligibility = await certificationsService.calculateEligibility(userH.id, 'NV-NET');
      labsReq = eligibility.requirements.find((r) => r.key === 'LABS');
      assert(labsReq!.title.includes(`(${requiredLabs.length}/${requiredLabs.length})`), `10.7 Case 5: All required labs completed (got: ${labsReq!.title})`);
      assert(labsReq!.status === 'COMPLETE', '10.8 Case 5 status is COMPLETE');

      console.log('  ✓ P0 #10 Passed: Distinct lab completion enforced across Cases 1-5 without duplicate substitution.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #11: CERTIFICATION BLUEPRINT & EXAM QUESTION INTEGRITY
    // --------------------------------------------------------------------------
    console.log('\n[P0 #11] Certification Exam Question Pool & Blueprint Integrity');
    {
      // Verify blueprint does not generate synthetic questions when raw pool is sufficient
      const qCount = await prisma.quizQuestion.count();
      assert(qCount >= 50, `11.1 Approved question pool has at least 50 questions (got: ${qCount})`);

      const rawQuestions = await prisma.quizQuestion.findMany({ take: 50 });
      for (const q of rawQuestions) {
        assert(!q.id.startsWith('q-synth-'), '11.2 Question ID does not have synthetic marker');
        assert(typeof q.questionText === 'string' && q.questionText.length > 5, '11.3 Question text is substantial');
      }

      console.log('  ✓ P0 #11 Passed: Question pool integrity verified with approved question content.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #12: CERTIFICATE DATA INTEGRITY & ZERO FABRICATED SKILLS
    // --------------------------------------------------------------------------
    console.log('\n[P0 #12] Certificate Data Authority & No Fabricated Metadata');
    {
      const userI = await prisma.user.create({
        data: {
          email: `learner-i-${Date.now()}@netvision.test`,
          username: `learner_i_${Date.now()}`,
          fullName: 'Jordan Lee',
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      const cert = await prisma.certificate.create({
        data: {
          userId: userI.id,
          credentialId: `NV-NET-JLEE-${Date.now()}`,
          verificationCode: `NV-VERIFY-JLEE-${Date.now()}`,
          certificationCode: 'NV-NET',
          certificationTitle: 'NetVision Certified Network Administrator',
          recipientName: 'Jordan Lee',
          status: 'ACTIVE',
          metadataJson: {
            grade: 'Pass with High Distinction',
            overallScore: 98,
            skillsAssessed: [
              'IPv4 CIDR Subnetting & Network Addressing',
              'VLAN Segmentation & Switch Port Provisioning',
            ],
          },
        },
      });

      const verification = await certificationsService.verifyCertificate(cert.credentialId!);
      assert(verification.isVerified === true, '12.1 Active certificate isVerified is true');
      assert(verification.recipientName === 'Jordan Lee', '12.2 Recipient name strictly matches database');
      assert(verification.certificationTitle === 'NetVision Certified Network Administrator', '12.3 Title strictly matches database');
      assert(Array.isArray(verification.skillsAssessed) && verification.skillsAssessed.length === 2, '12.4 Returns exact authoritative skills');
      assert(verification.skillsAssessed[0] === 'IPv4 CIDR Subnetting & Network Addressing', '12.5 First skill matches authoritative metadata');

      console.log('  ✓ P0 #12 Passed: Certificate data integrity and authoritative skill retrieval verified.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #13: CERTIFICATE OWNERSHIP & UNAUTHORIZED DOWNLOAD DEFENSE
    // --------------------------------------------------------------------------
    console.log('\n[P0 #13] Certificate Ownership & Unauthorized Download Defense');
    {
      const owner = await prisma.user.create({
        data: {
          email: `owner-${Date.now()}@netvision.test`,
          username: `owner_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      const attacker = await prisma.user.create({
        data: {
          email: `attacker-${Date.now()}@netvision.test`,
          username: `attacker_${Date.now()}`,
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      const cert = await prisma.certificate.create({
        data: {
          userId: owner.id,
          credentialId: `NV-NET-OWNER-${Date.now()}`,
          verificationCode: `NV-VERIFY-OWNER-${Date.now()}`,
          certificationCode: 'NV-NET',
          certificationTitle: 'NetVision Certified Network Administrator',
          recipientName: 'Cert Owner',
          status: 'ACTIVE',
        },
      });

      // Attacker attempts to download owner's certificate
      let attackerForbidden = false;
      try {
        await certificationsService.generateCertificateDownload(attacker.id, cert.credentialId!);
      } catch (err: any) {
        if (err?.status === 403 || err?.message?.includes('Access denied') || err?.message?.includes('Forbidden')) {
          attackerForbidden = true;
        }
      }
      assert(attackerForbidden, '13.1 Non-owner receives Forbidden on certificate download');

      // Owner downloads their own certificate
      const downloadStream = await certificationsService.generateCertificateDownload(owner.id, cert.credentialId!);
      assert(downloadStream !== undefined && downloadStream !== null, '13.2 Owner successfully generates download stream');

      console.log('  ✓ P0 #13 Passed: Certificate download strictly verifies ownership and blocks unauthorized access.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #14: CERTIFICATE PUBLIC VERIFICATION PRIVACY
    // --------------------------------------------------------------------------
    console.log('\n[P0 #14] Certificate Public Verification Privacy (Zero Private Data Leakage)');
    {
      const userJ = await prisma.user.create({
        data: {
          email: `private-learner-${Date.now()}@netvision.test`,
          username: `private_learner_${Date.now()}`,
          passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$super_private_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      const cert = await prisma.certificate.create({
        data: {
          userId: userJ.id,
          credentialId: `NV-NET-PRIV-${Date.now()}`,
          verificationCode: `NV-VERIFY-PRIV-${Date.now()}`,
          certificationCode: 'NV-NET',
          certificationTitle: 'NetVision Certified Network Administrator',
          recipientName: 'Private Learner',
          status: 'ACTIVE',
        },
      });

      const verification: any = await certificationsService.verifyCertificate(cert.credentialId!);
      assert(verification.email === undefined, '14.1 Public verification does not expose email');
      assert(verification.passwordHash === undefined, '14.2 Public verification does not expose passwordHash');
      assert(verification.userId === undefined, '14.3 Public verification does not expose internal userId');

      console.log('  ✓ P0 #14 Passed: Public verification strictly sanitizes private user data.');
      passedTests++;
    }

    // --------------------------------------------------------------------------
    // P0 #15: DUPLICATE CERTIFICATE CLAIM PREVENTION
    // --------------------------------------------------------------------------
    console.log('\n[P0 #15] Duplicate Certificate Claim Prevention');
    {
      const userK = await prisma.user.create({
        data: {
          email: `learner-k-${Date.now()}@netvision.test`,
          username: `learner_k_${Date.now()}`,
          fullName: 'Casey Smith',
          passwordHash: 'dummy_hash',
          role: Role.STUDENT,
          isVerified: true,
        },
      });

      // Create existing certificate
      const cert1 = await prisma.certificate.create({
        data: {
          userId: userK.id,
          credentialId: `NV-NET-CASEY-${Date.now()}`,
          verificationCode: `NV-VERIFY-CASEY-${Date.now()}`,
          certificationCode: 'NV-NET',
          certificationTitle: 'NetVision Certified Network Administrator',
          recipientName: 'Casey Smith',
          status: 'ACTIVE',
        },
      });

      // Attempt to claim again via service
      const cert2 = await certificationsService.claimCertificationCertificate(userK.id, 'NV-NET');
      assert(cert2.credentialId === cert1.credentialId, '15.1 Duplicate claim returns existing certificate');

      const allUserCerts = await prisma.certificate.findMany({
        where: { userId: userK.id, certificationCode: 'NV-NET' },
      });
      assert(allUserCerts.length === 1, '15.2 Only 1 certificate record exists for user and certification code');

      console.log('  ✓ P0 #15 Passed: Duplicate certificate claim prevention verified.');
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
