import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { WarehouseNav } from '@/components/warehouse-nav';
import { WarehouseHeader } from '@/components/warehouse-header';
import { WarehouseSidebar } from '@/components/warehouse-sidebar';
import { WarehouseDesktopHeader } from '@/components/warehouse-desktop-header';
import { OfflineBanner } from '@/components/offline-banner';
import { Toaster } from '@homebase/ui';
import { getServerUser } from '@homebase/auth/server';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'HomeBase WMS',
    template: '%s | WMS',
  },
  description: 'HomeBase Warehouse Management System',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          {/* Desktop layout: fixed header + sidebar + shifted main content */}
          <WarehouseDesktopHeader user={user} />
          <WarehouseSidebar />

          {/* Mobile layout: original header + bottom nav */}
          <div className="flex h-screen flex-col md:hidden">
            <WarehouseHeader user={user} />
            <OfflineBanner />
            <main className="flex-1 overflow-y-auto p-4 pb-20">{children}</main>
            <WarehouseNav />
          </div>

          {/* Desktop main content area — offset by sidebar (ml-60) and header (pt-16) */}
          <div className="hidden md:block">
            <OfflineBanner />
            <main className="ml-60 min-h-screen pt-16">
              <div className="p-6">{children}</div>
            </main>
          </div>

          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
