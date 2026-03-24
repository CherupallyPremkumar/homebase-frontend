import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SellerSidebar } from '@/components/seller-sidebar';
import { SellerHeader } from '@/components/seller-header';
import { Toaster } from '@homebase/ui';
import { getServerUser } from '@homebase/auth/server';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'HomeBase Seller Central',
    template: '%s | Seller Central',
  },
  description: 'Manage your products, orders, and business on HomeBase',
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <SellerSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <SellerHeader user={user} />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
