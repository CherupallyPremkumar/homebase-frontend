import { OmsSidebar } from '@/features/oms/ui/oms-sidebar';
import { OmsHeader } from '@/features/oms/ui/oms-header';
import { Toaster } from '@homebase/ui';
import { getServerUser } from '@homebase/auth/server';

export const metadata = {
  title: { default: 'Operations', template: '%s | HomeBase OMS' },
};

export default async function OmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <OmsSidebar roles={user?.roles ?? []} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <OmsHeader user={user ? { ...user, roles: user.roles } : null} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
