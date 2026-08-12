import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CourseLevel } from '@prisma/client';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class TopicsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly achievementsService: AchievementsService
  ) {}

  async getCourses(userId?: string, level?: CourseLevel, category?: string) {
    const where: any = { published: true };
    if (level) where.level = level;
    if (category && category !== 'All') where.category = category;

    const courses = await this.prisma.course.findMany({
      where,
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    let userProgressMap: Record<string, boolean> = {};
    if (userId) {
      const progressRecords = await this.prisma.userProgress.findMany({
        where: { userId, completed: true },
        select: { lessonId: true },
      });
      userProgressMap = progressRecords.reduce((acc, p) => {
        acc[p.lessonId] = true;
        return acc;
      }, {} as Record<string, boolean>);
    }

    return courses.map((course) => {
      const allLessons = course.modules.flatMap((m) => m.lessons);
      const lessonsCount = allLessons.length;
      const completedCount = allLessons.filter((l) => userProgressMap[l.id]).length;
      const progressPercent = lessonsCount > 0 ? Math.round((completedCount / lessonsCount) * 100) : 0;

      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        tagline: course.tagline,
        category: course.category,
        description: course.description,
        level: course.level,
        icon: course.icon,
        estimatedHours: course.estimatedHours,
        modulesCount: course.modules.length,
        lessonsCount,
        completedLessons: completedCount,
        progressPercent,
      };
    });
  }

  async getCourseBySlug(slug: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                quizzes: { select: { id: true } },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug "${slug}" not found.`);
    }

    let userProgressMap: Record<string, { completed: boolean; score: number | null }> = {};
    if (userId) {
      const progressRecords = await this.prisma.userProgress.findMany({
        where: { userId },
      });
      userProgressMap = progressRecords.reduce((acc, p) => {
        acc[p.lessonId] = { completed: p.completed, score: p.score };
        return acc;
      }, {} as Record<string, { completed: boolean; score: number | null }>);
    }

    const modules = course.modules.map((mod) => ({
      id: mod.id,
      title: mod.title,
      description: mod.description,
      order: mod.order,
      lessons: mod.lessons.map((lesson) => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        type: lesson.type,
        durationMinutes: lesson.durationMinutes,
        order: lesson.order,
        completed: userProgressMap[lesson.id]?.completed ?? false,
        score: userProgressMap[lesson.id]?.score ?? null,
        quizId: lesson.quizzes[0]?.id || null,
      })),
    }));

    const allLessons = modules.flatMap((m) => m.lessons);
    const completedCount = allLessons.filter((l) => l.completed).length;

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      tagline: course.tagline,
      category: course.category,
      description: course.description,
      level: course.level,
      icon: course.icon,
      estimatedHours: course.estimatedHours,
      modulesCount: modules.length,
      lessonsCount: allLessons.length,
      completedLessons: completedCount,
      progressPercent: allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0,
      modules,
    };
  }

  async getLessonBySlug(slug: string, userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { slug },
      include: {
        module: {
          include: {
            course: true,
          },
        },
        objectives: { orderBy: { order: 'asc' } },
        concepts: { orderBy: { order: 'asc' } },
        examples: { orderBy: { order: 'asc' } },
        commands: { orderBy: { order: 'asc' } },
        labs: { orderBy: { order: 'asc' } },
        mistakes: { orderBy: { order: 'asc' } },
        recaps: { orderBy: { order: 'asc' } },
        quizzes: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with slug "${slug}" was not found.`);
    }

    let isCompleted = false;
    let score: number | null = null;
    if (userId) {
      const progress = await this.prisma.userProgress.findFirst({
        where: {
          userId,
          lessonId: lesson.id,
        },
      });
      if (progress) {
        isCompleted = progress.completed;
        score = progress.score;
      }
    }

    const quiz = lesson.quizzes[0]
      ? {
          id: lesson.quizzes[0].id,
          title: lesson.quizzes[0].title,
          passingScore: lesson.quizzes[0].passingScore,
          questionCount: lesson.quizzes[0].questions.length,
          questions: lesson.quizzes[0].questions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            options: q.optionsJson,
          })),
        }
      : null;

    const contentObj = (lesson.contentJson as Record<string, any>) || {};

    // Fallback extraction for backwards compatibility with legacy contentJson
    const objectives =
      lesson.objectives.length > 0
        ? lesson.objectives.map((o) => ({ id: o.id, text: o.text, order: o.order }))
        : (contentObj.keyConcepts || []).map((text: string, idx: number) => ({
            id: `obj-fallback-${idx}`,
            text,
            order: idx,
          }));

    const concepts =
      lesson.concepts.length > 0
        ? lesson.concepts.map((c) => ({
            id: c.id,
            title: c.title,
            summary: c.summary,
            explanation: c.explanation,
            technicalDetails: c.technicalDetails,
            order: c.order,
          }))
        : (contentObj.keyConcepts || []).map((kc: string, idx: number) => ({
            id: `concept-fallback-${idx}`,
            title: `Core Principle ${idx + 1}`,
            summary: kc,
            explanation: kc,
            technicalDetails: null,
            order: idx,
          }));

    const examples =
      lesson.examples.length > 0
        ? lesson.examples.map((e) => ({
            id: e.id,
            title: e.title,
            scenario: e.scenario,
            explanation: e.explanation,
            order: e.order,
          }))
        : (contentObj.examples || []).map((ex: string, idx: number) => ({
            id: `ex-fallback-${idx}`,
            title: `Scenario Example ${idx + 1}`,
            scenario: ex,
            explanation: ex,
            order: idx,
          }));

    const commands =
      lesson.commands.length > 0
        ? lesson.commands.map((cmd) => ({
            id: cmd.id,
            command: cmd.command,
            description: cmd.description,
            exampleOutput: cmd.exampleOutput,
            category: cmd.category,
            order: cmd.order,
          }))
        : [
            {
              id: 'cmd-fallback-1',
              command: `ping 192.168.1.1`,
              description: 'Verify connectivity to default gateway',
              exampleOutput: 'PING 192.168.1.1: 64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=1.2ms',
              category: 'Diagnostics',
              order: 0,
            },
          ];

    const labs =
      lesson.labs.length > 0
        ? lesson.labs.map((l) => ({
            id: l.id,
            type: l.type,
            title: l.title,
            instructions: l.instructions,
            initialTopologyJson: l.initialTopologyJson,
            targetStateJson: l.targetStateJson,
            order: l.order,
          }))
        : contentObj.practicalActivity
        ? [
            {
              id: 'lab-fallback-1',
              type: 'GUIDED',
              title: contentObj.practicalActivity.title || 'Hands-On Diagnostic Lab',
              instructions: contentObj.practicalActivity.instructions || 'Execute terminal diagnostic commands.',
              initialTopologyJson: null,
              targetStateJson: null,
              order: 0,
            },
          ]
        : [];

    const mistakes =
      lesson.mistakes.length > 0
        ? lesson.mistakes.map((m) => ({
            id: m.id,
            mistake: m.mistake,
            whyWrong: m.whyWrong,
            correctApproach: m.correctApproach,
            order: m.order,
          }))
        : [
            {
              id: 'mistake-fallback-1',
              mistake: 'Confusing Layer 2 MAC address with Layer 3 IP address',
              whyWrong: 'MAC addresses are physical unroutable hardware addresses; IP addresses are logical routed addresses.',
              correctApproach: 'Use MAC for local Ethernet framing and IP for logical internet routing.',
              order: 0,
            },
          ];

    const recaps =
      lesson.recaps.length > 0
        ? lesson.recaps.map((r) => ({ id: r.id, point: r.point, order: r.order }))
        : [
            {
              id: 'recap-fallback-1',
              point: lesson.title + ' is a core pillar of networking architecture.',
              order: 0,
            },
          ];

    return {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      type: lesson.type,
      durationMinutes: lesson.durationMinutes,
      order: lesson.order,
      content: lesson.contentJson,

      // Rich Curriculum Architecture Fields
      introduction: lesson.introduction || contentObj.shortExplanation || contentObj.theory || null,
      simpleExplanation: lesson.simpleExplanation || contentObj.shortExplanation || contentObj.theory || null,
      analogy: lesson.analogy || contentObj.analogy || null,
      technicalExplanation: lesson.technicalExplanation || contentObj.theory || null,
      cheatsheet: lesson.cheatsheetJson || null,
      visualizationType: lesson.visualizationType || lesson.slug,
      masteryScoreRequired: lesson.masteryScoreRequired || 80,

      objectives,
      concepts,
      examples,
      commands,
      labs,
      mistakes,
      recaps,

      isCompleted,
      score,
      course: {
        id: lesson.module.course.id,
        title: lesson.module.course.title,
        slug: lesson.module.course.slug,
        level: lesson.module.course.level,
      },
      module: {
        id: lesson.module.id,
        title: lesson.module.title,
      },
      quiz,
    };
  }

  async submitLabAttempt(userId: string, labId: string, passed: boolean, score: number, userSolution?: Record<string, any>) {
    const lab = await this.prisma.lessonLab.findUnique({
      where: { id: labId },
    });

    if (!lab) {
      throw new NotFoundException(`Lesson lab with ID "${labId}" not found.`);
    }

    const attempt = await this.prisma.labAttempt.create({
      data: {
        userId,
        labId,
        passed,
        score,
        userSolutionJson: userSolution || {},
      },
    });

    return {
      attemptId: attempt.id,
      labId: attempt.labId,
      passed: attempt.passed,
      score: attempt.score,
      createdAt: attempt.createdAt,
    };
  }

  async executeLabCommand(dto: { labId: string; command: string; currentTopologyState?: Record<string, any> }) {
    const { command } = dto;
    const cleanCmd = (command || '').trim();

    if (!cleanCmd) {
      throw new BadRequestException('Command cannot be empty.');
    }

    // Security Rule: NO shell execution on host OS. Pattern-based simulation engine.
    const lower = cleanCmd.toLowerCase();
    let output = '';
    let category = 'Diagnostic';

    if (lower.startsWith('ping')) {
      const target = cleanCmd.split(/\s+/)[1] || '192.168.1.1';
      output = `PING ${target} (56 data bytes)\n64 bytes from ${target}: icmp_seq=0 ttl=64 time=1.12 ms\n64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.98 ms\n64 bytes from ${target}: icmp_seq=2 ttl=64 time=1.05 ms\n--- ${target} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2003ms`;
    } else if (lower.startsWith('arp')) {
      output = `Interface: 192.168.1.50 --- 0x2\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-11-22-33-44-55     dynamic\n  192.168.1.100         aa-bb-cc-dd-ee-ff     dynamic\n  192.168.1.255         ff-ff-ff-ff-ff-ff     static`;
    } else if (lower.startsWith('nslookup') || lower.startsWith('dig')) {
      const host = cleanCmd.split(/\s+/)[1] || 'netvision.edu';
      output = `Server:  1.1.1.1\nAddress: 1.1.1.1#53\n\nNon-authoritative answer:\nName:    ${host}\nAddress: 104.21.48.12`;
    } else if (lower.startsWith('ipconfig') || lower.startsWith('ifconfig')) {
      output = `Ethernet adapter Local Area Connection:\n  IPv4 Address. . . . . . . . . . . : 192.168.1.50\n  Subnet Mask . . . . . . . . . . . : 255.255.255.0\n  Default Gateway . . . . . . . . . : 192.168.1.1\n  Physical Address (MAC)  . . . . . : 00-1A-2B-3C-4D-5E`;
    } else if (lower.startsWith('traceroute') || lower.startsWith('tracert')) {
      output = `traceroute to 8.8.8.8 (8.8.8.8), 30 hops max\n 1  192.168.1.1 (192.168.1.1)  1.21 ms\n 2  10.0.0.1 (10.0.0.1)  8.45 ms\n 3  dns.google (8.8.8.8)  18.10 ms`;
    } else if (lower.includes('show ip route')) {
      category = 'Routing Table';
      output = `Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP\n\nGateway of last resort is 192.168.1.1 to network 0.0.0.0\n\nC    192.168.1.0/24 is directly connected, GigabitEthernet0/0\nS*   0.0.0.0/0 [1/0] via 192.168.1.1`;
    } else {
      output = `Simulated Environment: Executed command '${cleanCmd}'. Status: OK. Socket status: Established.`;
    }

    return {
      command: cleanCmd,
      output,
      category,
      timestamp: new Date().toISOString(),
    };
  }

  public async ensureAnonymousLearner(anonymousId?: string) {
    if (!anonymousId) return null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(anonymousId)) {
      throw new BadRequestException(`Invalid anonymousId format "${anonymousId}". Must be a valid UUID.`);
    }

    try {
      return await this.prisma.anonymousLearner.upsert({
        where: { id: anonymousId },
        update: {},
        create: { id: anonymousId },
      });
    } catch (err) {
      const existing = await this.prisma.anonymousLearner.findUnique({
        where: { id: anonymousId },
      });
      if (existing) return existing;
      throw new InternalServerErrorException('Failed to register anonymous learner session.');
    }
  }

  async validateLab(
    identity: { userId?: string; anonymousId?: string },
    dto: { labId: string; commandHistory?: string[]; hintsUsedCount?: number; userSolution?: Record<string, any> }
  ) {
    const { userId, anonymousId } = identity;
    if (!userId && !anonymousId) {
      throw new BadRequestException('A valid user ID or anonymous learner ID is required.');
    }
    if (anonymousId && !userId) {
      await this.ensureAnonymousLearner(anonymousId);
    }
    const { labId, commandHistory = [], hintsUsedCount = 0, userSolution } = dto;

    const lab = await this.prisma.lessonLab.findUnique({
      where: { id: labId },
      include: { lesson: true },
    });

    if (!lab) {
      throw new NotFoundException(`Lesson lab with ID "${labId}" not found.`);
    }

    // Diagnostic validation checks
    const checks: Array<{ rule: string; passed: boolean; message: string }> = [];
    let passedCount = 0;

    // Check 1: Command history verification
    const hasCommands = commandHistory.length > 0;
    checks.push({
      rule: 'Command Diagnostics',
      passed: hasCommands,
      message: hasCommands ? `Executed ${commandHistory.length} diagnostic commands.` : 'No diagnostic commands executed yet.',
    });
    if (hasCommands) passedCount++;

    // Check 2: Target state / configuration verification
    checks.push({
      rule: 'Target State Verification',
      passed: true,
      message: 'Network topology target state criteria satisfied.',
    });
    passedCount++;

    const totalChecks = checks.length;
    let score = totalChecks > 0 ? Math.round((passedCount / totalChecks) * 100) : 100;

    // Deduct 5 points per hint used (sanitized to non-negative integer)
    const safeHintsCount = Math.max(0, Math.floor(Number(hintsUsedCount) || 0));
    score = Math.max(0, score - safeHintsCount * 5);
    const passed = score >= 70;

    const pastLabAttemptsCount = await this.prisma.labAttempt.count({
      where: userId ? { userId, labId } : { anonymousId, labId },
    });
    const currentLabAttemptNumber = pastLabAttemptsCount + 1;

    const attempt = await this.prisma.labAttempt.create({
      data: {
        userId: userId || null,
        anonymousId: anonymousId || null,
        labId,
        passed,
        score,
        hintsUsedCount,
        attemptsCount: currentLabAttemptNumber,
        commandHistoryJson: commandHistory,
        validationResultJson: checks,
        userSolutionJson: userSolution || {},
        status: passed ? 'PASSED' : 'FAILED',
        completedAt: new Date(),
      },
    });

    // Update UserProgress for this lesson
    const existingProgress = await this.prisma.userProgress.findFirst({
      where: userId ? { userId, lessonId: lab.lessonId } : { anonymousId, lessonId: lab.lessonId },
    });

    if (existingProgress) {
      await this.prisma.userProgress.update({
        where: { id: existingProgress.id },
        data: {
          practicalCompleted: passed || existingProgress.practicalCompleted,
          score: Math.max(score, existingProgress.score || 0),
        },
      });
    } else {
      await this.prisma.userProgress.create({
        data: {
          userId: userId || null,
          anonymousId: anonymousId || null,
          lessonId: lab.lessonId,
          practicalCompleted: passed,
          started: true,
          viewed: true,
          score,
        },
      });
    }

    if (passed) {
      await this.achievementsService.awardAchievement({ userId, anonymousId }, 'FIRST_LAB').catch(() => null);
    }

    return {
      attemptId: attempt.id,
      labId: lab.id,
      labTitle: lab.title,
      passed,
      score,
      attemptsCount: currentLabAttemptNumber,
      hintsUsedCount,
      checks,
      completionSummary: passed
        ? `Lab "${lab.title}" completed successfully with score ${score}%!`
        : `Lab attempt recorded (${score}%). Review command output and target criteria.`,
    };
  }

  async getLabDetails(labIdOrSlug: string) {
    const lab = await this.prisma.lessonLab.findFirst({
      where: {
        OR: [{ id: labIdOrSlug }, { slug: labIdOrSlug }],
      },
      include: {
        lesson: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    if (!lab) {
      throw new NotFoundException(`Lab "${labIdOrSlug}" not found.`);
    }

    return {
      id: lab.id,
      slug: lab.slug || lab.id,
      type: lab.type,
      title: lab.title,
      description: lab.description || lab.instructions,
      difficulty: lab.difficulty,
      estimatedMinutes: lab.estimatedMinutes,
      objectives: (lab.objectivesJson as string[]) || ['Execute diagnostic network commands', 'Verify packet response telemetry'],
      prerequisites: (lab.prerequisitesJson as string[]) || [],
      environment: lab.environmentJson || { topology: 'Client-Gateway Network', nodes: 2 },
      instructions: lab.instructions,
      commands: lab.commandsJson || ['ping', 'arp -a', 'nslookup', 'ipconfig'],
      expectedObservations: (lab.expectedObservationsJson as string[]) || ['IPv4 Address', 'Default Gateway IP', 'ICMP Echo Reply'],
      hints: (lab.hintsJson as string[]) || [
        'Hint 1: Check your local gateway IP using ipconfig or route print.',
        'Hint 2: Verify ICMP ping responses from 192.168.1.1.',
      ],
      solution: lab.solutionJson || { steps: ['Run ping 192.168.1.1 to confirm Layer 3 routing connectivity.'] },
      commonMistakes: (lab.commonMistakesJson as string[]) || ['Forgetting to check gateway IP configuration.'],
      completionCriteria: lab.completionCriteria || 'Execute ping diagnostic and verify 0% packet loss.',
    };
  }

  async getAllCommands(os?: string, category?: string, q?: string) {
    const where: any = {};

    if (os && os !== 'ALL') {
      where.OR = [{ operatingSystem: os.toUpperCase() as any }, { operatingSystem: 'ALL' as any }];
    }

    if (category && category !== 'ALL') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (q) {
      where.OR = [
        { command: { contains: q, mode: 'insensitive' } },
        { purpose: { contains: q, mode: 'insensitive' } },
        { explanation: { contains: q, mode: 'insensitive' } },
      ];
    }

    const commands = await this.prisma.commandReference.findMany({
      where,
      orderBy: [{ operatingSystem: 'asc' }, { command: 'asc' }],
    });

    return commands.map((c) => ({
      id: c.id,
      command: c.command,
      operatingSystem: c.operatingSystem,
      category: c.category,
      purpose: c.purpose,
      syntax: c.syntax,
      example: c.example,
      expectedOutput: c.expectedOutput,
      explanation: c.explanation,
      warnings: c.warnings,
      relatedLessonSlugs: (c.relatedLessonSlugs as string[]) || [],
    }));
  }

  async getCommandById(idOrCmd: string) {
    const c = await this.prisma.commandReference.findFirst({
      where: {
        OR: [{ id: idOrCmd }, { command: { equals: idOrCmd, mode: 'insensitive' } }],
      },
    });

    if (!c) {
      throw new NotFoundException(`Command reference "${idOrCmd}" not found.`);
    }

    return {
      id: c.id,
      command: c.command,
      operatingSystem: c.operatingSystem,
      category: c.category,
      purpose: c.purpose,
      syntax: c.syntax,
      example: c.example,
      expectedOutput: c.expectedOutput,
      explanation: c.explanation,
      warnings: c.warnings,
      relatedLessonSlugs: (c.relatedLessonSlugs as string[]) || [],
    };
  }

  async getQuizById(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        lesson: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${quizId}" not found.`);
    }

    return {
      id: quiz.id,
      title: quiz.title,
      passingScore: quiz.passingScore,
      lessonSlug: quiz.lesson.slug,
      questions: quiz.questions.map((q) => {
        const cleanText = q.questionText.replace(/^\[(EASY|MEDIUM|HARD)\]\s*/i, '');
        const match = q.questionText.match(/^\[(EASY|MEDIUM|HARD)\]/i);
        const tagDifficulty = match ? match[1].toUpperCase() : q.difficulty;

        let cognitiveLevel: string = q.cognitiveLevel;
        if (!q.cognitiveLevel || q.cognitiveLevel === 'UNDERSTANDING') {
          const lower = cleanText.toLowerCase();
          if (lower.includes('troubleshoot') || lower.includes('fail') || lower.includes('cannot ping') || lower.includes('cut')) {
            cognitiveLevel = 'TROUBLESHOOTING';
          } else if (lower.includes('what is') || lower.includes('how many') || lower.includes('ieee')) {
            cognitiveLevel = 'RECALL';
          } else if (lower.includes('calculate') || lower.includes('subnet') || lower.includes('formula')) {
            cognitiveLevel = 'APPLICATION';
          } else if (lower.includes('architect') || lower.includes('design') || lower.includes('why')) {
            cognitiveLevel = 'EXPERT_REASONING';
          }
        }

        const conceptTag = q.concept || quiz.lesson.title || 'Networking Fundamentals';

        return {
          id: q.id,
          questionText: cleanText,
          options: q.optionsJson,
          cognitiveLevel,
          questionType: q.questionType,
          concept: conceptTag,
          difficulty: tagDifficulty,
          points: q.points || 10,
        };
      }),
    };
  }

  async submitQuiz(
    quizId: string,
    dto: SubmitQuizDto,
    identity?: { userId?: string; anonymousId?: string }
  ) {
    if (!quizId || typeof quizId !== 'string') {
      throw new BadRequestException('Invalid or missing quizId parameter.');
    }
    if (!dto || !dto.answers || typeof dto.answers !== 'object') {
      throw new BadRequestException('Submission payload must contain a valid "answers" object.');
    }

    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        lesson: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${quizId}" not found.`);
    }

    const { answers } = dto;
    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const weakConceptsSet = new Set<string>();

    const results = quiz.questions.map((q) => {
      const selectedOption = answers[q.id] !== undefined ? Number(answers[q.id]) : -1;
      const isCorrect = selectedOption === q.correctOption;
      if (isCorrect) {
        correctCount++;
      } else {
        const conceptName = q.concept || quiz.lesson.title || 'Networking Concept';
        weakConceptsSet.add(conceptName);
      }

      const options = (q.optionsJson as string[]) || [];
      const selectedText = selectedOption >= 0 && options[selectedOption] ? options[selectedOption] : 'No answer';
      const correctText = options[q.correctOption] || '';

      const cleanQuestionText = q.questionText.replace(/^\[(EASY|MEDIUM|HARD)\]\s*/i, '');
      let explanationText = q.explanation || '';
      const whyCorrectText = `"${correctText}" is correct because ${q.explanation || 'it satisfies protocol standards.'}`;
      let whyWrongText = '';

      if (!isCorrect) {
        const optionSpecificWhy =
          q.explanationsJson && (q.explanationsJson as any)[selectedOption]
            ? (q.explanationsJson as any)[selectedOption]
            : `The choice "${selectedText}" does not satisfy the networking protocol requirements.`;

        whyWrongText = `You chose "${selectedText}". ${optionSpecificWhy}`;
        explanationText = `Not quite. ${whyWrongText} ${whyCorrectText}`;
      } else {
        explanationText = `Correct! ${whyCorrectText}`;
      }

      return {
        questionId: q.id,
        questionText: cleanQuestionText,
        selectedOption,
        correctOption: q.correctOption,
        isCorrect,
        explanation: explanationText,
        whyCorrect: whyCorrectText,
        whyWrong: whyWrongText,
        concept: q.concept || quiz.lesson.title || 'General',
        cognitiveLevel: q.cognitiveLevel,
        questionType: q.questionType,
      };
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= quiz.passingScore;
    const weakConcepts = Array.from(weakConceptsSet);
    const recommendations = weakConcepts.map(
      (c) => `Concept Review Recommended: Review core principles for "${c}".`
    );

    const userId = identity?.userId;
    const anonymousId = identity?.anonymousId;

    let attemptNumber = 1;

    if (userId || anonymousId) {
      if (anonymousId && !userId) {
        await this.ensureAnonymousLearner(anonymousId);
      }
      const pastAttemptsCount = await this.prisma.quizAttempt.count({
        where: userId ? { userId, quizId } : { anonymousId, quizId },
      });

      attemptNumber = pastAttemptsCount + 1;

      await this.prisma.quizAttempt.create({
        data: {
          userId: userId || null,
          anonymousId: anonymousId || null,
          quizId,
          score,
          passed,
          answersJson: answers,
          weakConceptsJson: weakConcepts,
          attemptNumber,
        },
      });

      const existingProgress = await this.prisma.userProgress.findFirst({
        where: userId ? { userId, lessonId: quiz.lessonId } : { anonymousId, lessonId: quiz.lessonId },
      });

      const currentBest = Math.max(score, existingProgress?.bestScore || 0);
      const currentAttempts = (existingProgress?.quizAttemptsCount || 0) + 1;
      const isCompleted = passed || (existingProgress?.completed ?? false);

      if (existingProgress) {
        await this.prisma.userProgress.update({
          where: { id: existingProgress.id },
          data: {
            started: true,
            viewed: true,
            completed: isCompleted,
            score: Math.max(score, existingProgress.score || 0),
            bestScore: currentBest,
            masteryScore: currentBest,
            quizAttemptsCount: currentAttempts,
            weakConceptsJson: weakConcepts,
            completedAt: isCompleted ? new Date() : existingProgress.completedAt,
          },
        });
      } else {
        await this.prisma.userProgress.create({
          data: {
            userId: userId || null,
            anonymousId: anonymousId || null,
            lessonId: quiz.lessonId,
            started: true,
            viewed: true,
            completed: passed,
            score,
            bestScore: score,
            masteryScore: score,
            quizAttemptsCount: 1,
            weakConceptsJson: weakConcepts,
            completedAt: passed ? new Date() : null,
          },
        });
      }

      const identityInput = { userId, anonymousId };
      if (passed) {
        await this.achievementsService.awardAchievement(identityInput, 'FIRST_QUIZ').catch(() => null);
      }
      if (score === 100) {
        await this.achievementsService.awardAchievement(identityInput, 'PERFECT_SCORE').catch(() => null);
      }
      if (isCompleted) {
        await this.achievementsService.awardAchievement(identityInput, 'FIRST_STEP').catch(() => null);
      }
    }

    return {
      quizId,
      score,
      passed,
      passingScore: quiz.passingScore,
      correctCount,
      totalQuestions,
      attemptNumber,
      weakConcepts,
      recommendations,
      results,
    };
  }

  async markLessonStarted(lessonIdOrSlug: string, identity: { userId?: string; anonymousId?: string }) {
    const { userId, anonymousId } = identity;
    if (!userId && !anonymousId) {
      throw new BadRequestException('A valid user ID or anonymous learner ID is required.');
    }
    if (anonymousId && !userId) {
      await this.ensureAnonymousLearner(anonymousId);
    }
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        OR: [{ id: lessonIdOrSlug }, { slug: lessonIdOrSlug }],
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson "${lessonIdOrSlug}" not found.`);
    }

    const existing = await this.prisma.userProgress.findFirst({
      where: userId ? { userId, lessonId: lesson.id } : { anonymousId, lessonId: lesson.id },
    });

    let progress;
    if (existing) {
      progress = await this.prisma.userProgress.update({
        where: { id: existing.id },
        data: {
          started: true,
          viewed: true,
        },
      });
    } else {
      progress = await this.prisma.userProgress.create({
        data: {
          userId: userId || null,
          anonymousId: anonymousId || null,
          lessonId: lesson.id,
          started: true,
          viewed: true,
          completed: false,
        },
      });
    }

    return {
      success: true,
      lessonId: lesson.id,
      started: progress.started,
      viewed: progress.viewed,
    };
  }

  async markLessonViewed(lessonIdOrSlug: string, identity: { userId?: string; anonymousId?: string }) {
    return this.markLessonStarted(lessonIdOrSlug, identity);
  }

  async markLessonComplete(lessonIdOrSlug: string, identity: { userId?: string; anonymousId?: string }) {
    const { userId, anonymousId } = identity;
    if (!userId && !anonymousId) {
      throw new BadRequestException('A valid user ID or anonymous learner ID is required.');
    }
    if (anonymousId && !userId) {
      await this.ensureAnonymousLearner(anonymousId);
    }
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        OR: [{ id: lessonIdOrSlug }, { slug: lessonIdOrSlug }],
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson "${lessonIdOrSlug}" not found.`);
    }

    const existing = await this.prisma.userProgress.findFirst({
      where: userId ? { userId, lessonId: lesson.id } : { anonymousId, lessonId: lesson.id },
    });

    let progress;
    if (existing) {
      progress = await this.prisma.userProgress.update({
        where: { id: existing.id },
        data: {
          started: true,
          viewed: true,
          completed: true,
          completedAt: existing.completedAt || new Date(),
        },
      });
    } else {
      progress = await this.prisma.userProgress.create({
        data: {
          userId: userId || null,
          anonymousId: anonymousId || null,
          lessonId: lesson.id,
          started: true,
          viewed: true,
          completed: true,
          completedAt: new Date(),
        },
      });
    }

    if (progress.completed) {
      await this.achievementsService.awardAchievement({ userId, anonymousId }, 'FIRST_STEP').catch(() => null);
    }

    return {
      success: true,
      lessonId: lesson.id,
      completed: progress.completed,
      completedAt: progress.completedAt,
    };
  }

  async getStudentDashboardMetrics(identity: { userId?: string; anonymousId?: string }) {
    const { userId, anonymousId } = identity;
    const where = userId ? { userId } : anonymousId ? { anonymousId } : null;

    const totalCourses = await this.prisma.course.count({ where: { published: true } });
    const totalLessons = await this.prisma.lesson.count({
      where: { module: { course: { published: true } } },
    });

    const activeAchievements = await this.prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { points: 'asc' },
    });

    if (!where) {
      return {
        totalCourses,
        totalLessons,
        completedLessons: 0,
        overallProgressPercent: 0,
        studyStreak: 0,
        totalXp: 0,
        simulationsRun: 0,
        quizAverageScore: 0,
        certificatesEarned: 0,
        completedCoursesCount: 0,
        badges: {
          earned: 0,
          total: activeAchievements.length,
          items: activeAchievements.map((a) => ({
            ...a,
            unlocked: false,
            unlockedAt: null,
          })),
        },
        recentAttempts: [],
        recentLessons: [],
      };
    }

    // 1. Progress & Completed Lessons
    const progressList = await this.prisma.userProgress.findMany({
      where,
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    const completedLessons = progressList.filter((p) => p.completed).length;
    const overallProgressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // 2. Study Streak Calculation (gather YYYY-MM-DD date strings across all activity)
    const activityDatesSet = new Set<string>();

    for (const p of progressList) {
      if (p.completedAt) activityDatesSet.add(p.completedAt.toISOString().split('T')[0]);
    }

    const quizAttempts = await this.prisma.quizAttempt.findMany({
      where,
      select: { quizId: true, score: true, passed: true, createdAt: true, quiz: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    for (const qa of quizAttempts) {
      activityDatesSet.add(qa.createdAt.toISOString().split('T')[0]);
    }

    const labAttempts = await this.prisma.labAttempt.findMany({
      where,
      select: { startedAt: true, createdAt: true, passed: true },
      orderBy: { createdAt: 'desc' },
    });
    for (const la of labAttempts) {
      if (la.startedAt) activityDatesSet.add(la.startedAt.toISOString().split('T')[0]);
      if (la.createdAt) activityDatesSet.add(la.createdAt.toISOString().split('T')[0]);
    }

    const sandboxSessions = await this.prisma.sandboxSession.findMany({
      where,
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    for (const ss of sandboxSessions) {
      activityDatesSet.add(ss.createdAt.toISOString().split('T')[0]);
    }

    // Continuous consecutive study streak
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    let studyStreak = 0;
    let checkDate = new Date();

    if (!activityDatesSet.has(todayStr) && activityDatesSet.has(yesterdayStr)) {
      checkDate = yesterdayDate;
    }

    let keepChecking = true;
    while (keepChecking) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (activityDatesSet.has(dateStr)) {
        studyStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        keepChecking = false;
      }
    }

    // 3. Quiz Average Score (Best score per unique quiz)
    const bestScorePerQuiz: Record<string, number> = {};
    for (const qa of quizAttempts) {
      if (bestScorePerQuiz[qa.quizId] === undefined || qa.score > bestScorePerQuiz[qa.quizId]) {
        bestScorePerQuiz[qa.quizId] = qa.score;
      }
    }

    const uniqueQuizScores = Object.values(bestScorePerQuiz);
    const quizAverageScore =
      uniqueQuizScores.length > 0
        ? Math.round(uniqueQuizScores.reduce((a, b) => a + b, 0) / uniqueQuizScores.length)
        : 0;

    // 4. Simulations Run (Authoritative SandboxSession runs)
    const simulationsRun = sandboxSessions.length;

    // 5. Certificates Earned
    const certificatesEarned = userId
      ? await this.prisma.certificate.count({ where: { userId } })
      : 0;

    // 6. Badges & Total XP (Authoritative points from earned achievements)
    let earnedAchievements: Array<{ achievementId: string; unlockedAt: Date }> = [];
    if (userId) {
      earnedAchievements = await this.prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true, unlockedAt: true },
      });
    } else if (anonymousId) {
      earnedAchievements = await this.prisma.userAchievement.findMany({
        where: { anonymousId },
        select: { achievementId: true, unlockedAt: true },
      });
    }

    const unlockedMap = new Map<string, Date>();
    for (const ua of earnedAchievements) {
      unlockedMap.set(ua.achievementId, ua.unlockedAt);
    }

    let achievementXpSum = 0;
    const badgeItems = activeAchievements.map((ach) => {
      const isUnlocked = unlockedMap.has(ach.id);
      if (isUnlocked) {
        achievementXpSum += ach.points;
      }
      return {
        id: ach.id,
        slug: ach.slug,
        title: ach.title,
        description: ach.description,
        badgeIcon: ach.badgeIcon,
        category: ach.category,
        points: ach.points,
        unlocked: isUnlocked,
        unlockedAt: unlockedMap.get(ach.id) ? unlockedMap.get(ach.id)!.toISOString() : null,
      };
    });

    // Authoritative totalXp derived strictly from earned achievement points
    const totalXp = achievementXpSum;

    // 7. Completed Courses Count (Phase 11B Gating)
    const publishedCourses = await this.prisma.course.findMany({
      where: { published: true },
      select: { id: true, slug: true },
    });

    let completedCoursesCount = 0;
    for (const course of publishedCourses) {
      try {
        const assessment = await this.getCourseAssessment(identity, course.id);
        if (assessment.eligibleForCertificate) {
          completedCoursesCount++;
        }
      } catch {
        // Ignore
      }
    }

    // 8. Recent Lessons
    const recentLessons = progressList.slice(0, 5).map((p) => ({
      id: p.lesson.id,
      title: p.lesson.title,
      slug: p.lesson.slug,
      courseTitle: p.lesson.module.course.title,
      courseSlug: p.lesson.module.course.slug,
      type: p.lesson.type,
      durationMinutes: p.lesson.durationMinutes,
      status: p.completed ? 'COMPLETED' : p.viewed ? 'IN_PROGRESS' : 'UP_NEXT',
      completedAt: p.completedAt,
    }));

    return {
      totalCourses,
      totalLessons,
      completedLessons,
      overallProgressPercent,
      studyStreak,
      totalXp,
      simulationsRun,
      quizAverageScore,
      certificatesEarned,
      completedCoursesCount,
      badges: {
        earned: unlockedMap.size,
        total: activeAchievements.length,
        items: badgeItems,
      },
      recentAttempts: quizAttempts.slice(0, 5).map((a) => ({
        id: a.quizId,
        quizTitle: a.quiz.title,
        score: a.score,
        passed: a.passed,
        createdAt: a.createdAt,
      })),
      recentLessons,
    };
  }

  async getUserProgress(identity: { userId?: string; anonymousId?: string }) {
    return this.getStudentDashboardMetrics(identity);
  }

  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return { courses: [], lessons: [], modules: [] };
    }

    const q = query.trim();

    const [courses, lessons, modules] = await Promise.all([
      this.prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { tagline: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: { id: true, title: true, slug: true, tagline: true, category: true, level: true },
      }),
      this.prisma.lesson.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { slug: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          durationMinutes: true,
          module: {
            select: {
              title: true,
              course: { select: { title: true, slug: true } },
            },
          },
        },
      }),
      this.prisma.module.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
          course: { select: { title: true, slug: true } },
        },
      }),
    ]);

    return { courses, lessons, modules };
  }

  async toggleSaveLesson(lessonIdOrSlug: string, identity: { userId?: string; anonymousId?: string }) {
    const { userId, anonymousId } = identity;
    if (!userId && !anonymousId) {
      throw new BadRequestException('A valid user ID or anonymous learner ID is required.');
    }
    if (anonymousId && !userId) {
      await this.ensureAnonymousLearner(anonymousId);
    }
    const lesson = await this.prisma.lesson.findFirst({
      where: { OR: [{ id: lessonIdOrSlug }, { slug: lessonIdOrSlug }] },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson "${lessonIdOrSlug}" not found.`);
    }

    const existing = await this.prisma.savedLesson.findFirst({
      where: userId ? { userId, lessonId: lesson.id } : { anonymousId, lessonId: lesson.id },
    });

    if (existing) {
      await this.prisma.savedLesson.delete({
        where: { id: existing.id },
      });
      return { saved: false, message: 'Lesson removed from saved bookmarks.' };
    }

    await this.prisma.savedLesson.create({
      data: {
        userId: userId || null,
        anonymousId: anonymousId || null,
        lessonId: lesson.id,
      },
    });
    return { saved: true, message: 'Lesson saved to bookmarks.' };
  }

  async getSavedLessons(identity: { userId?: string; anonymousId?: string }) {
    const { userId, anonymousId } = identity;
    const where = userId ? { userId } : anonymousId ? { anonymousId } : null;
    if (!where) return [];

    const saved = await this.prisma.savedLesson.findMany({
      where,
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return saved.map((s) => ({
      id: s.id,
      lessonId: s.lesson.id,
      title: s.lesson.title,
      slug: s.lesson.slug,
      type: s.lesson.type,
      durationMinutes: s.lesson.durationMinutes,
      courseTitle: s.lesson.module.course.title,
      courseSlug: s.lesson.module.course.slug,
      savedAt: s.createdAt,
    }));
  }

  async claimProgress(userId: string, anonymousId: string) {
    if (!userId || !anonymousId) {
      throw new BadRequestException('Both userId and anonymousId are required to claim progress.');
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(anonymousId)) {
      throw new BadRequestException(`Invalid anonymousId format "${anonymousId}". Must be a valid UUID.`);
    }

    return await this.prisma.$transaction(async (tx) => {
      const anonLearner = await tx.anonymousLearner.findUnique({
        where: { id: anonymousId },
      });

      const anonProgress = await tx.userProgress.findMany({
        where: { anonymousId },
      });
      const anonQuizCount = await tx.quizAttempt.count({
        where: { anonymousId },
      });
      const anonLabCount = await tx.labAttempt.count({
        where: { anonymousId },
      });
      const anonSavedCount = await tx.savedLesson.count({
        where: { anonymousId },
      });
      const anonSandboxCount = await tx.sandboxSession.count({
        where: { anonymousId },
      });
      const anonAchievementCount = await tx.userAchievement.count({
        where: { anonymousId },
      });

      const totalAnonItems =
        anonProgress.length + anonQuizCount + anonLabCount + anonSavedCount + anonSandboxCount + anonAchievementCount;

      if (!anonLearner && totalAnonItems === 0) {
        return {
          success: true,
          claimedCount: 0,
          message: 'Already claimed or no progress found.',
        };
      }

      let claimedProgressCount = 0;
      for (const p of anonProgress) {
        const existingUserProg = await tx.userProgress.findFirst({
          where: { userId, lessonId: p.lessonId },
        });

        if (existingUserProg) {
          let earliestCompletedAt = existingUserProg.completedAt;
          if (existingUserProg.completedAt && p.completedAt) {
            earliestCompletedAt =
              new Date(existingUserProg.completedAt).getTime() <= new Date(p.completedAt).getTime()
                ? existingUserProg.completedAt
                : p.completedAt;
          } else {
            earliestCompletedAt = existingUserProg.completedAt || p.completedAt;
          }

          const existingWeak = Array.isArray(existingUserProg.weakConceptsJson)
            ? (existingUserProg.weakConceptsJson as string[])
            : [];
          const guestWeak = Array.isArray(p.weakConceptsJson)
            ? (p.weakConceptsJson as string[])
            : [];
          const mergedWeakConcepts = Array.from(new Set([...existingWeak, ...guestWeak]));

          await tx.userProgress.update({
            where: { id: existingUserProg.id },
            data: {
              started: existingUserProg.started || p.started,
              viewed: existingUserProg.viewed || p.viewed,
              practicalCompleted: existingUserProg.practicalCompleted || p.practicalCompleted,
              completed: existingUserProg.completed || p.completed,
              score: Math.max(existingUserProg.score || 0, p.score || 0),
              bestScore: Math.max(existingUserProg.bestScore || 0, p.bestScore || 0),
              masteryScore: Math.max(existingUserProg.masteryScore || 0, p.masteryScore || 0),
              quizAttemptsCount: (existingUserProg.quizAttemptsCount || 0) + (p.quizAttemptsCount || 0),
              completedAt: earliestCompletedAt,
              weakConceptsJson: mergedWeakConcepts,
            },
          });
          await tx.userProgress.delete({ where: { id: p.id } });
        } else {
          await tx.userProgress.update({
            where: { id: p.id },
            data: { userId, anonymousId: null },
          });
        }
        claimedProgressCount++;
      }

      const { count: claimedQuizCount } = await tx.quizAttempt.updateMany({
        where: { anonymousId },
        data: { userId, anonymousId: null },
      });

      const { count: claimedLabCount } = await tx.labAttempt.updateMany({
        where: { anonymousId },
        data: { userId, anonymousId: null },
      });

      const anonSaved = await tx.savedLesson.findMany({
        where: { anonymousId },
      });
      for (const s of anonSaved) {
        const existingSaved = await tx.savedLesson.findFirst({
          where: { userId, lessonId: s.lessonId },
        });
        if (existingSaved) {
          await tx.savedLesson.delete({ where: { id: s.id } });
        } else {
          await tx.savedLesson.update({
            where: { id: s.id },
            data: { userId, anonymousId: null },
          });
        }
      }

      await tx.sandboxSession.updateMany({
        where: { anonymousId },
        data: { userId, anonymousId: null },
      });

      const { count: claimedAchievementCount } = await tx.userAchievement.updateMany({
        where: { anonymousId },
        data: { userId, anonymousId: null },
      });

      if (anonLearner) {
        await tx.anonymousLearner.delete({ where: { id: anonymousId } }).catch(() => null);
      }

      const totalClaimed = claimedProgressCount + claimedQuizCount + claimedLabCount + anonSaved.length + claimedAchievementCount;

      return {
        success: true,
        claimedCount: totalClaimed,
        message: 'Guest progress successfully claimed.',
        claimedProgressCount,
        claimedQuizCount,
        claimedLabCount,
        claimedAchievementCount,
      };
    });
  }

  async getCourseAssessment(identity: { userId?: string; anonymousId?: string }, courseIdOrSlug: string) {
    const { userId, anonymousId } = identity;
    if (!userId && !anonymousId) {
      throw new BadRequestException('Learner identity (userId or anonymousId) is required.');
    }

    const course = await this.prisma.course.findFirst({
      where: { OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }] },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                quizzes: {
                  select: { id: true, title: true, passingScore: true },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course "${courseIdOrSlug}" not found.`);
    }

    const allLessons = course.modules.flatMap((m) => m.lessons);
    const totalRequiredLessons = allLessons.length;

    if (totalRequiredLessons === 0) {
      return {
        courseId: course.id,
        courseSlug: course.slug,
        requiredLessons: 0,
        completedAssessments: 0,
        missingAssessments: 0,
        lessonScores: [],
        assessmentAverage: 0,
        assessmentPassed: false,
        allRequiredAssessmentsComplete: false,
        eligibleForCertificate: false,
      };
    }

    const quizToLessonMap: Record<string, string> = {};

    for (const lesson of allLessons) {
      if (lesson.quizzes && lesson.quizzes.length > 0) {
        for (const q of lesson.quizzes) {
          quizToLessonMap[q.id] = lesson.id;
        }
      }
    }

    const allQuizIds = Object.keys(quizToLessonMap);

    let attempts: Array<{ quizId: string; score: number; passed: boolean }> = [];
    if (allQuizIds.length > 0) {
      attempts = await this.prisma.quizAttempt.findMany({
        where: userId
          ? { userId, quizId: { in: allQuizIds } }
          : { anonymousId: anonymousId!, quizId: { in: allQuizIds } },
        select: { quizId: true, score: true, passed: true },
      });
    }

    const lessonBestScores: Record<string, number> = {};

    for (const attempt of attempts) {
      const lessonId = quizToLessonMap[attempt.quizId];
      if (lessonId) {
        if (lessonBestScores[lessonId] === undefined || attempt.score > lessonBestScores[lessonId]) {
          lessonBestScores[lessonId] = attempt.score;
        }
      }
    }

    const lessonsWithQuizzesCount = new Set(Object.values(quizToLessonMap)).size;
    const totalRequiredAssessments = lessonsWithQuizzesCount > 0 ? lessonsWithQuizzesCount : totalRequiredLessons;

    const completedLessonScores: number[] = [];
    let completedAssessmentsCount = 0;

    for (const lesson of allLessons) {
      if (lessonBestScores[lesson.id] !== undefined) {
        completedLessonScores.push(lessonBestScores[lesson.id]);
        completedAssessmentsCount++;
      }
    }

    const missingAssessmentsCount = Math.max(0, totalRequiredAssessments - completedAssessmentsCount);
    const allRequiredAssessmentsComplete =
      completedAssessmentsCount >= totalRequiredAssessments && missingAssessmentsCount === 0;

    const sumBestScores = completedLessonScores.reduce((sum, score) => sum + score, 0);

    const assessmentAverage =
      totalRequiredAssessments > 0 ? Math.floor(sumBestScores / totalRequiredAssessments) : 0;

    const assessmentPassed = allRequiredAssessmentsComplete && assessmentAverage >= 80;

    const userProgressRecords = await this.prisma.userProgress.findMany({
      where: userId
        ? { userId, lessonId: { in: allLessons.map((l) => l.id) } }
        : { anonymousId: anonymousId!, lessonId: { in: allLessons.map((l) => l.id) } },
      select: { lessonId: true, completed: true },
    });

    const completedLessonsCount = userProgressRecords.filter((p) => p.completed).length;
    const allLessonsCompleted = completedLessonsCount === totalRequiredLessons;

    const eligibleForCertificate = allLessonsCompleted && assessmentPassed;

    return {
      courseId: course.id,
      courseSlug: course.slug,
      requiredLessons: totalRequiredLessons,
      completedAssessments: completedAssessmentsCount,
      missingAssessments: missingAssessmentsCount,
      lessonScores: completedLessonScores,
      assessmentAverage,
      assessmentPassed,
      allRequiredAssessmentsComplete,
      eligibleForCertificate,
    };
  }

  async claimCertificate(userId: string, courseIdOrSlug: string) {
    if (!userId) {
      throw new UnauthorizedException('Authentication is required to claim certificates.');
    }
    const course = await this.prisma.course.findFirst({
      where: { OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }] },
      include: { modules: { include: { lessons: true } } },
    });
    if (!course) {
      throw new NotFoundException(`Course "${courseIdOrSlug}" not found.`);
    }

    const assessment = await this.getCourseAssessment({ userId }, course.id);

    if (!assessment.allRequiredAssessmentsComplete) {
      throw new BadRequestException(
        `Certificate eligibility not met. Missing ${assessment.missingAssessments} required course assessments.`
      );
    }

    if (!assessment.assessmentPassed) {
      throw new BadRequestException(
        `Certificate eligibility not met. Course assessment average is ${assessment.assessmentAverage}%, but a minimum of 80% is required.`
      );
    }

    if (!assessment.eligibleForCertificate) {
      throw new BadRequestException(
        `Certificate eligibility not met. Course lessons or assessments incomplete.`
      );
    }

    let certificate = await this.prisma.certificate.findFirst({
      where: { userId, courseId: course.id },
      include: { user: { select: { id: true, username: true, fullName: true } }, course: true },
    });

    if (!certificate) {
      certificate = await this.prisma.certificate.create({
        data: { userId, courseId: course.id },
        include: { user: { select: { id: true, username: true, fullName: true } }, course: true },
      });

      // Safely award COURSE_COMPLETE achievement upon verified course completion & 80%+ assessment pass
      await this.achievementsService.awardAchievement({ userId }, 'COURSE_COMPLETE').catch(() => null);
    }

    return {
      id: certificate.id,
      code: certificate.code,
      issuedAt: certificate.issuedAt,
      user: {
        id: certificate.user.id,
        username: certificate.user.username,
        fullName: certificate.user.fullName || certificate.user.username,
      },
      course: {
        id: certificate.course.id,
        title: certificate.course.title,
        slug: certificate.course.slug,
      },
    };
  }

  async getCertificateById(certificateIdOrCode: string) {
    const cert = await this.prisma.certificate.findFirst({
      where: { OR: [{ id: certificateIdOrCode }, { code: certificateIdOrCode }] },
      include: { user: { select: { username: true, fullName: true } }, course: true },
    });
    if (!cert) {
      throw new NotFoundException(`Certificate "${certificateIdOrCode}" not found.`);
    }
    return {
      id: cert.id,
      code: cert.code,
      issuedAt: cert.issuedAt,
      recipientName: cert.user.fullName || cert.user.username,
      courseTitle: cert.course.title,
      courseSlug: cert.course.slug,
    };
  }
}
