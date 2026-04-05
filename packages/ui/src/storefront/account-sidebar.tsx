'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  RefreshCw,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-react';
import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AccountPage =
  | 'profile'
  | 'orders'
  | 'wishlist'
  | 'addresses'
  | 'payment-methods'
  | 'returns'
  | 'settings';

export interface AccountSidebarProps {
  /** User's display name. */
  userName: string;
  /** User's email address. */
  userEmail: string;
  /** The currently active page identifier. */
  activePage: AccountPage;
  /** Optional className for the outermost wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Menu items
// ---------------------------------------------------------------------------

interface MenuItem {
  key: AccountPage;
  label: string;
  href: string;
  icon: React.ElementType;
}

const menuItems: MenuItem[] = [
  { key: 'profile', label: 'Profile', href: '/profile', icon: User },
  { key: 'orders', label: 'My Orders', href: '/orders', icon: ShoppingBag },
  { key: 'wishlist', label: 'Wishlist', href: '/wishlist', icon: Heart },
  { key: 'addresses', label: 'Addresses', href: '/profile#addresses', icon: MapPin },
  {
    key: 'payment-methods',
    label: 'Payment Methods',
    href: '/profile#payment-methods',
    icon: CreditCard,
  },
  { key: 'returns', label: 'Returns', href: '/returns', icon: RefreshCw },
  { key: 'settings', label: 'Settings', href: '/profile#settings', icon: Settings },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AccountSidebar({
  userName,
  userEmail,
  activePage,
  className,
}: AccountSidebarProps) {
  return (
    <aside className={cn('w-64 shrink-0', className)}>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* User Summary */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-brand-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white text-lg font-bold">
              {getInitials(userName)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#0F1B2D] text-sm truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="py-2">
          {menuItems.map((item) => {
            const isActive = activePage === item.key;
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-5 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-600 font-semibold border-l-[3px] border-brand-500'
                    : 'text-gray-600 hover:bg-brand-50 hover:text-brand-600'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          {/* Sign Out */}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <Link
              href="/login"
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
