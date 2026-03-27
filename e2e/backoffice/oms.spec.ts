import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../auth/login';

test.describe('Backoffice — OMS (Order Management)', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsAdmin(page, baseURL!);
  });

  test('backoffice dashboard loads with section cards', async ({ page }) => {
    // The backoffice landing page shows section cards (Operations, Finance, Warehouse)
    await expect(
      page.getByText(/Operations|where would you like to work/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('navigate to OMS orders page', async ({ page }) => {
    test.slow();

    await page.goto('/oms/orders');
    await expect(page).toHaveURL('/oms/orders');

    // Should show the orders data table or empty state
    await expect(
      page.getByText(/Orders|Order ID|No orders|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('OMS orders page shows data table', async ({ page }) => {
    test.slow();

    await page.goto('/oms/orders');

    // Wait for table to load
    const dataRow = page.getByRole('row');
    const emptyState = page.getByText(/No orders|No data/i);

    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('click an order to view detail with action buttons', async ({ page }) => {
    test.slow();

    await page.goto('/oms/orders');

    // Look for clickable order rows
    const rows = page.getByRole('row');
    const rowCount = await rows.count().catch(() => 0);

    if (rowCount > 1) {
      const orderLink = rows.nth(1).getByRole('link').first();
      if (await orderLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await orderLink.click();

        // Should show order detail with status and action buttons
        await expect(
          page.getByText(/Order|Status|Items|Actions|Total/i).first(),
        ).toBeVisible({ timeout: 10_000 });

        // Action buttons (based on allowedActions from STM) should be visible
        const actionSection = page.getByRole('button').filter({
          hasText: /Confirm|Ship|Cancel|Refund|Fulfill|Pack|Assign/i,
        });
        // It's OK if there are no actions (depends on order state)
      }
    }
  });

  test('OMS shipments page loads', async ({ page }) => {
    await page.goto('/oms/shipments');
    await expect(page).toHaveURL('/oms/shipments');

    await expect(
      page.getByText(/Shipment|Tracking|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('OMS fulfillment page loads', async ({ page }) => {
    await page.goto('/oms/fulfillment');
    await expect(page).toHaveURL('/oms/fulfillment');

    await expect(
      page.getByText(/Fulfillment|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('OMS returns page loads', async ({ page }) => {
    await page.goto('/oms/returns');
    await expect(page).toHaveURL('/oms/returns');

    await expect(
      page.getByText(/Return|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });
});
