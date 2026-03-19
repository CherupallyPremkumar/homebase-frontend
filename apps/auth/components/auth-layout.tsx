import Link from 'next/link';
import { ShieldCheck, Truck, CreditCard, Headphones } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left: Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 block">
            <h1 className="text-2xl font-bold text-primary">HomeBase</h1>
          </Link>

          {/* Title */}
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          )}

          {/* Form */}
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Right: Branded visual — hidden on mobile */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-primary-600 lg:to-primary-900 lg:px-12">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold text-white">
            Shop smarter with HomeBase
          </h2>
          <p className="mt-4 text-lg text-primary-200">
            India's trusted marketplace for everything you need. Fast delivery, easy returns, secure payments.
          </p>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-2 gap-6 text-left">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 flex-shrink-0 text-primary-300" />
              <div>
                <p className="font-semibold text-white">Secure</p>
                <p className="text-sm text-primary-300">256-bit encryption</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-6 w-6 flex-shrink-0 text-primary-300" />
              <div>
                <p className="font-semibold text-white">Fast Delivery</p>
                <p className="text-sm text-primary-300">2-5 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-6 w-6 flex-shrink-0 text-primary-300" />
              <div>
                <p className="font-semibold text-white">Easy Payments</p>
                <p className="text-sm text-primary-300">UPI, Cards, COD</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Headphones className="h-6 w-6 flex-shrink-0 text-primary-300" />
              <div>
                <p className="font-semibold text-white">24/7 Support</p>
                <p className="text-sm text-primary-300">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
