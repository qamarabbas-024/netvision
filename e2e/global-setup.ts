import { seedAllE2EData, prisma } from './helpers/seed-e2e-data';

async function globalSetup() {
  console.log('[Playwright E2E] Running deterministic E2E database seeding...');
  await seedAllE2EData();
  await prisma.$disconnect();
  console.log('[Playwright E2E] Seeding completed successfully and DB disconnected.');
}

export default globalSetup;
