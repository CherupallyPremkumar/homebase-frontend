'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PackageOpen, ClipboardList, ScanBarcode, MapPin, RotateCcw } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

const TABS = [
  { href: '/warehouse', label: 'Home', icon: LayoutDashboard },
  { href: '/warehouse/receiving', label: 'Receive', icon: PackageOpen },
  { href: '/warehouse/picking', label: 'Pick', icon: ClipboardList },
  { href: '/warehouse/packing', label: 'Pack', icon: ScanBarcode },
  { href: '/warehouse/cycle-count', label: 'Count', icon: RotateCcw },
  { href: '/warehouse/bins', label: 'Bins', icon: MapPin },
];

export function WarehouseNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
      <div className="mx-auto flex max-w-3xl items-center justify-around">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex min-w-[64px] flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-gray-500',
              )}
            >
              <Icon className={cn('h-6 w-6', isActive && 'stroke-[2.5px]')} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
