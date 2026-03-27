import { test, expect } from '@playwright/test';
import { loginAsSeller } from '../auth/login';

test.describe('Seller — Products', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsSeller(page, baseURL!);
  });

  test('products page loads and shows product list', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL('/products');

    // Should show a product listing or empty state
    await expect(
      page.getByText(/Products|No products|Add Product/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('product list shows data', async ({ page }) => {
    test.slow();

    await page.goto('/products');

    // Wait for data table or card grid to load
    const dataRow = page.getByRole('row').or(page.getByRole('article'));
    const emptyState = page.getByText(/No products|No data|Get started/i);

    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('click a product to view detail', async ({ page }) => {
    test.slow();

    await page.goto('/products');

    // Wait for product list
    const productLink = page
      .getByRole('link')
      .filter({ hasText: /.+/ })
      .first();

    const hasProducts = await page
      .getByRole('row')
      .or(page.getByRole('article'))
      .first()
      .isVisible({ timeout: 10_000 })
      .catch(() => false);

    if (hasProducts) {
      // Click first product link in the table/grid
      const link = page.getByRole('row').nth(1).getByRole('link').first().or(
        page.getByRole('article').first().getByRole('link').first(),
      );

      if (await link.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await link.click();
        await expect(page).toHaveURL(/\/products\/.+/);

        // Product detail should show product info
        await expect(
          page.getByText(/Product|Name|Price|SKU|Status/i).first(),
        ).toBeVisible({ timeout: 10_000 });
      }
    }
  });
});
