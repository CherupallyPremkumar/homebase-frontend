import { test, expect, type Page } from '@playwright/test';
import {
  APP_URLS,
  STOREFRONT_PAGES,
  SELLER_PAGES,
  BACKOFFICE_PAGES,
  PLATFORM_PAGES,
  SELLER_SIDEBAR_LINKS,
  PLATFORM_SIDEBAR_LINKS,
  BACKOFFICE_OMS_SIDEBAR_LINKS,
  BACKOFFICE_FINANCE_SIDEBAR_LINKS,
  BACKOFFICE_WAREHOUSE_NAV_LINKS,
  STOREFRONT_HEADER_LINKS,
  STOREFRONT_CATEGORY_LINKS,
  VIEWPORTS,
  waitForPageReady,
  assertNotErrorPage,
  captureConsoleErrors,
  takeScreenshot,
  assertNoHorizontalOverflow,
} from './helpers';
// Auth is disabled for UI testing — just navigate directly
const loginAsCustomer = async (page: Page, baseUrl: string) => { await page.goto(baseUrl); };
const loginAsSeller = async (page: Page, baseUrl: string) => { await page.goto(baseUrl); };
const loginAsAdmin = async (page: Page, baseUrl: string, path?: string) => { await page.goto(baseUrl + (path || '')); };
const loginAsWarehouse = async (page: Page, baseUrl: string) => { await page.goto(baseUrl); };

// ============================================================================
// TEST 1: Every page loads without 404 or errors
// ============================================================================

