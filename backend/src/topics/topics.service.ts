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

    return {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      type: lesson.type,
      durationMinutes: lesson.durationMinutes,
      order: lesson.order,
      content: lesson.contentJson,
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
      questions: quiz.questions.map((q) => ({
        id: q.id,
        questionText: q.questionText.replace(/^\[(EASY|MEDIUM|HARD)\]\s*/i, ''),
        options: q.optionsJson,
      })),
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

    const results = quiz.questions.map((q) => {
      const selectedOption = answers[q.id] !== undefined ? Number(answers[q.id]) : -1;
      const isCorrect = selectedOption === q.correctOption;
      if (isCorrect) correctCount++;

      const options = (q.optionsJson as string[]) || [];
      const selectedText = selectedOption >= 0 && options[selectedOption] ? options[selectedOption] : 'No answer';
      const correctText = options[q.correctOption] || '';

      const cleanQuestionText = q.questionText.replace(/^\[(EASY|MEDIUM|HARD)\]\s*/i, '');
      let explanationText = q.explanation || '';
      if (!isCorrect) {
        const optionSpecificWhy =
          q.explanationsJson && (q.explanationsJson as any)[selectedOption]
            ? (q.explanationsJson as any)[selectedOption]
            : `The option "${selectedText}" does not satisfy the networking protocol specifications.`;

        explanationText = `Not quite. You selected "${selectedText}". ${optionSpecificWhy} The correct answer is "${correctText}" because ${
          q.explanation || 'it adheres strictly to networking standards.'
        }`;
      } else {
        explanationText = `Correct! "${correctText}" is the right answer. ${q.explanation || ''}`;
      }

      return {
        questionId: q.id,
        questionText: cleanQuestionText,
        selectedOption,
        correctOption: q.correctOption,
        isCorrect,
        explanation: explanationText,
      };
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= quiz.passingScore;

    if (userId) {
      await this.prisma.quizAttempt.create({
        data: {
          userId,
          quizId,
          score,
          passed,
          answersJson: answers,
        },
      });

      if (passed || !quiz.passingScore) {
        await this.prisma.userProgress.upsert({
          where: {
            userId_lessonId: { userId, lessonId: quiz.lessonId },
          },
          update: {
            completed: true,
            score: Math.max(score, 0),
            completedAt: new Date(),
          },
          create: {
            userId,
            lessonId: quiz.lessonId,
            completed: true,
            score,
            completedAt: new Date(),
          },
        });
      }
    }

    return {
      quizId,
      score,
      passed,
      passingScore: quiz.passingScore,
      correctCount,
      totalQuestions,
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
