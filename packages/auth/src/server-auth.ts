import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';

/**
 * Server-side auth utilities for Server Components and Route Handlers.
 * Reads roles from the encrypted JWT cookie — roles NEVER reach the browser.
 */

interface ServerUser {
  name?: string | null;
  email?: string | null;
  roles: string[];
}

/**
 * Get the current user's info including roles from the encrypted JWT cookie.
 * Only works in Server Components, Route Handlers, and Server Actions.
 */
export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const cookieStore = await cookies();
    const headerStore = await headers();

    // Build a minimal request-like object for getToken
    const token = await getToken({
      req: {
        cookies: Object.fromEntries(
          cookieStore.getAll().map((c) => [c.name, c.value]),
        ),
        headers: Object.fromEntries(headerStore.entries()),
      } as Parameters<typeof getToken>[0]['req'],
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    });

    if (!token) return null;

    return {
      name: (token.name as string) || null,
      email: (token.email as string) || null,
      roles: (token.roles as string[]) || [],
    };
  } catch {
    return null;
  }
}

/**
 * Get the current user's roles from the encrypted JWT cookie.
 */
export async function getServerRoles(): Promise<string[]> {
  const user = await getServerUser();
  return user?.roles || [];
}

/**
 * Check if the current user has a specific role.
 */
export async function hasRole(role: string): Promise<boolean> {
  const roles = await getServerRoles();
  return roles.includes(role);
}

/**
 * Check if the current user has any of the specified roles.
 */
export async function hasAnyRole(...roles: string[]): Promise<boolean> {
  const userRoles = await getServerRoles();
  return roles.some((r) => userRoles.includes(r));
}
