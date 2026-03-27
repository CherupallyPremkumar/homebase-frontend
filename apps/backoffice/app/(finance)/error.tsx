'use client';

import { Button } from '@homebase/ui';
import Link from 'next/link';

export default function SectionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mt-2 text-sm text-gray-500">An error occurred in this section. You can try again or go back to the dashboard.</p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-gray-400">Error ID: {error.digest}</p>
      )}
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
