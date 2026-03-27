import { Warehouse } from 'lucide-react';
import { SessionExpiredPage } from '@homebase/auth';

export const metadata = { title: 'Session Expired' };

export default function Page() {
  return (
    <SessionExpiredPage
      className="flex h-screen flex-col items-center justify-center gap-6 bg-slate-50"
      header={
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Warehouse className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">HomeBase</span>
        </div>
      }
    />
  );
}
