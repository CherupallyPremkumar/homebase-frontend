'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { StateBadge, formatDate } from '@homebase/shared';
import { usePlatformActivity } from '../api/queries';

export function RecentActivity() {
  const { data: recentItems } = usePlatformActivity();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentItems?.length ? (
          <div className="space-y-3">
            {recentItems.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded p-2 text-sm hover:bg-gray-50">
                <div>
                  <p className="font-medium">#{item.orderNumber}</p>
                  <p className="text-xs text-gray-500">{formatDate(item.createdTime)}</p>
                </div>
                <StateBadge state={item.stateId} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent activity</p>
        )}
      </CardContent>
    </Card>
  );
}
