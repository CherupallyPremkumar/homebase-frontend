import { test, expect } from '@playwright/test';
import { loginAsWarehouse } from '../auth/login';

test.describe('Backoffice — Warehouse', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsWarehouse(page, baseURL!);
  });

  test('warehouse dashboard loads', async ({ page }) => {
    await page.goto('/warehouse');
    await expect(page).toHaveURL(/\/warehouse/);

    await expect(
      page.getByText(/Warehouse|Receiving|Picking|Packing/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('picking queue page loads', async ({ page }) => {
    await page.goto('/warehouse/picking');
    await expect(page).toHaveURL('/warehouse/picking');

    await expect(
      page.getByText(/Picking|Queue|No data|No items/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('cycle count page loads with inventory table', async ({ page }) => {
    await page.goto('/warehouse/cycle-count');
    await expect(page).toHaveURL('/warehouse/cycle-count');

    // Should show cycle count interface or empty state
    await expect(
      page.getByText(/Cycle Count|Inventory|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('receiving page loads', async ({ page }) => {
    await page.goto('/warehouse/receiving');
    await expect(page).toHaveURL('/warehouse/receiving');

    await expect(
      page.getByText(/Receiving|Inbound|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('packing page loads', async ({ page }) => {
    await page.goto('/warehouse/packing');
    await expect(page).toHaveURL('/warehouse/packing');

    await expect(
      page.getByText(/Packing|Pack|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('bins page loads', async ({ page }) => {
    await page.goto('/warehouse/bins');
    await expect(page).toHaveURL('/warehouse/bins');

    await expect(
      page.getByText(/Bin|Location|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });
});
