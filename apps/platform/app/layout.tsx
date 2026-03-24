import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { PlatformSidebar } from '@/components/platform-sidebar';
import { PlatformHeader } from '@/components/platform-header';
import { Toaster } from '@homebase/ui';
import { getServerUser } from '@homebase/auth/server';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'HomeBase Platform',
    template: '%s | HomeBase Platform',
  },
  description: 'HomeBase platform administration',
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <PlatformSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <PlatformHeader user={user} />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
