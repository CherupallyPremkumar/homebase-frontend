'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Undo2,
  Layers,
  BarChart3,
  Star,
  Wallet,
  MessageCircle,
  LifeBuoy,
  FileText,
  Settings,
  Store,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: 'brand' | 'warning' | 'danger';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Main Menu',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/products', label: 'Products', icon: Package },
      { href: '/orders', label: 'Orders', icon: ClipboardList },
      { href: '/returns', label: 'Returns', icon: Undo2, badge: 8, badgeColor: 'warning' },
      { href: '/inventory', label: 'Inventory', icon: Layers, badge: 5, badgeColor: 'danger' },
      { href: '/performance', label: 'Performance', icon: BarChart3 },
      { href: '/reviews', label: 'Reviews', icon: Star, badge: 12, badgeColor: 'brand' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { href: '/settlements', label: 'Settlements', icon: Wallet },
    ],
  },
  {
    title: 'Support',
    items: [
      { href: '/messages', label: 'Messages', icon: MessageCircle, badge: 5, badgeColor: 'brand' },
      { href: '/support', label: 'Support', icon: LifeBuoy, badge: 2, badgeColor: 'warning' },
      { href: '/documents', label: 'Documents', icon: FileText },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const BADGE_STYLES: Record<string, string> = {
  brand: 'bg-orange-500 text-white',
  warning: 'bg-yellow-500 text-[#0F1B2D]',
  danger: 'bg-red-600 text-white',
};

interface SellerSidebarProps {
  activePage?: string;
}

export function SellerSidebar({ activePage }: SellerSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (activePage) {
      return activePage === href;
    }
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-60 z-40 flex flex-col overflow-y-auto"
      style={{ backgroundColor: '#0F1B2D' }}
    >
      {/* Seller Info Card */}
      <div className="px-4 pt-5 pb-4">
        <div className="rounded-xl p-3.5 border border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              RS
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">Rajesh Store</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[10px] text-green-400 font-medium">Active</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Seller Score</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-orange-400">4.6</span>
              <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4">
        {NAV_SECTIONS.map((section, sectionIdx) => (
          <div key={section.title}>
            <p className={cn(
              'px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2',
              sectionIdx > 0 && 'mt-6',
            )}>
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                        active
                          ? 'text-orange-400 bg-orange-500/15 border-r-[3px] border-orange-500'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.08]',
                      )}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      {item.label}
                      {item.badge != null && (
                        <span className={cn(
                          'ml-auto text-[10px] font-bold rounded-full px-2 py-0.5',
                          BADGE_STYLES[item.badgeColor || 'brand'],
                        )}>
                          {item.badge}
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

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/storefront"
          className="flex items-center gap-2 text-gray-500 text-xs hover:text-gray-300 transition"
        >
          <Store className="w-4 h-4" />
          View My Storefront
        </Link>
      </div>
    </aside>
  );
}
