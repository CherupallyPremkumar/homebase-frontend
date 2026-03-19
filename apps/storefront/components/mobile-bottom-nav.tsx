'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, Package, User, LogIn } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useCartStore } from '@homebase/shared';

interface MobileBottomNavProps {
  isAuthenticated: boolean;
}

/**
 * Receives auth state as props from server layout — no API call needed.
 */
export function MobileBottomNav({ isAuthenticated }: MobileBottomNavProps) {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());

  const NAV_ITEMS = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/categories', label: 'Categories', icon: LayoutGrid },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, showBadge: true },
    ...(isAuthenticated
      ? [
          { href: '/orders', label: 'Orders', icon: Package },
          { href: '/profile', label: 'Account', icon: User },
        ]
      : [
          { href: '/api/auth/signin/keycloak', label: 'Login', icon: LogIn },
        ]),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="flex h-14 items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && !item.href.startsWith('/api') && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-w-[44px] flex-col items-center gap-0.5 px-3 py-1',
                isActive ? 'text-primary' : 'text-gray-500',
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.showBadge && itemCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
