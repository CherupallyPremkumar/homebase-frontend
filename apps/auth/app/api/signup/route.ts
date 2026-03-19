import { NextRequest, NextResponse } from 'next/server';

async function getAdminToken(): Promise<string> {
  const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8180';

  const response = await fetch(
    `${keycloakUrl}/realms/master/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'admin-cli',
        username: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
        password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
      }),
    },
  );

  if (!response.ok) throw new Error('Failed to get admin token');
  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8180';
  const realm = process.env.KEYCLOAK_REALM || 'homebase';

  try {
    const adminToken = await getAdminToken();

    // Create user in Keycloak
    const createResponse = await fetch(
      `${keycloakUrl}/admin/realms/${realm}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          username: email,
          email,
          firstName,
          lastName,
          enabled: true,
          emailVerified: true, // Skip email verification for now
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: false,
            },
          ],
          groups: ['customers'], // Default group — assigns CUSTOMER role
        }),
      },
    );

    if (createResponse.status === 409) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      );
    }

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      console.error('[Auth] User creation failed:', errorData);
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Auth] Signup failed:', error);
    return NextResponse.json(
      { error: 'Registration service unavailable' },
      { status: 503 },
    );
  }
}
