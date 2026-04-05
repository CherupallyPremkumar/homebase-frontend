'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';
import {
  LayoutDashboard,
  ClipboardList,
  CornerDownLeft,
  Package,
  Store,
  Users,
  DollarSign,
  Landmark,
  RotateCcw,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Newspaper,
  Star,
  Boxes,
  Truck,
  Bell,
  HeadphonesIcon,
  Receipt,
  UserPlus,
  FileText,
  FolderTree,
  Settings,
  ScrollText,
  Activity,
  Tag,
  Bookmark,
  AlertTriangle,
  Warehouse,
  MapPin,
  Megaphone,
  Image,
  ShoppingCart,
  PieChart,
  MonitorDot,
  Zap,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badgeQuery?: string;
  badgeVariant?: 'brand' | 'warning';
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// ----------------------------------------------------------------
// Navigation structure — badge counts fetched from API
// ----------------------------------------------------------------

const NAV_SECTIONS: NavSection[] = [
  {
    label: '',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/products', label: 'Products', icon: Package },
      { href: '/categories', label: 'Categories', icon: FolderTree },
      { href: '/products/attributes', label: 'Attributes', icon: Tag },
      { href: '/products/brands', label: 'Brands', icon: Bookmark },
      { href: '/inventory', label: 'Inventory', icon: Boxes },
      { href: '/products/pricing-rules', label: 'Pricing Rules', icon: DollarSign },
    ],
  },
  {
    label: 'Orders',
    items: [
      { href: '/orders', label: 'All Orders', icon: ClipboardList, badgeQuery: 'orders', badgeVariant: 'brand' },
      { href: '/returns', label: 'Returns & Refunds', icon: CornerDownLeft, badgeQuery: 'returnrequests', badgeVariant: 'warning' },
      { href: '/disputes', label: 'Disputes', icon: AlertTriangle, badgeVariant: 'warning' },
    ],
  },
  {
    label: 'Sellers',
    items: [
      { href: '/suppliers', label: 'Manage Sellers', icon: Store, badgeQuery: 'suppliers', badgeVariant: 'brand' },
      { href: '/onboarding', label: 'Onboarding', icon: UserPlus, badgeQuery: 'onboarding', badgeVariant: 'brand' },
      { href: '/suppliers/sla', label: 'SLA & Performance', icon: BarChart3 },
      { href: '/suppliers/payouts', label: 'Payouts', icon: Landmark },
    ],
  },
  {
    label: 'Fulfillment & Logistics',
    items: [
      { href: '/warehouses', label: 'Warehouses / FCs', icon: Warehouse },
      { href: '/shipping', label: 'Shipments', icon: Truck },
      { href: '/shipping/tracking', label: 'Delivery Tracking', icon: MapPin },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/finance', label: 'Payments', icon: DollarSign },
      { href: '/finance/settlements', label: 'Settlements', icon: Landmark, badgeQuery: 'pendingSettlements', badgeVariant: 'warning' },
      { href: '/finance/reconciliation', label: 'Reconciliation', icon: RotateCcw },
      { href: '/tax', label: 'Tax & GST', icon: Receipt },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { href: '/promotions', label: 'Promotions / Coupons', icon: Sparkles },
      { href: '/promotions/campaigns', label: 'Campaigns', icon: Megaphone },
      { href: '/cms', label: 'Banners / CMS', icon: Image },
    ],
  },
  {
    label: 'Customers',
    items: [
      { href: '/users', label: 'User Management', icon: Users },
      { href: '/users/segments', label: 'Segments', icon: PieChart },
      { href: '/reviews', label: 'Reviews', icon: Star, badgeQuery: 'reviews', badgeVariant: 'warning' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { href: '/analytics', label: 'Business Reports', icon: BarChart3 },
      { href: '/analytics/abandoned-carts', label: 'Abandoned Carts', icon: ShoppingCart },
      { href: '/analytics/sessions', label: 'Sessions', icon: MonitorDot },
    ],
  },
  {
    label: 'Settings',
    items: [
      { href: '/settings', label: 'Platform Config', icon: Settings },
      { href: '/compliance', label: 'Compliance', icon: ShieldCheck },
      { href: '/notifications', label: 'Notifications', icon: Bell },
      { href: '/audit-log', label: 'Audit Log', icon: ScrollText },
      { href: '/health', label: 'System Health', icon: Zap },
    ],
  },
];

// ----------------------------------------------------------------
// Hook: fetch sidebar badge counts from API
// ----------------------------------------------------------------

function useSidebarCounts() {
  return useQuery({
    queryKey: ['sidebar-counts'],
    queryFn: async () => {
      const api = getApiClient();
      // Each entry: [sidebarKey, module, queryName]
      const entries: [string, string, string][] = [
        ['orders', 'order', 'orders'],
        ['returnrequests', 'returnrequest', 'returnrequests'],
        ['suppliers', 'supplier', 'suppliers'],
        ['onboarding', 'onboarding', 'onboardings'],
        ['pendingSettlements', 'settlement', 'pendingSettlements'],
        ['tickets', 'support', 'tickets'],
        ['reviews', 'review', 'reviews'],
      ];
      const results = await Promise.allSettled(
        entries.map(([, module, query]) =>
          api.post<SearchResponse<unknown>>(`/${module}/${query}`, { pageNum: 1, pageSize: 1 }),
        ),
      );
      const counts: Record<string, number> = {};
      entries.forEach(([key], i) => {
        const result = results[i];
        if (result && result.status === 'fulfilled') {
          counts[key] = result.value.maxRows ?? 0;
        }
      });
      return counts;
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function PlatformSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: counts } = useSidebarCounts();

  const userName = session?.user?.name || 'Admin';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      className="fixed left-0 top-16 bottom-0 w-60 z-40 flex flex-col overflow-y-auto bg-[#0A1628]"
      role="complementary"
      aria-label="Platform navigation"
    >
      {/* ---- Admin Info Card ---- */}
      <div className="px-4 pt-5 pb-4">
        <div className="rounded-xl p-3.5 border border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold shrink-0"
              aria-hidden="true"
            >
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{userName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" aria-hidden="true" />
                <span className="text-[10px] text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Role</span>
            <span className="text-xs font-semibold text-orange-400">Platform Admin</span>
          </div>
        </div>
      </div>

      {/* ---- Navigation ---- */}
      <nav className="flex-1 px-3 pb-4" aria-label="Sidebar navigation">
        {NAV_SECTIONS.map((section, sectionIdx) => (
          <div key={section.label || `section-${sectionIdx}`} className={sectionIdx > 0 ? 'mt-5' : ''}>
            {section.label && (
              <p className="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5" role="list">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const badgeCount = item.badgeQuery ? Number(counts?.[item.badgeQuery] ?? 0) : 0;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                        active
                          ? 'text-orange-400 bg-orange-500/15 border-r-[3px] border-orange-500'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.06]',
                      )}
                    >
                      <Icon className="w-[18px] h-[18px] flex-shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                      {badgeCount != null && badgeCount > 0 && (
                        <span
                          className={cn(
                            'ml-auto text-[10px] font-bold rounded-full px-2 py-0.5',
                            item.badgeVariant === 'warning'
                              ? 'bg-yellow-500 text-[#0A1628]'
                              : 'bg-orange-500 text-white',
                          )}
                        >
                          {badgeCount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ---- System Status Footer ---- */}
      <div className="px-4 pb-4">
        <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">System Status</p>
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            <span className="text-xs text-green-400 font-semibold">All Systems Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
