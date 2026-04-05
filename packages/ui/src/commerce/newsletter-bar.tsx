'use client';

import { useState } from 'react';
import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NewsletterBarProps {
  title?: string;
  subtitle?: string;
  onSubscribe?: (email: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NewsletterBar({
  title = 'Subscribe to our Newsletter',
  subtitle = 'Get the latest deals, offers & updates directly in your inbox',
  onSubscribe,
  className,
}: NewsletterBarProps) {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe?.(email.trim());
      setEmail('');
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#0F1B2D] p-10 md:flex-row',
        className,
      )}
    >
      <div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full md:w-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full rounded-l-lg px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400 md:w-80"
        />
        <button
          type="submit"
          className="whitespace-nowrap rounded-r-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
