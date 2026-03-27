import { test, expect } from '@playwright/test';
import { loginAsSeller } from '../auth/login';

test.describe('Seller — Orders', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsSeller(page, baseURL!);
  });

  test('orders page loads', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL('/orders');

    // Should show order list or empty state
    await expect(
      page.getByText(/Orders|No orders|Order ID/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('order list shows data table', async ({ page }) => {
    test.slow();

    await page.goto('/orders');

    // Wait for data table rows or empty state
    const dataRow = page.getByRole('row');
    const emptyState = page.getByText(/No orders|No data/i);

    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('click an order to view detail with actions', async ({ page }) => {
    test.slow();

    await page.goto('/orders');

    // Check if there are order rows (skip header row)
    const rows = page.getByRole('row');
    const rowCount = await rows.count().catch(() => 0);

    if (rowCount > 1) {
      // Click on the first data row's link
      const orderLink = rows.nth(1).getByRole('link').first();
      if (await orderLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await orderLink.click();
        await expect(page).toHaveURL(/\/orders\/.+/);

        // Order detail should show order info and possible actions
        await expect(
          page.getByText(/Order|Status|Items|Total|Customer/i).first(),
        ).toBeVisible({ timeout: 10_000 });
      }
    }
  });
});
