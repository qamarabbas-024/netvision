import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:4000/api/v1';

async function request(endpoint: string, options: RequestInit = {}, headers: Record<string, string> = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data, ok: res.ok };
}

async function runPhase11cDashboardTests() {
  console.log('==================================================');
  console.log('NETVISION PHASE 11C — STUDENT DASHBOARD CORRECTION SUITE');
  console.log('==================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, detail?: any) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` — ${JSON.stringify(detail)}` : ''}`);
      failedCount++;
    }
  }

  // Register User A
  const userAEmail = `p11c-usera-${Date.now()}@netvision.edu`;
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userAEmail,
      username: `p11c_a_${Date.now().toString().slice(-6)}`,
      password: 'SecurePassword123!',
      fullName: 'Dashboard User A',
    }),
  });
  await prisma.user.update({ where: { email: userAEmail }, data: { isVerified: true } });
  const loginARes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userAEmail, password: 'SecurePassword123!' }),
  });
  const jwtA = loginARes.data.accessToken;
  const userA = await prisma.user.findUnique({ where: { email: userAEmail } });
  if (!userA) throw new Error('User A not created');

  // Register User B
  const userBEmail = `p11c-userb-${Date.now()}@netvision.edu`;
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userBEmail,
      username: `p11c_b_${Date.now().toString().slice(-6)}`,
      password: 'SecurePassword123!',
      fullName: 'Dashboard User B',
    }),
  });
  await prisma.user.update({ where: { email: userBEmail }, data: { isVerified: true } });
  const loginBRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userBEmail, password: 'SecurePassword123!' }),
  });
  const jwtB = loginBRes.data.accessToken;
  const userB = await prisma.user.findUnique({ where: { email: userBEmail } });
  if (!userB) throw new Error('User B not created');

  // 1. Invalid JWT returns 401 Unauthorized
  const invalidJwtRes = await request('/progress/dashboard', {}, { Authorization: 'Bearer invalid.jwt.token' });
  assert(invalidJwtRes.status === 401, '1. Invalid JWT request returns 401 Unauthorized', invalidJwtRes);

  // 2. Fresh user receives safe zero/empty dashboard values (XP === 0, no unhandled nulls or NaN)
  const freshDashA = await request('/progress/dashboard', {}, { Authorization: `Bearer ${jwtA}` });
  assert(
    freshDashA.ok &&
      freshDashA.data.completedLessons === 0 &&
      freshDashA.data.studyStreak === 0 &&
      freshDashA.data.totalXp === 0 &&
      freshDashA.data.simulationsRun === 0 &&
      freshDashA.data.quizAverageScore === 0 &&
      freshDashA.data.certificatesEarned === 0,
    '2. Fresh user receives totalXp === 0 and safe zero/empty values (XP Audit Rule)',
    freshDashA
  );

  // Seed User A activity:
  // - 2 completed lessons
  // - 2 quiz attempts (score 80, 100)
  // - 1 lab attempt (passed)
  // - 1 sandbox session
  // - 1 certificate
  const lessons = await prisma.lesson.findMany({ take: 3, include: { quizzes: true } });
  if (lessons.length < 2) throw new Error('Not enough lessons seeded');

  await prisma.userProgress.create({
    data: { userId: userA.id, lessonId: lessons[0].id, completed: true, completedAt: new Date() },
  });
  await prisma.userProgress.create({
    data: { userId: userA.id, lessonId: lessons[1].id, completed: true, completedAt: new Date() },
  });

  if (lessons[0].quizzes.length > 0) {
    await prisma.quizAttempt.create({
      data: { userId: userA.id, quizId: lessons[0].quizzes[0].id, score: 80, passed: true, answersJson: {} },
    });
  }
  if (lessons[1].quizzes.length > 0) {
    await prisma.quizAttempt.create({
      data: { userId: userA.id, quizId: lessons[1].quizzes[0].id, score: 100, passed: true, answersJson: {} },
    });
  }

  const lab = await prisma.lessonLab.findFirst();
  if (lab) {
    await prisma.labAttempt.create({
      data: { userId: userA.id, labId: lab.id, score: 100, passed: true, status: 'COMPLETED' },
    });
  }

  await prisma.sandboxSession.create({
    data: { userId: userA.id, status: 'STOPPED', expiresAt: new Date(Date.now() + 3600000) },
  });

  const firstCourse = await prisma.course.findFirst();
  if (firstCourse) {
    await prisma.certificate.create({
      data: { userId: userA.id, courseId: firstCourse.id },
    });
  }

  // Award 1 achievement badge (FIRST_STEP, points = 50) to User A
  const firstStepAch = await prisma.achievement.findUnique({ where: { slug: 'FIRST_STEP' } });
  if (firstStepAch) {
    await prisma.userAchievement.create({
      data: { userId: userA.id, achievementId: firstStepAch.id },
    });
  }

  // 3. Authenticated user receives own metrics
  const dashA = await request('/progress/dashboard', {}, { Authorization: `Bearer ${jwtA}` });
  assert(dashA.ok && dashA.data.completedLessons === 2, '3. Authenticated user receives their own dashboard metrics', dashA);

  // 4. Identity Security: client-supplied userId query/body/header cannot override JWT identity
  const tamperedDash = await request(`/progress/dashboard?userId=${userB.id}`, {}, { Authorization: `Bearer ${jwtA}` });
  assert(tamperedDash.ok && tamperedDash.data.completedLessons === 2, '4. Client-supplied userId query cannot override JWT identity', tamperedDash);

  // 5. XP Audit Rule: totalXp is derived strictly from authoritative earned achievement points (50), without invented 10/20/30 multipliers
  const expectedAuthoritativeXp = firstStepAch ? firstStepAch.points : 50;
  assert(dashA.data.totalXp === expectedAuthoritativeXp, `5. XP equals exact authoritative earned achievement points (${expectedAuthoritativeXp}), without invented multipliers`, dashA);

  // 6. Simulation Semantics: simulationsRun strictly counts SandboxSession runs (1) and does not double-count lab attempts
  assert(dashA.data.simulationsRun === 1, '6. simulationsRun strictly counts SandboxSession runs (1) without adding/double-counting lab attempts', dashA);

  // 7. Completed lessons count is accurate
  assert(dashA.data.completedLessons === 2, '7. Completed lessons count is accurate (2 completed)', dashA);

  // 8. Overall progress percentage is accurate
  const expectedPercent = Math.round((2 / dashA.data.totalLessons) * 100);
  assert(dashA.data.overallProgressPercent === expectedPercent, '8. Overall progress percentage is accurate', dashA);

  // 9. Study streak is calculated from real activity
  assert(dashA.data.studyStreak >= 1, '9. Study streak is calculated from real activity dates (studyStreak >= 1)', dashA);

  // 10. Quiz average is calculated correctly using best attempts
  assert(dashA.data.quizAverageScore === 90, '10. Quiz average is calculated correctly (80 + 100) / 2 = 90%', dashA);

  // 11. Certificate count is calculated correctly
  assert(dashA.data.certificatesEarned === 1, '11. Certificate count is calculated correctly (1 earned certificate)', dashA);

  // 12. Badge count is calculated correctly
  assert(dashA.data.badges.earned === 1 && dashA.data.badges.total >= 4, '12. Badge count is calculated correctly (1 earned badge)', dashA);

  // 13. Inactive/reserved badges are not returned in available active catalog
  const inactiveInBadges = dashA.data.badges.items.some((item: any) => item.isActive === false);
  assert(!inactiveInBadges, '13. Inactive/reserved badges are not returned in available active catalog', dashA);

  // 14. Phase 11B course completion/gating metrics are integrated
  assert(typeof dashA.data.completedCoursesCount === 'number', '14. Phase 11B course completion/gating metrics are integrated', dashA);

  // 15. Guest header X-Anonymous-ID cannot override JWT identity when authenticated
  const guestOverrideDash = await request('/progress/dashboard', {}, { Authorization: `Bearer ${jwtA}`, 'X-Anonymous-ID': randomUUID() });
  assert(guestOverrideDash.ok && guestOverrideDash.data.completedLessons === 2, '15. Guest header X-Anonymous-ID cannot override JWT identity when authenticated', guestOverrideDash);

  // 16. Guest metrics & claim behavior remains intact
  const guestId = randomUUID();
  await prisma.anonymousLearner.create({ data: { id: guestId } });
  await prisma.userProgress.create({
    data: { anonymousId: guestId, lessonId: lessons[2].id, completed: true, completedAt: new Date() },
  });

  const guestDash = await request('/progress/dashboard', {}, { 'X-Anonymous-ID': guestId });
  assert(guestDash.ok && guestDash.data.completedLessons === 1, '16. Guest user receives guest-isolated dashboard metrics', guestDash);

  const claimRes = await request('/learners/claim', { method: 'POST', body: JSON.stringify({ anonymousId: guestId }) }, { Authorization: `Bearer ${jwtA}` });
  const postClaimDash = await request('/progress/dashboard', {}, { Authorization: `Bearer ${jwtA}` });
  assert(claimRes.ok && postClaimDash.data.completedLessons === 3, '16b. Guest progress claim correctly merges metrics into authenticated account (2 + 1 = 3)', postClaimDash);

  // Clean up test data
  await prisma.certificate.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } }).catch(() => null);
  await prisma.userAchievement.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } }).catch(() => null);
  await prisma.userProgress.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } }).catch(() => null);
  await prisma.quizAttempt.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } }).catch(() => null);
  await prisma.labAttempt.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } }).catch(() => null);
  await prisma.sandboxSession.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } }).catch(() => null);
  await prisma.user.deleteMany({ where: { id: { in: [userA.id, userB.id] } } }).catch(() => null);

  await prisma.$disconnect();

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedCount} passed, ${failedCount} failed.`);
  console.log('==================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runPhase11cDashboardTests();
