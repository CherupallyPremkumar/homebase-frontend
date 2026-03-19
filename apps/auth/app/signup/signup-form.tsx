'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@homebase/ui';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface SignupFormProps {
  redirectTo?: string;
}

export function SignupForm({ redirectTo }: SignupFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Password strength checks
  const passwordChecks = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    match: form.password === form.confirmPassword && form.confirmPassword.length > 0,
  };

  const allValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        return;
      }

      toast.success('Account created! Please sign in.');
      router.push(`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First name</Label>
          <Input id="firstName" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="John" required className="mt-1.5 h-11" disabled={loading} autoFocus />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last name</Label>
          <Input id="lastName" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Doe" required className="mt-1.5 h-11" disabled={loading} />
        </div>
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
        <Input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" required autoComplete="email" className="mt-1.5 h-11" disabled={loading} />
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
        <div className="relative mt-1.5">
          <Input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Create a strong password" required className="h-11 pr-10" disabled={loading} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Password strength indicators */}
        {form.password.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <PasswordCheck label="At least 8 characters" valid={passwordChecks.length} />
            <PasswordCheck label="One uppercase letter" valid={passwordChecks.uppercase} />
            <PasswordCheck label="One lowercase letter" valid={passwordChecks.lowercase} />
            <PasswordCheck label="One number" valid={passwordChecks.number} />
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm password</Label>
        <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Re-enter your password" required className="mt-1.5 h-11" disabled={loading} />
        {form.confirmPassword.length > 0 && !passwordChecks.match && (
          <p className="mt-1.5 text-xs text-red-500">Passwords don't match</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" className="h-11 w-full text-base" disabled={loading || !allValid}>
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>
        ) : (
          'Create account'
        )}
      </Button>

      {/* Terms */}
      <p className="text-center text-xs text-gray-400">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
      </p>

      {/* Sign in link */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="font-medium text-primary hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function PasswordCheck({ label, valid }: { label: string; valid: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {valid ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <X className="h-3.5 w-3.5 text-gray-300" />
      )}
      <span className={valid ? 'text-green-600' : 'text-gray-400'}>{label}</span>
    </div>
  );
}
