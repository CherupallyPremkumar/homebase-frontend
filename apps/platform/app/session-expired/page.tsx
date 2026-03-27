import { SessionExpiredPage } from '@homebase/auth';

export const metadata = { title: 'Session Expired' };

export default function Page() {
  return (
    <SessionExpiredPage className="flex h-screen flex-col items-center justify-center gap-6 bg-slate-50" />
  );
}
