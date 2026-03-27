import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for HomeBase monorepo.
 *
 * Four projects — one per app — each targeting its own dev-server port.
 * Auth storage-state files live under e2e/.auth/ and are populated by
 * the helpers in e2e/auth/login.ts before tests that need them.
 */

const BASE = {
  storefront: 'http://localhost:3000',
  seller: 'http://localhost:3002',
  backoffice: 'http://localhost:3003',
  platform: 'http://localhost:3006',
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },

  projects: [
    {
      name: 'storefront',
      testDir: './e2e/storefront',
      use: { baseURL: BASE.storefront },
    },
    {
      name: 'seller',
      testDir: './e2e/seller',
      use: { baseURL: BASE.seller },
    },
    {
      name: 'backoffice',
      testDir: './e2e/backoffice',
      use: { baseURL: BASE.backoffice },
    },
    {
      name: 'platform',
      testDir: './e2e/platform',
      use: { baseURL: BASE.platform },
    },
  ],
});
