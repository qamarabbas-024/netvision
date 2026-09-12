import { PrismaClient, Role, ExamAttemptStatus, ExamType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Read DATABASE_URL from backend/.env if not present in environment
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(__dirname, '../../backend/.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
      if (match) {
        process.env.DATABASE_URL = match[1];
      }
    }
  } catch {
    // Ignore error
  }
}

const dbUrl = (process.env.DATABASE_URL || '').replace(/connection_limit=\d+/, 'connection_limit=5');
export const prisma = new PrismaClient(
  dbUrl
    ? {
        datasources: {
          db: {
            url: dbUrl,
          },
        },
      }
    : undefined
);

prisma.$use(async (params, next) => {
  let retries = 4;
  let delay = 300;
  while (retries > 0) {
    try {
      return await next(params);
    } catch (error: any) {
      const msg = error?.message || '';
      const isTransient =
        error?.code === 'P1001' ||
        error?.code === 'P1017' ||
        msg.includes('Server has closed the connection') ||
        msg.includes('Connection closed') ||
        msg.includes('connection reset') ||
        msg.includes("Can't reach database server") ||
        msg.includes('connection pool') ||
        msg.includes('timeout') ||
        msg.includes('ETIMEDOUT') ||
        msg.includes('ECONNRESET');

      if (isTransient && retries > 1) {
        retries--;
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
});

// Deterministic Argon2 hash for password 'E2eTestPass123!'
export const E2E_PASSWORD = 'E2eTestPass123!';
export const E2E_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$weoRM+BbtTlO1R1MaXAWkQ$hlGsgDXBvOQUJd2QGiIV8rAMQcrHvtlsVnQhv8a/mxk';

export const TEST_USERS = {
  DASHBOARD: {
    email: 'e2e-dashboard-candidate@netvision.test',
    username: 'e2e_dashboard_cand',
    password: E2E_PASSWORD,
    fullName: 'E2E Dashboard Candidate',
  },
  COURSE_CLAIM: {
    email: 'e2e-course-candidate@netvision.test',
    username: 'e2e_course_cand',
    password: E2E_PASSWORD,
    fullName: 'E2E Course Candidate',
  },
  CAPSTONE_FAIL: {
    email: 'e2e-capstone-fail-candidate@netvision.test',
    username: 'e2e_capstone_fail_cand',
    password: E2E_PASSWORD,
    fullName: 'E2E Capstone Below-Threshold Candidate',
  },
  CAPSTONE_PASS: {
    email: 'e2e-capstone-pass-candidate@netvision.test',
    username: 'e2e_capstone_pass_cand',
    password: E2E_PASSWORD,
    fullName: 'E2E Capstone Passing Candidate',
  },
  MASTERY_CLAIM: {
    email: 'e2e-mastery-candidate@netvision.test',
    username: 'e2e_mastery_cand',
    password: E2E_PASSWORD,
    fullName: 'E2E Mastery Candidate',
  },
  SECURITY: {
    email: 'e2e-security-candidate@netvision.test',
    username: 'e2e_security_cand',
    password: E2E_PASSWORD,
    fullName: 'E2E Security Auditor Candidate',
  },
};

export async function cleanupE2EData() {
  const emails = Object.values(TEST_USERS).map((u) => u.email);
  const users = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { id: true },
  });
  const userIds = users.map((u) => u.id);

  if (userIds.length > 0) {
    await prisma.certificate.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.examAttempt.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.labAttempt.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.quizAttempt.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.userProgress.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  }
}

export async function seedAllE2EData() {
  await cleanupE2EData();

  // Load flagship courses from DB
  const flagshipCourses = await prisma.course.findMany({
    where: { code: { in: ['NV-C01', 'NV-C02', 'NV-C03', 'NV-C04', 'NV-C05'] } },
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

  const c1Course = flagshipCourses.find((c) => c.code === 'NV-C01');
  const c1Lessons = c1Course ? c1Course.modules.flatMap((m) => m.lessons) : [];
  const c1Quizzes = c1Lessons.flatMap((l) => l.quizzes);
  const c1Labs = c1Lessons.flatMap((l) => l.labs);

  const allLessons = flagshipCourses.flatMap((c) => c.modules.flatMap((m) => m.lessons));
  const allQuizzes = allLessons.flatMap((l) => l.quizzes);
  const allLabs = allLessons.flatMap((l) => l.labs);

  // Helper to create or upsert a user
  async function createUser(userData: { email: string; username: string; fullName: string }) {
    return prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        fullName: userData.fullName,
        passwordHash: E2E_PASSWORD_HASH,
        role: Role.STUDENT,
        isVerified: true,
      },
    });
  }

  // 1. Dashboard User (Clean initial state)
  const dashboardUser = await createUser(TEST_USERS.DASHBOARD);

  // 2. Course Claim Candidate (NV-C01 100% completed, zero claimed certs)
  const courseUser = await createUser(TEST_USERS.COURSE_CLAIM);
  if (c1Lessons.length > 0) {
    await prisma.userProgress.createMany({
      data: c1Lessons.map((lesson) => ({
        userId: courseUser.id,
        lessonId: lesson.id,
        completed: true,
        score: 95,
        started: true,
        viewed: true,
        completedAt: new Date(),
      })),
    });
  }
  if (c1Quizzes.length > 0) {
    await prisma.quizAttempt.createMany({
      data: c1Quizzes.map((quiz) => ({
        userId: courseUser.id,
        quizId: quiz.id,
        score: 95,
        passed: true,
        answersJson: {},
      })),
    });
  }
  if (c1Labs.length > 0) {
    await prisma.labAttempt.createMany({
      data: c1Labs.map((lab) => ({
        userId: courseUser.id,
        labId: lab.id,
        passed: true,
        score: 100,
      })),
    });
  }

  // Helper to fulfill all 5 course prerequisites for Capstone candidates
  async function fulfillAllCoursePrerequisites(userId: string) {
    if (allLessons.length > 0) {
      await prisma.userProgress.createMany({
        data: allLessons.map((lesson) => ({
          userId,
          lessonId: lesson.id,
          completed: true,
          score: 95,
          started: true,
          viewed: true,
          completedAt: new Date(),
        })),
      });
    }
    if (allQuizzes.length > 0) {
      await prisma.quizAttempt.createMany({
        data: allQuizzes.map((quiz) => ({
          userId,
          quizId: quiz.id,
          score: 95,
          passed: true,
          answersJson: {},
        })),
      });
    }
    if (allLabs.length > 0) {
      await prisma.labAttempt.createMany({
        data: allLabs.map((lab) => ({
          userId,
          labId: lab.id,
          passed: true,
          score: 100,
        })),
      });
    }
    const certCodes = ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'];
    await prisma.certificate.createMany({
      data: certCodes.map((code) => ({
        userId,
        certificationCode: code,
        certificationTitle: `Certification ${code}`,
        recipientName: 'E2E Capstone Candidate',
        status: 'ACTIVE',
        credentialId: `${code}-E2E-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        verificationCode: `NV-VERIFY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      })),
    });
  }

  // 3. Capstone Fail Candidate
  const capstoneFailUser = await createUser(TEST_USERS.CAPSTONE_FAIL);
  await fulfillAllCoursePrerequisites(capstoneFailUser.id);

  // 4. Capstone Pass Candidate
  const capstonePassUser = await createUser(TEST_USERS.CAPSTONE_PASS);
  await fulfillAllCoursePrerequisites(capstonePassUser.id);

  // 5. Mastery Claim Candidate (all 5 course certs + passed Master Capstone exam)
  const masteryUser = await createUser(TEST_USERS.MASTERY_CLAIM);
  await fulfillAllCoursePrerequisites(masteryUser.id);
  await prisma.examAttempt.create({
    data: {
      userId: masteryUser.id,
      certificationCode: 'NV-NET-MASTERY',
      type: ExamType.PRACTICAL,
      status: ExamAttemptStatus.PASSED,
      score: 92,
      passed: true,
      attemptNumber: 1,
      startedAt: new Date(Date.now() - 3600000),
      submittedAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000),
    },
  });

  // 6. Security Candidate (Clean user for IDOR testing)
  const securityUser = await createUser(TEST_USERS.SECURITY);

  return {
    dashboardUser,
    courseUser,
    capstoneFailUser,
    capstonePassUser,
    masteryUser,
    securityUser,
  };
}
