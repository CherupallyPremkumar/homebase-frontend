import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../auth/login';

const PLATFORM_URL = 'http://localhost:3006';

test.describe('Platform — Configuration & Settings', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsAdmin(page, baseURL || PLATFORM_URL);
  });

  test('config editor page loads', async ({ page }) => {
    await page.goto('/settings/config');
    await expect(page).toHaveURL('/settings/config');

    await expect(
      page.getByText(/Config|Configuration|Settings|Editor/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('rules engine page loads', async ({ page }) => {
    await page.goto('/settings/rules');
    await expect(page).toHaveURL('/settings/rules');

    await expect(
      page.getByText(/Rules|Rule Engine|Business Rules|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('CMS page loads', async ({ page }) => {
    await page.goto('/cms');
    await expect(page).toHaveURL('/cms');

    await expect(
      page.getByText(/CMS|Content|Banner|Page/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('CMS banners page loads', async ({ page }) => {
    await page.goto('/cms/banners');
    await expect(page).toHaveURL('/cms/banners');

    await expect(
      page.getByText(/Banner|Hero|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('analytics page loads', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL('/analytics');

    await expect(
      page.getByText(/Analytics|Dashboard|Metrics|Chart|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('compliance page loads', async ({ page }) => {
    await page.goto('/compliance');
    await expect(page).toHaveURL('/compliance');

    await expect(
      page.getByText(/Compliance|Policy|Agreement|Legal/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('compliance agreements page loads', async ({ page }) => {
    await page.goto('/compliance/agreements');
    await expect(page).toHaveURL('/compliance/agreements');

    await expect(
      page.getByText(/Agreement|Contract|Terms|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('tax configuration page loads', async ({ page }) => {
    await page.goto('/tax');
    await expect(page).toHaveURL('/tax');

    await expect(
      page.getByText(/Tax|GST|Rate|Slab|No data/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });
});
