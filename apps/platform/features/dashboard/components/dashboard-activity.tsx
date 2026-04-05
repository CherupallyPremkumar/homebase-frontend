'use client';

import Link from 'next/link';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';


import { useDashboardActivity } from '../hooks/use-dashboard';
import { adaptActivity } from '../services/activity-adapter';
import { activityIcons } from '../../../lib/registries/icon-registry';
import type { ActivityIconKey } from '../../../lib/registries/icon-registry';

// ----------------------------------------------------------------
// Skeleton (loading state for the activity feed)
// ----------------------------------------------------------------

export function ActivitySkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="divide-y divide-gray-50">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3.5 px-6 py-4">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function DashboardActivity() {
  const { data: rawActivity, isLoading } = useDashboardActivity();

  const items = adaptActivity(rawActivity);

  return (
    <section aria-label="Recent activity">
      <article className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Link
            href="/orders"
            className="text-xs font-medium text-orange-500 hover:text-orange-600"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3.5 px-6 py-4">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {items.map((item) => {
              const IconComp = activityIcons.resolve(item.iconType as ActivityIconKey);

              return (
                <Link
                  key={item.id}
                  href={item.navigateTo}
                  className="flex items-start gap-3.5 px-6 py-4 transition-colors hover:bg-gray-50 cursor-pointer block"
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      item.iconBgColor,
                    )}
                    aria-hidden="true"
                  >
                    <IconComp className={cn('h-4 w-4', item.iconColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800">{item.title}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {item.subtitle} &middot; {item.relativeTime}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-1 text-[10px] font-medium',
                      item.badgeStyle.bg,
                      item.badgeStyle.text,
                    )}
                  >
                    {item.badgeLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-sm text-gray-400">
            No recent activity
          </div>
        )}
      </article>
    </section>
  );
}
