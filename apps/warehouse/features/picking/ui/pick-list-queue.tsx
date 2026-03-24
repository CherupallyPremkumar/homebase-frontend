'use client';

import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Card, CardContent, Badge } from '@homebase/ui';
import { TaskCard } from '@/components/task-card';
import { ClipboardList } from 'lucide-react';
import { useActivePickLists } from '../api/queries';

export function PickListQueue() {
  const { data, isLoading, error } = useActivePickLists();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Picking</h1>
        <p className="text-sm text-gray-500">Fulfillment orders ready for picking</p>
      </div>

      {!data?.length ? (
        <TaskCard
          title="No picks pending"
          subtitle="No fulfillment orders need picking right now"
          status="completed"
          icon={<ClipboardList className="h-8 w-8 text-green-600" />}
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
                    {order.priority && (
                      <Badge variant={order.priority === 'HIGH' || order.priority === 'URGENT' ? 'destructive' : 'outline'}>
                        {order.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                {order.warehouseId && (
                  <p className="mt-2 text-xs text-gray-400">Warehouse: {order.warehouseId}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
