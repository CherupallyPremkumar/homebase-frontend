'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowDownToLine,
  Archive,
  ClipboardList,
  Truck,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: { count: number; variant: 'brand' | 'warning' };
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/receiving', label: 'Inbound', icon: ArrowDownToLine, badge: { count: 8, variant: 'brand' } },
  { href: '/inventory', label: 'Inventory', icon: Archive },
  { href: '/picking', label: 'Orders', icon: ClipboardList, badge: { count: 45, variant: 'warning' } },
  { href: '/shipments', label: 'Shipments', icon: Truck },
];

interface WarehouseSidebarProps {
  activePage?: string;
}

export function WarehouseSidebar({ activePage }: WarehouseSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-40 hidden w-60 flex-col overflow-y-auto md:flex" style={{ background: '#0F2027' }}>
      {/* User Info Card */}
      <div className="px-4 pt-5 pb-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
              AK
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Arun Kumar</p>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span className="text-[10px] font-medium text-green-400">Online</span>
              </div>
            </div>
          </div>
          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-gray-400">Role</span>
              <span className="text-xs font-semibold text-brand-400">Warehouse Manager</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-gray-400">Location</span>
              <span className="text-xs font-semibold text-brand-400">Mumbai Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Operations
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              activePage === item.label.toLowerCase() ||
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    'hover:bg-white/[0.08]',
                    isActive
                      ? 'border-r-[3px] border-brand-400 bg-brand-500/15 text-brand-400'
                      : 'text-gray-400 hover:text-white',
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                  {item.badge && (
                    <span
                      className={cn(
                        'ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold',
                        item.badge.variant === 'brand'
                          ? 'bg-brand-500 text-white'
                          : 'bg-warning text-gray-900',
                      )}
                    >
                      {item.badge.count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer: System Status */}
      <div className="px-4 pb-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-[11px] font-medium text-green-400">System Online</span>
          </div>
          <p className="text-[10px] text-gray-500">WMS v3.2.1 | Last sync: 2 min ago</p>
        </div>
      </div>
    </aside>
  );
}
