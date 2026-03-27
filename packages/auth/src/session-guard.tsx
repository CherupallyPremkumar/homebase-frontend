'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

/**
 * Watches the NextAuth session for token refresh failures.
 * When the access token can't be refreshed (e.g. refresh_token expired or revoked),
 * redirects to /session-expired instead of silently dumping the user at the login page.
 *
 * Place this inside the SessionProvider in your app's root layout.
 */
export function SessionGuard() {
  const { data: session } = useSession();

  useEffect(() => {
    if ((session as Record<string, unknown> | null)?.error === 'RefreshAccessTokenError') {
      window.location.href = '/session-expired';
    }
  }, [session]);

  return null;
}
