import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8180';
  const realm = process.env.KEYCLOAK_REALM || 'homebase';

  try {
    // Get admin token
    const tokenRes = await fetch(
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

    if (!tokenRes.ok) throw new Error('Failed to get admin token');
    const { access_token: adminToken } = await tokenRes.json();

    // Find user by email
    const usersRes = await fetch(
      `${keycloakUrl}/admin/realms/${realm}/users?email=${encodeURIComponent(email)}&exact=true`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      },
    );

    const users = await usersRes.json();

    if (users.length > 0) {
      // Trigger Keycloak's password reset email
      await fetch(
        `${keycloakUrl}/admin/realms/${realm}/users/${users[0].id}/execute-actions-email`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(['UPDATE_PASSWORD']),
        },
      );
    }

    // Always return success (don't reveal if email exists)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Auth] Password reset failed:', error);
    // Still return success to not reveal if email exists
    return NextResponse.json({ success: true });
  }
}
