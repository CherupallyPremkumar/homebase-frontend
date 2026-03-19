import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth-layout';
import { SignupForm } from './signup-form';

export const metadata: Metadata = { title: 'Create Account' };

interface Props {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function SignupPage({ searchParams }: Props) {
  const { redirect } = await searchParams;

  return (
    <AuthLayout title="Create your account" subtitle="Start shopping on HomeBase today">
      <SignupForm redirectTo={redirect} />
    </AuthLayout>
  );
}