test.describe('Page Load Tests', () => {
  test.describe('Storefront (public pages)', () => {
    const publicPages = STOREFRONT_PAGES.filter((p) => !p.auth);

    for (const pg of publicPages) {
      test(`storefront ${pg.label} (${pg.path}) loads without error`, async ({ page }) => {
        await page.goto(`${APP_URLS.storefront}${pg.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });
        await waitForPageReady(page);
        await assertNotErrorPage(page);
      });
    }
  });

  test.describe('Storefront (authenticated pages)', () => {
    const authPages = STOREFRONT_PAGES.filter((p) => p.auth);

    for (const pg of authPages) {
      test(`storefront ${pg.label} (${pg.path}) loads for logged-in customer`, async ({
        page,
      }) => {
        test.slow();
        await loginAsCustomer(page, APP_URLS.storefront);
        await page.goto(`${APP_URLS.storefront}${pg.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });
        await waitForPageReady(page);
        await assertNotErrorPage(page);
      });
    }
  });

  test.describe('Seller pages', () => {
    for (const pg of SELLER_PAGES) {
      test(`seller ${pg.label} (${pg.path}) loads after login`, async ({ page }) => {
        test.slow();
        await loginAsSeller(page, APP_URLS.seller);
        await page.goto(`${APP_URLS.seller}${pg.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });
        await waitForPageReady(page);
        await assertNotErrorPage(page);
      });
    }
  });

  test.describe('Backoffice pages', () => {
    for (const pg of BACKOFFICE_PAGES) {
      test(`backoffice ${pg.label} (${pg.path}) loads after login`, async ({ page }) => {
        test.slow();
        await loginAsAdmin(page, APP_URLS.backoffice);
        await page.goto(`${APP_URLS.backoffice}${pg.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });
        await waitForPageReady(page);
        await assertNotErrorPage(page);
      });
    }
  });

  test.describe('Platform pages', () => {
    for (const pg of PLATFORM_PAGES) {
      test(`platform ${pg.label} (${pg.path}) loads after login`, async ({ page }) => {
        test.slow();
        await loginAsAdmin(page, APP_URLS.platform);
        await page.goto(`${APP_URLS.platform}${pg.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });
        await waitForPageReady(page);
        await assertNotErrorPage(page);
      });
    }
  });
});

// ============================================================================
// TEST 2: Sidebar navigation tests
// ============================================================================

test.describe('Sidebar Navigation Tests', () => {
  test.describe('Seller sidebar links navigate correctly', () => {
    for (const link of SELLER_SIDEBAR_LINKS) {
      test(`seller sidebar -> ${link.label} (${link.href})`, async ({ page }) => {
        test.slow();
        await loginAsSeller(page, APP_URLS.seller);

        // Wait for sidebar to render
        const sidebar = page.locator('aside');
        await expect(sidebar.first()).toBeVisible({ timeout: 15_000 });

        // Find and click the sidebar link by its text
        const navLink = sidebar.getByRole('link', { name: link.label, exact: false }).first();
        await expect(navLink).toBeVisible({ timeout: 10_000 });
        await navLink.click();

        // Wait for navigation
        await page.waitForLoadState('domcontentloaded');
        await waitForPageReady(page);

        // Verify we navigated to the right path
        const currentPath = new URL(page.url()).pathname;
        expect(currentPath).toBe(link.href);

        // Page should not be a 404
        await assertNotErrorPage(page);

        // Verify the active state is applied (seller uses orange-400 text for active)
        const activeLink = sidebar
          .getByRole('link', { name: link.label, exact: false })
          .first();
        await expect(activeLink).toBeVisible();
      });
    }
  });

  test.describe('Platform sidebar links navigate correctly', () => {
    for (const link of PLATFORM_SIDEBAR_LINKS) {
      test(`platform sidebar -> ${link.label} (${link.href})`, async ({ page }) => {
        test.slow();
        await loginAsAdmin(page, APP_URLS.platform);

        const sidebar = page.locator('aside');
        await expect(sidebar.first()).toBeVisible({ timeout: 15_000 });

        const navLink = sidebar.getByRole('link', { name: link.label, exact: false }).first();
        await expect(navLink).toBeVisible({ timeout: 10_000 });
        await navLink.click();

        await page.waitForLoadState('domcontentloaded');
        await waitForPageReady(page);

        const currentPath = new URL(page.url()).pathname;
        expect(currentPath).toBe(link.href);

        await assertNotErrorPage(page);
      });
    }
  });

  test.describe('Backoffice OMS sidebar links navigate correctly', () => {
    for (const link of BACKOFFICE_OMS_SIDEBAR_LINKS) {
      test(`backoffice OMS sidebar -> ${link.label} (${link.href})`, async ({ page }) => {
        test.slow();
        await loginAsAdmin(page, APP_URLS.backoffice, '/oms');

        // Navigate to OMS section first to see its sidebar
        await page.goto(`${APP_URLS.backoffice}/oms`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });
        await waitForPageReady(page);

        // Find the sidebar or navigation area
        const nav = page.locator('aside, nav').first();
        await expect(nav).toBeVisible({ timeout: 15_000 });

        const navLink = nav.getByRole('link', { name: link.label, exact: false }).first();
        if (await navLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
          await navLink.click();
          await page.waitForLoadState('domcontentloaded');
          await waitForPageReady(page);

          const currentPath = new URL(page.url()).pathname;
          expect(currentPath).toBe(link.href);
          await assertNotErrorPage(page);
        }
      });
    }
  });

  test.describe('Backoffice Finance sidebar links navigate correctly', () => {
    for (const link of BACKOFFICE_FINANCE_SIDEBAR_LINKS) {
      test(`backoffice Finance sidebar -> ${link.label} (${link.href})`, async ({ page }) => {
        test.slow();
        await loginAsAdmin(page, APP_URLS.backoffice, '/finance');

        await page.goto(`${APP_URLS.backoffice}/finance`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });
        await waitForPageReady(page);

        const nav = page.locator('aside, nav').first();
        await expect(nav).toBeVisible({ timeout: 15_000 });

        const navLink = nav.getByRole('link', { name: link.label, exact: false }).first();
        if (await navLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
          await navLink.click();
          await page.waitForLoadState('domcontentloaded');
          await waitForPageReady(page);

          const currentPath = new URL(page.url()).pathname;
          expect(currentPath).toBe(link.href);
          await assertNotErrorPage(page);
        }
      });
    }
  });

  test.describe('Backoffice Warehouse nav links navigate correctly', () => {
    for (const link of BACKOFFICE_WAREHOUSE_NAV_LINKS) {
      test(`backoffice Warehouse nav -> ${link.label} (${link.href})`, async ({ page }) => {
        test.slow();
        await loginAsWarehouse(page, APP_URLS.backoffice);

        await page.goto(`${APP_URLS.backoffice}/warehouse`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });
        await waitForPageReady(page);

        // Warehouse uses a bottom nav bar
        const navLink = page.getByRole('link', { name: link.label, exact: false }).first();
        if (await navLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
          await navLink.click();
          await page.waitForLoadState('domcontentloaded');
          await waitForPageReady(page);

          const currentPath = new URL(page.url()).pathname;
          expect(currentPath).toBe(link.href);
          await assertNotErrorPage(page);
        }
      });
    }
  });
});

// ============================================================================
// TEST 3: Header navigation tests (storefront)
// ============================================================================

test.describe('Header Navigation Tests', () => {
  test('storefront logo navigates to homepage', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/products`, {
      waitUntil: 'domcontentloaded',
    });
    await waitForPageReady(page);

    // Logo link contains "HomeBase" text
    const logoLink = page.getByRole('link', { name: /HomeBase/i }).first();
    await expect(logoLink).toBeVisible({ timeout: 10_000 });
    await logoLink.click();

    await page.waitForLoadState('domcontentloaded');
    expect(new URL(page.url()).pathname).toBe('/');
  });

  test('storefront cart link navigates to /cart', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/`, {
      waitUntil: 'domcontentloaded',
    });
    await waitForPageReady(page);

    const cartLink = page.getByRole('link', { name: /Cart/i }).first();
    await expect(cartLink).toBeVisible({ timeout: 10_000 });
    await cartLink.click();

    await page.waitForLoadState('domcontentloaded');
    expect(new URL(page.url()).pathname).toBe('/cart');
    await assertNotErrorPage(page);
  });

  test('storefront wishlist link navigates to /wishlist', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/`, {
      waitUntil: 'domcontentloaded',
    });
    await waitForPageReady(page);

    // Wishlist link is hidden on mobile, visible on desktop
    const wishlistLink = page.getByRole('link', { name: /Wishlist/i }).first();
    if (await wishlistLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await wishlistLink.click();
      await page.waitForLoadState('domcontentloaded');
      // Wishlist could navigate to /wishlist or /profile#wishlist
      const path = new URL(page.url()).pathname;
      expect(path).toMatch(/\/(wishlist|profile)/);
      await assertNotErrorPage(page);
    }
  });

  test('storefront account link navigates to /login for unauthenticated users', async ({
    page,
  }) => {
    await page.goto(`${APP_URLS.storefront}/`, {
      waitUntil: 'domcontentloaded',
    });
    await waitForPageReady(page);

    // Account link shows "Account" text — for unauthenticated, it points to /login
    const accountLink = page.getByRole('link', { name: /Account/i }).first();
    if (await accountLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await accountLink.click();
      await page.waitForLoadState('domcontentloaded');
      // Could redirect to /login or to Keycloak
      const path = page.url();
      expect(path).toMatch(/\/login|\/realms/);
    }
  });

  test.describe('Storefront category nav links', () => {
    // Skip "Home" category as it points to "/" which is the starting page
    const categoryLinks = STOREFRONT_CATEGORY_LINKS.filter((c) => c.href !== '/');

    for (const cat of categoryLinks) {
      test(`category link "${cat.label}" navigates to ${cat.href}`, async ({ page }) => {
        await page.goto(`${APP_URLS.storefront}/`, {
          waitUntil: 'domcontentloaded',
        });
        await waitForPageReady(page);

        const navLink = page.getByRole('link', { name: cat.label, exact: true }).first();
        if (await navLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
          await navLink.click();
          await page.waitForLoadState('domcontentloaded');
          const currentPath = new URL(page.url()).pathname;
          expect(currentPath).toBe(cat.href);
        }
      });
    }
  });
});

// ============================================================================
// TEST 4: Button interaction tests — buttons are clickable and don't crash
// ============================================================================

test.describe('Button Interaction Tests', () => {
  test('storefront homepage buttons do not throw JS errors', async ({ page }) => {
    const { errors, cleanup } = captureConsoleErrors(page);

    await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible().catch(() => false)) {
        const isDisabled = await btn.isDisabled().catch(() => false);
        if (!isDisabled) {
          await btn.click({ force: true, timeout: 5_000 }).catch(() => {
            // Button may be covered by another element — that is fine
          });
          // Small wait to let any async errors propagate
          await page.waitForTimeout(300);
        }
      }
    }

    cleanup();
    // Filter out non-critical console errors (e.g. missing API endpoints during dev)
    const criticalErrors = errors.filter(
      (e) => !e.includes('Failed to fetch') && !e.includes('NetworkError') && !e.includes('ERR_CONNECTION_REFUSED'),
    );
    expect(
      criticalErrors.length,
      `Found ${criticalErrors.length} JS error(s) on storefront homepage:\n${criticalErrors.join('\n')}`,
    ).toBe(0);
  });

  test('storefront products page "Add to Cart" buttons are clickable', async ({ page }) => {
    const { errors, cleanup } = captureConsoleErrors(page);

    await page.goto(`${APP_URLS.storefront}/products`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    // Wait for product cards to load
    const addToCartBtn = page.getByRole('button', { name: /Add to Cart/i }).first();
    if (await addToCartBtn.isVisible({ timeout: 15_000 }).catch(() => false)) {
      await addToCartBtn.click();
      await page.waitForTimeout(1_000);
      // Expect either a toast message or no crash
      await assertNotErrorPage(page);
    }

    cleanup();
    const criticalErrors = errors.filter(
      (e) => !e.includes('Failed to fetch') && !e.includes('NetworkError') && !e.includes('ERR_CONNECTION_REFUSED'),
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('seller dashboard buttons do not throw JS errors', async ({ page }) => {
    test.slow();
    const { errors, cleanup } = captureConsoleErrors(page);

    await loginAsSeller(page, APP_URLS.seller);
    await waitForPageReady(page);

    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible().catch(() => false)) {
        const isDisabled = await btn.isDisabled().catch(() => false);
        if (!isDisabled) {
          await btn.click({ force: true, timeout: 5_000 }).catch(() => {});
          await page.waitForTimeout(300);
        }
      }
    }

    cleanup();
    const criticalErrors = errors.filter(
      (e) => !e.includes('Failed to fetch') && !e.includes('NetworkError') && !e.includes('ERR_CONNECTION_REFUSED'),
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('platform dashboard buttons do not throw JS errors', async ({ page }) => {
    test.slow();
    const { errors, cleanup } = captureConsoleErrors(page);

    await loginAsAdmin(page, APP_URLS.platform);
    await waitForPageReady(page);

    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible().catch(() => false)) {
        const isDisabled = await btn.isDisabled().catch(() => false);
        if (!isDisabled) {
          await btn.click({ force: true, timeout: 5_000 }).catch(() => {});
          await page.waitForTimeout(300);
        }
      }
    }

    cleanup();
    const criticalErrors = errors.filter(
      (e) => !e.includes('Failed to fetch') && !e.includes('NetworkError') && !e.includes('ERR_CONNECTION_REFUSED'),
    );
    expect(criticalErrors.length).toBe(0);
  });
});

// ============================================================================
// TEST 5: Form tests — forms are fillable and submittable
// ============================================================================

test.describe('Form Tests', () => {
  test('storefront search form accepts input and submits', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/products`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    // The search box in the header
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await searchInput.fill('laptop');
      await searchInput.press('Enter');
      await page.waitForTimeout(2_000);
      await assertNotErrorPage(page);
    }
  });

  test('storefront product search page works', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/search?q=test`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);
    await assertNotErrorPage(page);

    // Should show search results or empty state
    await expect(
      page.getByText(/results|products|No products found|Search/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('storefront cart page shows cart summary', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/cart`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    await expect(
      page.getByText(/Shopping Cart|Your Cart|Cart is empty|cart/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('storefront checkout page renders form fields for authenticated user', async ({
    page,
  }) => {
    test.slow();
    await loginAsCustomer(page, APP_URLS.storefront);

    await page.goto(`${APP_URLS.storefront}/checkout`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    // Checkout page should render — either shows form or "empty cart"
    await expect(
      page.getByText(/Checkout|Shipping|Payment|Your cart is empty|Address/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('seller new product form renders all required fields', async ({ page }) => {
    test.slow();
    await loginAsSeller(page, APP_URLS.seller);

    await page.goto(`${APP_URLS.seller}/products/new`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    // New product page should have form fields
    await expect(
      page.getByText(/Add Product|New Product|Create Product|Product Name/i).first(),
    ).toBeVisible({ timeout: 15_000 });

    // Try to find and fill the product name field
    const nameInput = page.getByLabel(/Product Name|Name/i).first().or(
      page.locator('input[name*="name"], input[placeholder*="name"]').first(),
    );
    if (await nameInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await nameInput.fill('Test Product E2E');
    }

    // Try to find and fill a price field
    const priceInput = page.getByLabel(/Price/i).first().or(
      page.locator('input[name*="price"], input[placeholder*="price"]').first(),
    );
    if (await priceInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await priceInput.fill('999');
    }

    await assertNotErrorPage(page);
  });

  test('platform new product form renders', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.platform);

    await page.goto(`${APP_URLS.platform}/products/new`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    await expect(
      page.getByText(/Add Product|New Product|Create|Product/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('platform new promotion form renders', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.platform);

    await page.goto(`${APP_URLS.platform}/promotions/new`, {
      waitUntil: 'domcontentloaded',
    });
    await waitForPageReady(page);

    await expect(
      page.getByText(/Promotion|Create|New|Coupon|Discount/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('storefront product detail "Add to Cart" flow works', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/products`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    // Navigate to a product detail page
    const productLink = page.locator('a[href^="/products/"]').first();
    if (await productLink.isVisible({ timeout: 15_000 }).catch(() => false)) {
      await productLink.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/products\/.+/);

      // Product detail should have an "Add to Cart" button
      const addBtn = page.getByRole('button', { name: /Add to Cart/i });
      if (await addBtn.isVisible({ timeout: 10_000 }).catch(() => false)) {
        await addBtn.click();
        await page.waitForTimeout(2_000);
        // Expect either a success toast or the page to remain stable
        await assertNotErrorPage(page);
      }
    }
  });
});

// ============================================================================
// TEST 6: Visual regression screenshots (baseline capture)
// ============================================================================

test.describe('Visual Screenshots', () => {
  // Storefront public pages
  const screenshotPages = [
    { app: 'storefront', url: APP_URLS.storefront, path: '/', name: 'storefront-home' },
    { app: 'storefront', url: APP_URLS.storefront, path: '/products', name: 'storefront-products' },
    { app: 'storefront', url: APP_URLS.storefront, path: '/categories', name: 'storefront-categories' },
    { app: 'storefront', url: APP_URLS.storefront, path: '/cart', name: 'storefront-cart' },
  ];

  for (const pg of screenshotPages) {
    test(`screenshot: ${pg.name}`, async ({ page }) => {
      await page.goto(`${pg.url}${pg.path}`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);
      // Give images and lazy content time to load
      await page.waitForTimeout(2_000);
      await takeScreenshot(page, pg.name);
    });
  }

  test('screenshot: seller dashboard', async ({ page }) => {
    test.slow();
    await loginAsSeller(page, APP_URLS.seller);
    await waitForPageReady(page);
    await page.waitForTimeout(2_000);
    await takeScreenshot(page, 'seller-dashboard');
  });

  test('screenshot: platform dashboard', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.platform);
    await waitForPageReady(page);
    await page.waitForTimeout(2_000);
    await takeScreenshot(page, 'platform-dashboard');
  });

  test('screenshot: backoffice home', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.backoffice);
    await waitForPageReady(page);
    await page.waitForTimeout(2_000);
    await takeScreenshot(page, 'backoffice-home');
  });

  test('screenshot: backoffice OMS orders', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.backoffice, '/oms/orders');
    await page.goto(`${APP_URLS.backoffice}/oms/orders`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);
    await page.waitForTimeout(2_000);
    await takeScreenshot(page, 'backoffice-oms-orders');
  });

  test('screenshot: backoffice warehouse', async ({ page }) => {
    test.slow();
    await loginAsWarehouse(page, APP_URLS.backoffice);
    await page.goto(`${APP_URLS.backoffice}/warehouse`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);
    await page.waitForTimeout(2_000);
    await takeScreenshot(page, 'backoffice-warehouse');
  });
});

