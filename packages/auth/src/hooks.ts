'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export interface UseAuthReturn {
  user: {
    name?: string | null;
    email?: string | null;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
      }
    : null;

  return {
    user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login: () => signIn('keycloak'),
    logout: () => {
      // Server-side logout — clears cookies + ends Keycloak session
      window.location.href = '/api/auth/logout';
    },
  };
}

// Re-export for convenience
export { signIn, signOut } from 'next-auth/react';
