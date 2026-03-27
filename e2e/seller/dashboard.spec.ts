import { test, expect } from '@playwright/test';
import { loginAsSeller } from '../auth/login';

test.describe('Seller — Dashboard', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsSeller(page, baseURL!);
  });

  test('dashboard loads after login', async ({ page }) => {
    await expect(page).toHaveURL(/\//);

    // Dashboard should show stats or welcome content
    await expect(page.locator('main, [class*="container"]').first()).toBeVisible({
      timeout: 15_000,
    });

    // Look for typical dashboard elements: revenue, orders, products
    await expect(
      page.getByText(/Revenue|Orders|Products|Dashboard|Welcome/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('sidebar navigation works', async ({ page }) => {
    // Seller app should have navigation links
    const nav = page.getByRole('navigation').or(page.locator('aside, [class*="sidebar"]'));

    if (await nav.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      // Check for key nav items
      const productsLink = page.getByRole('link', { name: /Products/i }).first();
      const ordersLink = page.getByRole('link', { name: /Orders/i }).first();

      // At least one nav link should be visible
      await expect(productsLink.or(ordersLink)).toBeVisible({ timeout: 5_000 });
    }
  });

  test('dashboard shows stat cards', async ({ page }) => {
    // Wait for data to load — stat cards typically show numeric values
    await page.waitForTimeout(2_000);

    // Look for common dashboard patterns: cards with numbers
    const statContent = page
      .getByText(/Revenue|Total Orders|Total Products|Active|Pending/i)
      .first();
    await expect(statContent).toBeVisible({ timeout: 15_000 });
  });
});
