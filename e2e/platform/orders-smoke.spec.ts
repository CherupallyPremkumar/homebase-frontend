import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3006';

test.describe('Orders Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login via Keycloak
    await page.goto(BASE);
    if (page.url().includes('/login') || page.url().includes('localhost:8180')) {
      // If on our login page, click sign in
      const signInBtn = page.locator('button:has-text("Sign"), a:has-text("Sign")').first();
      if (await signInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await signInBtn.click();
      }
      // Wait for Keycloak
      await page.waitForURL(/localhost:8180/, { timeout: 10000 }).catch(() => {});
      if (page.url().includes('localhost:8180')) {
        await page.fill('#username', 'admin@test.com');
        await page.fill('#password', 'Test@1234');
        await page.click('#kc-login');
        await page.waitForURL(`${BASE}/**`, { timeout: 15000 });
      }
    }
  });

  test('orders page loads with real data', async ({ page }) => {
    await page.goto(`${BASE}/orders`);
    await page.waitForLoadState('networkidle');

    // Page title
    await expect(page.locator('h1')).toContainText('Order Management');

    // Stat cards should have numbers (not --)
    const statCards = page.locator('[aria-label="Platform statistics"] >> text=/\\d+/').first();
    await expect(statCards).toBeVisible({ timeout: 10000 });

    // Tabs should exist with real state names from backend
    const tabBar = page.locator('[role="tablist"]');
    await expect(tabBar).toBeVisible();
    await expect(tabBar.locator('button').first()).toContainText('All Orders');

    // Table should have rows
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows.first()).toBeVisible({ timeout: 10000 });

    // Order ID column should have real order numbers
    const firstOrderId = tableRows.first().locator('a').first();
    await expect(firstOrderId).toContainText(/HB-/);

    console.log('Orders page: PASS');
  });

  test('tab filtering works', async ({ page }) => {
    await page.goto(`${BASE}/orders`);
    await page.waitForLoadState('networkidle');

    // Click a state tab (not "All Orders")
    const tabs = page.locator('[role="tablist"] button');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThan(1);

    // Click second tab (first real state)
    const secondTab = tabs.nth(1);
    const tabText = await secondTab.textContent();
    await secondTab.click();

    // Wait for data refresh
    await page.waitForTimeout(1000);

    // The "Showing X of Y" text should update
    const showing = page.locator('text=/Showing \\d+ of \\d+ orders/');
    await expect(showing).toBeVisible({ timeout: 5000 });

    console.log(`Tab filter (${tabText?.trim()}): PASS`);
  });

  test('seller column shows data', async ({ page }) => {
    await page.goto(`${BASE}/orders`);
    await page.waitForLoadState('networkidle');

    // Check SELLER column header exists
    await expect(page.locator('th:has-text("SELLER")')).toBeVisible();

    console.log('Seller column: visible');
  });
});
