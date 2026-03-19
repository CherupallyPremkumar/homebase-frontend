import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth-layout';
import { ForgotPasswordForm } from './forgot-password-form';

export const metadata: Metadata = { title: 'Reset Password' };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you a reset link">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
