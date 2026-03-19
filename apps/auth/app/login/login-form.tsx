'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Checkbox } from '@homebase/ui';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  redirectTo?: string;
  error?: string;
}

export function LoginForm({ redirectTo, error: initialError }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password');
        return;
      }

      // Success — redirect back to the app
      toast.success('Welcome back!');
      if (redirectTo) {
        window.location.href = redirectTo;
      } else {
        router.push('/');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          autoFocus
          className="mt-1.5 h-11"
          disabled={loading}
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <Link
            href={`/forgot-password${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
            className="text-sm font-medium text-primary hover:text-primary-700"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative mt-1.5">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            className="h-11 pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(v) => setRememberMe(!!v)}
        />
        <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
          Remember me for 30 days
        </Label>
      </div>

      {/* Submit */}
      <Button type="submit" className="h-11 w-full text-base" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-4 text-gray-400">New to HomeBase?</span>
        </div>
      </div>

      {/* Sign up link */}
      <Link
        href={`/signup${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
        className="block"
      >
        <Button type="button" variant="outline" className="h-11 w-full text-base">
          Create an account
        </Button>
      </Link>
    </form>
  );
}
