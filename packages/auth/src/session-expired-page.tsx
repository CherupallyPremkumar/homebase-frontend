import Link from 'next/link';
import { LogIn, Clock } from 'lucide-react';

export function SessionExpiredPage({
  className = 'flex h-screen flex-col items-center justify-center gap-6',
  header,
}: {
  className?: string;
  header?: React.ReactNode;
} = {}) {
  return (
    <div className={className}>
      {header}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
        <Clock className="h-6 w-6 text-amber-600" />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900">Session Expired</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your session has expired for security reasons.
        </p>
        <p className="mt-0.5 text-sm text-gray-400">
          Please sign in again to continue.
        </p>
      </div>
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
      >
        <LogIn className="h-4 w-4" />
        Sign in again
      </Link>
    </div>
  );
}
