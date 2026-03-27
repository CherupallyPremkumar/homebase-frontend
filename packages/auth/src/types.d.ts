import type { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    error?: string | null;
    user: DefaultSession['user'] & {
      roles: string[];
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    roles?: string[];
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
