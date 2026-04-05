'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, Home, User, Settings, LogOut } from 'lucide-react';

interface DesktopHeaderProps {
  user?: { name?: string | null; email?: string | null } | null;
}

export function WarehouseDesktopHeader({ user }: DesktopHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hidden h-16 border-b border-gray-200 bg-white md:block">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Logo + WAREHOUSE label */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight" style={{ color: '#0F2027' }}>
              Home<span className="text-brand-500">Base</span>
            </span>
            <span className="ml-1 border-l border-gray-200 pl-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              WAREHOUSE
            </span>
          </div>
        </div>

        {/* Center: Search bar */}
        <div className="mx-8 flex max-w-lg flex-1">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory, orders, shipments..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <button className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              7
            </span>
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200" />

          {/* Profile with dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-gray-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-sm font-bold text-white">
                AK
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold leading-tight text-gray-800">Arun Kumar</p>
                <p className="text-[10px] leading-tight text-gray-400">Warehouse Manager</p>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-gray-100 bg-white py-2 shadow-lg z-50">
                  <a href="/" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="h-4 w-4 text-gray-400" /> My Profile
                  </a>
                  <a href="/" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="h-4 w-4 text-gray-400" /> Settings
                  </a>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={() => alert('Sign out')}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
