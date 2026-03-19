import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { FinanceSidebar } from '@/components/finance-sidebar';
import { FinanceHeader } from '@/components/finance-header';
import { Toaster } from '@homebase/ui';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'HomeBase Finance',
    template: '%s | HomeBase Finance',
  },
  description: 'HomeBase Finance Dashboard - Settlements, Reconciliation, Payments',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <FinanceSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <FinanceHeader />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
