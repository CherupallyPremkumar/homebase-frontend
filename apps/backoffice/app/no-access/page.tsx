import { Warehouse } from 'lucide-react';

export const metadata = { title: 'No Access' };

export default function NoAccessPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-slate-50">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Warehouse className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">HomeBase</span>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900">Access Denied</h1>
        <p className="mt-1 text-sm text-gray-500">
          You don&apos;t have permission to access the backoffice.
        </p>
        <p className="mt-0.5 text-sm text-gray-400">
          Contact your administrator if you think this is a mistake.
        </p>
      </div>
      <a
        href="/api/auth/logout"
        className="text-sm text-primary hover:underline"
      >
        Sign out
      </a>
    </div>
  );
}
