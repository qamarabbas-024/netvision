/**
 * NETVISION DROP E VERIFICATION SUITE
 * Curriculum Completeness Audit & Integrity: NV-C01, NV-C02, NV-C03, NV-C04, NV-C05
 *
 * Asserts:
 * 1. All 5 Canonical Flagship Courses exist, are active/published, and have proper hierarchy.
 * 2. Every constituent module across all 5 flagship courses has >= 1 authoritative lesson.
 * 3. Zero empty/unpopulated modules exist in the active catalog.
 * 4. Every lesson has an associated quiz assessment and valid pedagogical content.
 * 5. Historical/legacy courses (16 historical) remain properly preserved with published: false.
 */

import { PrismaClient, CourseLevel } from '@prisma/client';
import { PrismaService } from '../src/database/prisma.service';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';

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

async function waitForDatabase(retries = 10, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return;
    } catch (err) {
      if (i === retries) throw err;
      console.log(`⏳ Neon connection warmup... retrying in ${delayMs}ms (attempt ${i}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function runDropETests() {
  console.log('========================================================================');
  console.log('NETVISION DROP E: CURRICULUM COMPLETENESS & MODULE INTEGRITY AUDIT');
  console.log('========================================================================\n');

  try {
    await waitForDatabase();

    // -------------------------------------------------------------------------
    // Suite 1: Canonical 5 Flagship Courses Verification
    // -------------------------------------------------------------------------
    console.log('--- Suite 1: Canonical 5 Flagship Courses Verification ---');
    const publishedCourses = await prisma.course.findMany({
      where: { published: true },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                quizzes: true,
                labs: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    check(publishedCourses.length === 5, 'Exactly 5 flagship courses published in catalog', `Found ${publishedCourses.length}`);
    const expectedCodes = ['NV-C01', 'NV-C02', 'NV-C03', 'NV-C04', 'NV-C05'];
    const actualCodes = publishedCourses.map((c) => c.code);
    check(
      expectedCodes.every((code) => actualCodes.includes(code)),
      'All 5 flagship course codes (NV-C01..C05) exist in active catalog',
      `Found: ${actualCodes.join(', ')}`
    );

    // -------------------------------------------------------------------------
    // Suite 2: Module Population & Zero Empty Modules Invariant
    // -------------------------------------------------------------------------
    console.log('\n--- Suite 2: Module Population & Zero Empty Modules Invariant ---');
    let totalModules = 0;
    let emptyModules = 0;
    let totalLessons = 0;
    let totalQuizzes = 0;
    let totalLabs = 0;

    for (const course of publishedCourses) {
      const spec = FLAGSHIP_5_COURSES.find((f) => f.code === course.code);
      check(!!spec, `Course ${course.code} corresponds to canonical blueprint`);
      check(course.modules.length === (spec?.modules.length ?? 0), `Course ${course.code} has exactly ${spec?.modules.length} modules (found: ${course.modules.length})`);

      for (const module of course.modules) {
        totalModules++;
        const lessonCount = module.lessons.length;
        if (lessonCount === 0) {
          emptyModules++;
        }
        check(lessonCount > 0, `Module "${module.title}" [${module.id}] in ${course.code} has >= 1 lesson (found: ${lessonCount})`);

        for (const lesson of module.lessons) {
          totalLessons++;
          check(!!lesson.title && !!lesson.slug, `Lesson ${lesson.slug} has title and valid slug`);
          check(lesson.quizzes.length > 0, `Lesson ${lesson.slug} has associated quiz assessment`);
          totalQuizzes += lesson.quizzes.length;
          if (lesson.labs.length > 0) {
            totalLabs += lesson.labs.length;
          }
        }
      }
    }

    check(emptyModules === 0, `Zero empty modules across all 5 flagship courses (empty count: ${emptyModules})`);
    check(totalLessons >= 35, `Total lessons across flagship curriculum exceeds baseline requirement (found: ${totalLessons} >= 35)`);
    check(totalQuizzes >= 35, `Total quiz assessments across flagship curriculum exceeds baseline requirement (found: ${totalQuizzes} >= 35)`);

    // -------------------------------------------------------------------------
    // Suite 3: Historical Archival Course Retention Invariant
    // -------------------------------------------------------------------------
    console.log('\n--- Suite 3: Historical Archival Course Retention Invariant ---');
    const historicalCourses = await prisma.course.findMany({
      where: { published: false },
    });
    check(historicalCourses.length >= 16, `Historical courses preserved as inactive records (found: ${historicalCourses.length} >= 16)`);
    const historicalCodes = historicalCourses.map((c) => c.code);
    check(historicalCodes.includes('NET-101'), 'Historical NET-101 course safely archived');
    check(historicalCodes.includes('NET-404'), 'Historical NET-404 course safely archived');

    // -------------------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------------------
    console.log('\n========================================================================');
    console.log(`DROP E CURRICULUM COMPLETENESS RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`Summary: ${publishedCourses.length} Courses, ${totalModules} Modules, ${totalLessons} Lessons, ${totalQuizzes} Quizzes, ${totalLabs} Labs`);
    console.log('========================================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

runDropETests().catch(async (err) => {
  console.error('Fatal error during Drop E verification:', err);
  await prisma.$disconnect();
  process.exit(1);
});
