import { BENCHMARK_LESSONS_FULL } from '../src/topics/benchmark-lessons-content';
import { LESSONS_NET_C04 } from '../src/topics/lessons-net-c04';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[DropDTestAssertionFailed] ${message}`);
  }
}

export function runDropDCurriculumC04Tests() {
  console.log('========================================================================');
  console.log('NETVISION DROP D: COURSE NV-C04 CURRICULUM SEEDING & BENCHMARK INTEGRITY');
  console.log('========================================================================\n');

  // 1. Verify Course NV-C04 in Flagship Curriculum
  console.log('--- Suite 1: Canonical Course NV-C04 Architecture & Module Definitions ---');
  const courseC04 = FLAGSHIP_5_COURSES.find((c) => c.code === 'NV-C04');
  assert(!!courseC04, 'Course NV-C04 must exist in FLAGSHIP_5_COURSES');
  assert(courseC04!.modules.length === 3, `NV-C04 must define exactly 3 modules, got ${courseC04!.modules.length}`);

  const modAcls = courseC04!.modules.find((m) => m.id === 'mod-c04-acls-firewalls');
  const modNat = courseC04!.modules.find((m) => m.id === 'mod-c04-nat-pat');
  const modVpn = courseC04!.modules.find((m) => m.id === 'mod-c04-vpn-crypto');

  assert(!!modAcls, 'Module mod-c04-acls-firewalls must exist');
  assert(!!modNat, 'Module mod-c04-nat-pat must exist');
  assert(!!modVpn, 'Module mod-c04-vpn-crypto must exist');

  assert(modAcls!.legacyCourseCodes.includes('NET-305'), 'mod-c04-acls-firewalls must map legacy code NET-305');
  assert(modNat!.legacyCourseCodes.includes('NET-401'), 'mod-c04-nat-pat must map legacy code NET-401');
  assert(modVpn!.legacyCourseCodes.includes('NET-402'), 'mod-c04-vpn-crypto must map legacy code NET-402');
  console.log('  ✅ PASS: Canonical module mapping verified (NET-305, NET-401, NET-402)\n');

  // 2. Verify LESSONS_NET_C04 Benchmark Coverage
  console.log('--- Suite 2: LESSONS_NET_C04 Authoritative Lesson Content ---');
  assert(LESSONS_NET_C04.length >= 4, `Expected at least 4 lessons in LESSONS_NET_C04, got ${LESSONS_NET_C04.length}`);

  const net305Lessons = LESSONS_NET_C04.filter((l) => l.courseCode === 'NET-305');
  const net401Lessons = LESSONS_NET_C04.filter((l) => l.courseCode === 'NET-401');
  const net402Lessons = LESSONS_NET_C04.filter((l) => l.courseCode === 'NET-402');

  assert(net305Lessons.length === 2, `NET-305 must have 2 benchmark lessons, got ${net305Lessons.length}`);
  assert(net401Lessons.length === 1, `NET-401 must have 1 benchmark lesson, got ${net401Lessons.length}`);
  assert(net402Lessons.length === 1, `NET-402 must have 1 benchmark lesson, got ${net402Lessons.length}`);

  // Test content richness and pedagogical structure
  for (const lesson of LESSONS_NET_C04) {
    assert(lesson.title.length > 10, `Lesson ${lesson.slug} must have a descriptive title`);
    assert(lesson.durationMinutes >= 30, `Lesson ${lesson.slug} duration must be >= 30 minutes`);
    assert(!!lesson.contentV2, `Lesson ${lesson.slug} must define contentV2`);
    const recapCount = Array.isArray(lesson.contentV2!.recap)
      ? lesson.contentV2!.recap.length
      : lesson.contentV2!.recap.summaryPoints.length;
    assert(recapCount >= 3, `Lesson ${lesson.slug} recap must contain at least 3 points`);
    assert(lesson.questions.length >= 4, `Lesson ${lesson.slug} must contain at least 4 assessment questions`);
    assert(!!lesson.lab, `Lesson ${lesson.slug} must define a guided practice lab`);

    // Verify questions integrity
    for (const q of lesson.questions) {
      assert(q.options.length === 4, `Question "${q.text.slice(0, 30)}" must have 4 options`);
      assert(q.correctOption >= 0 && q.correctOption <= 3, `Question correctOption must be between 0 and 3`);
      assert(q.explanation.length > 20, `Question must have a clear explanation`);
    }
  }
  console.log(`  ✅ PASS: All ${LESSONS_NET_C04.length} lessons pass full pedagogical and structural verification\n`);

  // 3. Verify Integration into Global Benchmark Corpus
  console.log('--- Suite 3: Global Benchmark Corpus Integration ---');
  for (const lesson of LESSONS_NET_C04) {
    const foundInFull = BENCHMARK_LESSONS_FULL.find((l) => l.slug === lesson.slug);
    assert(!!foundInFull, `Lesson ${lesson.slug} must be present in BENCHMARK_LESSONS_FULL`);
  }
  console.log('  ✅ PASS: BENCHMARK_LESSONS_FULL includes all Course NV-C04 lessons\n');

  console.log('========================================================================');
  console.log('🎉 ALL DROP D TESTS PASSED SUCCESSFULLY');
  console.log('========================================================================\n');
}

if (require.main === module) {
  runDropDCurriculumC04Tests();
}
