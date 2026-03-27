import { FinanceSidebar } from '@/features/finance/ui/finance-sidebar';
import { FinanceHeader } from '@/features/finance/ui/finance-header';
import { Toaster } from '@homebase/ui';
import { getServerUser } from '@homebase/auth/server';

export const metadata = {
  title: { default: 'Finance', template: '%s | HomeBase Finance' },
};

export default async function FinanceLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <FinanceSidebar roles={user?.roles ?? []} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <FinanceHeader user={user ? { ...user, roles: user.roles } : null} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
