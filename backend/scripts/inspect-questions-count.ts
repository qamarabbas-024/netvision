import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspectQuestions() {
  await prisma.$connect();
  const total = await prisma.quizQuestion.count();
  const byCognitiveLevel = await prisma.quizQuestion.groupBy({
    by: ['cognitiveLevel'],
    _count: true,
  });
  const byDifficulty = await prisma.quizQuestion.groupBy({
    by: ['difficulty'],
    _count: true,
  });

  const quizzes = await prisma.quiz.findMany({
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
      questions: true,
    },
  });

  console.log('=== ASSESSMENT AUDIT ===');
  console.log(`TOTAL QUESTIONS BEFORE: ${total}`);
  console.log('\nBY COGNITIVE LEVEL:');
  byCognitiveLevel.forEach((c) => console.log(`  ${c.cognitiveLevel}: ${c._count}`));
  console.log('\nBY DIFFICULTY:');
  byDifficulty.forEach((d) => console.log(`  ${d.difficulty}: ${d._count}`));
  console.log('\nBY QUIZ / COURSE:');
  quizzes.forEach((q) => {
    const courseCode = q.lesson?.module?.course?.code || 'UNKNOWN';
    console.log(`  [${courseCode}] "${q.title}" -> ${q.questions.length} questions`);
  });

  await prisma.$disconnect();
}

inspectQuestions();
