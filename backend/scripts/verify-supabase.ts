import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const courses = await prisma.course.count();
  const modules = await prisma.module.count();
  const lessons = await prisma.lesson.count();
  const questions = await prisma.quizQuestion.count();
  const credentials = await prisma.certificationDefinition.count();
  console.log("Supabase Verification:");
  console.log("  Users:", users);
  console.log("  Courses:", courses);
  console.log("  Modules:", modules);
  console.log("  Lessons:", lessons);
  console.log("  Questions:", questions);
  console.log("  Credentials:", credentials);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error("Connection error:", err);
  process.exit(1);
});
