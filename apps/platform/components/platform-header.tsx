'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  Bell,
  Search,
  HelpCircle,
  ChevronDown,
  Home,
  User,
  Settings,
  Clock,
  LogOut,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface HeaderProps {
  user?: { name?: string | null; email?: string | null } | null;
}

// ----------------------------------------------------------------
// Profile dropdown menu items
// ----------------------------------------------------------------

interface ProfileMenuItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  variant?: 'default' | 'danger';
  onClick?: () => void;
}

const PROFILE_ITEMS: ProfileMenuItem[] = [
  { label: 'My Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Audit Log', href: '/audit-log', icon: Clock },
];

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function PlatformHeader({ user }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const notifButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (profileOpen) {
          setProfileOpen(false);
          profileButtonRef.current?.focus();
        }
        if (notifOpen) {
          setNotifOpen(false);
          notifButtonRef.current?.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [profileOpen, notifOpen]);

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: '/login' });
  }, []);

  const displayName = user?.name ?? 'Super Admin';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6"
      role="banner"
    >
      {/* ---- Left: Logo + Platform ---- */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2" aria-label="HomeBase Platform home">
          <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center" aria-hidden="true">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-[#0A1628]">
              Home<span className="text-orange-500">Base</span>
            </span>
            <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase ml-1 border-l border-gray-200 pl-2">
              PLATFORM
            </span>
          </div>
        </Link>
      </div>

      {/* ---- Center: Search ---- */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search sellers, orders, users, products..."
            aria-label="Search the platform"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
          />
        </div>
      </div>

      {/* ---- Right: Actions ---- */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            ref={notifButtonRef}
            type="button"
            aria-label="Notifications, 9 unread"
            aria-expanded={notifOpen}
            aria-haspopup="true"
            onClick={() => { setNotifOpen((prev) => !prev); setProfileOpen(false); }}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              9
            </span>
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
              role="menu"
              aria-label="Notification list"
            >
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">Notifications</span>
                <button
                  type="button"
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                  role="menuitem"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                <NotifItem
                  bg="bg-green-100"
                  iconColor="text-green-600"
                  title="New seller registration"
                  detail="Sharma Electronics"
                  time="8 minutes ago"
                  unread
                />
                <NotifItem
                  bg="bg-red-100"
                  iconColor="text-red-600"
                  title="Product flagged"
                  detail="Premium LED Panel reported"
                  time="45 minutes ago"
                  unread
                />
                <NotifItem
                  bg="bg-blue-100"
                  iconColor="text-blue-600"
                  title="Bulk order placed"
                  detail="#HB-78234 worth \u20B91,24,500"
                  time="1 hour ago"
                />
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
                <button
                  type="button"
                  className="w-full text-center text-xs font-medium text-orange-500 hover:text-orange-600"
                  role="menuitem"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button
          type="button"
          aria-label="Help center"
          className="hidden sm:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-gray-200" aria-hidden="true" />

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            ref={profileButtonRef}
            type="button"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label="Account menu"
            onClick={() => { setProfileOpen((prev) => !prev); setNotifOpen(false); }}
            className="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition"
          >
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold"
              aria-hidden="true"
            >
              SA
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{displayName}</p>
              <p className="text-[10px] text-gray-400 leading-tight">Platform Admin</p>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-gray-400 hidden sm:block transition-transform',
                profileOpen && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
              role="menu"
              aria-label="Account actions"
            >
              {PROFILE_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href ?? '#'}
                    role="menuitem"
                    tabIndex={0}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Icon className="w-4 h-4 text-gray-400" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-gray-100 my-1" role="separator" />
              <button
                type="button"
                role="menuitem"
                tabIndex={0}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ----------------------------------------------------------------
// Notification Item (internal)
// ----------------------------------------------------------------

interface NotifItemProps {
  bg: string;
  iconColor: string;
  title: string;
  detail: string;
  time: string;
  unread?: boolean;
}

function NotifItem({ bg, iconColor, title, detail, time, unread }: NotifItemProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer" role="menuitem">
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', bg)}>
        <Bell className={cn('w-4 h-4', iconColor)} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{title}</span> - {detail}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
      {unread && (
        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-2" aria-label="Unread" />
      )}
    </div>
  );
}
