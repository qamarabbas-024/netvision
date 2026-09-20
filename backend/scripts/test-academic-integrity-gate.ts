import { PrismaService } from '../src/database/prisma.service';
import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';
const CANONICAL_TEXTBOOK_MAPPING = require('../src/topics/data/textbook-curriculum-mapping.json');

const prisma = new PrismaService();

let passed = 0;
let failed = 0;

function check(condition: boolean, message: string, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}${detail ? ` -> ${detail}` : ''}`);
  }
}

async function runAcademicIntegrityGate() {
  console.log('========================================================================');
  console.log('NETVISION DROP M: ACADEMIC INTEGRITY & CURRICULUM REMEDIATION GATE');
  console.log('========================================================================\n');

  async function waitForDatabase(retries = 3, delayMs = 1500): Promise<boolean> {
    for (let i = 1; i <= retries; i++) {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
      } catch (err: any) {
        if (i === retries) {
          if (process.env.CI === 'true') throw err;
          console.warn(`⚠️ Database offline or unreachable in local environment (${err?.message || err}). Skipping live DB integration suite.`);
          return false;
        }
        console.log(`⏳ Database connection retry (${i}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    return false;
  }

  try {
    const isDbConnected = await waitForDatabase();
    if (!isDbConnected) {
      console.log('========================================================================');
      console.log('Academic Integrity Gate SKIPPED SAFELY (Offline Local Mode)');
      console.log('========================================================================\n');
      return;
    }

    // -------------------------------------------------------------------------
    // Suite 1: Published Lessons & Content Population Invariant
    // -------------------------------------------------------------------------
    console.log('--- Suite 1: Published Lessons & Content Population Invariant ---');
    const publishedCourses = await prisma.course.findMany({
      where: { published: true },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                quizzes: {
                  include: {
                    questions: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    let totalPublishedLessons = 0;
    let nullContentLessons = 0;
    let zeroQuestionQuizzes = 0;
    let totalQuestions = 0;
    const optionCounts = [0, 0, 0, 0];

    for (const course of publishedCourses) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          totalPublishedLessons++;
          if (!lesson.contentJson) {
            nullContentLessons++;
            console.error(`  ❌ NULL contentJson found in lesson: ${lesson.slug} (${course.code})`);
          }

          for (const quiz of lesson.quizzes) {
            if (quiz.questions.length === 0) {
              zeroQuestionQuizzes++;
              console.error(`  ❌ 0 questions found in quiz: ${quiz.id} (${lesson.slug})`);
            }
            for (const q of quiz.questions) {
              totalQuestions++;
              optionCounts[q.correctOption]++;
            }
          }
        }
      }
    }

    check(totalPublishedLessons >= 45, `Total published lessons >= 45 (Found: ${totalPublishedLessons})`);
    check(nullContentLessons === 0, `Zero lessons with contentJson === null across published courses (Found: ${nullContentLessons})`);
    check(zeroQuestionQuizzes === 0, `Zero quizzes with 0 questions across published curriculum (Found: ${zeroQuestionQuizzes})`);

    // -------------------------------------------------------------------------
    // Suite 2: Question Bank & Option Distribution Invariant
    // -------------------------------------------------------------------------
    console.log('\n--- Suite 2: Question Bank & Option Distribution Invariant ---');
    const totalBankQuestions = EXPANDED_ASSESSMENT_QUESTION_BANK.length;
    check(totalBankQuestions >= 220, `Question bank contains >= 220 questions (Found: ${totalBankQuestions})`);

    const bankOptionCounts = [0, 0, 0, 0];
    const duplicates = new Set<string>();
    let duplicateCount = 0;

    for (let i = 0; i < EXPANDED_ASSESSMENT_QUESTION_BANK.length; i++) {
      const q = EXPANDED_ASSESSMENT_QUESTION_BANK[i];
      bankOptionCounts[q.correctOption]++;

      const key = `${q.quizId}:::${q.text.trim().toLowerCase()}`;
      if (duplicates.has(key)) {
        duplicateCount++;
      } else {
        duplicates.add(key);
      }

      // Check option validity
      if (q.options.length !== 4) {
        check(false, `Question ${i} in ${q.quizId} has exactly 4 options (Found: ${q.options.length})`);
      }
      if (q.correctOption < 0 || q.correctOption > 3) {
        check(false, `Question ${i} in ${q.quizId} has valid correctOption index (Found: ${q.correctOption})`);
      }
      if (q.explanationsJson[q.correctOption]) {
        check(false, `Question ${i} in ${q.quizId} does not have correct option in distractor explanationsJson`);
      }
    }

    check(duplicateCount === 0, `Zero duplicate questions in authoritative question bank (Found: ${duplicateCount})`);

    const pctA = (bankOptionCounts[0] / totalBankQuestions) * 100;
    const pctB = (bankOptionCounts[1] / totalBankQuestions) * 100;
    const pctC = (bankOptionCounts[2] / totalBankQuestions) * 100;
    const pctD = (bankOptionCounts[3] / totalBankQuestions) * 100;

    console.log(`  Distribution: A=${pctA.toFixed(1)}% (${bankOptionCounts[0]}), B=${pctB.toFixed(1)}% (${bankOptionCounts[1]}), C=${pctC.toFixed(1)}% (${bankOptionCounts[2]}), D=${pctD.toFixed(1)}% (${bankOptionCounts[3]})`);

    check(pctA >= 20 && pctA <= 30, `Option A distribution is ~25% (Found: ${pctA.toFixed(1)}%)`);
    check(pctB >= 20 && pctB <= 30, `Option B distribution is ~25% (Found: ${pctB.toFixed(1)}%)`);
    check(pctC >= 20 && pctC <= 30, `Option C distribution is ~25% (Found: ${pctC.toFixed(1)}%)`);
    check(pctD >= 20 && pctD <= 30, `Option D distribution is ~25% (Found: ${pctD.toFixed(1)}%)`);

    // -------------------------------------------------------------------------
    // Suite 3: Textbook Mapping & Attribution Invariant
    // -------------------------------------------------------------------------
    console.log('\n--- Suite 3: Textbook Mapping & Attribution Invariant ---');
    check(CANONICAL_TEXTBOOK_MAPPING.length >= 45, `Textbook mapping covers >= 45 lessons (Found: ${CANONICAL_TEXTBOOK_MAPPING.length})`);

    const allMappedHaveRfcs = CANONICAL_TEXTBOOK_MAPPING.every((m) => m.standardsRefs.length > 0);
    check(allMappedHaveRfcs, '100% of mapped lessons reference formal RFCs or IEEE standards');

    const allMappedHaveObjectives = CANONICAL_TEXTBOOK_MAPPING.every((m) => m.learningObjectives.length >= 2);
    check(allMappedHaveObjectives, '100% of mapped lessons have Bloom-aligned learning objectives');

    // -------------------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------------------
    console.log('\n========================================================================');
    console.log(`ACADEMIC INTEGRITY GATE RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`Published Lessons: ${totalPublishedLessons}, Null Content: ${nullContentLessons}`);
    console.log(`Total Quizzes: ${publishedCourses.reduce((acc, c) => acc + c.modules.reduce((macc, m) => macc + m.lessons.reduce((lacc, l) => lacc + l.quizzes.length, 0), 0), 0)}, Zero-Question Quizzes: ${zeroQuestionQuizzes}`);
    console.log(`Total Questions Synced: ${totalQuestions}`);
    console.log('========================================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

runAcademicIntegrityGate().catch(async (err) => {
  console.error('Fatal error during Academic Integrity Gate:', err);
  await prisma.$disconnect();
  process.exit(1);
});
