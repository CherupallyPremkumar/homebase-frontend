'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  PackageOpen,
  RotateCcw,
  LifeBuoy,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useUIStore } from '@homebase/shared';
import { useState } from 'react';
import { filterNavByRole, type NavGroup } from '@/lib/filter-nav-by-role';

interface OmsSidebarProps {
  roles: string[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/oms', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Order Operations',
    items: [
      { href: '/oms/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/oms/shipments', label: 'Shipments', icon: Truck },
      { href: '/oms/fulfillment', label: 'Fulfillment', icon: PackageOpen },
      { href: '/oms/returns', label: 'Returns', icon: RotateCcw },
    ],
  },
  {
    label: 'Customer Care',
    items: [
      { href: '/oms/support', label: 'Support Tickets', icon: LifeBuoy },
    ],
  },
];

export function OmsSidebar({ roles }: OmsSidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(NAV_GROUPS.map((g) => g.label)),
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-white transition-all duration-200',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {sidebarOpen && (
          <Link href="/oms" className="text-lg font-bold text-primary">
            HomeBase OMS
          </Link>
        )}
        <button onClick={toggleSidebar} className="rounded p-1 hover:bg-gray-100" aria-label="Toggle sidebar">
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {filterNavByRole(NAV_GROUPS, roles).map((group) => (
          <div key={group.label} className="mb-1">
            {sidebarOpen && (
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex w-full items-center justify-between px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600"
              >
                {group.label}
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform',
                    expandedGroups.has(group.label) && 'rotate-180',
                  )}
                />
              </button>
            )}
            {(expandedGroups.has(group.label) || !sidebarOpen) &&
              group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-r-2 border-primary bg-primary/5 text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      !sidebarOpen && 'justify-center px-2',
                    )}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
