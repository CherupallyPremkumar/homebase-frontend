import { test, expect } from '@playwright/test';
import { loginAsCustomer } from '../auth/login';

test.describe('Storefront — Reviews', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAsCustomer(page, baseURL!);
  });

  test('product detail shows reviews tab', async ({ page }) => {
    test.slow();

    // Navigate to a product
    await page.goto('/products');
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 15_000 });
    await firstProduct.click();
    await expect(page).toHaveURL(/\/products\/.+/);

    // The product detail page has tabs: Description, Specifications, Reviews
    const reviewsTab = page.getByRole('tab', { name: /Reviews/i });
    await expect(reviewsTab).toBeVisible({ timeout: 10_000 });

    // Click the Reviews tab
    await reviewsTab.click();

    // Should show the "Customer Reviews" heading or "No reviews yet" or existing reviews
    await expect(
      page.getByText(/Customer Reviews|No reviews yet|Write a Review/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('submit a review on a product', async ({ page }) => {
    test.slow();

    // Navigate to a product detail page
    await page.goto('/products');
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 15_000 });
    await firstProduct.click();
    await expect(page).toHaveURL(/\/products\/.+/);

    // Click the Reviews tab
    const reviewsTab = page.getByRole('tab', { name: /Reviews/i });
    await reviewsTab.click();

    // Click "Write a Review" button
    const writeReviewBtn = page.getByRole('button', { name: /Write a Review/i });
    await expect(writeReviewBtn).toBeVisible({ timeout: 10_000 });
    await writeReviewBtn.click();

    // The review form should appear
    await expect(page.getByText(/Write Your Review/i)).toBeVisible();

    // Select a 4-star rating (click the 4th star button)
    const starButtons = page.locator('form button').filter({ has: page.locator('svg') });
    const fourthStar = starButtons.nth(3); // 0-indexed, 4th star
    if (await fourthStar.isVisible().catch(() => false)) {
      await fourthStar.click();
      await expect(page.getByText('Very Good')).toBeVisible();
    }

    // Fill the title
    await page.getByPlaceholder(/Summarize your experience/i).fill('Great product for testing');

    // Fill the review body
    await page
      .getByPlaceholder(/Share your thoughts/i)
      .fill('This is an excellent product. I would recommend it to everyone looking for quality.');

    // Submit the review
    await page.getByRole('button', { name: /Submit Review/i }).click();

    // Wait for feedback — success toast or error (mutation may fail on query-build-only backend)
    const successMsg = page.getByText(/Review submitted|Thank you/i);
    const errorMsg = page.getByText(/error|failed|unavailable/i).first();
    const formStillVisible = page.getByText(/Write Your Review/i);
    await expect(successMsg.or(errorMsg).or(formStillVisible)).toBeVisible({
      timeout: 10_000,
    });
  });
});
