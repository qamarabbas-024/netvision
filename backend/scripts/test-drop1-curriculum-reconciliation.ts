import { PrismaClient } from '@prisma/client';
import { TopicsService } from '../src/topics/topics.service';
import { AchievementsService } from '../src/achievements/achievements.service';
import { PrismaService } from '../src/database/prisma.service';
import { FLAGSHIP_5_COURSES, CANONICAL_CREDENTIALS, LEGACY_SLUG_COMPATIBILITY_MAP } from '@netvision/shared';

async function runDrop1Verification() {
  console.log('🧪 Starting NetVision Drop #1 Verification: Curriculum Reconciliation & Safe Migration...\n');

  const prisma = new PrismaClient();
  const prismaService = new PrismaService();
  const achievementsService = new AchievementsService(prismaService);
  const topicsService = new TopicsService(prismaService, achievementsService);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}${detail ? ` -> ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // -----------------------------------------------------------------------
    // TEST 1: Catalog returns exactly 5 Flagship Courses
    // -----------------------------------------------------------------------
    console.log('--- Test Suite 1: Catalog Five Flagship Courses ---');
    const courses = await topicsService.getCourses();
    assert(courses.length === 5, 'Public catalog returns exactly 5 flagship courses', `Got ${courses.length}`);

    const courseCodes = courses.map((c) => c.code);
    const expectedCodes = ['NV-C01', 'NV-C02', 'NV-C03', 'NV-C04', 'NV-C05'];
    assert(
      expectedCodes.every((code) => courseCodes.includes(code)),
      'All 5 flagship course codes (NV-C01 to NV-C05) are present',
      `Present: ${courseCodes.join(', ')}`
    );

    const c1 = courses.find((c) => c.code === 'NV-C01');
    const c2 = courses.find((c) => c.code === 'NV-C02');
    const c3 = courses.find((c) => c.code === 'NV-C03');
    const c4 = courses.find((c) => c.code === 'NV-C04');
    const c5 = courses.find((c) => c.code === 'NV-C05');

    assert(c1?.slug === 'foundations-network-architecture', 'Course 1 slug matches canonical blueprint');
    assert(c2?.slug === 'ethernet-switching-ip-networking', 'Course 2 slug matches canonical blueprint');
    assert(c3?.slug === 'transport-routing-network-services', 'Course 3 slug matches canonical blueprint');
    assert(c4?.slug === 'network-security-secure-connectivity', 'Course 4 slug matches canonical blueprint');
    assert(c5?.slug === 'network-engineering-automation-troubleshooting', 'Course 5 slug matches canonical blueprint');

    // -----------------------------------------------------------------------
    // TEST 2: Prerequisites Hierarchy
    // -----------------------------------------------------------------------
    console.log('\n--- Test Suite 2: Prerequisites & Sequencing ---');
    assert(Array.isArray(c1?.prerequisites) && c1!.prerequisites.length === 0, 'Course 1 has zero prerequisites');
    assert(c2?.prerequisites.includes('NV-C01'), 'Course 2 has NV-C01 prerequisite');
    assert(c3?.prerequisites.includes('NV-C02'), 'Course 3 has NV-C02 prerequisite');
    assert(c4?.prerequisites.includes('NV-C03'), 'Course 4 has NV-C03 prerequisite');
    assert(c5?.prerequisites.includes('NV-C04'), 'Course 5 has NV-C04 prerequisite');

    // -----------------------------------------------------------------------
    // TEST 3: STP Educational Positioning in Course 2
    // -----------------------------------------------------------------------
    console.log('\n--- Test Suite 3: STP Educational Positioning ---');
    const c2Full = await topicsService.getCourseBySlug('ethernet-switching-ip-networking');
    const stpModule = c2Full.modules.find((m) => m.id === 'mod-c02-spanning-tree');
    assert(!!stpModule, 'Course 2 contains Spanning Tree Protocol module (mod-c02-spanning-tree)');

    const stpLesson = stpModule?.lessons.find((l) => l.slug === 'net-302-spanning-tree-protocol-loop-prevention');
    assert(!!stpLesson, 'STP lesson (net-302-spanning-tree-protocol-loop-prevention) is child of Course 2 Spanning Tree module');

    // -----------------------------------------------------------------------
    // TEST 4: Historical Course & Module Preservation (Zero Deletions)
    // -----------------------------------------------------------------------
    console.log('\n--- Test Suite 4: Database Preservation Invariants ---');
    const legacyCourseCount = await prisma.course.count({ where: { published: false } });
    assert(legacyCourseCount >= 16, 'Historical courses preserved in database with published=false', `Count: ${legacyCourseCount}`);

    const net101Historical = await prisma.course.findUnique({ where: { code: 'NET-101' } });
    assert(!!net101Historical && net101Historical.published === false, 'Historical NET-101 course intact and unpublished');

    const totalLessons = await prisma.lesson.count();
    assert(totalLessons >= 35, 'Total lessons in database >= 35 intact without loss', `Count: ${totalLessons}`);

    // -----------------------------------------------------------------------
    // TEST 5: Legacy Slug Compatibility & Strict 404 Resolution
    // -----------------------------------------------------------------------
    console.log('\n--- Test Suite 5: Legacy Slug Compatibility & Strict 404 ---');
    const resolvedNet101 = await topicsService.getCourseBySlug('net-101-digital-foundations');
    assert(
      resolvedNet101.code === 'NV-C01' && resolvedNet101.slug === 'foundations-network-architecture',
      'Legacy slug "net-101-digital-foundations" resolves to Course 1 (NV-C01)'
    );

    const resolvedSTP = await topicsService.getCourseBySlug('net-302-spanning-tree');
    assert(
      resolvedSTP.code === 'NV-C02' && resolvedSTP.slug === 'ethernet-switching-ip-networking',
      'Legacy slug "net-302-spanning-tree" resolves to Course 2 (NV-C02)'
    );

    let caught404 = false;
    try {
      await topicsService.getCourseBySlug('completely-unknown-bogus-course-slug-12345');
    } catch (err: any) {
      caught404 = err.status === 404 || err.message.includes('not found');
    }
    assert(caught404, 'Unknown slug throws strict 404 NotFoundException (no fallback to NET-101)');

    // -----------------------------------------------------------------------
    // TEST 6: Six Authoritative Certification Definitions
    // -----------------------------------------------------------------------
    console.log('\n--- Test Suite 6: Six Authoritative Credentials ---');
    const activeCertDefs = await prisma.certificationDefinition.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    });

    const activeCodes = activeCertDefs.map((c) => c.code);
    const expectedCertCodes = ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05', 'NV-NET-MASTERY'];
    assert(activeCertDefs.length === 6, 'Exactly 6 active CertificationDefinition records exist', `Count: ${activeCertDefs.length}`);
    assert(
      expectedCertCodes.every((code) => activeCodes.includes(code)),
      'Active certification codes match canonical specification (NV-NET-C01..C05 + NV-NET-MASTERY)',
      `Codes: ${activeCodes.join(', ')}`
    );

    const masteryCert = activeCertDefs.find((c) => c.code === 'NV-NET-MASTERY');
    const masteryReqs = masteryCert?.requirementsJson as any;
    assert(
      masteryReqs?.isMastery === true &&
      Array.isArray(masteryReqs?.requiredCourseCodes) &&
      masteryReqs?.requiredCourseCodes.length === 5,
      'NV-NET-MASTERY credential requires completion of all 5 flagship courses'
    );

    // -----------------------------------------------------------------------
    // SUMMARY
    // -----------------------------------------------------------------------
    console.log('\n======================================================');
    console.log(`Drop #1 Verification Results: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error during Drop #1 verification:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await prismaService.$disconnect();
  }
}

runDrop1Verification();
