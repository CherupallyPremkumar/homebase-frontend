'use client';

import { Button } from '@homebase/ui';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  appName?: string;
  homeHref?: string;
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mt-2 text-gray-500">
        {process.env.NODE_ENV === 'development'
          ? error.message || 'An unexpected error occurred.'
          : 'An unexpected error occurred.'}
      </p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-gray-400">Error ID: {error.digest}</p>
      )}
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
