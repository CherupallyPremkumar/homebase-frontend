'use client';

import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Card, CardContent, Badge } from '@homebase/ui';
import { TaskCard } from '@/features/warehouse/ui/task-card';
import { PackageOpen } from 'lucide-react';
import { usePendingReceiving } from '../api/queries';

export function ReceivingList() {
  const { data, isLoading, error } = usePendingReceiving();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Receiving</h1>
        <p className="text-sm text-gray-500">Inventory items pending stock inspection</p>
      </div>

      {!data?.length ? (
        <TaskCard
          title="All caught up!"
          subtitle="No pending items to receive"
          status="completed"
          icon={<PackageOpen className="h-8 w-8 text-green-600" />}
        />
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold font-mono">{item.sku}</p>
                    <p className="text-sm text-gray-500">
                      Product: {item.productId.substring(0, 8)}...
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary">{item.stateId}</Badge>
                    {item.inboundQuantity > 0 && (
                      <Badge variant="outline">Inbound: {item.inboundQuantity}</Badge>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex gap-4 text-sm text-gray-500">
                  <span>Qty: {item.quantity}</span>
                  {item.primaryFc && <span>FC: {item.primaryFc}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
