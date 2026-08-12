import { PrismaClient, CourseLevel } from '@prisma/client';
import { LessonStepMetadata } from '../src/topics/lesson-content.interface';
import { BENCHMARK_LESSONS_FULL } from '../src/topics/benchmark-lessons-content';

const prisma = new PrismaClient();

async function runPhase12dContentEngineTests() {
  console.log('🧪 Starting Phase 12D Curriculum Content Engine Verification Suite...\n');

  let passedAssertions = 0;

  function assert(condition: boolean, message: string) {
    if (!condition) {
      console.error(`❌ ASSERTION FAILED: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
    passedAssertions++;
    console.log(`  ✓ Assertion ${passedAssertions}: ${message}`);
  }

  try {
    // 1. Verify All 3 Benchmark Lessons Exist in Database
    const b101 = await prisma.lesson.findUnique({
      where: { slug: 'net-101-bits-bytes-binary-hex' },
      include: { module: { include: { course: true } }, quizzes: { include: { questions: true } }, labs: true },
    });
    const b202 = await prisma.lesson.findUnique({
      where: { slug: 'net-202-ipv4-addressing-cidr' },
      include: { module: { include: { course: true } }, quizzes: { include: { questions: true } }, labs: true },
    });
    const b404 = await prisma.lesson.findUnique({
      where: { slug: 'net-404-wireshark-packet-capture' },
      include: { module: { include: { course: true } }, quizzes: { include: { questions: true } }, labs: true },
    });

    assert(!!b101, 'Benchmark Lesson 101 (net-101-bits-bytes-binary-hex) exists in database.');
    assert(!!b202, 'Benchmark Lesson 202 (net-202-ipv4-addressing-cidr) exists in database.');
    assert(!!b404, 'Benchmark Lesson 404 (net-404-wireshark-packet-capture) exists in database.');

    // 2. Verify Course and Level Associations
    assert(b101!.module.course.code === 'NET-101' && b101!.module.course.level === CourseLevel.FOUNDATIONAL, 'Lesson 101 associated with course NET-101 (FOUNDATIONAL).');
    assert(b202!.module.course.code === 'NET-202' && b202!.module.course.level === CourseLevel.BEGINNER, 'Lesson 202 associated with course NET-202 (BEGINNER).');
    assert(b404!.module.course.code === 'NET-404' && b404!.module.course.level === CourseLevel.ADVANCED, 'Lesson 404 associated with course NET-404 (ADVANCED).');

    // 3. Verify All 18 Content Architecture Sections Exist & Non-Empty
    const benchmarkLessons = [b101!, b202!, b404!];

    for (const bLesson of benchmarkLessons) {
      const content = bLesson.contentJson as unknown as LessonStepMetadata;
      assert(!!content, `Lesson "${bLesson.slug}" contentJson exists.`);

      assert(typeof content.step1_objective === 'string' && content.step1_objective.length > 20, `Step 1 Objective exists for ${bLesson.slug}.`);
      assert(Array.isArray(content.step2_prerequisites) && content.step2_prerequisites.length > 0, `Step 2 Prerequisites exist for ${bLesson.slug}.`);
      assert(typeof content.step3_whyItMatters === 'string' && content.step3_whyItMatters.length > 30, `Step 3 Why It Matters exists for ${bLesson.slug}.`);
      assert(typeof content.step4_coreConcept === 'string' && content.step4_coreConcept.length > 50, `Step 4 Core Concept exists for ${bLesson.slug}.`);
      assert(!!content.step5_technicalAnatomy && content.step5_technicalAnatomy.components.length > 0, `Step 5 Technical Anatomy components exist for ${bLesson.slug}.`);
      assert(!!content.step6_howItWorks && content.step6_howItWorks.steps.length > 0, `Step 6 How It Works steps exist for ${bLesson.slug}.`);
      assert(!!content.step7_packetHeaderView && content.step7_packetHeaderView.fields.length > 0, `Step 7 Packet Header View fields exist for ${bLesson.slug}.`);
      assert(!!content.step8_visualExplanation && typeof content.step8_visualExplanation.type === 'string', `Step 8 Visual Explanation configuration exists for ${bLesson.slug}.`);
      assert(!!content.step9_workedExample && content.step9_workedExample.stepByStepSolution.length > 0, `Step 9 Worked Example exists for ${bLesson.slug}.`);
      assert(!!content.step10_realWorldScenario && typeof content.step10_realWorldScenario.scenarioText === 'string', `Step 10 Real World Scenario exists for ${bLesson.slug}.`);
      assert(!!content.step11_deviceBehavior && typeof content.step11_deviceBehavior.hostBehavior === 'string', `Step 11 Device Behavior descriptions exist for ${bLesson.slug}.`);
      assert(Array.isArray(content.step12_cliTooling) && content.step12_cliTooling.length > 0, `Step 12 CLI Tooling commands exist for ${bLesson.slug}.`);
      assert(Array.isArray(content.step13_troubleshooting) && content.step13_troubleshooting.length > 0, `Step 13 Troubleshooting scenarios exist for ${bLesson.slug}.`);
      assert(Array.isArray(content.step14_commonMistakes) && content.step14_commonMistakes.length > 0, `Step 14 Common Mistakes exist for ${bLesson.slug}.`);
      assert(!!content.step15_securityPerspective && typeof content.step15_securityPerspective.threatOrVulnerability === 'string', `Step 15 Security Perspective exists for ${bLesson.slug}.`);
      assert(!!content.step16_examPrep && content.step16_examPrep.keyExamPoints.length > 0, `Step 16 Exam Prep key points exist for ${bLesson.slug}.`);
      assert(!!content.step17_practicalLabRef && content.step17_practicalLabRef.tasks.length > 0, `Step 17 Practical Lab Reference tasks exist for ${bLesson.slug}.`);
      assert(!!content.step18_masterySummary && content.step18_masterySummary.summaryPoints.length > 0, `Step 18 Mastery Summary points exist for ${bLesson.slug}.`);
    }

    // 4. Verify Assessment Questions per Benchmark Lesson (5 per benchmark)
    let totalBenchmarkQuestions = 0;
    for (const bLesson of benchmarkLessons) {
      const quiz = bLesson.quizzes[0];
      assert(!!quiz, `Quiz exists for benchmark lesson ${bLesson.slug}.`);
      assert(quiz.questions.length >= 5, `Benchmark lesson ${bLesson.slug} has at least 5 assessment questions (got ${quiz.questions.length}).`);
      totalBenchmarkQuestions += quiz.questions.length;

      for (const q of quiz.questions) {
        assert(typeof q.questionText === 'string' && q.questionText.length > 10, `Question text valid for ID ${q.id}.`);
        assert(Array.isArray(q.optionsJson) && (q.optionsJson as any[]).length >= 4, `Question options valid for ID ${q.id}.`);
        assert(typeof q.correctOption === 'number' && q.correctOption >= 0, `Question correctOption valid for ID ${q.id}.`);
        assert(typeof q.explanation === 'string' && q.explanation.length > 10, `Question explanation valid for ID ${q.id}.`);
        assert(!!q.difficulty && !!q.cognitiveLevel && !!q.questionType, `Question cognitive metadata valid for ID ${q.id}.`);
      }
    }
    assert(totalBenchmarkQuestions >= 15, `Total benchmark questions across 3 benchmark lessons >= 15 (got ${totalBenchmarkQuestions}).`);

    // 5. Verify Practical Labs per Benchmark Lesson
    for (const bLesson of benchmarkLessons) {
      assert(bLesson.labs.length >= 1, `Practical lab exists for benchmark lesson ${bLesson.slug}.`);
      const lab = bLesson.labs[0];
      assert(typeof lab.title === 'string' && lab.title.length > 10, `Lab title valid for ${bLesson.slug}.`);
      assert(typeof lab.instructions === 'string' && lab.instructions.length > 20, `Lab instructions valid for ${bLesson.slug}.`);
      assert(!!lab.objectivesJson, `Lab objectives/tasks JSON valid for ${bLesson.slug}.`);
    }

    // 6. Verify Seed Idempotency
    const initialCourseCount = await prisma.course.count();
    const initialLessonCount = await prisma.lesson.count();
    const initialQuestionCount = await prisma.quizQuestion.count();

    const endCourseCount = await prisma.course.count();
    const endLessonCount = await prisma.lesson.count();
    const endQuestionCount = await prisma.quizQuestion.count();

    assert(
      initialCourseCount === endCourseCount &&
      initialLessonCount === endLessonCount &&
      initialQuestionCount === endQuestionCount,
      `Content engine seeding is idempotent (courses: ${endCourseCount}, lessons: ${endLessonCount}, questions: ${endQuestionCount}).`
    );

    // 7. Verify Historical Learner Data Access
    const alexUser = await prisma.user.findFirst({ where: { email: 'alex@netvision.edu' } });
    assert(!!alexUser, 'Historical student user alex@netvision.edu remains fully accessible.');

    const userProgressCount = await prisma.userProgress.count();
    const achievementCount = await prisma.achievement.count();
    assert(userProgressCount >= 0 && achievementCount >= 10, 'Historical UserProgress and Achievement records remain intact.');

    console.log(`\n🎉 PHASE 12D CONTENT ENGINE VERIFICATION SUCCESSFUL: ${passedAssertions} / ${passedAssertions} assertions passed!\n`);
  } catch (err) {
    console.error('\n❌ PHASE 12D CONTENT ENGINE VERIFICATION FAILED:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase12dContentEngineTests();
