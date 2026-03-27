import Link from 'next/link';
import { LogIn, Warehouse } from 'lucide-react';

export const metadata = { title: 'Signed Out' };

export default function SignedOutPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-slate-50">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Warehouse className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">HomeBase</span>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900">You've been signed out</h1>
        <p className="mt-1 text-sm text-gray-500">Your session has ended securely.</p>
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
