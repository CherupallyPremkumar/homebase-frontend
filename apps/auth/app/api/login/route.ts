import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8180';
  const realm = process.env.KEYCLOAK_REALM || 'homebase';
  const clientId = process.env.KEYCLOAK_LOGIN_CLIENT_ID || 'storefront-web';

  try {
    // Call Keycloak token endpoint with Direct Access Grant (password grant)
    const tokenResponse = await fetch(
      `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: clientId,
          username: email,
          password: password,
          scope: 'openid email profile',
        }),
      },
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));

      if (errorData.error === 'invalid_grant') {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 },
        );
      }

      if (errorData.error === 'account_disabled') {
        return NextResponse.json(
          { error: 'Your account has been disabled. Contact support.' },
          { status: 403 },
        );
      }

      return NextResponse.json(
        { error: 'Authentication failed. Please try again.' },
        { status: 401 },
      );
    }

    const tokens = await tokenResponse.json();

    // Return tokens — the calling app will store them in its session
    return NextResponse.json({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      idToken: tokens.id_token,
    });
  } catch (error) {
    console.error('[Auth] Login failed:', error);
    return NextResponse.json(
      { error: 'Authentication service unavailable' },
      { status: 503 },
    );
  }
}
