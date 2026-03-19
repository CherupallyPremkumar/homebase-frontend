import type { NextAuthConfig } from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

export interface AuthAppConfig {
  clientId: string;
  allowedRoles: string[];
  basePath?: string;
  signInPage?: string;
}

export function createAuthConfig(appConfig: AuthAppConfig): NextAuthConfig {
  const envIssuer = process.env.KEYCLOAK_ISSUER;
  if (!envIssuer && process.env.NODE_ENV === 'production') {
    throw new Error('KEYCLOAK_ISSUER environment variable is required in production');
  }
  const issuerUrl = envIssuer || 'http://localhost:8180/realms/homebase';

  return {
    providers: [
      Keycloak({
        clientId: appConfig.clientId,
        clientSecret: '', // Public client — no secret needed
        issuer: issuerUrl,
        authorization: {
          params: {
            scope: 'openid email profile',
          },
        },
      }),
    ],
    basePath: appConfig.basePath || '/api/auth',
    pages: {
      signIn: appConfig.signInPage || '/api/auth/signin',
      error: '/auth/error',
    },
    session: {
      strategy: 'jwt',
      maxAge: 30 * 60, // 30 minutes
    },
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.expiresAt = account.expires_at;
          token.idToken = account.id_token;

          // Extract realm roles from Keycloak token
          if (profile) {
            const realmAccess = (profile as Record<string, unknown>).realm_access as { roles?: string[] } | undefined;
            token.roles = realmAccess?.roles || [];
          }
        }

        // Check if token is expired
        if (token.expiresAt && Date.now() / 1000 > (token.expiresAt as number)) {
          // Token expired — try to refresh
          try {
            const refreshed = await refreshAccessToken(token, appConfig.clientId, issuerUrl);
            return refreshed;
          } catch {
            return { ...token, error: 'RefreshAccessTokenError' };
          }
        }

        return token;
      },
      async session({ session, token }) {
        // SECURITY: Minimal session — only what the UI absolutely needs.
        // No tokens, no roles, no IDs in the browser-visible session.
        // Roles stay in the server-side JWT for middleware/server component checks.
        return {
          ...session,
          user: {
            ...session.user,
            name: session.user?.name || null,
            email: session.user?.email || null,
          },
        };
      },
      async authorized({ auth, request }) {
        const isLoggedIn = !!auth?.user;
        if (!isLoggedIn) return false;

        // Check role-based access — roles are in user.roles only
        const userRoles = (auth?.user as { roles?: string[] })?.roles || [];

        if (appConfig.allowedRoles.length > 0) {
          const hasRole = appConfig.allowedRoles.some((role) => userRoles.includes(role));
          if (!hasRole) return false;
        }

        return true;
      },
    },
    trustHost: true,
  };
}

async function refreshAccessToken(
  token: Record<string, unknown>,
  clientId: string,
  issuer: string,
): Promise<Record<string, unknown>> {
  const tokenEndpoint = `${issuer}/protocol/openid-connect/token`;

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: token.refreshToken as string,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();

  return {
    ...token,
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? token.refreshToken,
    expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
  };
}