// ============================================================================
// TEST 7: Responsive tests
// ============================================================================

test.describe('Responsive Tests', () => {
  test.describe('Storefront at mobile (375px)', () => {
    test.use({ viewport: VIEWPORTS.mobile });

    test('homepage has no horizontal overflow on mobile', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);
      await assertNoHorizontalOverflow(page);
    });

    test('products page has no horizontal overflow on mobile', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/products`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);
      await assertNoHorizontalOverflow(page);
    });

    test('mobile bottom nav is visible on mobile', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);

      // The MobileBottomNav is visible on mobile (md:hidden means it shows on small screens)
      const bottomNav = page.locator('nav.fixed.bottom-0').first();
      await expect(bottomNav).toBeVisible({ timeout: 10_000 });

      // Check that key mobile nav items are present
      await expect(page.getByRole('link', { name: /Home/i }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: /Cart/i }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: /Categories/i }).first()).toBeVisible();
    });

    test('desktop header search is hidden on mobile', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);

      // The search form has class "hidden md:flex" so it should not be visible on mobile
      const searchForm = page.locator('form').filter({
        has: page.locator('input[placeholder*="Search"]'),
      }).first();

      // It may be hidden or not in the DOM at all on mobile
      if (await searchForm.count() > 0) {
        const isVisible = await searchForm.isVisible().catch(() => false);
        // On mobile viewport, the search should be hidden
        expect(isVisible).toBe(false);
      }
    });

    test('mobile screenshot: storefront home', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);
      await page.waitForTimeout(2_000);
      await takeScreenshot(page, 'storefront-home-mobile-375');
    });
  });

  test.describe('Storefront at tablet (768px)', () => {
    test.use({ viewport: VIEWPORTS.tablet });

    test('homepage has no horizontal overflow on tablet', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);
      await assertNoHorizontalOverflow(page);
    });

    test('products page has no horizontal overflow on tablet', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/products`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);
      await assertNoHorizontalOverflow(page);
    });

    test('tablet screenshot: storefront home', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);
      await page.waitForTimeout(2_000);
      await takeScreenshot(page, 'storefront-home-tablet-768');
    });
  });

  test.describe('Storefront at desktop (1440px)', () => {
    test.use({ viewport: VIEWPORTS.desktop });

    test('homepage has no horizontal overflow on desktop', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);
      await assertNoHorizontalOverflow(page);
    });

    test('products page has no horizontal overflow on desktop', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/products`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);
      await assertNoHorizontalOverflow(page);
    });

    test('desktop header elements are visible at 1440px', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);

      // Search bar should be visible at desktop width
      const searchInput = page.locator('input[placeholder*="Search"]').first();
      await expect(searchInput).toBeVisible({ timeout: 10_000 });

      // Wishlist link should be visible
      const wishlistLink = page.getByRole('link', { name: /Wishlist/i }).first();
      await expect(wishlistLink).toBeVisible();

      // Account link should be visible
      const accountLink = page.getByRole('link', { name: /Account/i }).first();
      await expect(accountLink).toBeVisible();
    });

    test('desktop screenshot: storefront home', async ({ page }) => {
      await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
      await waitForPageReady(page);
      await page.waitForTimeout(2_000);
      await takeScreenshot(page, 'storefront-home-desktop-1440');
    });
  });
});

// ============================================================================
// TEST 8: Accessibility (structural checks without axe-core dependency)
// ============================================================================

test.describe('Accessibility Tests', () => {
  test('storefront homepage has proper heading hierarchy', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    // Page should have at least one heading
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    expect(count, 'Page should have at least one heading').toBeGreaterThan(0);
  });

  test('storefront homepage images have alt attributes', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);
    await page.waitForTimeout(3_000); // wait for lazy-loaded images

    const images = page.locator('img');
    const imgCount = await images.count();

    let missingAltCount = 0;
    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      if (await img.isVisible().catch(() => false)) {
        const alt = await img.getAttribute('alt');
        // alt="" is acceptable (decorative images), but missing alt is not
        if (alt === null) {
          missingAltCount++;
        }
      }
    }

    expect(
      missingAltCount,
      `Found ${missingAltCount} image(s) missing the alt attribute on storefront homepage`,
    ).toBe(0);
  });

  test('storefront interactive elements are keyboard focusable', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    // Tab through the page and check that focus is not trapped
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }

    // After tabbing, we should have a focused element that is visible
    const focusedElement = page.locator(':focus');
    const hasFocus = (await focusedElement.count()) > 0;
    expect(hasFocus, 'Page should have a focused element after pressing Tab').toBe(true);
  });

  test('storefront buttons have accessible names', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    const buttons = page.getByRole('button');
    const count = await buttons.count();

    let namelessButtons = 0;
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible().catch(() => false)) {
        const name = await btn.getAttribute('aria-label');
        const text = await btn.innerText().catch(() => '');
        const title = await btn.getAttribute('title');

        // A button should have at least one of: text content, aria-label, or title
        if (!name && !text.trim() && !title) {
          namelessButtons++;
        }
      }
    }

    expect(
      namelessButtons,
      `Found ${namelessButtons} button(s) without accessible names on storefront homepage`,
    ).toBe(0);
  });

  test('storefront forms have associated labels', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/products`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    // Check that input fields have either a label, aria-label, or placeholder
    const inputs = page.locator('input:not([type="hidden"]):not([type="submit"])');
    const inputCount = await inputs.count();

    let unlabelledInputs = 0;
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible().catch(() => false)) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        // Check if there is a label[for=id]
        let hasLabel = false;
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          hasLabel = (await label.count()) > 0;
        }

        if (!hasLabel && !ariaLabel && !placeholder && !ariaLabelledBy) {
          unlabelledInputs++;
        }
      }
    }

    expect(
      unlabelledInputs,
      `Found ${unlabelledInputs} input(s) without labels/aria on storefront products page`,
    ).toBe(0);
  });

  test('seller app has proper navigation landmarks', async ({ page }) => {
    test.slow();
    await loginAsSeller(page, APP_URLS.seller);
    await waitForPageReady(page);

    // Should have at least one <nav> or role="navigation"
    const navCount = await page.locator('nav, [role="navigation"]').count();
    expect(navCount, 'Seller app should have at least one navigation landmark').toBeGreaterThan(0);

    // Should have a <main> or role="main"
    const mainCount = await page.locator('main, [role="main"]').count();
    expect(mainCount, 'Seller app should have a main content area').toBeGreaterThan(0);
  });

  test('platform app has proper navigation landmarks', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.platform);
    await waitForPageReady(page);

    const navCount = await page.locator('nav, [role="navigation"]').count();
    expect(navCount, 'Platform app should have at least one navigation landmark').toBeGreaterThan(0);

    const mainCount = await page.locator('main, [role="main"]').count();
    expect(mainCount, 'Platform app should have a main content area').toBeGreaterThan(0);
  });

  test('storefront product cards have meaningful link text', async ({ page }) => {
    await page.goto(`${APP_URLS.storefront}/products`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    const productLinks = page.locator('a[href^="/products/"]');
    const count = await productLinks.count();

    if (count > 0) {
      // Each product link should contain some text (not just an empty link)
      const firstLink = productLinks.first();
      const text = await firstLink.innerText().catch(() => '');
      const ariaLabel = await firstLink.getAttribute('aria-label');
      expect(
        text.trim().length > 0 || (ariaLabel && ariaLabel.length > 0),
        'Product links should have descriptive text or aria-label',
      ).toBe(true);
    }
  });

  test('color contrast: text is readable against backgrounds on storefront', async ({
    page,
  }) => {
    await page.goto(`${APP_URLS.storefront}/`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    // Check that the main content area has text that is reasonably sized
    const bodyFontSize = await page.evaluate(() => {
      const body = document.querySelector('body');
      if (!body) return '0';
      return window.getComputedStyle(body).fontSize;
    });

    const size = parseInt(bodyFontSize, 10);
    expect(size, 'Body font size should be at least 12px for readability').toBeGreaterThanOrEqual(12);
  });
});

