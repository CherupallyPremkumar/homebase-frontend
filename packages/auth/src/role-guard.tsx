'use client';

import { useAuth } from './hooks';

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Only renders children if the current user has at least one of the required roles.
 */
export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { hasAnyRole, isLoading } = useAuth();

  if (isLoading) return null;
  if (!hasAnyRole(roles)) return <>{fallback}</>;

  return <>{children}</>;
}
