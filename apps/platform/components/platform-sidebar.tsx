'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  Building2,
  UserPlus,
  Tag,
  Star,
  Settings,
  Scale,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  FileText,
  Image,
  BarChart3,
  ShieldCheck,
  FileCheck,
  Receipt,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useUIStore } from '@homebase/shared';
import { useState } from 'react';

interface NavGroup {
  label: string;
  items: { href: string; label: string; icon: React.ElementType }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/products', label: 'Products', icon: Package },
      { href: '/inventory', label: 'Inventory', icon: Warehouse },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/users', label: 'Users', icon: Users },
      { href: '/suppliers', label: 'Suppliers', icon: Building2 },
      { href: '/onboarding', label: 'Onboarding', icon: UserPlus },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/cms', label: 'Pages', icon: FileText },
      { href: '/cms/banners', label: 'Banners', icon: Image },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { href: '/promotions', label: 'Promotions', icon: Tag },
      { href: '/reviews', label: 'Reviews', icon: Star },
    ],
  },
  {
    label: 'Reports',
    items: [
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Governance',
    items: [
      { href: '/compliance', label: 'Policies', icon: ShieldCheck },
      { href: '/compliance/agreements', label: 'Agreements', icon: FileCheck },
      { href: '/tax', label: 'Tax Rates', icon: Receipt },
    ],
  },
  {
    label: 'Platform',
    items: [
      { href: '/settings/config', label: 'Config', icon: Settings },
      { href: '/settings/rules', label: 'Rules Engine', icon: Scale },
    ],
  },
];

export function PlatformSidebar() {
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
          <Link href="/" className="text-lg font-bold text-primary">
            Platform
          </Link>
        )}
        <button onClick={toggleSidebar} className="rounded p-1 hover:bg-gray-100" aria-label="Toggle sidebar">
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_GROUPS.map((group) => (
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
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
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
