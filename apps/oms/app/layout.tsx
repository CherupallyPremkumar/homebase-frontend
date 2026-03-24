import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { OmsSidebar } from '@/components/oms-sidebar';
import { OmsHeader } from '@/components/oms-header';
import { Toaster } from '@homebase/ui';
import { getServerUser } from '@homebase/auth/server';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'HomeBase OMS',
    template: '%s | HomeBase OMS',
  },
  description: 'HomeBase Order Management System',
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <OmsSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <OmsHeader user={user} />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
