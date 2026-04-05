'use client';

import Link from 'next/link';
import { FileText, Download, Bell, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

import { mockQuickActions } from '../services/mock-data';

const ICON_MAP: Record<string, LucideIcon> = {
  'file-text': FileText,
  download: Download,
  bell: Bell,
  'bar-chart': BarChart3,
};

export function DashboardQuickActions() {
  return (
    <div className="fixed bottom-0 left-60 right-0 z-40 border-t border-navy-700 bg-navy-900/95 px-8 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-4">
        {mockQuickActions.map((action) => {
          const Icon = ICON_MAP[action.iconKey] ?? FileText;
          const isPrimary = action.variant === 'primary';

          const className = cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:-translate-y-px hover:shadow-lg',
            isPrimary
              ? 'bg-brand-500 text-white hover:bg-brand-600'
              : 'border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white',
          );

          if (action.href) {
            return (
              <Link key={action.label} href={action.href} className={className}>
                <Icon className="h-4 w-4" />
                {action.label}
              </Link>
            );
          }

          return (
            <button key={action.label} className={className}>
              <Icon className="h-4 w-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
