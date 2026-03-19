'use client';

import { formatDate } from '@homebase/shared';
import { cn } from '@homebase/ui/src/lib/utils';

interface Activity {
  name: string;
  comment?: string;
  timestamp: string;
}

interface OrderStatusTimelineProps {
  activities: Activity[];
}

const STATE_COLORS: Record<string, string> = {
  CREATED: 'bg-blue-500',
  PAID: 'bg-green-500',
  PROCESSING: 'bg-yellow-500',
  SHIPPED: 'bg-indigo-500',
  DELIVERED: 'bg-green-600',
  CANCELLED: 'bg-red-500',
  REFUNDED: 'bg-orange-500',
};

export function OrderStatusTimeline({ activities }: OrderStatusTimelineProps) {
  if (!activities.length) return null;

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-200" />

      <div className="space-y-6">
        {activities.map((activity, i) => {
          const isFirst = i === 0;
          const dotColor = STATE_COLORS[activity.name] || 'bg-gray-400';

          return (
            <div key={i} className="relative flex gap-4 pl-8">
              {/* Dot */}
              <div
                className={cn(
                  'absolute left-0 top-1 h-6 w-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center',
                  isFirst ? dotColor : 'bg-gray-300',
                )}
              >
                {isFirst && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-1">
                <p className={cn('text-sm font-medium', isFirst ? 'text-gray-900' : 'text-gray-600')}>
                  {activity.name.replace(/_/g, ' ')}
                </p>
                {activity.comment && (
                  <p className="mt-0.5 text-sm text-gray-500">{activity.comment}</p>
                )}
                <p className="mt-0.5 text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
