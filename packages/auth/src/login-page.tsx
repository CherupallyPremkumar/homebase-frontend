import { AutoSignIn } from './auto-sign-in';

export async function LoginPage({
  searchParams,
  prompt,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
  prompt?: string;
}) {
  const params = await searchParams;
  let callbackUrl = '/';
  if (params.callbackUrl && params.callbackUrl.startsWith('/') && !params.callbackUrl.startsWith('//')) {
    callbackUrl = params.callbackUrl;
  }

  return <AutoSignIn callbackUrl={callbackUrl} prompt={prompt} />;
}
