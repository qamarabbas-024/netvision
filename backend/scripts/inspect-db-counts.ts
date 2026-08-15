import { PrismaService } from '../src/database/prisma.service';

const p = new PrismaService();

async function main() {
  await p.$connect();

  const [
    coursesCount,
    modulesCount,
    lessonsCount,
    quizzesCount,
    quizQuestionsCount,
    lessonLabsCount,
    commandRefsCount,
    achievementsCount,
    certDefsCount,
    usersCount,
    activeCourses,
  ] = await Promise.all([
    p.course.count(),
    p.module.count(),
    p.lesson.count(),
    p.quiz.count(),
    p.quizQuestion.count(),
    p.lessonLab.count(),
    p.commandReference.count(),
    p.achievement.count(),
    p.certificationDefinition.count(),
    p.user.count(),
    p.course.findMany({
      select: {
        id: true,
        code: true,
        slug: true,
        title: true,
        level: true,
        category: true,
        modules: {
          select: {
            id: true,
            title: true,
            order: true,
            lessons: {
              select: {
                id: true,
                title: true,
                slug: true,
                type: true,
                labs: { select: { id: true, title: true } },
                quizzes: {
                  select: {
                    id: true,
                    title: true,
                    questions: { select: { id: true } },
                  },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    }),
  ]);

  const certDefs = await p.certificationDefinition.findMany();
  const achievements = await p.achievement.findMany();
  const lessonLabs = await p.lessonLab.findMany({ select: { id: true, slug: true, title: true, difficulty: true, type: true } });
  const commandRefs = await p.commandReference.findMany({ select: { id: true, command: true, category: true, operatingSystem: true } });

  console.log('=== DATABASE INVENTORY AUDIT ===');
  console.log({
    coursesCount,
    modulesCount,
    lessonsCount,
    quizzesCount,
    quizQuestionsCount,
    lessonLabsCount,
    commandRefsCount,
    achievementsCount,
    certDefsCount,
    usersCount,
  });

  console.log('\n=== COURSES & LESSON COUNTS ===');
  for (const c of activeCourses) {
    const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const totalQuizzes = c.modules.reduce((acc, m) => acc + m.lessons.reduce((qAcc, l) => qAcc + l.quizzes.length, 0), 0);
    const totalQuestions = c.modules.reduce((acc, m) => acc + m.lessons.reduce((qAcc, l) => qAcc + l.quizzes.reduce((qqAcc, q) => qqAcc + q.questions.length, 0), 0), 0);
    const totalLabs = c.modules.reduce((acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.labs.length, 0), 0);

    console.log(`- [${c.code || 'NO-CODE'}] ${c.title} (${c.level} / ${c.category}): ${c.modules.length} modules, ${totalLessons} lessons, ${totalLabs} labs, ${totalQuizzes} quizzes (${totalQuestions} questions)`);
    for (const m of c.modules) {
      console.log(`    Module: ${m.title} (${m.lessons.length} lessons)`);
    }
  }

  console.log('\n=== CERTIFICATION DEFINITIONS ===');
  console.log(certDefs.map(cd => ({ code: cd.code, title: cd.title, level: cd.level, requirements: cd.requirementsJson })));

  console.log('\n=== LABS ===');
  console.log(`Total Labs: ${lessonLabs.length}`);
  console.log(lessonLabs);

  console.log('\n=== COMMAND REFERENCES ===');
  console.log(`Total Commands: ${commandRefs.length}`);
  console.log(commandRefs.map(cr => `${cr.command} (${cr.category})`));

  console.log('\n=== ACHIEVEMENTS ===');
  console.log(`Total Achievements: ${achievements.length}`);
  console.log(achievements.map(a => ({ slug: a.slug, title: a.title, category: a.category, points: a.points })));

  await p.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
