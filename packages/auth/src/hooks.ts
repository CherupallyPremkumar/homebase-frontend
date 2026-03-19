'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export interface UseAuthReturn {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles: string[];
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: string[];
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  login: () => void;
  logout: () => void;
  accessToken: string | null;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = session as any;

  const user = s?.user
    ? {
        id: s.user.id as string || '',
        name: s.user.name as string | null,
        email: s.user.email as string | null,
        image: s.user.image as string | null,
        roles: (s.roles as string[]) || [],
      }
    : null;

  const roles = user?.roles || [];

  return {
    user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    roles,
    hasRole: (role: string) => roles.includes(role),
    hasAnyRole: (checkRoles: string[]) => checkRoles.some((r) => roles.includes(r)),
    login: () => signIn('keycloak'),
    logout: () => signOut({ callbackUrl: '/' }),
    accessToken: (s?.accessToken as string) || null,
  };
}

// Re-export for convenience
export { signIn, signOut } from 'next-auth/react';
