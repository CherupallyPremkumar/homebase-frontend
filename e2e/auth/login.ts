import type { Page } from '@playwright/test';

/**
 * Shared helpers to authenticate through the Keycloak OIDC flow.
 *
 * Each app's /login page auto-submits a form that redirects to Keycloak.
 * We fill the Keycloak login form, submit, and wait for the redirect back
 * to the originating app.
 *
 * Test users (all password: Test@1234):
 *   customer@test.com — CUSTOMER
 *   seller@test.com   — SELLER
 *   warehouse@test.com— WAREHOUSE
 *   ops@test.com      — OPS_ADMIN
 *   finance@test.com  — FINANCE
 *   admin@test.com    — ADMIN
 */

const DEFAULT_PASSWORD = 'Test@1234';

interface LoginOptions {
  email: string;
  password?: string;
  /** The base URL of the target app, e.g. http://localhost:3000 */
  baseURL: string;
  /** Path to redirect to after login (default: /) */
  callbackUrl?: string;
}

/**
 * Core login function.
 *
 * 1. Navigates to the app's /login page (which auto-submits to Keycloak)
 * 2. Waits for the Keycloak login form to appear
 * 3. Fills in email + password and submits
 * 4. Waits for the redirect back to the app
 */
export async function keycloakLogin(page: Page, opts: LoginOptions): Promise<void> {
  const { email, password = DEFAULT_PASSWORD, baseURL, callbackUrl = '/' } = opts;

  // Navigate to login — the page auto-redirects to Keycloak
  const loginUrl = `${baseURL}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });

  // Wait for Keycloak login form — the auto-submit form redirects through NextAuth to Keycloak
  // The URL may contain /realms/homebase or stay on /login while the form auto-submits
  await page.waitForURL(/.*\/realms\/homebase.*|.*\/login.*/, {
    timeout: 15_000,
  });

  // If we're still on the app's /login page, wait for the auto-submit to redirect to Keycloak
  if (page.url().includes('/login') && !page.url().includes('/realms/')) {
    // Wait for either the Keycloak redirect or for the login form to appear
    await page.waitForURL(/.*\/realms\/homebase.*/, { timeout: 20_000 }).catch(() => {
      // Auto-submit may have already completed — check if we have a login form
    });
  }

  // Fill the Keycloak login form (may use custom HomeBase theme)
  // Try standard Keycloak IDs first, fall back to role-based selectors
  const usernameField = page.locator('#username, input[name="username"], input[type="email"]').first();
  const passwordField = page.locator('#password, input[name="password"], input[type="password"]').first();

  await usernameField.waitFor({ state: 'visible', timeout: 10_000 });
  await usernameField.fill(email);
  await passwordField.fill(password);

  // Submit — custom theme may not have #kc-login, use button with "Sign in" text
  const submitBtn = page.locator('#kc-login').or(page.getByRole('button', { name: /Sign in/i })).first();
  await submitBtn.click();

  // Wait for redirect back to the app
  await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
}

// ── Convenience wrappers per role ──

export async function loginAsCustomer(page: Page, baseURL = 'http://localhost:3000') {
  await keycloakLogin(page, { email: 'customer@test.com', baseURL });
}

export async function loginAsSeller(page: Page, baseURL = 'http://localhost:3002') {
  await keycloakLogin(page, { email: 'seller@test.com', baseURL });
}

export async function loginAsAdmin(
  page: Page,
  baseURL = 'http://localhost:3003',
  callbackUrl = '/',
) {
  await keycloakLogin(page, { email: 'admin@test.com', baseURL, callbackUrl });
}

export async function loginAsWarehouse(page: Page, baseURL = 'http://localhost:3003') {
  await keycloakLogin(page, { email: 'warehouse@test.com', baseURL });
}

export async function loginAsFinance(page: Page, baseURL = 'http://localhost:3003') {
  await keycloakLogin(page, { email: 'finance@test.com', baseURL });
}

export async function loginAsOps(page: Page, baseURL = 'http://localhost:3003') {
  await keycloakLogin(page, { email: 'ops@test.com', baseURL });
}
