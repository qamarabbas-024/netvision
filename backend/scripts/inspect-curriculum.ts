import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              labs: true,
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' }
  });

  console.log(`Total published courses: ${courses.length}`);
  let totalModules = 0;
  let emptyModules = 0;
  let totalLessons = 0;

  for (const c of courses) {
    console.log(`\n======================================================`);
    console.log(`COURSE: ${c.code} - ${c.title} (${c.slug})`);
    console.log(`======================================================`);
    for (const m of c.modules) {
      totalModules++;
      const count = m.lessons.length;
      if (count === 0) emptyModules++;
      console.log(`  [Module ${m.order}] ${m.id} | "${m.title}" -> ${count} lessons`);
      for (const l of m.lessons) {
        totalLessons++;
        const labInfo = l.labs.length > 0 ? l.labs.map(lab => lab.type).join(',') : 'NO_LAB';
        console.log(`    - [Lesson ${l.order}] ${l.id} (${l.slug}) [labs: ${labInfo}]`);
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`SUMMARY:`);
  console.log(`Courses: ${courses.length}`);
  console.log(`Modules: ${totalModules}`);
  console.log(`Empty Modules: ${emptyModules}`);
  console.log(`Total Lessons: ${totalLessons}`);
  console.log(`======================================================`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
