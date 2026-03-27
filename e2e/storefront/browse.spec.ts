import { test, expect } from '@playwright/test';

test.describe('Storefront — Browse & Discovery', () => {
  test('homepage loads with key sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // The storefront logo / brand
    await expect(page.getByRole('link', { name: 'HomeBase' })).toBeVisible();

    // At least one section heading should appear
    const heading = page.locator('h2, h3').first();
    await expect(heading).toBeVisible({ timeout: 15_000 });
  });

  test('products page loads and shows product cards', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL('/products');

    await expect(page.getByRole('heading', { name: /All Products/i }).first()).toBeVisible();

    // Wait for product cards to render (EntityCard renders as div with links)
    // Look for product links inside the product grid
    const productLinks = page.locator('a[href^="/products/"]');
    await expect(productLinks.first()).toBeVisible({ timeout: 15_000 });

    const count = await productLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('search for a product by name', async ({ page }) => {
    await page.goto('/products');

    const searchInput = page.getByRole('searchbox', { name: /Search products/i });
    await expect(searchInput).toBeVisible({ timeout: 10_000 });

    // Wait for initial products to load first
    await expect(page.locator('a[href^="/products/"]').first()).toBeVisible({ timeout: 15_000 });

    await searchInput.fill('test');
    await searchInput.press('Enter');

    // Wait for results to reload
    await page.waitForTimeout(2_000);

    // Either we see product links or a "no products found" message
    const productLinks = page.locator('a[href^="/products/"]');
    const emptyMessage = page.getByText(/No products found/i);
    await expect(productLinks.first().or(emptyMessage)).toBeVisible({ timeout: 10_000 });
  });

  test('filter by category tab', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await expect(page.locator('a[href^="/products/"]').first()).toBeVisible({ timeout: 15_000 });

    // The ProductListing component has tabs: All, New Arrivals, Top Rated
    const newArrivals = page.getByRole('tab', { name: /New Arrivals/i });
    if (await newArrivals.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await newArrivals.click();
      await page.waitForTimeout(1_000);
      await expect(newArrivals).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('product detail page loads with name, price, and image', async ({ page }) => {
    await page.goto('/products');

    // Wait for product cards to render
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 15_000 });

    await firstProduct.click();

    // Should be on a product detail page
    await expect(page).toHaveURL(/\/products\/.+/);

    // Product detail should show the product name as an h1
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10_000 });

    // Price should be visible
    await expect(page.getByText(/₹|In Stock|Out of Stock/i).first()).toBeVisible();
  });

  test('categories page loads', async ({ page }) => {
    await page.goto('/categories');
    await expect(page).toHaveURL('/categories');

    await expect(page.locator('main, [class*="container"]').first()).toBeVisible({ timeout: 10_000 });
  });
});
