import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "user_achievements" CASCADE;');
  await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "achievements" CASCADE;');
  await prisma.$executeRawUnsafe('DROP TYPE IF EXISTS "AchievementCategory" CASCADE;');
  console.log('Successfully dropped achievement tables and enum!');
}

main().finally(() => prisma.$disconnect());
