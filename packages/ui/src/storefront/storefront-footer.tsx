import * as React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StorefrontFooterProps {
  /** Optional className for the outermost footer element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
];

const customerServiceLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'Track Order', href: '/order-tracking' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Shipping Info', href: '/shipping' },
];

const sellerLinks = [
  { label: 'Become a Seller', href: '/seller/register' },
  { label: 'Seller Dashboard', href: '/seller/dashboard' },
  { label: 'Seller Policies', href: '/seller/policies' },
  { label: 'Seller Support', href: '/seller/support' },
];

const paymentMethods = ['VISA', 'MasterCard', 'UPI', 'PayTM', 'COD', 'Net Banking'];

const socialLinks = [
  { label: 'f', href: '#', title: 'Facebook' },
  { label: 't', href: '#', title: 'Twitter' },
  { label: 'in', href: '#', title: 'LinkedIn' },
  { label: 'yt', href: '#', title: 'YouTube' },
];

const policyLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StorefrontFooter({ className }: StorefrontFooterProps) {
  return (
    <footer className={cn('bg-[#0F1B2D] text-gray-400 pt-12 pb-6', className)}>
      <div className="max-w-7xl mx-auto px-4">
        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">
                Home<span className="text-brand-500">Base</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              India&apos;s #1 Online Marketplace. Shop from thousands of
              sellers with secure payments and easy returns.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((s) => (
                <a
                  key={s.title}
                  href={s.href}
                  title={s.title}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-500 transition text-xs text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm">
              {customerServiceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sell on HomeBase */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              Sell on HomeBase
            </h4>
            <ul className="space-y-2 text-sm">
              {sellerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods + Download */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              Payment Methods
            </h4>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="bg-white/10 text-xs text-white px-3 py-1.5 rounded"
                >
                  {method}
                </span>
              ))}
            </div>
            <h4 className="text-white font-semibold text-sm mb-3 mt-5">
              Download App
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="bg-white/10 text-xs text-white px-3 py-2 rounded hover:bg-white/20 transition"
              >
                App Store
              </a>
              <a
                href="#"
                className="bg-white/10 text-xs text-white px-3 py-2 rounded hover:bg-white/20 transition"
              >
                Google Play
              </a>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} HomeBase. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            {policyLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-brand-400 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
