import { type Page, type Locator, expect, type BrowserContext } from '@playwright/test';

// ---------------------------------------------------------------------------
// Base URLs for each app
// ---------------------------------------------------------------------------

export const APP_URLS = {
  storefront: 'http://localhost:3000',
  seller: 'http://localhost:3002',
  backoffice: 'http://localhost:3003',
  platform: 'http://localhost:3006',
} as const;

export type AppName = keyof typeof APP_URLS;

// ---------------------------------------------------------------------------
// Page route definitions per app (every known page.tsx route)
// ---------------------------------------------------------------------------

interface PageEntry {
  path: string;
  label: string;
  auth?: boolean;
}

export const STOREFRONT_PAGES: PageEntry[] = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/categories', label: 'Categories' },
  { path: '/cart', label: 'Cart' },
  { path: '/search', label: 'Search' },
  { path: '/wishlist', label: 'Wishlist' },
  { path: '/profile', label: 'Profile', auth: true },
  { path: '/orders', label: 'Orders', auth: true },
  { path: '/returns', label: 'Returns', auth: true },
  { path: '/checkout', label: 'Checkout', auth: true },
];

export const SELLER_PAGES: PageEntry[] = [
  { path: '/', label: 'Dashboard' },
  { path: '/products', label: 'Products' },
  { path: '/orders', label: 'Orders' },
  { path: '/returns', label: 'Returns' },
  { path: '/inventory', label: 'Inventory' },
  { path: '/performance', label: 'Performance' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/settlements', label: 'Settlements' },
  { path: '/messages', label: 'Messages' },
  { path: '/support', label: 'Support' },
  { path: '/documents', label: 'Documents' },
  { path: '/settings', label: 'Settings' },
  { path: '/products/new', label: 'New Product' },
  { path: '/profile', label: 'Profile' },
  { path: '/store-settings', label: 'Store Settings' },
  { path: '/payments', label: 'Payments' },
];

export const BACKOFFICE_PAGES: PageEntry[] = [
  { path: '/', label: 'Home' },
  // OMS section
  { path: '/oms', label: 'OMS Dashboard' },
  { path: '/oms/orders', label: 'OMS Orders' },
  { path: '/oms/shipments', label: 'OMS Shipments' },
  { path: '/oms/fulfillment', label: 'OMS Fulfillment' },
  { path: '/oms/returns', label: 'OMS Returns' },
  { path: '/oms/support', label: 'OMS Support' },
  // Finance section
  { path: '/finance', label: 'Finance Dashboard' },
  { path: '/finance/settlements', label: 'Finance Settlements' },
  { path: '/finance/reconciliation', label: 'Finance Reconciliation' },
  { path: '/finance/payments', label: 'Finance Payments' },
  { path: '/finance/gst', label: 'GST Reports' },
  // Warehouse section
  { path: '/warehouse', label: 'Warehouse Dashboard' },
  { path: '/warehouse/receiving', label: 'Warehouse Receiving' },
  { path: '/warehouse/picking', label: 'Warehouse Picking' },
  { path: '/warehouse/packing', label: 'Warehouse Packing' },
  { path: '/warehouse/cycle-count', label: 'Warehouse Cycle Count' },
  { path: '/warehouse/bins', label: 'Warehouse Bins' },
];

export const PLATFORM_PAGES: PageEntry[] = [
  { path: '/', label: 'Dashboard' },
  { path: '/orders', label: 'Orders' },
  { path: '/returns', label: 'Returns' },
  { path: '/products', label: 'Products' },
  { path: '/products/new', label: 'New Product' },
  { path: '/suppliers', label: 'Sellers' },
  { path: '/users', label: 'Users' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/compliance', label: 'Compliance' },
  { path: '/compliance/agreements', label: 'Compliance Agreements' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/promotions', label: 'Promotions' },
  { path: '/promotions/new', label: 'New Promotion' },
  { path: '/cms', label: 'CMS' },
  { path: '/cms/banners', label: 'CMS Banners' },
  { path: '/settings', label: 'Settings' },
  { path: '/settings/config', label: 'Configuration' },
  { path: '/settings/rules', label: 'Rules Engine' },
  { path: '/tax', label: 'Tax' },
  { path: '/inventory', label: 'Inventory' },
  { path: '/audit-log', label: 'Audit Log' },
  { path: '/profile', label: 'Profile' },
];

// ---------------------------------------------------------------------------
// Sidebar link definitions (matches actual component code)
// ---------------------------------------------------------------------------

export const SELLER_SIDEBAR_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'Orders' },
  { href: '/returns', label: 'Returns' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/performance', label: 'Performance' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/settlements', label: 'Settlements' },
  { href: '/messages', label: 'Messages' },
  { href: '/support', label: 'Support' },
  { href: '/documents', label: 'Documents' },
  { href: '/settings', label: 'Settings' },
] as const;

export const PLATFORM_SIDEBAR_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/orders', label: 'Orders' },
  { href: '/returns', label: 'Returns' },
  { href: '/products', label: 'Products' },
  { href: '/suppliers', label: 'Sellers' },
  { href: '/users', label: 'Users' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/compliance', label: 'Compliance' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/promotions', label: 'Promotions' },
  { href: '/cms', label: 'CMS' },
  { href: '/settings', label: 'Settings' },
] as const;

