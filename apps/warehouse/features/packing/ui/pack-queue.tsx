'use client';

import Link from 'next/link';
import { SectionSkeleton, ErrorSection } from '@homebase/shared';
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
        <p className="text-sm text-gray-500">Pack picked items and generate labels</p>
      </div>

      {!data?.length ? (
        <TaskCard
          title="No items to pack"
          subtitle="Waiting for picks to complete"
          status="completed"
          icon={<ScanBarcode className="h-8 w-8 text-green-600" />}
        />
      ) : (
        <div className="space-y-3">
          {data.map((task) => (
            <Link key={task.id} href={`/packing/${task.id}`}>
              <TaskCard
                title={`Order #${task.orderNumber}`}
                subtitle={`${task.packedItems}/${task.totalItems} items packed`}
                count={task.totalItems - task.packedItems}
                status={task.status === 'PACKING' ? 'in-progress' : 'pending'}
                className="mb-3"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
