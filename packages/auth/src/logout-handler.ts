import { type NextRequest, NextResponse } from 'next/server';

/**
 * Server-side logout handler.
 * Clears session cookies and redirects to Keycloak's end-session endpoint.
 * Tokens never touch the browser — this runs server-side only.
 */
export function createLogoutHandler() {
  return async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin;
    const issuer = process.env.KEYCLOAK_ISSUER;
    const clientId = process.env.KEYCLOAK_CLIENT_ID || 'storefront-web';

    // Build Keycloak logout URL
    let redirectUrl = origin;
    if (issuer) {
      const params = new URLSearchParams({
        post_logout_redirect_uri: origin,
        client_id: clientId,
      });
      redirectUrl = `${issuer}/protocol/openid-connect/logout?${params.toString()}`;
    }

    // Redirect and clear session cookies via Set-Cookie headers
    const response = NextResponse.redirect(redirectUrl);

    // Clear all auth-related cookies
    response.cookies.delete('authjs.session-token');
    response.cookies.delete('__Secure-authjs.session-token');
    response.cookies.delete('authjs.callback-url');
    response.cookies.delete('authjs.csrf-token');

    return response;
  };
}
