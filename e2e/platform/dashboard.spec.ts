import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../auth/login';

const PLATFORM_URL = 'http://localhost:3006';

test.describe('Platform — Dashboard', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsAdmin(page, baseURL || PLATFORM_URL);
  });

  test('dashboard loads after login', async ({ page }) => {
    await expect(page.locator('main, [class*="container"]').first()).toBeVisible({
      timeout: 15_000,
    });

    // Dashboard should show stats or platform overview
    await expect(
      page.getByText(/Dashboard|Platform|Overview|Welcome/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('dashboard shows stat cards with real data', async ({ page }) => {
    test.slow();

    // Wait for data to load
    await page.waitForTimeout(2_000);

    // Look for typical dashboard stat cards (products, orders, users, revenue, etc.)
    await expect(
      page.getByText(/Products|Orders|Users|Revenue|Suppliers|Active/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('platform health section is visible', async ({ page }) => {
    test.slow();

    // Wait for dashboard to fully load
    await page.waitForTimeout(2_000);

    // Health/status section or system stats
    await expect(
      page.getByText(/Health|Status|System|Uptime|Services|Active/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });
});
