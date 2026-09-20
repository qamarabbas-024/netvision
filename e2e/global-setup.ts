import { seedAllE2EData, prisma } from './helpers/seed-e2e-data';

async function globalSetup() {
  console.log('[Playwright E2E] Running deterministic E2E database seeding...');
  try {
    await seedAllE2EData();
    await prisma.$disconnect();
    console.log('[Playwright E2E] Seeding completed successfully and DB disconnected.');
  } catch (err: any) {
    if (process.env.CI === 'true') {
      throw err;
    }
    console.warn(
      `⚠️ [Playwright E2E] Database unavailable during local seeding (${err?.message || err}). Tests relying on pre-seeded candidates will handle accordingly.`
    );
  }
}

export default globalSetup;
