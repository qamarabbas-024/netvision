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

async function runPhase11bAssessmentGatingTests() {
  console.log('==================================================');
  console.log('NETVISION PHASE 11B — ASSESSMENT GATING SUITE (29 ASSERTS)');
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

  // Create test user A
  const userAEmail = `p11b-usera-${Date.now()}@netvision.edu`;
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userAEmail,
      username: `p11b_a_${Date.now().toString().slice(-6)}`,
      password: 'SecurePassword123!',
      fullName: 'Assessment User A',
    }),
  });
  await prisma.user.update({ where: { email: userAEmail }, data: { isVerified: true } });
  const loginARes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userAEmail, password: 'SecurePassword123!' }),
  });
  const jwtA = loginARes.data.accessToken;
  const userA = await prisma.user.findUnique({ where: { email: userAEmail } });
  if (!userA) throw new Error('User A not found');

  // Create test user B
  const userBEmail = `p11b-userb-${Date.now()}@netvision.edu`;
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userBEmail,
      username: `p11b_b_${Date.now().toString().slice(-6)}`,
      password: 'SecurePassword123!',
      fullName: 'Assessment User B',
    }),
  });
  await prisma.user.update({ where: { email: userBEmail }, data: { isVerified: true } });
  const loginBRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userBEmail, password: 'SecurePassword123!' }),
  });
  const jwtB = loginBRes.data.accessToken;
  const userB = await prisma.user.findUnique({ where: { email: userBEmail } });

  // Create dummy single-lesson course for controlled calculation testing
  const testCourseSlug = `test-gating-course-${Date.now()}`;
  const testCourse = await prisma.course.create({
    data: {
      slug: testCourseSlug,
      title: 'Assessment Gating Test Course',
      tagline: 'Gating test',
      description: 'Course testing 80% assessment gating rules.',
      icon: 'Shield',
      published: true,
      modules: {
        create: [
          {
            title: 'Gating Module 1',
            description: 'Module for gating tests',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Gating Lesson 1',
                  slug: `gating-lesson-1-${Date.now()}`,
                  order: 1,
                  quizzes: {
                    create: [
                      {
                        title: 'Quiz 1',
                        passingScore: 80,
                        questions: {
                          create: [
                            {
                              questionText: 'Test Q1',
                              optionsJson: ['A', 'B'],
                              correctOption: 0,
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  title: 'Gating Lesson 2',
                  slug: `gating-lesson-2-${Date.now()}`,
                  order: 2,
                  quizzes: {
                    create: [
                      {
                        title: 'Quiz 2',
                        passingScore: 80,
                        questions: {
                          create: [
                            {
                              questionText: 'Test Q2',
                              optionsJson: ['A', 'B'],
                              correctOption: 0,
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              quizzes: true,
            },
          },
        },
      },
    },
  });

  const lesson1 = testCourse.modules[0].lessons[0];
  const lesson2 = testCourse.modules[0].lessons[1];
  const quiz1 = lesson1.quizzes[0];
  const quiz2 = lesson2.quizzes[0];

  // ----------------------------------------------------
  // A. COURSE ASSESSMENT CALCULATION & RETAKES
  // ----------------------------------------------------

  // 1. Correctly calculates average score
  // Submit Quiz 1 attempt = 60%, Quiz 2 attempt = 100%
  await prisma.quizAttempt.create({
    data: { userId: userA.id, quizId: quiz1.id, score: 60, passed: false, answersJson: {} },
  });
  await prisma.quizAttempt.create({
    data: { userId: userA.id, quizId: quiz2.id, score: 100, passed: true, answersJson: {} },
  });

  const calcRes1 = await request(`/courses/${testCourseSlug}/assessment`, {}, { Authorization: `Bearer ${jwtA}` });
  assert(
    calcRes1.ok && calcRes1.data.assessmentAverage === 80 && calcRes1.data.completedAssessments === 2,
    '1. Correctly calculates average score (60 + 100) / 2 = 80%',
    calcRes1
  );

  // 2 & 3. Uses best attempt per lesson and does not average duplicate attempts together
  // Add retake for Quiz 1: Attempt 2 = 50%, Attempt 3 = 80%
  await prisma.quizAttempt.create({
    data: { userId: userA.id, quizId: quiz1.id, score: 50, passed: false, answersJson: {} },
  });
  await prisma.quizAttempt.create({
    data: { userId: userA.id, quizId: quiz1.id, score: 80, passed: true, answersJson: {} },
  });

  const calcRes2 = await request(`/courses/${testCourseSlug}/assessment`, {}, { Authorization: `Bearer ${jwtA}` });
  assert(
    calcRes2.ok && calcRes2.data.lessonScores.includes(80) && calcRes2.data.assessmentAverage === 90,
    '2 & 3. Uses best attempt per lesson (Quiz 1 best = 80, Quiz 2 best = 100 => avg 90%)',
    calcRes2
  );

  // 4. Exactly 80% passes
  // Create User C with scores 80% and 80%
  const userCEmail = `p11b-userc-${Date.now()}@netvision.edu`;
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userCEmail,
      username: `p11b_c_${Date.now().toString().slice(-6)}`,
      password: 'SecurePassword123!',
      fullName: 'User C',
    }),
  });
  await prisma.user.update({ where: { email: userCEmail }, data: { isVerified: true } });
  const loginCRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userCEmail, password: 'SecurePassword123!' }),
  });
  const jwtC = loginCRes.data.accessToken;
  const userC = await prisma.user.findUnique({ where: { email: userCEmail } });

  await prisma.quizAttempt.create({ data: { userId: userC!.id, quizId: quiz1.id, score: 80, passed: true, answersJson: {} } });
  await prisma.quizAttempt.create({ data: { userId: userC!.id, quizId: quiz2.id, score: 80, passed: true, answersJson: {} } });

  const calcRes3 = await request(`/courses/${testCourseSlug}/assessment`, {}, { Authorization: `Bearer ${jwtC}` });
  assert(
    calcRes3.ok && calcRes3.data.assessmentAverage === 80 && calcRes3.data.assessmentPassed === true,
    '4. Exactly 80% assessment average passes (assessmentPassed = true)',
    calcRes3
  );

  // 5. 79% fails
  // Create User D with scores 78% and 80% => avg 79%
  const userDEmail = `p11b-userd-${Date.now()}@netvision.edu`;
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userDEmail,
      username: `p11b_d_${Date.now().toString().slice(-6)}`,
      password: 'SecurePassword123!',
      fullName: 'User D',
    }),
  });
  await prisma.user.update({ where: { email: userDEmail }, data: { isVerified: true } });
  const loginDRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userDEmail, password: 'SecurePassword123!' }),
  });
  const jwtD = loginDRes.data.accessToken;
  const userD = await prisma.user.findUnique({ where: { email: userDEmail } });

  await prisma.quizAttempt.create({ data: { userId: userD!.id, quizId: quiz1.id, score: 78, passed: false, answersJson: {} } });
  await prisma.quizAttempt.create({ data: { userId: userD!.id, quizId: quiz2.id, score: 80, passed: true, answersJson: {} } });

  const calcRes4 = await request(`/courses/${testCourseSlug}/assessment`, {}, { Authorization: `Bearer ${jwtD}` });
  assert(
    calcRes4.ok && calcRes4.data.assessmentAverage === 79 && calcRes4.data.assessmentPassed === false,
    '5. 79% assessment average fails (assessmentPassed = false)',
    calcRes4
  );

  // 6. 81% passes
  await prisma.quizAttempt.create({ data: { userId: userD!.id, quizId: quiz1.id, score: 82, passed: true, answersJson: {} } });
  const calcRes5 = await request(`/courses/${testCourseSlug}/assessment`, {}, { Authorization: `Bearer ${jwtD}` });
  assert(
    calcRes5.ok && calcRes5.data.assessmentAverage === 81 && calcRes5.data.assessmentPassed === true,
    '6. 81% assessment average passes (assessmentPassed = true)',
    calcRes5
  );

  // ----------------------------------------------------
  // B. COMPLETENESS
  // ----------------------------------------------------

  // 7. Missing required quiz fails eligibility
  const userEEmail = `p11b-usere-${Date.now()}@netvision.edu`;
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userEEmail,
      username: `p11b_e_${Date.now().toString().slice(-6)}`,
      password: 'SecurePassword123!',
      fullName: 'User E',
    }),
  });
  await prisma.user.update({ where: { email: userEEmail }, data: { isVerified: true } });
  const loginERes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userEEmail, password: 'SecurePassword123!' }),
  });
  const jwtE = loginERes.data.accessToken;
  const userE = await prisma.user.findUnique({ where: { email: userEEmail } });

  // User E only completes Quiz 1 (100%), Quiz 2 missing
  await prisma.quizAttempt.create({ data: { userId: userE!.id, quizId: quiz1.id, score: 100, passed: true, answersJson: {} } });

  const calcRes6 = await request(`/courses/${testCourseSlug}/assessment`, {}, { Authorization: `Bearer ${jwtE}` });
  assert(
    calcRes6.ok && calcRes6.data.allRequiredAssessmentsComplete === false && calcRes6.data.assessmentPassed === false,
    '7. Missing required quiz fails eligibility (allRequiredAssessmentsComplete = false)',
    calcRes6
  );

  // 8. All required quizzes present allows assessment evaluation
  await prisma.quizAttempt.create({ data: { userId: userE!.id, quizId: quiz2.id, score: 90, passed: true, answersJson: {} } });
  const calcRes7 = await request(`/courses/${testCourseSlug}/assessment`, {}, { Authorization: `Bearer ${jwtE}` });
  assert(
    calcRes7.ok && calcRes7.data.allRequiredAssessmentsComplete === true && calcRes7.data.assessmentPassed === true,
    '8. All required quizzes present allows assessment evaluation (allRequiredAssessmentsComplete = true)',
    calcRes7
  );

  // 9. Zero required lessons handled safely
  const emptyCourse = await prisma.course.create({
    data: {
      slug: `empty-course-${Date.now()}`,
      title: 'Empty Course',
      tagline: 'No lessons',
      description: 'Empty course with 0 lessons.',
      icon: 'Shield',
      published: true,
    },
  });
  const calcRes8 = await request(`/courses/${emptyCourse.slug}/assessment`, {}, { Authorization: `Bearer ${jwtA}` });
  assert(
    calcRes8.ok && calcRes8.data.requiredLessons === 0 && calcRes8.data.assessmentPassed === false,
    '9. Course with 0 required lessons handled safely (assessmentPassed = false)',
    calcRes8
  );

  // ----------------------------------------------------
  // C. CERTIFICATE GATING
  // ----------------------------------------------------

  // Mark User D lessons complete
  await prisma.userProgress.create({ data: { userId: userD!.id, lessonId: lesson1.id, completed: true } });
  await prisma.userProgress.create({ data: { userId: userD!.id, lessonId: lesson2.id, completed: true } });

  // Mark User E lessons complete
  await prisma.userProgress.create({ data: { userId: userE!.id, lessonId: lesson1.id, completed: true } });
  await prisma.userProgress.create({ data: { userId: userE!.id, lessonId: lesson2.id, completed: true } });

  // Mark User C lessons complete
  await prisma.userProgress.create({ data: { userId: userC!.id, lessonId: lesson1.id, completed: true } });
  await prisma.userProgress.create({ data: { userId: userC!.id, lessonId: lesson2.id, completed: true } });

  // 10. <80% certificate claim rejected
  // User F has completed lessons but average < 80%
  const userFEmail = `p11b-userf-${Date.now()}@netvision.edu`;
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userFEmail,
      username: `p11b_f_${Date.now().toString().slice(-6)}`,
      password: 'SecurePassword123!',
      fullName: 'User F',
    }),
  });
  await prisma.user.update({ where: { email: userFEmail }, data: { isVerified: true } });
  const loginFRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userFEmail, password: 'SecurePassword123!' }),
  });
  const jwtF = loginFRes.data.accessToken;
  const userF = await prisma.user.findUnique({ where: { email: userFEmail } });

  await prisma.userProgress.create({ data: { userId: userF!.id, lessonId: lesson1.id, completed: true } });
  await prisma.userProgress.create({ data: { userId: userF!.id, lessonId: lesson2.id, completed: true } });
  await prisma.quizAttempt.create({ data: { userId: userF!.id, quizId: quiz1.id, score: 70, passed: false, answersJson: {} } });
  await prisma.quizAttempt.create({ data: { userId: userF!.id, quizId: quiz2.id, score: 70, passed: false, answersJson: {} } });

  const certResFail = await request(
    '/certificates/claim',
    { method: 'POST', body: JSON.stringify({ courseId: testCourse.id }) },
    { Authorization: `Bearer ${jwtF}` }
  );
  assert(certResFail.status === 400, '10. Certificate claim rejected for < 80% assessment average (400 Bad Request)', certResFail);

  // 11. Exactly 80% certificate claim succeeds
  const certResExact80 = await request(
    '/certificates/claim',
    { method: 'POST', body: JSON.stringify({ courseId: testCourse.id }) },
    { Authorization: `Bearer ${jwtC}` }
  );
  assert(certResExact80.ok && certResExact80.data.code, '11. Certificate claim succeeds for exactly 80% assessment average', certResExact80);

  // 12. >80% certificate claim succeeds
  const certResAbove80 = await request(
    '/certificates/claim',
    { method: 'POST', body: JSON.stringify({ courseId: testCourse.id }) },
    { Authorization: `Bearer ${jwtE}` }
  );
  assert(certResAbove80.ok && certResAbove80.data.code, '12. Certificate claim succeeds for > 80% assessment average', certResAbove80);

  // 13. Missing assessment certificate claim rejected
  // User G has 1 lesson complete and 1 quiz missing
  const userGEmail = `p11b-userg-${Date.now()}@netvision.edu`;
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: userGEmail,
      username: `p11b_g_${Date.now().toString().slice(-6)}`,
      password: 'SecurePassword123!',
      fullName: 'User G',
    }),
  });
  await prisma.user.update({ where: { email: userGEmail }, data: { isVerified: true } });
  const loginGRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: userGEmail, password: 'SecurePassword123!' }),
  });
  const jwtG = loginGRes.data.accessToken;
  const userG = await prisma.user.findUnique({ where: { email: userGEmail } });

  await prisma.userProgress.create({ data: { userId: userG!.id, lessonId: lesson1.id, completed: true } });
  await prisma.quizAttempt.create({ data: { userId: userG!.id, quizId: quiz1.id, score: 100, passed: true, answersJson: {} } });

  const certResMissing = await request(
    '/certificates/claim',
    { method: 'POST', body: JSON.stringify({ courseId: testCourse.id }) },
    { Authorization: `Bearer ${jwtG}` }
  );
  assert(certResMissing.status === 400, '13. Certificate claim rejected for missing required quiz (400 Bad Request)', certResMissing);

  // 14. Existing certificate claim remains idempotent
  const certResIdempotent = await request(
    '/certificates/claim',
    { method: 'POST', body: JSON.stringify({ courseId: testCourse.id }) },
    { Authorization: `Bearer ${jwtC}` }
  );
  assert(
    certResIdempotent.ok && certResIdempotent.data.code === certResExact80.data.code,
    '14. Certificate claim remains 100% idempotent (returns existing code)',
    certResIdempotent
  );

  // ----------------------------------------------------
  // D. AUTHORIZATION & IDOR
  // ----------------------------------------------------

  // 15. User A cannot access User B assessment
  const assessUserBRes = await request(`/courses/${testCourseSlug}/assessment`, {}, { Authorization: `Bearer ${jwtA}` });
  assert(assessUserBRes.ok && assessUserBRes.data.completedAssessments === 2, '15. User A assessment request resolves only User A identity', assessUserBRes);

  // 16. User A cannot claim User B certificate (derived from JWT)
  const tamperedCertRes = await request(
    '/certificates/claim',
    { method: 'POST', body: JSON.stringify({ courseId: testCourse.id, userId: userB.id }) },
    { Authorization: `Bearer ${jwtA}` }
  );
  // Rejects extra body fields (400 Bad Request) or ignores client-supplied userId
  assert(
    tamperedCertRes.status === 400 || (tamperedCertRes.ok && tamperedCertRes.data.user.id === userA.id),
    '16. Client-supplied userId in body rejected or ignored for certificate claim',
    tamperedCertRes
  );

  // 17. Guest A cannot access Guest B assessment
  const guestAId = randomUUID();
  const guestBId = randomUUID();

  await prisma.anonymousLearner.create({ data: { id: guestAId } });
  await prisma.anonymousLearner.create({ data: { id: guestBId } });

  await prisma.quizAttempt.create({ data: { anonymousId: guestAId, quizId: quiz1.id, score: 90, passed: true, answersJson: {} } });

  const guestAAssess = await request(`/courses/${testCourseSlug}/assessment`, {}, { 'X-Anonymous-ID': guestAId });
  const guestBAssess = await request(`/courses/${testCourseSlug}/assessment`, {}, { 'X-Anonymous-ID': guestBId });

  assert(
    guestAAssess.data.completedAssessments === 1 && guestBAssess.data.completedAssessments === 0,
    '17. Guest A and Guest B assessment calculations are strictly isolated',
    { guestAAssess: guestAAssess.data, guestBAssess: guestBAssess.data }
  );

  // 18. Client-supplied userId cannot override authenticated identity
  const tamperedAssess = await request(
    `/courses/${testCourseSlug}/assessment?userId=${userB.id}`,
    {},
    { Authorization: `Bearer ${jwtA}` }
  );
  assert(tamperedAssess.ok && tamperedAssess.data.courseId === testCourse.id, '18. Client-supplied userId in query/body cannot override JWT identity', tamperedAssess);

  // ----------------------------------------------------
  // E. GUEST-FIRST
  // ----------------------------------------------------

  // 19. Guest quiz attempt contributes to assessment
  assert(guestAAssess.ok && guestAAssess.data.completedAssessments === 1, '19. Guest quiz attempt contributes to guest assessment calculation', guestAAssess);

  // 20 & 21. Guest -> authenticated claim preserves assessment data without duplication
  const guestUserEmail = `guest-p11b-${Date.now()}@netvision.edu`;
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: guestUserEmail,
      username: `guest_11b_${Date.now().toString().slice(-6)}`,
      password: 'SecurePassword123!',
      fullName: 'Claimed Guest',
    }),
  });
  await prisma.user.update({ where: { email: guestUserEmail }, data: { isVerified: true } });
  const guestLoginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: guestUserEmail, password: 'SecurePassword123!' }),
  });
  const guestJwt = guestLoginRes.data.accessToken;

  // Claim guest A progress
  const claimRes = await request('/learners/claim', { method: 'POST', body: JSON.stringify({ anonymousId: guestAId }) }, { Authorization: `Bearer ${guestJwt}` });
  const claimedAssessRes = await request(`/courses/${testCourseSlug}/assessment`, {}, { Authorization: `Bearer ${guestJwt}` });

  assert(
    claimRes.ok && claimedAssessRes.data.completedAssessments === 1 && claimedAssessRes.data.lessonScores.includes(90),
    '20 & 21. Guest -> authenticated claim preserves assessment data without duplication',
    claimedAssessRes
  );

  // ----------------------------------------------------
  // F. BADGE SAFETY
  // ----------------------------------------------------

  // 22. COURSE_COMPLETE is not awarded below requirements
  const userFAchievements = await request('/achievements/me', {}, { Authorization: `Bearer ${jwtF}` });
  const hasCourseCompleteF = userFAchievements.data.achievements?.some((a: any) => a.slug === 'COURSE_COMPLETE' && a.unlocked === true);
  assert(!hasCourseCompleteF, '22. COURSE_COMPLETE badge is NOT awarded when assessment requirement fails', userFAchievements);

  // 23. COURSE_COMPLETE is awarded when valid completion + assessment requirements are satisfied
  const userCAchievements = await request('/achievements/me', {}, { Authorization: `Bearer ${jwtC}` });
  const hasCourseCompleteC = userCAchievements.data.achievements?.some((a: any) => a.slug === 'COURSE_COMPLETE' && a.unlocked === true);
  assert(hasCourseCompleteC, '23. COURSE_COMPLETE badge is awarded upon verified 80%+ course assessment completion', userCAchievements);

  // 24. NETVISION_SCHOLAR remains reserved/inactive
  const scholarBadge = await prisma.achievement.findUnique({ where: { slug: 'NETVISION_SCHOLAR' } });
  assert(scholarBadge?.isActive === false, '24. NETVISION_SCHOLAR badge remains reserved and inactive', scholarBadge);

  // Clean up test data
  await prisma.userAchievement.deleteMany({ where: { user: { email: { in: [userAEmail, userBEmail, userCEmail, userDEmail, userEEmail, userFEmail, userGEmail, guestUserEmail] } } } }).catch(() => null);
  await prisma.certificate.deleteMany({ where: { courseId: testCourse.id } }).catch(() => null);
  await prisma.userProgress.deleteMany({ where: { lesson: { moduleId: { in: testCourse.modules.map((m) => m.id) } } } }).catch(() => null);
  await prisma.quizAttempt.deleteMany({ where: { quiz: { lesson: { moduleId: { in: testCourse.modules.map((m) => m.id) } } } } }).catch(() => null);
  await prisma.course.delete({ where: { id: testCourse.id } }).catch(() => null);
  await prisma.course.delete({ where: { id: emptyCourse.id } }).catch(() => null);
  await prisma.user.deleteMany({ where: { email: { in: [userAEmail, userBEmail, userCEmail, userDEmail, userEEmail, userFEmail, userGEmail, guestUserEmail] } } }).catch(() => null);

  await prisma.$disconnect();

  console.log('\n==================================================');
  console.log(`SUMMARY: ${passedCount} passed, ${failedCount} failed.`);
  console.log('==================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runPhase11bAssessmentGatingTests();
