import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth-layout';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Sign In' };

interface Props {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirect, error } = await searchParams;

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your HomeBase account">
      <LoginForm redirectTo={redirect} error={error} />
    </AuthLayout>
  );
}
