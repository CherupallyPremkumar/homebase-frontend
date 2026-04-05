'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Heart,
  Home,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react';
import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Seller {
  value: string;
  label: string;
}

export interface StorefrontHeaderProps {
  /** Number of items in the cart. */
  cartCount?: number;
  /** Whether the current user is authenticated. */
  isAuthenticated?: boolean;
  /** Available sellers for the filter dropdown. */
  sellers?: Seller[];
  /** Callback invoked when the seller filter changes. */
  onSellerChange?: (sellerValue: string) => void;
  /** Optional className for the outermost wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Category links shown in the nav bar
// ---------------------------------------------------------------------------

const categories = [
  { label: 'Home', href: '/', active: true },
  { label: 'Electronics', href: '/category/electronics' },
  { label: 'Fashion', href: '/category/fashion' },
  { label: 'Home & Living', href: '/category/home-living' },
  { label: 'Sports', href: '/category/sports' },
  { label: 'Groceries', href: '/category/groceries' },
  { label: 'Beauty', href: '/category/beauty' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StorefrontHeader({
  cartCount = 0,
  isAuthenticated = false,
  sellers = [],
  onSellerChange,
  className,
}: StorefrontHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSeller, setSelectedSeller] = React.useState('all');

  const handleSellerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSeller(value);
    onSellerChange?.(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search form submission — parent can listen via URL or add onSearch prop
  };

  return (
    <div className={cn('w-full', className)}>
      {/* ===== TOP BAR ===== */}
      <div className="bg-[#0F1B2D] text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              Hotline 24/7:{' '}
              <strong className="text-white ml-1">(025) 3886 2516</strong>
            </span>
            <Link
              href="/seller/register"
              className="hover:text-brand-400 transition hidden sm:inline"
            >
              Sell on HomeBase
            </Link>
            <Link
              href="/order-tracking"
              className="hover:text-brand-400 transition hidden sm:inline"
            >
              Order Tracking
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <select className="bg-transparent text-gray-300 text-xs border-none outline-none cursor-pointer">
              <option>INR &#8377;</option>
              <option>USD $</option>
            </select>
            <select className="bg-transparent text-gray-300 text-xs border-none outline-none cursor-pointer">
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#0F1B2D]">
              Home<span className="text-brand-500">Base</span>
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="flex w-full">
              <select
                value={selectedSeller}
                onChange={handleSellerChange}
                className="bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg px-3 text-sm text-gray-600 outline-none"
              >
                <option value="all">All Sellers</option>
                {sellers.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full border border-gray-200 py-2.5 px-4 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-r-lg transition"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-5">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden md:flex flex-col items-center text-gray-500 hover:text-brand-500 transition"
            >
              <Heart className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="flex flex-col items-center text-gray-500 hover:text-brand-500 transition relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href={isAuthenticated ? '/account' : '/login'}
              className={cn(
                'hidden md:flex flex-col items-center transition',
                isAuthenticated
                  ? 'text-brand-500'
                  : 'text-gray-500 hover:text-brand-500'
              )}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Account</span>
            </Link>
          </div>
        </div>

        {/* ===== NAVIGATION BAR ===== */}
        <nav className="bg-white border-t border-gray-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 h-11 text-sm">
            {/* All Sellers Dropdown */}
            <div className="relative mr-4">
              <select
                value={selectedSeller}
                onChange={handleSellerChange}
                className="appearance-none bg-[#0F1B2D] text-white px-4 py-1.5 rounded-md text-sm font-medium pr-8 cursor-pointer outline-none"
              >
                <option value="all">All Sellers</option>
                {sellers.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
            </div>

            {/* Category links */}
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={cn(
                  'px-3 py-1.5 hover:text-brand-500 transition',
                  cat.active
                    ? 'font-medium text-brand-600'
                    : 'text-gray-600'
                )}
              >
                {cat.label}
              </Link>
            ))}

            {/* Track Order */}
            <div className="ml-auto">
              <Link
                href="/order-tracking"
                className="px-3 py-1.5 text-gray-600 hover:text-brand-500 transition flex items-center gap-1"
              >
                <MapPin className="w-4 h-4 text-brand-500" />
                Track Order
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
