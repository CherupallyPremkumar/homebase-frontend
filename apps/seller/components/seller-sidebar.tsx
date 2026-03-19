'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Wallet,
  BarChart3,
  User,
  LifeBuoy,
  FileText,
  ClipboardCheck,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useUIStore } from '@homebase/shared';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/settlements', label: 'Settlements', icon: Wallet },
  { href: '/performance', label: 'Performance', icon: BarChart3 },
  { href: '/onboarding', label: 'Onboarding', icon: ClipboardCheck },
  { href: '/support', label: 'Support', icon: LifeBuoy },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/profile', label: 'Business Profile', icon: User },
];

export function SellerSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-white transition-all duration-200',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {sidebarOpen && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">Seller Central</span>
          </Link>
        )}
        <button onClick={toggleSidebar} className="rounded p-1 hover:bg-gray-100" aria-label="Toggle sidebar">
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
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
      </nav>

      {/* Footer — seller info */}
      {sidebarOpen && (
        <div className="border-t p-4">
          <p className="text-xs text-gray-400">Seller ID: —</p>
          <p className="text-xs text-gray-400">seller.homebase.com</p>
        </div>
      )}
    </aside>
  );
}
