import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3006';
const KEYCLOAK_USER = 'admin@test.com';
const KEYCLOAK_PASS = 'Test@1234';

// All platform pages to test
const PAGES = [
  { path: '/', name: 'Dashboard' },
  { path: '/orders', name: 'Orders' },
  { path: '/products', name: 'Products' },
  { path: '/users', name: 'Users' },
  { path: '/inventory', name: 'Inventory' },
  { path: '/suppliers', name: 'Sellers/Suppliers' },
  { path: '/returns', name: 'Returns' },
  { path: '/shipping', name: 'Shipping' },
  { path: '/settlements', name: 'Settlements' },
  { path: '/refunds', name: 'Refunds' },
  { path: '/promotions', name: 'Promotions' },
  { path: '/reviews', name: 'Reviews' },
  { path: '/support', name: 'Support' },
  { path: '/cms', name: 'CMS' },
  { path: '/analytics', name: 'Analytics' },
  { path: '/compliance', name: 'Compliance' },
  { path: '/finance', name: 'Finance' },
  { path: '/notifications', name: 'Notifications' },
  { path: '/settings', name: 'Settings' },
];

test.describe('Platform Smoke Test', () => {
  test.beforeAll(async ({ browser }) => {
    // Login once, save auth state
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(BASE);

    // Should redirect to Keycloak login
    await page.waitForURL(/localhost:8180|login/, { timeout: 10000 });

    // If redirected to our /login page, click the sign-in button
    if (page.url().includes('/login')) {
      const signInBtn = page.locator('button:has-text("Sign"), a:has-text("Sign")').first();
      if (await signInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await signInBtn.click();
        await page.waitForURL(/localhost:8180/, { timeout: 10000 });
      }
    }

    // Fill Keycloak login form
    if (page.url().includes('localhost:8180')) {
      await page.fill('#username', KEYCLOAK_USER);
      await page.fill('#password', KEYCLOAK_PASS);
      await page.click('#kc-login');
      await page.waitForURL(`${BASE}/**`, { timeout: 15000 });
    }

    // Save auth state
    await context.storageState({ path: '/tmp/platform-auth.json' });
    await context.close();
  });

  for (const { path, name } of PAGES) {
    test(`${name} (${path})`, async ({ browser }) => {
      const context = await browser.newContext({ storageState: '/tmp/platform-auth.json' });
      const page = await context.newPage();

      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', err => errors.push(err.message));

      const response = await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30000 });
      const status = response?.status() ?? 0;

      // Check no 500 error
      expect(status).toBeLessThan(500);

      // Check page rendered (not blank)
      const body = await page.textContent('body');
      expect(body?.length).toBeGreaterThan(10);

      // Check no "Internal Server Error" text
      expect(body).not.toContain('Internal Server Error');

      // Log results
      const apiCalls = errors.filter(e => e.includes('API') || e.includes('fetch') || e.includes('500'));
      console.log(`${name}: HTTP ${status}, body=${body?.length}chars, errors=${errors.length}, apiErrors=${apiCalls.length}`);
      if (errors.length > 0) {
        console.log(`  Errors: ${errors.slice(0, 3).join(' | ')}`);
      }

      await context.close();
    });
  }
});
