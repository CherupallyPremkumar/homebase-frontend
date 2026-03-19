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
    logout: async () => {
      const idToken = s?.idToken as string | undefined;

      // Clear NextAuth session first
      await signOut({ redirect: false });

      // Redirect to Keycloak's end-session endpoint to kill the Keycloak session
      // This prevents auto-login on next visit
      const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER || 'http://localhost:8180/realms/homebase';
      const params = new URLSearchParams({
        post_logout_redirect_uri: window.location.origin,
      });
      if (idToken) {
        params.set('id_token_hint', idToken);
      }
      window.location.href = `${issuer}/protocol/openid-connect/logout?${params.toString()}`;
    },
    accessToken: (s?.accessToken as string) || null,
  };
}

// Re-export for convenience
export { signIn, signOut } from 'next-auth/react';
