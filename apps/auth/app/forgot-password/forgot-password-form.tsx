'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Label } from '@homebase/ui';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send reset email');
        return;
      }

      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <Mail className="h-7 w-7 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
        <p className="mt-2 text-sm text-gray-500">
          We sent a password reset link to <span className="font-medium text-gray-700">{email}</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Didn't receive it? Check your spam folder or try again.
        </p>
        <Link href="/login" className="mt-6 block">
          <Button variant="outline" className="h-11 w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus className="mt-1.5 h-11" disabled={loading} />
      </div>

      <Button type="submit" className="h-11 w-full text-base" disabled={loading || !email}>
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : 'Send reset link'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Remember your password?{' '}
        <Link href="/login" className="font-medium text-primary hover:text-primary-700">Sign in</Link>
      </p>
    </form>
  );
}
