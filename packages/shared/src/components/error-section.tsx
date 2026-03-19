'use client';

import { Button } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';
import { getErrorMessage } from '../lib/error-formatter';

interface ErrorSectionProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

export function ErrorSection({ error, onRetry, className }: ErrorSectionProps) {
  const message = getErrorMessage(error);

  return (
    <div className={cn('flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6', className)}>
      <p className="text-sm font-medium text-red-800">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
          Try again
        </Button>
      )}
    </div>
  );
}
