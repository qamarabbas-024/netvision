import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

let defaultDatabaseUrl =
  'postgresql://netvision:netvision_secure_password@localhost:5432/netvision_db?schema=public';
try {
  const envPath = path.resolve(__dirname, 'backend/.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
    if (match) {
      defaultDatabaseUrl = match[1];
    }
  }
} catch {
  // Ignore error
}

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  workers: 1, // Sequential execution to prevent test candidate database race conditions
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 180 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.CI ? {} : { channel: 'chrome' }),
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter netvision-backend start:prod',
      url: 'http://127.0.0.1:4000/api/v1/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        PORT: '4000',
        NODE_ENV: 'test',
        DATABASE_URL: (process.env.DATABASE_URL || defaultDatabaseUrl).replace(
          /connection_limit=\d+/,
          'connection_limit=5'
        ),
        JWT_SECRET:
          process.env.JWT_SECRET || 'netvision_ci_test_secret_must_be_over_32_characters_long',
      },
    },
    {
      command: 'pnpm --filter netvision-frontend start',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        PORT: '3000',
        NEXT_PUBLIC_API_URL: 'http://127.0.0.1:4000/api/v1',
      },
    },
  ],
});
