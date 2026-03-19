'use client';

import Link from 'next/link';
import { SectionSkeleton, ErrorSection, formatDate } from '@homebase/shared';
import { Badge } from '@homebase/ui';
import { TaskCard } from '@/components/task-card';
import { PackageOpen } from 'lucide-react';
import { usePendingShipments } from '../api/queries';

export function ReceivingList() {
  const { data, isLoading, error } = usePendingShipments();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Receiving</h1>
        <p className="text-sm text-gray-500">Inbound shipments to process</p>
      </div>

      {!data?.length ? (
        <TaskCard
          title="All caught up!"
          subtitle="No pending shipments to receive"
          status="completed"
          icon={<PackageOpen className="h-8 w-8 text-green-600" />}
        />
      ) : (
        <div className="space-y-3">
          {data.map((shipment) => (
            <Link key={shipment.id} href={`/receiving/${shipment.id}`}>
              <TaskCard
                title={`PO #${shipment.poNumber}`}
                subtitle={shipment.supplierName}
                count={shipment.expectedItems - shipment.receivedItems}
                status={
                  shipment.status === 'DISCREPANCY' ? 'urgent' :
                  shipment.status === 'IN_PROGRESS' ? 'in-progress' :
                  shipment.status === 'COMPLETED' ? 'completed' : 'pending'
                }
                className="mb-3"
              >
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  <span>Expected: {formatDate(shipment.expectedDate)}</span>
                  <span>{shipment.receivedItems}/{shipment.expectedItems} received</span>
                </div>
              </TaskCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
