import NextAuth from 'next-auth';
import { createAuthConfig } from '@homebase/auth';

const config = createAuthConfig({
  clientId: 'warehouse-web',
  allowedRoles: ['WAREHOUSE_STAFF', 'WAREHOUSE_MANAGER', 'SUPER_ADMIN'],
});

// NextAuth v5 beta has type inference issues — use explicit any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextAuth: any = NextAuth(config);

export const handlers: { GET: any; POST: any } = nextAuth.handlers;
export const auth: any = nextAuth.auth;
export const signIn: any = nextAuth.signIn;
export const signOut: any = nextAuth.signOut;
