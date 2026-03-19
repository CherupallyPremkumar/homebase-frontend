'use client';

import { Button } from '@homebase/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mt-2 text-gray-500">{error.message || 'An unexpected error occurred.'}</p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
