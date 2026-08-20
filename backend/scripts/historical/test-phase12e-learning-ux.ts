import { PrismaClient, CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function runPhase12eLearningUxTests() {
  console.log('🧪 Starting Phase 12E Learning Experience & Course UX Verification Suite...\n');

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
    // 1. Verify Course Catalog Level Tiers (Level 0 Foundations -> Level 3 Advanced)
    const foundationalCourses = await prisma.course.findMany({
      where: { level: CourseLevel.FOUNDATIONAL },
    });
    const beginnerCourses = await prisma.course.findMany({
      where: { level: CourseLevel.BEGINNER },
    });
    const intermediateCourses = await prisma.course.findMany({
      where: { level: CourseLevel.INTERMEDIATE },
    });
    const advancedCourses = await prisma.course.findMany({
      where: { level: CourseLevel.ADVANCED },
    });

    assert(foundationalCourses.length > 0, `Level 0 Foundational courses exist (${foundationalCourses.length} found).`);
    assert(beginnerCourses.length > 0, `Level 1 Beginner courses exist (${beginnerCourses.length} found).`);
    assert(intermediateCourses.length > 0, `Level 2 Intermediate courses exist (${intermediateCourses.length} found).`);
    assert(advancedCourses.length > 0, `Level 3 Advanced courses exist (${advancedCourses.length} found).`);

    // 2. Verify Course Detail & Syllabus Structure Data Contract
    const targetSlug = foundationalCourses[0].slug;
    const course = await prisma.course.findUnique({
      where: { slug: targetSlug },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: { quizzes: true, labs: true },
            },
          },
        },
      },
    });

    assert(!!course, `Target course "${targetSlug}" retrieved successfully.`);
    assert(Array.isArray(course!.modules) && course!.modules.length > 0, `Course "${targetSlug}" contains modules.`);
    assert(course!.modules[0].lessons.length > 0, `First module of "${targetSlug}" contains lessons.`);

    // 3. Verify Lesson Detail Data Contract & Content Structure
    const sampleLesson = course!.modules[0].lessons[0];
    const fullLesson = await prisma.lesson.findUnique({
      where: { id: sampleLesson.id },
      include: {
        objectives: true,
        concepts: true,
        commands: true,
        labs: true,
        mistakes: true,
        recaps: true,
        quizzes: { include: { questions: true } },
      },
    });

    assert(!!fullLesson, `Sample lesson "${sampleLesson.slug}" retrieved successfully.`);
    assert(typeof fullLesson!.title === 'string' && fullLesson!.title.length > 0, `Sample lesson has valid title.`);
    assert(typeof fullLesson!.durationMinutes === 'number' && fullLesson!.durationMinutes > 0, `Sample lesson has valid duration.`);

    // 4. Verify Next Activity Resolution Priority
    const allLessons = course!.modules.flatMap((m) => m.lessons);
    assert(allLessons.length > 0, 'Course contains playable lessons.');

    // Simulating next incomplete lesson resolution logic
    const mockUserProgressMap: Record<string, boolean> = {};
    mockUserProgressMap[allLessons[0].id] = true; // Mark first lesson completed

    const nextIncompleteLesson = allLessons.find((l) => !mockUserProgressMap[l.id]);
    assert(!!nextIncompleteLesson, `Next activity correctly resolves to second lesson "${nextIncompleteLesson?.slug}".`);
    assert(nextIncompleteLesson?.id !== allLessons[0].id, 'Next activity skipped completed first lesson.');

    // 5. Verify Assessment Quiz Structure & Option Data
    const quiz = await prisma.quiz.findFirst({
      where: { lessonId: sampleLesson.id },
      include: { questions: true },
    }) || await prisma.quiz.findFirst({
      include: { questions: true },
    });

    if (quiz) {
      assert(!!quiz.id && quiz.questions.length > 0, `Quiz for lesson has questions.`);
      const firstQ = quiz.questions[0];
      assert(typeof firstQ.questionText === 'string', `Quiz question text valid.`);
      assert(Array.isArray(firstQ.optionsJson), `Quiz question options is a valid array.`);
      assert(typeof firstQ.correctOption === 'number', `Quiz question correctOption is numeric.`);
    }

    // 6. Verify Practical Lab Gating Metadata
    const labLesson = allLessons.find((l) => l.labs.length > 0);
    if (labLesson) {
      const lab = labLesson.labs[0];
      assert(!!lab.id && typeof lab.instructions === 'string', `Practical lab metadata valid for lesson "${labLesson.slug}".`);
    }

    console.log(`\n🎉 Phase 12E Verification Passed! All ${passedAssertions} assertions verified successfully.`);
  } catch (error: any) {
    console.error('\n❌ Phase 12E Verification Failed:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase12eLearningUxTests();
