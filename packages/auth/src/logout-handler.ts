import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Server-side logout handler.
 * Clears session cookies and redirects to Keycloak's end-session endpoint
 * with id_token_hint for proper SSO session termination.
 */
export function createLogoutHandler() {
  return async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin;
    const issuer = process.env.KEYCLOAK_ISSUER;
    const clientId = process.env.KEYCLOAK_CLIENT_ID;

    if (!clientId) {
      throw new Error(
        'KEYCLOAK_CLIENT_ID environment variable is required. ' +
        'Set it to the OAuth client ID for this application (e.g. storefront-web, seller-web, backoffice-web, platform-web).',
      );
    }

    // Read id_token from JWT for proper Keycloak logout
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    // Build Keycloak logout URL
    let redirectUrl = origin;
    if (issuer) {
      const params = new URLSearchParams({
        post_logout_redirect_uri: origin,
        client_id: clientId,
      });
      // id_token_hint ensures Keycloak honors post_logout_redirect_uri
      if (token?.idToken) {
        params.set('id_token_hint', token.idToken as string);
      }
      redirectUrl = `${issuer}/protocol/openid-connect/logout?${params.toString()}`;
    }

    const response = NextResponse.redirect(redirectUrl);

    // Clear all auth-related cookies
    response.cookies.delete('authjs.session-token');
    response.cookies.delete('__Secure-authjs.session-token');
    response.cookies.delete('authjs.callback-url');
    response.cookies.delete('authjs.csrf-token');

    return response;
  };
}
