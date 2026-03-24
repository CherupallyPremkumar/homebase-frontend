import { signIn } from '@/auth';
import { AutoSubmitForm } from './auto-submit';

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  async function loginAction() {
    'use server';
    const params = await searchParams;
    // Validate callbackUrl — must be relative path, prevent open redirect
    let callbackUrl = '/';
    if (params.callbackUrl && params.callbackUrl.startsWith('/') && !params.callbackUrl.startsWith('//')) {
      callbackUrl = params.callbackUrl;
    }
    await signIn('keycloak', { redirectTo: callbackUrl });
  }

  return <AutoSubmitForm action={loginAction} />;
}