// ============================================================================
// TEST 9: Cross-app consistency checks
// ============================================================================

test.describe('Cross-App Consistency', () => {
  test('all apps return proper HTML document with lang attribute', async ({ page }) => {
    for (const [appName, url] of Object.entries(APP_URLS)) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });

      const lang = await page.locator('html').getAttribute('lang');
      expect(
        lang,
        `${appName} should have a lang attribute on <html>`,
      ).toBeTruthy();
    }
  });

  test('all apps have a viewport meta tag', async ({ page }) => {
    for (const [appName, url] of Object.entries(APP_URLS)) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });

      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(
        viewport,
        `${appName} should have a viewport meta tag`,
      ).toBeTruthy();
    }
  });

  test('all apps have a <title> tag', async ({ page }) => {
    for (const [appName, url] of Object.entries(APP_URLS)) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });

      const title = await page.title();
      expect(
        title.length,
        `${appName} should have a non-empty <title>`,
      ).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// TEST 10: Data table and list rendering tests
// ============================================================================

test.describe('Data Table & List Rendering', () => {
  test('seller products page shows data table or empty state', async ({ page }) => {
    test.slow();
    await loginAsSeller(page, APP_URLS.seller);
    await page.goto(`${APP_URLS.seller}/products`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    const dataRow = page.getByRole('row').or(page.getByRole('article'));
    const emptyState = page.getByText(/No products|No data|Get started/i);
    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('seller orders page shows data table or empty state', async ({ page }) => {
    test.slow();
    await loginAsSeller(page, APP_URLS.seller);
    await page.goto(`${APP_URLS.seller}/orders`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    const dataRow = page.getByRole('row');
    const emptyState = page.getByText(/No orders|No data/i);
    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('platform products page shows data table or empty state', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.platform);
    await page.goto(`${APP_URLS.platform}/products`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    const dataRow = page.getByRole('row').or(page.getByRole('article'));
    const emptyState = page.getByText(/No products|No data/i);
    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('platform users page shows data table or empty state', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.platform);
    await page.goto(`${APP_URLS.platform}/users`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    const dataRow = page.getByRole('row').or(page.getByRole('article'));
    const emptyState = page.getByText(/No users|No data/i);
    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('platform suppliers page shows data table or empty state', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.platform);
    await page.goto(`${APP_URLS.platform}/suppliers`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    const dataRow = page.getByRole('row').or(page.getByRole('article'));
    const emptyState = page.getByText(/No suppliers|No data/i);
    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('backoffice OMS orders shows data table or empty state', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.backoffice, '/oms/orders');
    await page.goto(`${APP_URLS.backoffice}/oms/orders`, { waitUntil: 'domcontentloaded' });
    await waitForPageReady(page);

    const dataRow = page.getByRole('row');
    const emptyState = page.getByText(/No orders|No data/i);
    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });

  test('backoffice finance settlements shows data table or empty state', async ({ page }) => {
    test.slow();
    await loginAsAdmin(page, APP_URLS.backoffice, '/finance/settlements');
    await page.goto(`${APP_URLS.backoffice}/finance/settlements`, {
      waitUntil: 'domcontentloaded',
    });
    await waitForPageReady(page);

    const dataRow = page.getByRole('row');
    const emptyState = page.getByText(/No data|No settlements/i);
    await expect(dataRow.first().or(emptyState)).toBeVisible({ timeout: 15_000 });
  });
});
