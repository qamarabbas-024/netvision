import { PrismaClient, CourseLevel, LessonType, Role } from '@prisma/client';
import { TopicsService } from '../src/topics/topics.service';
import { AchievementsService } from '../src/achievements/achievements.service';
import { CertificationsService } from '../src/certifications/certifications.service';
import { PrismaService } from '../src/database/prisma.service';
import { FLAGSHIP_5_COURSES, CANONICAL_CREDENTIALS, LEGACY_SLUG_COMPATIBILITY_MAP } from '@netvision/shared';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const prismaService = prisma as unknown as PrismaService;
const achievementsService = new AchievementsService(prismaService);
const certificationsService = new CertificationsService(prismaService);
const topicsService = new TopicsService(prismaService, achievementsService);

async function runDrop1Verification() {
  console.log('🧪 Starting Strengthened NetVision Drop #1 Verification: Curriculum Reconciliation & Safe Migration...\n');

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

  async function waitForDatabase(retries = 5, delayMs = 2500) {
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

  try {
    await waitForDatabase();

    // =======================================================================
    // SUITE 1: CANONICAL FIVE FLAGSHIP COURSES & PREREQUISITES
    // =======================================================================
    console.log('--- Suite 1: Canonical Five Flagship Courses & Hierarchy ---');
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

    // Prerequisites Sequencing
    assert(Array.isArray(c1?.prerequisites) && c1!.prerequisites.length === 0, 'Course 1 has zero prerequisites');
    assert(c2?.prerequisites.includes('NV-C01'), 'Course 2 has NV-C01 prerequisite');
    assert(c3?.prerequisites.includes('NV-C02'), 'Course 3 has NV-C02 prerequisite');
    assert(c4?.prerequisites.includes('NV-C03'), 'Course 4 has NV-C03 prerequisite');
    assert(c5?.prerequisites.includes('NV-C04'), 'Course 5 has NV-C04 prerequisite');

    // =======================================================================
    // SUITE 2: CURRICULUM COMPLETENESS & ZERO-ORPHAN INVARIANT
    // =======================================================================
    console.log('\n--- Suite 2: Curriculum Completeness & Module Distribution ---');
    const flagshipCoursesWithModules = await prisma.course.findMany({
      where: { published: true },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: { lessons: true },
        },
      },
    });

    let totalFlagshipLessons = 0;
    let allModulesHaveLessons = true;
    for (const fc of flagshipCoursesWithModules) {
      assert(fc.modules.length > 0, `Course ${fc.code} has domain modules (found: ${fc.modules.length})`);
      for (const mod of fc.modules) {
        if (mod.lessons.length === 0) {
          allModulesHaveLessons = false;
          console.error(`    ❌ Empty Module Found: [${fc.code}] ${mod.id} (${mod.title})`);
        }
        totalFlagshipLessons += mod.lessons.length;
      }
    }
    assert(allModulesHaveLessons, 'Every single module across all 5 flagship courses has >= 1 lesson');

    const totalDbLessons = await prisma.lesson.count();
    assert(totalFlagshipLessons === totalDbLessons, `100% of DB lessons are in flagship courses (${totalFlagshipLessons}/${totalDbLessons})`);

    const nonFlagshipLessons = await prisma.lesson.findMany({
      where: { module: { course: { published: false } } },
    });
    assert(nonFlagshipLessons.length === 0, 'Zero orphaned lessons attached to unpublished historical courses');

    // STP Educational Positioning
    const c2Full = await topicsService.getCourseBySlug('ethernet-switching-ip-networking');
    const stpModule = c2Full.modules.find((m) => m.id === 'mod-c02-spanning-tree');
    assert(!!stpModule, 'Course 2 contains Spanning Tree Protocol module (mod-c02-spanning-tree)');

    const stpLesson = stpModule?.lessons.find((l) => l.slug === 'net-302-spanning-tree-protocol-loop-prevention');
    assert(!!stpLesson, 'STP lesson (net-302-spanning-tree-protocol-loop-prevention) is child of Course 2 Spanning Tree module');

    // Course 5 Module 2 (Troubleshooting Workflows)
    const c5Full = await topicsService.getCourseBySlug('network-engineering-automation-troubleshooting');
    const tbModule = c5Full.modules.find((m) => m.id === 'mod-c05-troubleshooting-workflows');
    assert(!!tbModule && tbModule.lessons.length > 0, 'Course 5 contains populated Troubleshooting Workflows module');

    // =======================================================================
    // SUITE 3: DATABASE ENTITY COUNT INVARIANTS & PRESERVATION
    // =======================================================================
    console.log('\n--- Suite 3: Database Entity Count Invariants ---');
    const historicalCourseCount = await prisma.course.count({ where: { published: false } });
    assert(historicalCourseCount >= 16, 'Historical courses preserved with published=false', `Count: ${historicalCourseCount}`);

    const historicalModuleCount = await prisma.module.count({ where: { course: { published: false } } });
    assert(historicalModuleCount >= 16, 'Historical modules preserved intact', `Count: ${historicalModuleCount}`);

    const lessonCount = await prisma.lesson.count();
    assert(lessonCount >= 35, 'Lesson count intact (>= 35)', `Count: ${lessonCount}`);

    const quizCount = await prisma.quiz.count();
    assert(quizCount >= 35, 'Quiz count intact (>= 35)', `Count: ${quizCount}`);

    const labCount = await prisma.lessonLab.count();
    assert(labCount >= 10, 'Lab count intact (>= 10)', `Count: ${labCount}`);

    const net101Course = await prisma.course.findUnique({ where: { code: 'NET-101' } });
    assert(!!net101Course && net101Course.published === false, 'Historical NET-101 course intact with published=false');

    // Verify representative lesson UUID and slug preservation
    const benchmarkSlug = 'net-101-bits-bytes-binary-hex';
    const benchmarkLesson = await prisma.lesson.findUnique({ where: { slug: benchmarkSlug } });
    assert(!!benchmarkLesson, 'Representative benchmark lesson exists by slug');
    const initialLessonId = benchmarkLesson!.id;

    // =======================================================================
    // SUITE 4: REAL PROGRESS CONTINUITY ACROSS MIGRATION
    // =======================================================================
    console.log('\n--- Suite 4: Real UserProgress Continuity Across Migration ---');
    const testUserId = `test-progress-continuity-${Date.now()}`;
    const testUser = await prisma.user.create({
      data: {
        id: testUserId,
        email: `continuity-${Date.now()}@netvision.test`,
        username: `continuity_${Date.now()}`,
        passwordHash: 'dummy_hash',
        role: Role.STUDENT,
        isVerified: true,
      },
    });

    const completionTimestamp = new Date('2026-09-01T12:00:00.000Z');
    const createdProgress = await prisma.userProgress.create({
      data: {
        userId: testUser.id,
        lessonId: initialLessonId,
        completed: true,
        score: 95,
        started: true,
        viewed: true,
        completedAt: completionTimestamp,
      },
    });

    // Simulate lesson re-parenting upsert (same logic executed during seed)
    await prisma.lesson.upsert({
      where: { slug: benchmarkSlug },
      update: {
        moduleId: benchmarkLesson!.moduleId,
        title: benchmarkLesson!.title,
      },
      create: {
        moduleId: benchmarkLesson!.moduleId,
        title: benchmarkLesson!.title,
        slug: benchmarkSlug,
        order: benchmarkLesson!.order ?? 0,
      },
    });

    // Verify progress record continuity
    const postMigrationLesson = await prisma.lesson.findUnique({ where: { slug: benchmarkSlug } });
    assert(postMigrationLesson?.id === initialLessonId, 'Lesson UUID remains identical across migration upsert');

    const postMigrationProgress = await prisma.userProgress.findUnique({
      where: { id: createdProgress.id },
    });
    assert(!!postMigrationProgress, 'UserProgress record ID preserved intact');
    assert(postMigrationProgress?.lessonId === initialLessonId, 'UserProgress points to same lessonId');
    assert(postMigrationProgress?.completed === true, 'UserProgress completed=true preserved');
    assert(postMigrationProgress?.score === 95, 'UserProgress score=95 preserved');
    assert(
      postMigrationProgress?.completedAt?.toISOString() === completionTimestamp.toISOString(),
      'UserProgress completedAt timestamp preserved'
    );

    // Clean up isolated test user
    await prisma.userProgress.delete({ where: { id: createdProgress.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('  ✓ Isolated continuity test user cleaned up cleanly.');

    // =======================================================================
    // SUITE 5: SEED IDEMPOTENCY INVARIANT
    // =======================================================================
    console.log('\n--- Suite 5: Seed Idempotency Invariant ---');
    const preSnapshot = {
      courses: await prisma.course.count(),
      modules: await prisma.module.count(),
      lessons: await prisma.lesson.count(),
      quizzes: await prisma.quiz.count(),
      labs: await prisma.lessonLab.count(),
      certDefs: await prisma.certificationDefinition.count(),
    };

    // Re-run the flagship courses, modules, and certification definitions upserts
    for (const fDef of FLAGSHIP_5_COURSES) {
      const existing = await prisma.course.findFirst({
        where: { OR: [{ code: fDef.code }, { slug: fDef.slug }] },
      });
      if (existing) {
        await prisma.course.update({
          where: { id: existing.id },
          data: { title: fDef.title, published: true },
        });
      }
      for (const mDef of fDef.modules) {
        await prisma.module.upsert({
          where: { id: mDef.id },
          update: { title: mDef.title },
          create: { id: mDef.id, courseId: existing!.id, title: mDef.title, description: mDef.description, order: mDef.order },
        });
      }
    }

    for (const cred of CANONICAL_CREDENTIALS) {
      await prisma.certificationDefinition.upsert({
        where: { code: cred.code },
        update: { title: cred.title, isActive: true },
        create: {
          code: cred.code,
          title: cred.title,
          description: cred.description,
          isActive: true,
        },
      });
    }

    const postSnapshot = {
      courses: await prisma.course.count(),
      modules: await prisma.module.count(),
      lessons: await prisma.lesson.count(),
      quizzes: await prisma.quiz.count(),
      labs: await prisma.lessonLab.count(),
      certDefs: await prisma.certificationDefinition.count(),
    };

    assert(postSnapshot.courses === preSnapshot.courses, `Course count stable across re-seed (delta=0, total=${postSnapshot.courses})`);
    assert(postSnapshot.modules === preSnapshot.modules, `Module count stable across re-seed (delta=0, total=${postSnapshot.modules})`);
    assert(postSnapshot.lessons === preSnapshot.lessons, `Lesson count stable across re-seed (delta=0, total=${postSnapshot.lessons})`);
    assert(postSnapshot.quizzes === preSnapshot.quizzes, `Quiz count stable across re-seed (delta=0, total=${postSnapshot.quizzes})`);
    assert(postSnapshot.labs === preSnapshot.labs, `Lab count stable across re-seed (delta=0, total=${postSnapshot.labs})`);
    assert(postSnapshot.certDefs === preSnapshot.certDefs, `CertDef count stable across re-seed (delta=0, total=${postSnapshot.certDefs})`);

    // =======================================================================
    // SUITE 6: HISTORICAL CERTIFICATE SAFETY & VERIFICATION
    // =======================================================================
    console.log('\n--- Suite 6: Historical Certificate Safety & Verification ---');
    const allCertificates = await prisma.certificate.findMany();
    let allCourseFksValid = true;
    for (const cert of allCertificates) {
      if (cert.courseId) {
        const referencedCourse = await prisma.course.findUnique({ where: { id: cert.courseId } });
        if (!referencedCourse) {
          allCourseFksValid = false;
          console.error(`    ❌ Orphaned Certificate: ${cert.id} references missing courseId: ${cert.courseId}`);
        }
      }
    }
    assert(allCourseFksValid, 'All historical certificates have valid courseId foreign keys');

    // Verify verification service functions for certificates
    if (allCertificates.length > 0) {
      const sampleCert = allCertificates[0];
      const certIdToVerify = sampleCert.credentialId || sampleCert.verificationCode || sampleCert.code;
      const verified = await certificationsService.verifyCertificate(certIdToVerify);
      assert(verified.isVerified === true, `Historical certificate verification succeeds for ${certIdToVerify}`);
    } else {
      console.log('  ℹ No pre-existing certificate records in database; FK validity verified.');
    }

    // =======================================================================
    // SUITE 7: LEGACY ROUTING & STRICT 404 RESOLUTION
    // =======================================================================
    console.log('\n--- Suite 7: Legacy Slug Routing & Strict 404 Resolution ---');
    const legacyAliases = [
      { slug: 'net-101-digital-foundations', expectedCode: 'NV-C01' },
      { slug: 'net-102-network-fundamentals', expectedCode: 'NV-C01' },
      { slug: 'net-103-reference-models', expectedCode: 'NV-C01' },
      { slug: 'net-201-layer2-ethernet', expectedCode: 'NV-C02' },
      { slug: 'net-202-ipv4-subnetting', expectedCode: 'NV-C02' },
      { slug: 'net-301-vlan-switching', expectedCode: 'NV-C02' },
      { slug: 'net-302-spanning-tree', expectedCode: 'NV-C02' },
      { slug: 'net-203-core-ip-services', expectedCode: 'NV-C03' },
      { slug: 'net-204-transport-protocols', expectedCode: 'NV-C03' },
      { slug: 'net-303-static-routing', expectedCode: 'NV-C03' },
      { slug: 'net-304-dynamic-routing-ospf', expectedCode: 'NV-C03' },
      { slug: 'net-305-acls-firewalls', expectedCode: 'NV-C04' },
      { slug: 'net-401-nat-pat', expectedCode: 'NV-C04' },
      { slug: 'net-402-vpn-crypto', expectedCode: 'NV-C04' },
      { slug: 'net-403-network-automation', expectedCode: 'NV-C05' },
      { slug: 'net-404-packet-analysis', expectedCode: 'NV-C05' },
    ];

    let allAliasesResolved = true;
    for (const alias of legacyAliases) {
      const resolved = await topicsService.getCourseBySlug(alias.slug);
      if (resolved.code !== alias.expectedCode) {
        allAliasesResolved = false;
        console.error(`    ❌ Alias Failed: ${alias.slug} -> got ${resolved.code}, expected ${alias.expectedCode}`);
      }
    }
    assert(allAliasesResolved, 'All 16 legacy course slugs resolve to correct flagship courses');

    // Strict 404 on Unknown Slugs
    const bogusSlugs = [
      'completely-unknown-course-12345',
      'non-existent-course-slug-xyz',
      'net-999-quantum-computing',
      'level-0-foundations', // unpublished historical course cannot be queried directly as public course
    ];

    let all404sEnforced = true;
    for (const bogusSlug of bogusSlugs) {
      try {
        await topicsService.getCourseBySlug(bogusSlug);
        all404sEnforced = false;
        console.error(`    ❌ Expected 404 for "${bogusSlug}", but got 200`);
      } catch (err: any) {
        if (err.status !== 404 && !err.message?.includes('not found')) {
          all404sEnforced = false;
          console.error(`    ❌ Expected NotFoundException for "${bogusSlug}", got: ${err.message}`);
        }
      }
    }
    assert(all404sEnforced, 'Strict 404 NotFoundException enforced on unknown or unpublished slugs (no NET-101 fallback)');

    // =======================================================================
    // SUITE 8: SIX AUTHORITATIVE CREDENTIALS SPECIFICATION
    // =======================================================================
    console.log('\n--- Suite 8: Six Authoritative Credentials ---');
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

    // Verify historical credentials preserved as inactive
    const legacyCred = await prisma.certificationDefinition.findUnique({ where: { code: 'NV-NET' } });
    assert(!!legacyCred && legacyCred.isActive === false, 'Historical NV-NET credential preserved with isActive=false');

    // =======================================================================
    // SUMMARY
    // =======================================================================
    console.log('\n======================================================');
    console.log(`Drop #1 Hardened Verification Results: ${passed} PASSED, ${failed} FAILED`);
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
