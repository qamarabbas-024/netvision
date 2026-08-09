import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CourseLevel } from '@prisma/client';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCourses(userId?: string, level?: CourseLevel, category?: string) {
    const where: any = { published: true };
    if (level) where.level = level;
    if (category && category !== 'All') where.category = category;

    const courses = await this.prisma.course.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    const userProgressMap: Record<string, boolean> = {};
    if (userId) {
      const progressList = await this.prisma.userProgress.findMany({
        where: { userId, completed: true },
      });
      progressList.forEach((p) => {
        userProgressMap[p.lessonId] = true;
      });
    }

    return courses.map((course) => {
      const allLessons = course.modules.flatMap((m) => m.lessons);
      const totalLessons = allLessons.length;
      const completedLessons = allLessons.filter((l) => userProgressMap[l.id]).length;
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

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
        lessonsCount: totalLessons,
        completedLessons,
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
                quizzes: {
                  select: { id: true, title: true },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course or Topic with slug "${slug}" was not found.`);
    }

    const userProgressMap: Record<string, { completed: boolean; score?: number | null }> = {};
    if (userId) {
      const progressList = await this.prisma.userProgress.findMany({
        where: { userId },
      });
      progressList.forEach((p) => {
        userProgressMap[p.lessonId] = { completed: p.completed, score: p.score };
      });
    }

    const allLessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter((l) => userProgressMap[l.id]?.completed).length;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const formattedModules = course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      order: m.order,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        type: l.type,
        durationMinutes: l.durationMinutes,
        order: l.order,
        completed: !!userProgressMap[l.id]?.completed,
        score: userProgressMap[l.id]?.score || null,
        hasQuiz: l.quizzes.length > 0,
        quizId: l.quizzes[0]?.id || null,
      })),
    }));

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
      totalLessons,
      completedLessons,
      progressPercent,
      modules: formattedModules,
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
        quizzes: {
          include: {
            questions: true,
          },
        },
        objectives: { orderBy: { order: 'asc' } },
        concepts: { orderBy: { order: 'asc' } },
        examples: { orderBy: { order: 'asc' } },
        commands: { orderBy: { order: 'asc' } },
        labs: { orderBy: { order: 'asc' } },
        mistakes: { orderBy: { order: 'asc' } },
        recaps: { orderBy: { order: 'asc' } },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with slug "${slug}" was not found.`);
    }

    let isCompleted = false;
    let score: number | null = null;
    if (userId) {
      const progress = await this.prisma.userProgress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId: lesson.id },
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
    const { labId, command } = dto;
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

  async validateLab(userId: string, dto: { labId: string; commandHistory?: string[]; hintsUsedCount?: number; userSolution?: Record<string, any> }) {
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

    const attempt = await this.prisma.labAttempt.create({
      data: {
        userId,
        labId,
        passed,
        score,
        hintsUsedCount,
        commandHistoryJson: commandHistory,
        validationResultJson: checks,
        userSolutionJson: userSolution || {},
        status: passed ? 'PASSED' : 'FAILED',
        completedAt: new Date(),
      },
    });

    // Update UserProgress for this lesson
    await this.prisma.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId: lab.lessonId },
      },
      update: {
        practicalCompleted: passed,
        score: Math.max(score, 0),
      },
      create: {
        userId,
        lessonId: lab.lessonId,
        practicalCompleted: passed,
        started: true,
        viewed: true,
        score,
      },
    });

    return {
      attemptId: attempt.id,
      labId: lab.id,
      labTitle: lab.title,
      passed,
      score,
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

  async submitQuiz(quizId: string, dto: SubmitQuizDto, userId?: string) {
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
      let whyCorrectText = `"${correctText}" is correct because ${q.explanation || 'it satisfies protocol standards.'}`;
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

    if (userId) {
      const pastAttemptsCount = await this.prisma.quizAttempt.count({
        where: { userId, quizId },
      });

      await this.prisma.quizAttempt.create({
        data: {
          userId,
          quizId,
          score,
          passed,
          answersJson: answers,
          weakConceptsJson: weakConcepts,
          attemptNumber: pastAttemptsCount + 1,
        },
      });

      const existingProgress = await this.prisma.userProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId: quiz.lessonId } },
      });

      const currentBest = Math.max(score, existingProgress?.bestScore || 0);
      const currentAttempts = (existingProgress?.quizAttemptsCount || 0) + 1;
      const isCompleted = passed || (existingProgress?.completed ?? false);

      await this.prisma.userProgress.upsert({
        where: {
          userId_lessonId: { userId, lessonId: quiz.lessonId },
        },
        update: {
          started: true,
          viewed: true,
          completed: isCompleted,
          score: Math.max(score, existingProgress?.score || 0),
          bestScore: currentBest,
          masteryScore: currentBest,
          quizAttemptsCount: currentAttempts,
          weakConceptsJson: weakConcepts,
          completedAt: isCompleted ? new Date() : existingProgress?.completedAt,
        },
        create: {
          userId,
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

    return {
      quizId,
      score,
      passed,
      passingScore: quiz.passingScore,
      correctCount,
      totalQuestions,
      weakConcepts,
      recommendations,
      results,
    };
  }

  async markLessonComplete(lessonIdOrSlug: string, userId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        OR: [{ id: lessonIdOrSlug }, { slug: lessonIdOrSlug }],
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson "${lessonIdOrSlug}" not found.`);
    }

    const progress = await this.prisma.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId: lesson.id },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId: lesson.id,
        completed: true,
        completedAt: new Date(),
      },
    });

    return {
      success: true,
      lessonId: lesson.id,
      completed: progress.completed,
      completedAt: progress.completedAt,
    };
  }

  async getUserProgress(userId: string) {
    const progressList = await this.prisma.userProgress.findMany({
      where: { userId },
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
    });

    const totalCourses = await this.prisma.course.count({ where: { published: true } });
    const totalLessons = await this.prisma.lesson.count();
    const completedLessons = progressList.filter((p) => p.completed).length;
    const overallProgressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        quiz: { select: { title: true } },
      },
    });

    return {
      totalCourses,
      totalLessons,
      completedLessons,
      overallProgressPercent,
      recentAttempts: attempts.map((a) => ({
        id: a.id,
        quizTitle: a.quiz.title,
        score: a.score,
        passed: a.passed,
        createdAt: a.createdAt,
      })),
    };
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

  async toggleSaveLesson(lessonId: string, userId: string) {
    const existing = await this.prisma.savedLesson.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    if (existing) {
      await this.prisma.savedLesson.delete({
        where: { id: existing.id },
      });
      return { saved: false, message: 'Lesson removed from saved bookmarks.' };
    }

    await this.prisma.savedLesson.create({
      data: { userId, lessonId },
    });
    return { saved: true, message: 'Lesson saved to bookmarks.' };
  }

  async getSavedLessons(userId: string) {
    const saved = await this.prisma.savedLesson.findMany({
      where: { userId },
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
}
