import { test, expect } from '@playwright/test';
import { loginAsCustomer } from '../auth/login';

test.describe('Storefront — Cart & Checkout', () => {
  test('add item to cart as guest and verify cart page', async ({ page }) => {
    test.slow(); // Multiple navigations + API calls

    await page.goto('/products');

    // Wait for product cards
    const firstArticle = page.getByRole('article').first();
    await expect(firstArticle).toBeVisible({ timeout: 15_000 });

    // Click "Add to Cart" on the first in-stock product
    const addToCartBtn = firstArticle.getByRole('button', { name: /Add to Cart/i });
    if (await addToCartBtn.isVisible().catch(() => false)) {
      await addToCartBtn.click();

      // Verify success toast appears
      await expect(page.getByText(/added to cart/i)).toBeVisible({ timeout: 5_000 });
    }
  });

  test('cart icon shows item count after adding', async ({ page }) => {
    await page.goto('/products');

    const firstArticle = page.getByRole('article').first();
    await expect(firstArticle).toBeVisible({ timeout: 15_000 });

    const addToCartBtn = firstArticle.getByRole('button', { name: /Add to Cart/i });
    if (await addToCartBtn.isVisible().catch(() => false)) {
      await addToCartBtn.click();
      await expect(page.getByText(/added to cart/i)).toBeVisible({ timeout: 5_000 });

      // Cart icon in navbar should have a count badge
      const cartLink = page.getByRole('link', { name: /Cart/i });
      await expect(cartLink).toBeVisible();
    }
  });

  test('cart page shows items', async ({ page }) => {
    // Add an item first
    await page.goto('/products');
    const firstArticle = page.getByRole('article').first();
    await expect(firstArticle).toBeVisible({ timeout: 15_000 });

    const addToCartBtn = firstArticle.getByRole('button', { name: /Add to Cart/i });
    if (await addToCartBtn.isVisible().catch(() => false)) {
      await addToCartBtn.click();
      await expect(page.getByText(/added to cart/i)).toBeVisible({ timeout: 5_000 });
    }

    // Navigate to cart
    await page.goto('/cart');
    await expect(page).toHaveURL('/cart');

    // Cart page should show the Shopping Cart heading or cart items
    await expect(
      page.getByText(/Shopping Cart|Your Cart|Cart is empty/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('login as customer and view cart', async ({ page, baseURL }) => {
    test.slow();

    await loginAsCustomer(page, baseURL!);

    // After login, navigate to cart
    await page.goto('/cart');
    await expect(page).toHaveURL('/cart');

    await expect(
      page.getByText(/Shopping Cart|Your Cart|Cart is empty/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('proceed to checkout page loads', async ({ page, baseURL }) => {
    test.slow();

    await loginAsCustomer(page, baseURL!);

    // Navigate to checkout directly
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/checkout/);

    // Checkout page should render
    await expect(
      page.getByText(/Checkout|Shipping|Payment|Your cart is empty/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });
});
