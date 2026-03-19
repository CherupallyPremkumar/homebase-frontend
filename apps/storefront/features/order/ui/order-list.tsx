'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';
import { useSearchQuery, StateBadge, SectionSkeleton, ErrorSection, EmptyState, formatPriceRupees, formatDate, CACHE_TIMES } from '@homebase/shared';
import { Button } from '@homebase/ui';
import { Package } from 'lucide-react';

export function OrderList() {
  const { searchRequest, page, setPage } = useSearchQuery({ size: 10 });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-orders', searchRequest],
    queryFn: () => ordersApi.myOrders(searchRequest),
    ...CACHE_TIMES.orderList,
  });

  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Orders</h1>

      {isLoading ? (
        <SectionSkeleton rows={5} />
      ) : !data?.content.length ? (
        <EmptyState
          icon={<Package className="h-16 w-16" />}
          title="No orders yet"
          description="Start shopping to see your orders here."
          action={<Link href="/products"><Button>Browse Products</Button></Link>}
        />
      ) : (
        <div className="space-y-4">
          {data.content.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block rounded-lg border p-4 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Order #{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.createdTime)}</p>
                </div>
                <StateBadge state={order.stateId} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
                <p className="font-semibold">{formatPriceRupees(order.total)}</p>
              </div>
            </Link>
          ))}

          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={!data.hasPrevious}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={!data.hasNext}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
