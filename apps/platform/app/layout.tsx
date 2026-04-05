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
  const isAuthenticated = !!user;

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-50">
        <Providers>
          {isAuthenticated ? (
            <>
              <PlatformHeader user={user} />
              <PlatformSidebar />
              <main className="ml-60 pt-16 min-h-screen">
                <div className="p-6 lg:p-8">{children}</div>
              </main>
            </>
          ) : (
            <main className="min-h-screen">{children}</main>
          )}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
