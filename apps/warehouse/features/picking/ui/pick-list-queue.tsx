'use client';

import Link from 'next/link';
import { SectionSkeleton, ErrorSection, formatRelativeTime } from '@homebase/shared';
import { Badge } from '@homebase/ui';
import { TaskCard } from '@/components/task-card';
import { ClipboardList } from 'lucide-react';
import { useActivePickLists } from '../api/queries';

const PRIORITY_COLORS = {
  URGENT: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  NORMAL: 'bg-gray-100 text-gray-700',
};

export function PickListQueue() {
  const { data, isLoading, error } = useActivePickLists();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Picking</h1>
        <p className="text-sm text-gray-500">Pick items from shelves for orders</p>
      </div>

      {!data?.length ? (
        <TaskCard
          title="No picks pending"
          subtitle="Check back soon for new orders"
          status="completed"
          icon={<ClipboardList className="h-8 w-8 text-green-600" />}
        />
      ) : (
        <div className="space-y-3">
          {data.map((pick) => (
            <Link key={pick.id} href={`/picking/${pick.id}`}>
              <TaskCard
                title={`Order #${pick.orderNumber}`}
                subtitle={`${pick.pickedItems}/${pick.totalItems} items picked`}
                count={pick.totalItems - pick.pickedItems}
                status={
                  pick.priority === 'URGENT' ? 'urgent' :
                  pick.status === 'IN_PROGRESS' ? 'in-progress' : 'pending'
                }
                className="mb-3"
              >
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={PRIORITY_COLORS[pick.priority]}>{pick.priority}</Badge>
                  <span className="text-xs text-gray-400">{formatRelativeTime(pick.createdAt)}</span>
                </div>
              </TaskCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
