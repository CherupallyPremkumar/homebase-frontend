import { LoginPage } from '@homebase/auth';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  return <LoginPage searchParams={searchParams} prompt="login" />;
}
