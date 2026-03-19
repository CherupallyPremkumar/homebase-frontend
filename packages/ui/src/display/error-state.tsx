'use client';

import { cn } from '../lib/utils';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message = 'Something went wrong', onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-lg border border-error-200 bg-error-50 p-6', className)}>
      <p className="text-sm font-medium text-error-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-md border border-error-300 bg-white px-3 py-1.5 text-sm font-medium text-error-700 hover:bg-error-50"
        >
          Try again
        </button>
      )}
    </div>
  );
}