export const BACKOFFICE_OMS_SIDEBAR_LINKS = [
  { href: '/oms', label: 'Dashboard' },
  { href: '/oms/orders', label: 'Orders' },
  { href: '/oms/shipments', label: 'Shipments' },
  { href: '/oms/fulfillment', label: 'Fulfillment' },
  { href: '/oms/returns', label: 'Returns' },
  { href: '/oms/support', label: 'Support Tickets' },
] as const;

export const BACKOFFICE_FINANCE_SIDEBAR_LINKS = [
  { href: '/finance', label: 'Dashboard' },
  { href: '/finance/settlements', label: 'Settlements' },
  { href: '/finance/reconciliation', label: 'Reconciliation' },
  { href: '/finance/payments', label: 'Payments' },
  { href: '/finance/gst', label: 'GST Reports' },
] as const;

export const BACKOFFICE_WAREHOUSE_NAV_LINKS = [
  { href: '/warehouse', label: 'Home' },
  { href: '/warehouse/receiving', label: 'Receive' },
  { href: '/warehouse/picking', label: 'Pick' },
  { href: '/warehouse/packing', label: 'Pack' },
  { href: '/warehouse/cycle-count', label: 'Count' },
  { href: '/warehouse/bins', label: 'Bins' },
] as const;

// ---------------------------------------------------------------------------
// Storefront header links
// ---------------------------------------------------------------------------

export const STOREFRONT_HEADER_LINKS = [
  { href: '/', label: 'HomeBase (Logo)' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/cart', label: 'Cart' },
] as const;

export const STOREFRONT_CATEGORY_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/category/electronics', label: 'Electronics' },
  { href: '/category/fashion', label: 'Fashion' },
  { href: '/category/home-living', label: 'Home & Living' },
  { href: '/category/sports', label: 'Sports' },
  { href: '/category/groceries', label: 'Groceries' },
  { href: '/category/beauty', label: 'Beauty' },
] as const;

// ---------------------------------------------------------------------------
// Responsive viewport presets
// ---------------------------------------------------------------------------

export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
} as const;

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Wait for a page to finish loading meaningfully.
 * Waits for domcontentloaded and then for the main content area to appear.
 */
export async function waitForPageReady(page: Page, timeoutMs = 15_000): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  // Wait for any <main>, body content, or container div to be visible
  await page.locator('main, body, [class*="container"]').first().waitFor({
    state: 'visible',
    timeout: timeoutMs,
  });
}

/**
 * Assert the page is NOT a 404 / error page.
 * Checks for common 404 indicators, Next.js error boundaries, and blank pages.
 */
export async function assertNotErrorPage(page: Page): Promise<void> {
  const bodyText = await page.locator('body').innerText({ timeout: 10_000 }).catch(() => '');

  // Not a 404 page
  const is404 =
    /404|page not found|not found/i.test(bodyText) &&
    bodyText.trim().length < 500; // small page with only a 404 message
  expect(is404, `Expected page "${page.url()}" to NOT be a 404 page`).toBe(false);

  // Not a Next.js error boundary showing an unhandled error
  const hasErrorBoundary = await page
    .locator('[data-nextjs-error-boundary], #__next-build-error, [class*="nextjs-error"]')
    .count();
  expect(
    hasErrorBoundary,
    `Expected page "${page.url()}" to NOT show a Next.js error boundary`,
  ).toBe(0);

  // Not a completely blank page (body should have some text)
  expect(
    bodyText.trim().length,
    `Expected page "${page.url()}" to have visible content (not blank)`,
  ).toBeGreaterThan(0);
}

/**
 * Assert there are no uncaught JS errors on the page.
 * Returns a cleanup function to deregister the listener.
 */
export function captureConsoleErrors(page: Page): { errors: string[]; cleanup: () => void } {
  const errors: string[] = [];
  const handler = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  };
  page.on('console', handler);

  const pageErrorHandler = (err: Error) => {
    errors.push(`Page error: ${err.message}`);
  };
  page.on('pageerror', pageErrorHandler);

  return {
    errors,
    cleanup: () => {
      page.removeListener('console', handler);
      page.removeListener('pageerror', pageErrorHandler);
    },
  };
}

/**
 * Collect all visible <a> links inside a given locator scope.
 * Returns the href and visible text for each.
 */
export async function collectLinks(
  scope: Locator,
): Promise<{ href: string; text: string }[]> {
  const links = scope.locator('a[href]');
  const count = await links.count();
  const results: { href: string; text: string }[] = [];

  for (let i = 0; i < count; i++) {
    const link = links.nth(i);
    if (await link.isVisible().catch(() => false)) {
      const href = (await link.getAttribute('href')) || '';
      const text = (await link.innerText().catch(() => '')) || '';
      results.push({ href, text: text.trim() });
    }
  }
  return results;
}

/**
 * Take a named screenshot and save it to the e2e/screenshots/ directory.
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({
    path: `e2e/screenshots/${name}.png`,
    fullPage: true,
  });
}

/**
 * Check that a page has no horizontal overflow (content wider than viewport).
 */
export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(
    overflow,
    `Expected page "${page.url()}" to have no horizontal overflow`,
  ).toBe(false);
}

/**
 * Find all visible buttons on the page that are not navigation links.
 */
export async function collectButtons(page: Page): Promise<Locator[]> {
  const buttons = page.getByRole('button');
  const count = await buttons.count();
  const result: Locator[] = [];

  for (let i = 0; i < count; i++) {
    const btn = buttons.nth(i);
    if (await btn.isVisible().catch(() => false)) {
      result.push(btn);
    }
  }
  return result;
}
