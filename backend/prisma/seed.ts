import { PrismaClient, CourseLevel, LessonType, Role, AchievementCategory } from '@prisma/client';
import * as argon2 from 'argon2';
import { TARGET_16_COURSES } from '../src/topics/curriculum-migration';
import { BENCHMARK_LESSONS_FULL } from '../src/topics/benchmark-lessons-content';
import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';
import { FLAGSHIP_5_COURSES, CANONICAL_CREDENTIALS } from '@netvision/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Executing Phase 12C Curriculum Migration & Seed (16 Progressive Target Courses + Data Preservation)...');

  // 1. Create / Upsert Users (Environment Controlled for Production Safety)
  const isProd = process.env.NODE_ENV === 'production';
  const shouldSeedDemoUsers = !isProd || process.env.SEED_DEMO_USERS === 'true';

  if (shouldSeedDemoUsers) {
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const studentPassword = process.env.SEED_STUDENT_PASSWORD || 'alex123';

    const adminPasswordHash = await argon2.hash(adminPassword);
    const studentPasswordHash = await argon2.hash(studentPassword);

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@netvision.edu' },
      update: { isVerified: true },
      create: {
        email: 'admin@netvision.edu',
        username: 'admin',
        fullName: 'System Administrator',
        passwordHash: adminPasswordHash,
        role: Role.ADMIN,
        isVerified: true,
      },
    });

    const studentUser = await prisma.user.upsert({
      where: { email: 'alex@netvision.edu' },
      update: { isVerified: true },
      create: {
        email: 'alex@netvision.edu',
        username: 'alex',
        fullName: 'Alex Rivers',
        passwordHash: studentPasswordHash,
        role: Role.STUDENT,
        isVerified: true,
      },
    });

    console.log(`👤 Verified Demo Users: ADMIN (${adminUser.email}), STUDENT (${studentUser.email})`);
  } else {
    console.log('ℹ️ Production Environment Detected: Skipping default demo/test user creation.');
  }

  // 2A. Upsert 16 Historical Courses (Retained Intact as Historical Records, published: false)
  console.log('📚 Retaining 16 Historical Courses as Archive Records (NET-101 to NET-404)...');
  const courseMap = new Map<string, string>(); // code -> course.id
  const targetModuleMap = new Map<string, string>(); // course.id -> first module.id

  for (const cDef of TARGET_16_COURSES) {
    let course = await prisma.course.findFirst({
      where: { OR: [{ code: cDef.code }, { slug: cDef.slug }] },
    });
    if (course) {
      course = await prisma.course.update({
        where: { id: course.id },
        data: {
          code: cDef.code,
          slug: cDef.slug,
          order: cDef.order,
          title: cDef.title,
          tagline: cDef.tagline,
          category: cDef.category,
          description: cDef.description,
          level: cDef.level,
          icon: cDef.icon,
          estimatedHours: cDef.estimatedHours,
          published: false, // Preserved intact as historical record, hidden from active catalog
          prerequisitesJson: cDef.prerequisitesJson,
        },
      });
    } else {
      course = await prisma.course.create({
        data: {
          code: cDef.code,
          order: cDef.order,
          slug: cDef.slug,
          title: cDef.title,
          tagline: cDef.tagline,
          category: cDef.category,
          description: cDef.description,
          level: cDef.level,
          icon: cDef.icon,
          estimatedHours: cDef.estimatedHours,
          published: false, // Preserved intact as historical record
          prerequisitesJson: cDef.prerequisitesJson,
        },
      });
    }

    courseMap.set(cDef.code, course.id);

    // Upsert historical Module 1 for backward compatibility
    const mod = await prisma.module.upsert({
      where: { id: `mod-${cDef.code.toLowerCase()}-1` },
      update: {
        courseId: course.id,
        title: cDef.moduleTitle,
        description: cDef.moduleDescription,
        order: 1,
      },
      create: {
        id: `mod-${cDef.code.toLowerCase()}-1`,
        courseId: course.id,
        title: cDef.moduleTitle,
        description: cDef.moduleDescription,
        order: 1,
      },
    });

    targetModuleMap.set(course.id, mod.id);
  }

  // 2B. Upsert 5 Flagship Professional Certification Courses (NV-C01 to NV-C05, published: true)
  console.log('🏛️ Upserting 5 Flagship Professional Certification Courses (NV-C01 to NV-C05)...');
  const flagshipCourseMap = new Map<string, string>(); // code -> course.id
  const flagshipModuleMap = new Map<string, string>(); // legacyCode -> flagshipModule.id

  for (const fDef of FLAGSHIP_5_COURSES) {
    let flagshipCourse = await prisma.course.findFirst({
      where: { OR: [{ code: fDef.code }, { slug: fDef.slug }] },
    });

    const courseData = {
      code: fDef.code,
      slug: fDef.slug,
      order: fDef.order,
      title: fDef.title,
      tagline: fDef.tagline,
      category: fDef.category,
      description: fDef.description,
      level: fDef.level as any,
      icon: fDef.icon,
      estimatedHours: fDef.estimatedHours,
      published: true,
      prerequisitesJson: fDef.prerequisites,
    };

    if (flagshipCourse) {
      flagshipCourse = await prisma.course.update({
        where: { id: flagshipCourse.id },
        data: courseData,
      });
    } else {
      flagshipCourse = await prisma.course.create({
        data: courseData,
      });
    }

    flagshipCourseMap.set(fDef.code, flagshipCourse.id);

    // Upsert Flagship Domain Modules
    for (const mDef of fDef.modules) {
      const flagshipModule = await prisma.module.upsert({
        where: { id: mDef.id },
        update: {
          courseId: flagshipCourse.id,
          title: mDef.title,
          description: mDef.description,
          order: mDef.order,
        },
        create: {
          id: mDef.id,
          courseId: flagshipCourse.id,
          title: mDef.title,
          description: mDef.description,
          order: mDef.order,
        },
      });

      // Map each constituent legacy course code to this flagship domain module
      for (const legCode of mDef.legacyCourseCodes) {
        flagshipModuleMap.set(legCode, flagshipModule.id);
      }
    }
    console.log(`  ✓ Flagship Course [${fDef.code}] "${fDef.title}" (${fDef.level}) -> ${fDef.modules.length} Modules`);
  }

  // 3. Upsert Benchmark Deep Lessons (Re-parented to Flagship Domain Modules)
  console.log('📌 Upserting Benchmark Lessons into Flagship Domain Modules...');
  for (const bDef of BENCHMARK_LESSONS_FULL) {
    const targetModId = flagshipModuleMap.get(bDef.courseCode) || targetModuleMap.get(courseMap.get(bDef.courseCode) || '');
    if (!targetModId) continue;

    const bLesson = await prisma.lesson.upsert({
      where: { slug: bDef.slug },
      update: {
        moduleId: targetModId,
        title: bDef.title,
        type: bDef.type,
        durationMinutes: bDef.durationMinutes,
        order: bDef.order,
        visualizationType: bDef.visualizationType,
        introduction: bDef.introduction,
        contentJson: ((bDef as any).contentV2 || bDef.stepMetadata) as any,
      },
      create: {
        moduleId: targetModId,
        title: bDef.title,
        slug: bDef.slug,
        type: bDef.type,
        durationMinutes: bDef.durationMinutes,
        order: bDef.order,
        visualizationType: bDef.visualizationType,
        introduction: bDef.introduction,
        contentJson: ((bDef as any).contentV2 || bDef.stepMetadata) as any,
      },
    });

    // Upsert Benchmark Quiz
    await prisma.quiz.upsert({
      where: { id: `quiz-${bDef.slug}` },
      update: { lessonId: bLesson.id, title: `${bDef.title} Quiz Assessment` },
      create: { id: `quiz-${bDef.slug}`, lessonId: bLesson.id, title: `${bDef.title} Quiz Assessment` },
    });

    // Upsert Benchmark Lab if defined
    if (bDef.lab) {
      const existingLab = await prisma.lessonLab.findFirst({
        where: { lessonId: bLesson.id },
      });

      if (existingLab) {
        await prisma.lessonLab.update({
          where: { id: existingLab.id },
          data: {
            title: bDef.lab.title,
            instructions: bDef.lab.instructions,
            difficulty: bDef.lab.difficulty,
            estimatedMinutes: bDef.lab.estimatedMinutes,
            initialTopologyJson: bDef.lab.initialTopologyJson,
            objectivesJson: bDef.lab.tasks,
          },
        });
      } else {
        await prisma.lessonLab.create({
          data: {
            lessonId: bLesson.id,
            title: bDef.lab.title,
            instructions: bDef.lab.instructions,
            difficulty: bDef.lab.difficulty,
            estimatedMinutes: bDef.lab.estimatedMinutes,
            initialTopologyJson: bDef.lab.initialTopologyJson,
            objectivesJson: bDef.lab.tasks,
          },
        });
      }
    }

    console.log(`  ✓ Benchmark Deep Lesson [${bDef.courseCode}] "${bDef.title}"${bDef.lab ? ' (1 lab)' : ''}`);
  }

  // 4. Seed Legacy 22 Courses & Map 35 Lessons to Target Modules
  const defaultTargetCourseId = courseMap.get('NET-101')!;
  const defaultTargetModId = targetModuleMap.get(defaultTargetCourseId)!;

  // Level 0 Legacy Course
  const level0Course = await prisma.course.upsert({
    where: { slug: 'level-0-foundations' },
    update: { title: 'Level 0: Computer & Network Foundations', level: CourseLevel.FOUNDATIONAL, code: 'LEGACY-0', published: false },
    create: {
      slug: 'level-0-foundations',
      code: 'LEGACY-0',
      order: 99,
      title: 'Level 0: Computer & Network Foundations',
      tagline: 'Master computer networking fundamentals, hardware devices, packets, and CLI diagnostics.',
      category: 'Level 0 Foundations',
      description: 'The starting point for networking engineers.',
      level: CourseLevel.FOUNDATIONAL,
      icon: 'Network',
      estimatedHours: 12,
      published: false,
    },
  });

  const level0Mod = await prisma.module.upsert({
    where: { id: 'mod-level-0-1' },
    update: { courseId: level0Course.id, title: 'Module 1: Fundamental Concepts' },
    create: { id: 'mod-level-0-1', courseId: level0Course.id, title: 'Module 1: Fundamental Concepts', description: 'Core foundational pillars', order: 1 },
  });

  // Seed Level 0 Lessons
  const level0Lessons = [
    { title: '1. What is a Computer Network?', slug: 'level-0-what-is-a-computer-network', targetCode: 'NET-102' },
    { title: '2. Devices in a Network', slug: 'level-0-devices-in-a-network', targetCode: 'NET-101' },
    { title: '3. Client and Server Architecture', slug: 'level-0-client-and-server-architecture', targetCode: 'NET-102' },
    { title: '4. LAN, WAN, and the Global Internet', slug: 'level-0-lan-wan-internet-boundaries', targetCode: 'NET-102' },
    { title: '5. IP Addresses & Logical Location', slug: 'level-0-ip-addresses-logical-location', targetCode: 'NET-202' },
    { title: '6. MAC Addresses & Physical Identity', slug: 'level-0-mac-addresses-physical-identity', targetCode: 'NET-201' },
    { title: '7. Network Ports & Socket Boundaries', slug: 'level-0-network-ports-socket-boundaries', targetCode: 'NET-204' },
    { title: '8. Network Packets & Data Framing', slug: 'level-0-network-packets-data-framing', targetCode: 'NET-204' },
    { title: '9. Network Protocols & Standard Language', slug: 'level-0-network-protocols-standards', targetCode: 'NET-103' },
    { title: '10. DNS: The Phonebook of the Internet', slug: 'level-0-dns-internet-phonebook', targetCode: 'NET-203' },
    { title: '11. DHCP: Automatic Network Configuration', slug: 'level-0-dhcp-automatic-ip-allocation', targetCode: 'NET-203' },
    { title: '12. Routers: Inter-Subnet Path Finders', slug: 'level-0-routers-inter-subnet-pathfinders', targetCode: 'NET-303' },
    { title: '13. Switches: Local LAN Frame Forwarders', slug: 'level-0-switches-local-lan-forwarders', targetCode: 'NET-301' },
    { title: '14. Basic Network Troubleshooting Workflow', slug: 'level-0-basic-network-troubleshooting-workflow', targetCode: 'NET-TROUBLESHOOT' },
  ];

  const benchmarkSlugs = new Set(BENCHMARK_LESSONS_FULL.map((b) => b.slug));

  for (let idx = 0; idx < level0Lessons.length; idx++) {
    const lDef = level0Lessons[idx];
    const targetCId = courseMap.get(lDef.targetCode) || defaultTargetCourseId;
    const targetMId = flagshipModuleMap.get(lDef.targetCode) || targetModuleMap.get(targetCId) || level0Mod.id;

    if (benchmarkSlugs.has(lDef.slug)) {
      continue; // Handled with full 18-step metadata by BENCHMARK_LESSONS_FULL
    }

    const lesson = await prisma.lesson.upsert({
      where: { slug: lDef.slug },
      update: {
        moduleId: targetMId,
        title: lDef.title,
        type: LessonType.THEORY,
        durationMinutes: 15,
        order: idx + 1,
        introduction: `Foundational lesson: ${lDef.title}`,
      },
      create: {
        moduleId: targetMId,
        title: lDef.title,
        slug: lDef.slug,
        type: LessonType.THEORY,
        durationMinutes: 15,
        order: idx + 1,
        introduction: `Foundational lesson: ${lDef.title}`,
      },
    });

    // Quiz Check
    await prisma.quiz.upsert({
      where: { id: `quiz-${lDef.slug}` },
      update: { lessonId: lesson.id, title: `${lDef.title} Quiz` },
      create: { id: `quiz-${lDef.slug}`, lessonId: lesson.id, title: `${lDef.title} Quiz` },
    });

    // Guided Lab Check
    const labCount = await prisma.lessonLab.count({ where: { lessonId: lesson.id } });
    if (labCount === 0) {
      await prisma.lessonLab.create({
        data: {
          lessonId: lesson.id,
          title: `Guided Practice: ${lDef.title}`,
          instructions: 'Execute standard CLI network diagnostic commands in the terminal.',
          initialTopologyJson: {},
        },
      });
    }
  }

  // 21 Additional Legacy Topics Mapping
  const legacyTopics = [
    { slug: 'networking-fundamentals', title: 'What is Computer Networking?', targetCode: 'NET-102', lessonSlug: 'net-102-network-performance' },
    { slug: 'network-devices', title: 'Network Devices', targetCode: 'NET-101', lessonSlug: 'network-devices-overview' },
    { slug: 'network-topologies', title: 'Network Topologies', targetCode: 'NET-102', lessonSlug: 'network-topologies-overview' },
    { slug: 'osi-model', title: 'OSI Model', targetCode: 'NET-103', lessonSlug: 'osi-model-7-layers' },
    { slug: 'tcp-ip-model', title: 'TCP/IP Model', targetCode: 'NET-103', lessonSlug: 'tcp-ip-4-layers' },
    { slug: 'ip-addressing-ipv4', title: 'IP Addressing (IPv4)', targetCode: 'NET-202', lessonSlug: 'ip-addressing-ipv4-overview' },
    { slug: 'subnetting', title: 'Subnetting & CIDR', targetCode: 'NET-202', lessonSlug: 'subnetting-cidr-overview' },
    { slug: 'ipv6-foundations', title: 'IPv6 Foundations', targetCode: 'NET-203', lessonSlug: 'ipv6-foundations-overview' },
    { slug: 'ethernet-mac', title: 'Ethernet & MAC Addresses', targetCode: 'NET-201', lessonSlug: 'ethernet-mac-addresses-overview' },
    { slug: 'arp-protocol', title: 'ARP Protocol', targetCode: 'NET-203', lessonSlug: 'arp-protocol-overview' },
    { slug: 'dhcp-dns', title: 'DHCP & DNS', targetCode: 'NET-203', lessonSlug: 'dhcp-dns-overview' },
    { slug: 'tcp-udp', title: 'TCP & UDP Transport', targetCode: 'NET-204', lessonSlug: 'tcp-udp-transport-overview' },
    { slug: 'routing-fundamentals', title: 'Routing Fundamentals', targetCode: 'NET-303', lessonSlug: 'routing-fundamentals-overview' },
    { slug: 'switching-vlans', title: 'Switching & VLANs', targetCode: 'NET-301', lessonSlug: 'switching-vlans-overview' },
    { slug: 'network-security', title: 'Network Security Basics', targetCode: 'NET-305', lessonSlug: 'network-security-basics-overview' },
    { slug: 'firewalls-acls', title: 'Firewalls & ACLs', targetCode: 'NET-305', lessonSlug: 'firewalls-acls-overview' },
    { slug: 'nat-pat', title: 'NAT & PAT', targetCode: 'NET-401', lessonSlug: 'nat-pat-overview' },
    { slug: 'vpn-crypto', title: 'VPN & Cryptography', targetCode: 'NET-402', lessonSlug: 'vpn-cryptography-overview' },
    { slug: 'wireless-networking', title: 'Wireless Networking', targetCode: 'NET-102', lessonSlug: 'wireless-networking-overview' },
    { slug: 'network-troubleshooting', title: 'Network Troubleshooting', targetCode: 'NET-TROUBLESHOOT', lessonSlug: 'network-troubleshooting-overview' },
    { slug: 'sdn-cloud', title: 'SDN & Cloud Networking', targetCode: 'NET-403', lessonSlug: 'sdn-cloud-networking-overview' },
  ];

  for (let idx = 0; idx < legacyTopics.length; idx++) {
    const tDef = legacyTopics[idx];

    // Seed legacy Course wrapper for backward query compatibility
    const legCourse = await prisma.course.upsert({
      where: { slug: tDef.slug },
      update: { title: tDef.title, code: `LEGACY-${idx + 1}`, published: false },
      create: {
        slug: tDef.slug,
        code: `LEGACY-${idx + 1}`,
        order: 100 + idx,
        title: tDef.title,
        tagline: `Master ${tDef.title}`,
        category: 'Fundamentals',
        description: `Legacy course wrapper for ${tDef.title}`,
        level: CourseLevel.BEGINNER,
        icon: 'Network',
        estimatedHours: 3,
        published: false,
      },
    });

    const legMod = await prisma.module.upsert({
      where: { id: `mod-legacy-${tDef.slug}` },
      update: { courseId: legCourse.id, title: `Module 1: ${tDef.title}` },
      create: { id: `mod-legacy-${tDef.slug}`, courseId: legCourse.id, title: `Module 1: ${tDef.title}`, description: tDef.title, order: 1 },
    });

    if (benchmarkSlugs.has(tDef.lessonSlug)) {
      continue; // Handled with full 18-step metadata by BENCHMARK_LESSONS_FULL
    }

    const targetCId = courseMap.get(tDef.targetCode) || defaultTargetCourseId;
    const targetMId = flagshipModuleMap.get(tDef.targetCode) || targetModuleMap.get(targetCId) || legMod.id;

    const lesson = await prisma.lesson.upsert({
      where: { slug: tDef.lessonSlug },
      update: {
        moduleId: targetMId,
        title: tDef.title,
        type: LessonType.THEORY,
        durationMinutes: 15,
        order: idx + 1,
        introduction: `Overview lesson for ${tDef.title}`,
      },
      create: {
        moduleId: targetMId,
        title: tDef.title,
        slug: tDef.lessonSlug,
        type: LessonType.THEORY,
        durationMinutes: 15,
        order: idx + 1,
        introduction: `Overview lesson for ${tDef.title}`,
      },
    });

    // Quiz Check
    await prisma.quiz.upsert({
      where: { id: `quiz-${tDef.lessonSlug}` },
      update: { lessonId: lesson.id, title: `${tDef.title} Quiz` },
      create: { id: `quiz-${tDef.lessonSlug}`, lessonId: lesson.id, title: `${tDef.title} Quiz` },
    });

    // Guided Lab Check
    const labCount = await prisma.lessonLab.count({ where: { lessonId: lesson.id } });
    if (labCount === 0) {
      await prisma.lessonLab.create({
        data: {
          lessonId: lesson.id,
          title: `Guided Practice: ${tDef.title}`,
          instructions: 'Execute CLI network commands in the terminal environment.',
          initialTopologyJson: {},
        },
      });
    }
  }

  // Handle any pre-existing historical lesson aliases to guarantee 100% curriculum coverage in flagship modules
  const legacyLessonAliases: Record<string, string> = {
    'what-is-computer-networking': 'NET-102',
  };
  for (const [legacySlug, targetCode] of Object.entries(legacyLessonAliases)) {
    const existing = await prisma.lesson.findUnique({ where: { slug: legacySlug } });
    if (existing) {
      const targetModId = flagshipModuleMap.get(targetCode);
      if (targetModId) {
        await prisma.lesson.update({
          where: { slug: legacySlug },
          data: { moduleId: targetModId },
        });
      }
    }
  }

  // 5. Seed Assessment 2.0 Question Bank (170 Comprehensive Questions)
  console.log('📝 Seeding Assessment 2.0 Question Bank (170 High-Quality Questions)...');
  // Clean up legacy placeholder questions
  const deletedPlaceholders = await prisma.quizQuestion.deleteMany({
    where: {
      OR: [
        { questionText: { startsWith: '[EASY]' } },
        { quizId: 'quiz-net-101-bits-bytes-binary-hex' },
      ],
    },
  });
  if (deletedPlaceholders.count > 0) {
    console.log(`  🧹 Cleaned ${deletedPlaceholders.count} legacy/updated quiz questions.`);
  }

  let seededQCount = 0;
  for (const qDef of EXPANDED_ASSESSMENT_QUESTION_BANK) {
    const existingQ = await prisma.quizQuestion.findFirst({
      where: { quizId: qDef.quizId, questionText: qDef.text },
    });

    if (existingQ) {
      await prisma.quizQuestion.update({
        where: { id: existingQ.id },
        data: {
          optionsJson: qDef.options,
          correctOption: qDef.correctOption,
          explanation: qDef.explanation,
          explanationsJson: qDef.explanationsJson,
          difficulty: qDef.difficulty,
          cognitiveLevel: qDef.cognitiveLevel,
          questionType: qDef.questionType,
          concept: qDef.concept,
          points: qDef.points ?? 10,
        },
      });
    } else {
      await prisma.quizQuestion.create({
        data: {
          quizId: qDef.quizId,
          questionText: qDef.text,
          optionsJson: qDef.options,
          correctOption: qDef.correctOption,
          explanation: qDef.explanation,
          explanationsJson: qDef.explanationsJson,
          difficulty: qDef.difficulty,
          cognitiveLevel: qDef.cognitiveLevel,
          questionType: qDef.questionType,
          concept: qDef.concept,
          points: qDef.points ?? 10,
        },
      });
    }
    seededQCount++;
  }
  console.log(`  ✓ Successfully seeded/updated ${seededQCount} questions across 40 curriculum quizzes!`);
  console.log('🏆 Seeding Achievement Catalog...');
  const achievementsData = [
    { slug: 'FIRST_STEP', title: 'First Step', description: 'Completed your first interactive networking lesson.', badgeIcon: 'Zap', category: AchievementCategory.LEARNING, points: 50, isActive: true, criteriaJson: { type: 'LESSON_COMPLETED', count: 1 } },
    { slug: 'FIRST_QUIZ', title: 'First Knowledge Check', description: 'Passed your first lesson quiz assessment.', badgeIcon: 'CheckSquare', category: AchievementCategory.ASSESSMENT, points: 50, isActive: true, criteriaJson: { type: 'QUIZ_PASSED', count: 1 } },
    { slug: 'PERFECT_SCORE', title: 'Perfect Score', description: 'Achieved a 100% score on a qualifying quiz assessment.', badgeIcon: 'Award', category: AchievementCategory.ASSESSMENT, points: 100, isActive: true, criteriaJson: { type: 'PERFECT_QUIZ_SCORE', score: 100 } },
    { slug: 'FIRST_LAB', title: 'First Lab Completed', description: 'Successfully completed your first practical lab exercise.', badgeIcon: 'Terminal', category: AchievementCategory.PRACTICAL, points: 75, isActive: true, criteriaJson: { type: 'LAB_PASSED', count: 1 } },
    { slug: 'PACKET_MASTER', title: 'Packet Master', description: 'Mastered network packet encapsulation and packet tracing.', badgeIcon: 'Network', category: AchievementCategory.SKILL, points: 150, isActive: false, criteriaJson: { type: 'MASTERY_RESERVED', module: 'PACKET_INSPECTION' } },
    { slug: 'SUBNET_SPECIALIST', title: 'Subnet Specialist', description: 'Mastered IPv4 subnetting, CIDR calculations, and network partitioning.', badgeIcon: 'Cpu', category: AchievementCategory.SKILL, points: 150, isActive: false, criteriaJson: { type: 'MASTERY_RESERVED', module: 'SUBNETTING' } },
    { slug: 'HANDSHAKE_HERO', title: 'Handshake Hero', description: 'Mastered TCP stateful connection handshakes and packet flags.', badgeIcon: 'Handshake', category: AchievementCategory.SKILL, points: 150, isActive: false, criteriaJson: { type: 'MASTERY_RESERVED', module: 'TCP_HANDSHAKE' } },
    { slug: 'SECURITY_GUARDIAN', title: 'Security Guardian', description: 'Mastered network security fundamentals, firewalls, and encryption.', badgeIcon: 'Shield', category: AchievementCategory.SKILL, points: 200, isActive: false, criteriaJson: { type: 'MASTERY_RESERVED', module: 'SECURITY' } },
    { slug: 'COURSE_COMPLETE', title: 'Course Completionist', description: 'Completed 100% of all lessons and assessments in a course.', badgeIcon: 'CheckCircle2', category: AchievementCategory.COMPLETION, points: 200, isActive: true, criteriaJson: { type: 'COURSE_COMPLETE' } },
    { slug: 'NETVISION_SCHOLAR', title: 'NetVision Scholar', description: 'Earned multiple official networking completion certificates.', badgeIcon: 'GraduationCap', category: AchievementCategory.MILESTONE, points: 300, isActive: false, criteriaJson: { type: 'MILESTONE_RESERVED', certificatesCount: 3 } },
  ];

  for (const ach of achievementsData) {
    await prisma.achievement.upsert({
      where: { slug: ach.slug },
      update: ach,
      create: ach,
    });
  }

  // 6. Seed Authoritative Professional Certification Definitions (6 Canonical Credentials)
  console.log('🎓 Seeding Authoritative Professional Certification Definitions (6 Canonical Credentials)...');
  for (const cred of CANONICAL_CREDENTIALS) {
    const levelEnum =
      cred.level === 'FOUNDATIONAL'
        ? CourseLevel.FOUNDATIONAL
        : cred.level === 'INTERMEDIATE'
        ? CourseLevel.INTERMEDIATE
        : cred.level === 'ADVANCED'
        ? CourseLevel.ADVANCED
        : CourseLevel.BEGINNER;

    const requirements = cred.isMastery
      ? {
          requiredCourseCodes: ['NV-C01', 'NV-C02', 'NV-C03', 'NV-C04', 'NV-C05'],
          requiredCredentialCodes: ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'],
          minAssessmentAvg: 85,
          requireAllLabs: true,
          isMastery: true,
        }
      : {
          requiredCourseCodes: [cred.courseCode!],
          minAssessmentAvg: 80,
          requireAllLabs: true,
          isMastery: false,
        };

    const policyConfig = {
      maxAttempts: 3,
      cooldownAfterFirstFailure: 86400,
      cooldownAfterSubsequentFailure: 259200,
      rollingWindowDays: cred.isMastery ? 90 : 30,
    };

    const theoryConfig = {
      questionCount: cred.isMastery ? 75 : 40,
      durationSeconds: cred.isMastery ? 7200 : 3600,
      passingScore: cred.isMastery ? 85 : 80,
      troubleshootingMinimum: cred.isMastery ? 80 : 70,
    };

    const practicalConfig = {
      durationSeconds: cred.isMastery ? 7200 : 5400,
      passingScore: cred.isMastery ? 85 : 80,
      maximumHints: cred.isMastery ? 0 : 2,
      hintPenalty: 5,
      scenarioCode: `${cred.code}-PRACTICAL-SCENARIO`,
      scoringWeights: cred.isMastery
        ? {
            theoryWeight: 40,
            practicalWeight: 35,
            packetAnalysisWeight: 25,
            passingScore: 85,
          }
        : {
            theoryWeight: 20,
            practicalWeight: 40,
            troubleshootingWeight: 25,
            packetAnalysisWeight: 15,
            componentMinimum: 70,
            passingScore: 80,
          },
    };

    await prisma.certificationDefinition.upsert({
      where: { code: cred.code },
      update: {
        title: cred.title,
        description: cred.description,
        level: levelEnum,
        isActive: true,
        requirementsJson: requirements,
        policyJson: policyConfig,
        theoryConfigJson: theoryConfig,
        practicalConfigJson: practicalConfig,
      },
      create: {
        code: cred.code,
        title: cred.title,
        description: cred.description,
        level: levelEnum,
        isActive: true,
        requirementsJson: requirements,
        policyJson: policyConfig,
        theoryConfigJson: theoryConfig,
        practicalConfigJson: practicalConfig,
      },
    });
    console.log(`  ✓ Credential Definition [${cred.code}] "${cred.title}"`);
  }

  // Preserve legacy credentials as inactive (zero rows deleted, guaranteed present in fresh seed)
  const legacyCredDefs = [
    {
      code: 'NV-NET',
      title: 'NetVision Certified Network Administrator (Legacy)',
      description: 'Historical comprehensive network administration certification covering IPv4 CIDR subnetting, VLAN configuration, routing, and firewall management.',
      requirementsJson: { requiredCourseCodes: ['NV-C02', 'NV-C03'], minAssessmentAvg: 80, requireAllLabs: true },
    },
    {
      code: 'NV-SEC',
      title: 'NetVision Certified Security Specialist (Legacy)',
      description: 'Historical network security and secure connectivity certification.',
      requirementsJson: { requiredCourseCodes: ['NV-C04'], minAssessmentAvg: 80, requireAllLabs: true },
    },
    {
      code: 'NV-CLOUD',
      title: 'NetVision Certified Cloud Specialist (Legacy)',
      description: 'Historical cloud networking certification.',
      requirementsJson: {},
    },
    {
      code: 'NV-AIOPS',
      title: 'NetVision Certified AIOps Specialist (Legacy)',
      description: 'Historical automated operations certification.',
      requirementsJson: {},
    },
  ];

  for (const leg of legacyCredDefs) {
    await prisma.certificationDefinition.upsert({
      where: { code: leg.code },
      update: {
        isActive: false,
        requirementsJson: leg.requirementsJson,
      },
      create: {
        code: leg.code,
        title: leg.title,
        description: leg.description,
        level: CourseLevel.INTERMEDIATE,
        isActive: false,
        requirementsJson: leg.requirementsJson,
        policyJson: {
          maxAttempts: 3,
          rollingWindowDays: 30,
          cooldownAfterFirstFailure: 86400,
          cooldownAfterSubsequentFailure: 259200,
        },
      },
    });
    console.log(`  ℹ Preserved historical credential [${leg.code}] as inactive`);
  }

  console.log('✅ Phase 12C Curriculum Migration & Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Migration Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
