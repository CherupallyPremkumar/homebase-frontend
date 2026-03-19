import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { Toaster } from '@homebase/ui';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'HomeBase — Shop Online',
    template: '%s | HomeBase',
  },
  description: 'Shop the best products online at HomeBase. Fast delivery, easy returns, secure payments.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://homebase.com'),
  openGraph: {
    siteName: 'HomeBase',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 pb-14 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
