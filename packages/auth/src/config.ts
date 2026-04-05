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
  const envSecret = process.env.KEYCLOAK_CLIENT_SECRET;

  if (process.env.NODE_ENV === 'production') {
    if (!envIssuer) throw new Error('KEYCLOAK_ISSUER is required in production');
    if (!envSecret) throw new Error('KEYCLOAK_CLIENT_SECRET is required in production');
  }

  const issuerUrl = envIssuer || 'http://localhost:8180/realms/homebase';
  const clientSecret = envSecret || 'homebase-dev-secret';

  return {
    providers: [
      Keycloak({
        clientId: appConfig.clientId,
        clientSecret,
        issuer: issuerUrl,
        authorization: {
          params: {
            scope: 'openid email profile',
          },
        },
        checks: ['state'],
      }),
    ],
    basePath: appConfig.basePath || '/api/auth',
    pages: {
      signIn: appConfig.signInPage || '/login',
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

          if (profile) {
            const realmAccess = (profile as Record<string, unknown>).realm_access as { roles?: string[] } | undefined;
            token.roles = realmAccess?.roles || [];
          }
        }

        // Token refresh — use refresh_token before access_token expires
        if (token.expiresAt && Date.now() / 1000 > (token.expiresAt as number)) {
          try {
            return await refreshAccessToken(token, appConfig.clientId, clientSecret, issuerUrl);
          } catch {
            return { ...token, error: 'RefreshAccessTokenError' };
          }
        }

        return token;
      },
      async session({ session }) {
        // SECURITY: Minimal session — no tokens, no roles in browser.
        // Roles stay in server-side JWT for middleware/server component checks.
        return {
          ...session,
          user: {
            ...session.user,
            name: session.user?.name || null,
            email: session.user?.email || null,
          },
        };
      },
      async authorized({ auth }) {
        return !!auth?.user;
      },
    },
    events: {
      async signOut(message) {
        // End Keycloak SSO session when NextAuth signs out
        if ('token' in message && message.token?.idToken) {
          const params = new URLSearchParams({
            id_token_hint: message.token.idToken as string,
            client_id: appConfig.clientId,
          });
          await fetch(`${issuerUrl}/protocol/openid-connect/logout?${params}`).catch(() => {});
        }
      },
    },
    debug: false,
    trustHost: true,
  };
}

async function refreshAccessToken(
  token: Record<string, unknown>,
  clientId: string,
  clientSecret: string,
  issuer: string,
): Promise<Record<string, unknown>> {
  const tokenEndpoint = `${issuer}/protocol/openid-connect/token`;

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
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
