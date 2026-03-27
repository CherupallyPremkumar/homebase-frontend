import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../auth/login';

const PLATFORM_URL = 'http://localhost:3006';

test.describe('Platform — Entity Management', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsAdmin(page, baseURL || PLATFORM_URL);
  });

  test('products page loads with list', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL('/products');

    // Data table / grid or empty state
    const dataRow = page.getByRole('row').or(page.getByRole('article'));
    const emptyState = page.getByText(/No products|No data/i);

    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('suppliers page loads with list', async ({ page }) => {
    await page.goto('/suppliers');
    await expect(page).toHaveURL('/suppliers');

    const dataRow = page.getByRole('row').or(page.getByRole('article'));
    const emptyState = page.getByText(/No suppliers|No data/i);

    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('users page loads with list', async ({ page }) => {
    await page.goto('/users');
    await expect(page).toHaveURL('/users');

    const dataRow = page.getByRole('row').or(page.getByRole('article'));
    const emptyState = page.getByText(/No users|No data/i);

    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('reviews page loads with list', async ({ page }) => {
    await page.goto('/reviews');
    await expect(page).toHaveURL('/reviews');

    const dataRow = page.getByRole('row').or(page.getByRole('article'));
    const emptyState = page.getByText(/No reviews|No data/i);

    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('click a product to view detail', async ({ page }) => {
    test.slow();

    await page.goto('/products');

    const rows = page.getByRole('row');
    const rowCount = await rows.count().catch(() => 0);

    if (rowCount > 1) {
      const link = rows.nth(1).getByRole('link').first();
      if (await link.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await link.click();
        await expect(page).toHaveURL(/\/products\/.+/);

        await expect(
          page.getByText(/Product|Name|Price|SKU/i).first(),
        ).toBeVisible({ timeout: 10_000 });
      }
    }
  });

  test('click a supplier to view detail', async ({ page }) => {
    test.slow();

    await page.goto('/suppliers');

    const rows = page.getByRole('row');
    const rowCount = await rows.count().catch(() => 0);

    if (rowCount > 1) {
      const link = rows.nth(1).getByRole('link').first();
      if (await link.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await link.click();
        await expect(page).toHaveURL(/\/suppliers\/.+/);

        await expect(
          page.getByText(/Supplier|Name|Contact|Status/i).first(),
        ).toBeVisible({ timeout: 10_000 });
      }
    }
  });

  test('click a user to view detail', async ({ page }) => {
    test.slow();

    await page.goto('/users');

    const rows = page.getByRole('row');
    const rowCount = await rows.count().catch(() => 0);

    if (rowCount > 1) {
      const link = rows.nth(1).getByRole('link').first();
      if (await link.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await link.click();
        await expect(page).toHaveURL(/\/users\/.+/);

        await expect(
          page.getByText(/User|Name|Email|Role/i).first(),
        ).toBeVisible({ timeout: 10_000 });
      }
    }
  });

  test('inventory page loads', async ({ page }) => {
    await page.goto('/inventory');
    await expect(page).toHaveURL('/inventory');

    await expect(
      page.getByText(/Inventory|Stock|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('promotions page loads', async ({ page }) => {
    await page.goto('/promotions');
    await expect(page).toHaveURL('/promotions');

    await expect(
      page.getByText(/Promotion|Coupon|Discount|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });
});
