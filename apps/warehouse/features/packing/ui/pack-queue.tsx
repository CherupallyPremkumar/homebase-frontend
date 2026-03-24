'use client';

import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Card, CardContent, Badge } from '@homebase/ui';
import { TaskCard } from '@/components/task-card';
import { ScanBarcode } from 'lucide-react';
import { usePendingPacks } from '../api/queries';

export function PackQueue() {
  const { data, isLoading, error } = usePendingPacks();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Packing</h1>
        <p className="text-sm text-gray-500">Fulfillment orders ready for packing</p>
      </div>

      {!data?.length ? (
        <TaskCard
          title="No items to pack"
          subtitle="No fulfillment orders need packing right now"
          status="completed"
          icon={<ScanBarcode className="h-8 w-8 text-green-600" />}
        />
      ) : (
        <div className="space-y-3">
          {data.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">Order {order.orderId}</p>
                    <p className="text-sm text-gray-500">
                      Fulfillment: {order.id.substring(0, 8)}...
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary">{order.stateId}</Badge>
                    {order.carrier && (
                      <Badge variant="outline">{order.carrier}</Badge>
                    )}
                  </div>
                </div>
                {order.trackingNumber && (
                  <p className="mt-2 text-xs text-gray-400">Tracking: {order.trackingNumber}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
