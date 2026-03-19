import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { WarehouseNav } from '@/components/warehouse-nav';
import { WarehouseHeader } from '@/components/warehouse-header';
import { OfflineBanner } from '@/components/offline-banner';
import { Toaster } from '@homebase/ui';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <div className="flex h-screen flex-col">
            <WarehouseHeader />
            <OfflineBanner />
            <main className="flex-1 overflow-y-auto p-4 pb-20">{children}</main>
            <WarehouseNav />
          </div>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
