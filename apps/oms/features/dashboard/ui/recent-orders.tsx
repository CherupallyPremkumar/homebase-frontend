'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { StateBadge, formatPriceRupees, formatDate } from '@homebase/shared';
import { useRecentOrders } from '../api/queries';

export function RecentOrders() {
  const { data: recentOrders } = useRecentOrders(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Orders
          <Link href="/orders" className="text-sm font-normal text-primary hover:underline">
            View all
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentOrders?.length ? (
          <div className="space-y-3">
            {recentOrders.slice(0, 10).map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between rounded p-2 text-sm hover:bg-gray-50">
                <div>
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.createdTime)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatPriceRupees(order.total)}</span>
                  <StateBadge state={order.stateId} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent orders</p>
        )}
      </CardContent>
    </Card>
  );
}
