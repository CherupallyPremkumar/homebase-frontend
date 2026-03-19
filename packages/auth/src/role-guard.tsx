/**
 * Role-based access is enforced server-side only:
 * 1. Middleware checks roles on every request (route-level protection)
 * 2. Server Components can read roles from the JWT for UI decisions
 *
 * Roles are NEVER sent to the browser — no client-side role guard needed.
 * This file is kept for backward compatibility but does nothing.
 */
export function RoleGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
