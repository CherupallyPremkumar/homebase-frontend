import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../auth/login';

test.describe('Backoffice — Finance', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    // Finance routes require ADMIN role in backoffice
    await loginAsAdmin(page, baseURL!);
  });

  test('finance landing page loads', async ({ page }) => {
    await page.goto('/finance');
    await expect(page).toHaveURL(/\/finance/);

    await expect(
      page.getByText(/Finance|Settlement|Payment/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('settlements page loads with data', async ({ page }) => {
    await page.goto('/finance/settlements');
    await expect(page).toHaveURL('/finance/settlements');

    // Data table or empty state
    const dataRow = page.getByRole('row');
    const emptyState = page.getByText(/No data|No settlements/i);

    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('payments page loads', async ({ page }) => {
    await page.goto('/finance/payments');
    await expect(page).toHaveURL('/finance/payments');

    await expect(
      page.getByText(/Payment|Transaction|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('GST reports page loads', async ({ page }) => {
    await page.goto('/finance/gst');
    await expect(page).toHaveURL('/finance/gst');

    await expect(
      page.getByText(/GST|Tax|Report|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('reconciliation page loads', async ({ page }) => {
    await page.goto('/finance/reconciliation');
    await expect(page).toHaveURL('/finance/reconciliation');

    await expect(
      page.getByText(/Reconciliation|Match|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });
});
