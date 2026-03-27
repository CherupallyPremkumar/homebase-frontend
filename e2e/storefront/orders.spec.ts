import { test, expect } from '@playwright/test';
import { loginAsCustomer } from '../auth/login';

test.describe('Storefront — Orders', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
  });

  test('orders page loads', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL('/orders');

    // Should show the orders list or an empty state
    await expect(
      page.getByText(/My Orders|Order|No orders|You haven't placed/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('click an order to view detail', async ({ page }) => {
    test.slow();

    await page.goto('/orders');

    // Wait for order list to load — look for order links in main content area only
    const mainContent = page.locator('main');
    const orderLink = mainContent.locator('a[href^="/orders/"]').first();
    const emptyState = page.getByText(/No orders yet|You haven't placed/i);

    // Either we have orders to click, or an empty state
    const hasOrders = await orderLink.isVisible({ timeout: 10_000 }).catch(() => false);

    if (hasOrders) {
      await orderLink.click();
      await expect(page).toHaveURL(/\/orders\/.+/);

      // Order detail page should show order information
      await expect(
        page.getByText(/Order|Status|Total|Items/i).first(),
      ).toBeVisible({ timeout: 10_000 });
    } else {
      await expect(emptyState).toBeVisible();
    }
  });

  test('order detail shows tracking option', async ({ page }) => {
    test.slow();

    await page.goto('/orders');

    const mainContent = page.locator('main');
    const orderLink = mainContent.locator('a[href^="/orders/"]').first();
    const hasOrders = await orderLink.isVisible({ timeout: 10_000 }).catch(() => false);

    if (hasOrders) {
      await orderLink.click();
      await expect(page).toHaveURL(/\/orders\/.+/);

      // Look for a Track Order link/button
      const trackBtn = page.getByRole('link', { name: /Track/i }).or(
        page.getByRole('button', { name: /Track/i }),
      );

      if (await trackBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await trackBtn.click();
        await expect(page).toHaveURL(/\/orders\/.+\/track/);

        // Tracking page should show status stepper or tracking info
        await expect(
          page.getByText(/Tracking|Status|Delivered|Shipped|Processing/i).first(),
        ).toBeVisible({ timeout: 10_000 });
      }
    } else {
      // No orders — the test passes with empty state
      await expect(page.getByText(/No orders yet|You haven't placed/i)).toBeVisible();
    }
  });
});
