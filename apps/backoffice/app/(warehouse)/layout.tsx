import type { Viewport } from 'next';
import { WarehouseNav } from '@/features/warehouse/ui/warehouse-nav';
import { WarehouseHeader } from '@/features/warehouse/ui/warehouse-header';
import { OfflineBanner } from '@/features/warehouse/ui/offline-banner';
import { Toaster } from '@homebase/ui';
import { getServerUser } from '@homebase/auth/server';

export const metadata = {
  title: { default: 'Warehouse', template: '%s | HomeBase WMS' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function WarehouseLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  return (
    <>
      <div className="flex h-screen flex-col">
        <WarehouseHeader user={user ? { ...user, roles: user.roles } : null} />
        <OfflineBanner />
        <main className="flex-1 overflow-y-auto p-4 pb-20">{children}</main>
        <WarehouseNav />
      </div>
      <Toaster position="top-center" />
    </>
  );
}
