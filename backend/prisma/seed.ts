import { PrismaClient, CourseLevel, LessonType, Role, AchievementCategory } from '@prisma/client';
import * as argon2 from 'argon2';
import { TARGET_16_COURSES } from '../src/topics/curriculum-migration';
import { BENCHMARK_LESSONS_FULL } from '../src/topics/benchmark-lessons-content';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Executing Phase 12C Curriculum Migration & Seed (16 Progressive Target Courses + Data Preservation)...');

  // Helper builder function for questions
  const createQ = (
    text: string,
    opts: string[],
    correctIdx: number,
    whyCorrect: string,
    wrongWhys: Record<number, string>
  ) => ({
    questionText: text,
    optionsJson: opts,
    correctOption: correctIdx,
    explanation: whyCorrect,
    explanationsJson: wrongWhys,
  });

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

  // 2. Upsert 16 Target Progressive Courses
  console.log('📚 Upserting 16 Progressive Target Courses (NET-101 to NET-404)...');
  const courseMap = new Map<string, string>(); // code -> course.id
  const targetModuleMap = new Map<string, string>(); // course.id -> first module.id

  for (const cDef of TARGET_16_COURSES) {
    const course = await prisma.course.upsert({
      where: { slug: cDef.slug },
      update: {
        code: cDef.code,
        order: cDef.order,
        title: cDef.title,
        tagline: cDef.tagline,
        category: cDef.category,
        description: cDef.description,
        level: cDef.level,
        icon: cDef.icon,
        estimatedHours: cDef.estimatedHours,
        published: true,
        prerequisitesJson: cDef.prerequisitesJson,
      },
      create: {
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
        published: true,
        prerequisitesJson: cDef.prerequisitesJson,
      },
    });

    courseMap.set(cDef.code, course.id);

    // Upsert Module 1 for this target course
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
    console.log(`  ✓ Course [${cDef.code}] "${cDef.title}" (${cDef.level}) -> Module [${mod.title}]`);
  }

  // 3. Upsert Benchmark Deep Lessons (NET-101, NET-202, NET-404)
  console.log('📌 Upserting Benchmark Lessons with Full 18-Step Architecture, Questions & Labs...');
  for (const bDef of BENCHMARK_LESSONS_FULL) {
    const targetCourseId = courseMap.get(bDef.courseCode);
    if (!targetCourseId) continue;
    const targetModId = targetModuleMap.get(targetCourseId)!;

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
        contentJson: bDef.stepMetadata as any,
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
        contentJson: bDef.stepMetadata as any,
      },
    });

    // Upsert Benchmark Quiz
    const quiz = await prisma.quiz.upsert({
      where: { id: `quiz-${bDef.slug}` },
      update: { lessonId: bLesson.id, title: `${bDef.title} Quiz Assessment` },
      create: { id: `quiz-${bDef.slug}`, lessonId: bLesson.id, title: `${bDef.title} Quiz Assessment` },
    });

    // Upsert Benchmark Quiz Questions
    for (const qDef of bDef.questions) {
      const existingQ = await prisma.quizQuestion.findFirst({
        where: { quizId: quiz.id, questionText: qDef.text },
      });

      if (!existingQ) {
        await prisma.quizQuestion.create({
          data: {
            quizId: quiz.id,
            questionText: qDef.text,
            optionsJson: qDef.options,
            correctOption: qDef.correctOption,
            explanation: qDef.explanation,
            explanationsJson: qDef.explanationsJson,
            difficulty: qDef.difficulty,
            cognitiveLevel: qDef.cognitiveLevel,
            questionType: qDef.questionType,
            concept: qDef.concept,
          },
        });
      }
    }

    // Upsert Benchmark Lab
    const existingLab = await prisma.lessonLab.findFirst({
      where: { lessonId: bLesson.id },
    });

    if (!existingLab) {
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

    console.log(`  ✓ Benchmark Deep Lesson [${bDef.courseCode}] "${bDef.title}" (${bDef.questions.length} questions, 1 lab)`);
  }

  // 4. Seed Legacy 22 Courses & Map 35 Lessons to Target Modules
  const defaultTargetCourseId = courseMap.get('NET-101')!;
  const defaultTargetModId = targetModuleMap.get(defaultTargetCourseId)!;

  // Level 0 Legacy Course
  const level0Course = await prisma.course.upsert({
    where: { slug: 'level-0-foundations' },
    update: { title: 'Level 0: Computer & Network Foundations', level: CourseLevel.FOUNDATIONAL, code: 'LEGACY-0' },
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
      published: true,
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
    { title: '14. Basic Network Troubleshooting Workflow', slug: 'level-0-basic-network-troubleshooting-workflow', targetCode: 'NET-404' },
  ];

  for (let idx = 0; idx < level0Lessons.length; idx++) {
    const lDef = level0Lessons[idx];
    const targetCId = courseMap.get(lDef.targetCode) || defaultTargetCourseId;
    const targetMId = targetModuleMap.get(targetCId) || level0Mod.id;

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
    const quiz = await prisma.quiz.upsert({
      where: { id: `quiz-${lDef.slug}` },
      update: { lessonId: lesson.id, title: `${lDef.title} Quiz` },
      create: { id: `quiz-${lDef.slug}`, lessonId: lesson.id, title: `${lDef.title} Quiz` },
    });

    const qCount = await prisma.quizQuestion.count({ where: { quizId: quiz.id } });
    if (qCount === 0) {
      const q1 = createQ(
        `[EASY] What is the primary purpose of ${lDef.title}?`,
        ['To facilitate network communication', 'To hardware format disk drives', 'To CPU clock boost', 'To replace electricity'],
        0,
        'Networking concepts facilitate digital communication.',
        { 1: 'Formatting is disk storage.', 2: 'CPU clock is hardware performance.', 3: 'Electricity is physical power.' }
      );
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          questionText: q1.questionText,
          optionsJson: q1.optionsJson,
          correctOption: q1.correctOption,
          explanation: q1.explanation,
          explanationsJson: q1.explanationsJson,
        },
      });
    }

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
    { slug: 'networking-fundamentals', title: 'What is Computer Networking?', targetCode: 'NET-102', lessonSlug: 'what-is-computer-networking' },
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
    { slug: 'network-troubleshooting', title: 'Network Troubleshooting', targetCode: 'NET-404', lessonSlug: 'network-troubleshooting-overview' },
    { slug: 'sdn-cloud', title: 'SDN & Cloud Networking', targetCode: 'NET-403', lessonSlug: 'sdn-cloud-networking-overview' },
  ];

  for (let idx = 0; idx < legacyTopics.length; idx++) {
    const tDef = legacyTopics[idx];

    // Seed legacy Course wrapper for backward query compatibility
    const legCourse = await prisma.course.upsert({
      where: { slug: tDef.slug },
      update: { title: tDef.title, code: `LEGACY-${idx + 1}` },
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
        published: true,
      },
    });

    const legMod = await prisma.module.upsert({
      where: { id: `mod-legacy-${tDef.slug}` },
      update: { courseId: legCourse.id, title: `Module 1: ${tDef.title}` },
      create: { id: `mod-legacy-${tDef.slug}`, courseId: legCourse.id, title: `Module 1: ${tDef.title}`, description: tDef.title, order: 1 },
    });

    const targetCId = courseMap.get(tDef.targetCode) || defaultTargetCourseId;
    const targetMId = targetModuleMap.get(targetCId) || legMod.id;

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
    const quiz = await prisma.quiz.upsert({
      where: { id: `quiz-${tDef.lessonSlug}` },
      update: { lessonId: lesson.id, title: `${tDef.title} Quiz` },
      create: { id: `quiz-${tDef.lessonSlug}`, lessonId: lesson.id, title: `${tDef.title} Quiz` },
    });

    const qCount = await prisma.quizQuestion.count({ where: { quizId: quiz.id } });
    if (qCount === 0) {
      const q1 = createQ(
        `[EASY] What is the primary concept behind ${tDef.title}?`,
        ['Network protocol standards', 'Computer monitor colors', 'Hard drive sector size', 'Keyboard layout'],
        0,
        'Networking protocols govern digital communications.',
        { 1: 'Monitor colors are display specs.', 2: 'Hard drive sectors are disk storage.', 3: 'Keyboard layout is input hardware.' }
      );
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          questionText: q1.questionText,
          optionsJson: q1.optionsJson,
          correctOption: q1.correctOption,
          explanation: q1.explanation,
          explanationsJson: q1.explanationsJson,
        },
      });
    }

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

  // 5. Seed Achievement Catalog
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

  // 6. Seed Initial Professional Certification Definition (NV-NET)
  console.log('🎓 Seeding Professional Certification Definition (NV-NET)...');
  await prisma.certificationDefinition.upsert({
    where: { code: 'NV-NET' },
    update: {
      title: 'NetVision Certified Network Administrator',
      description: 'Demonstrates professional competence in Ethernet Layer 2 switching, IPv4 CIDR subnetting, core IP services (ARP, ICMP, DNS, DHCP), and Transport Layer TCP/UDP protocol operations.',
      level: CourseLevel.BEGINNER,
      isActive: true,
      requirementsJson: {
        requiredCourseCodes: ['NET-201', 'NET-202', 'NET-203', 'NET-204'],
        minAssessmentAvg: 80,
        requireAllLabs: true,
      },
      policyJson: {
        maxAttempts: 3,
        cooldownAfterFirstFailure: 86400, // 24 hours
        cooldownAfterSubsequentFailure: 259200, // 72 hours
        rollingWindowDays: 30,
      },
      theoryConfigJson: {
        questionCount: 50,
        durationSeconds: 3600, // 60 minutes
        passingScore: 80,
        troubleshootingMinimum: 70,
      },
      practicalConfigJson: {
        durationSeconds: 5400, // 90 minutes
        passingScore: 80,
        maximumHints: 2,
        hintPenalty: 5, // 5 percentage points penalty per hint
        scenarioCode: 'NV-NET-PRACTICAL-SCENARIO-1',
      },
    },
    create: {
      code: 'NV-NET',
      title: 'NetVision Certified Network Administrator',
      description: 'Demonstrates professional competence in Ethernet Layer 2 switching, IPv4 CIDR subnetting, core IP services (ARP, ICMP, DNS, DHCP), and Transport Layer TCP/UDP protocol operations.',
      level: CourseLevel.BEGINNER,
      isActive: true,
      requirementsJson: {
        requiredCourseCodes: ['NET-201', 'NET-202', 'NET-203', 'NET-204'],
        minAssessmentAvg: 80,
        requireAllLabs: true,
      },
      policyJson: {
        maxAttempts: 3,
        cooldownAfterFirstFailure: 86400, // 24 hours
        cooldownAfterSubsequentFailure: 259200, // 72 hours
        rollingWindowDays: 30,
      },
      theoryConfigJson: {
        questionCount: 50,
        durationSeconds: 3600, // 60 minutes
        passingScore: 80,
        troubleshootingMinimum: 70,
      },
      practicalConfigJson: {
        durationSeconds: 5400, // 90 minutes
        passingScore: 80,
        maximumHints: 2,
        hintPenalty: 5, // 5 percentage points penalty per hint
        scenarioCode: 'NV-NET-PRACTICAL-SCENARIO-1',
      },
    },
  });

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
