'use client';

import { Button } from '@homebase/ui';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-gray-500">{error.message}</p>
      <Button onClick={reset} size="lg" className="mt-6 touch-target">
        Try again
      </Button>
    </div>
  );
}
