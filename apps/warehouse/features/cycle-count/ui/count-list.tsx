'use client';

import Link from 'next/link';
import { SectionSkeleton, ErrorSection, formatDate } from '@homebase/shared';
import { TaskCard } from '@/components/task-card';
import { RotateCcw, MapPin } from 'lucide-react';
import { usePendingCounts } from '../api/queries';

export function CountList() {
  const { data, isLoading, error } = usePendingCounts();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Cycle Count</h1>
        <p className="text-sm text-gray-500">Count inventory at assigned bin locations</p>
      </div>

      {!data?.length ? (
        <TaskCard
          title="No counts scheduled"
          subtitle="All bins have been counted"
          status="completed"
          icon={<RotateCcw className="h-8 w-8 text-green-600" />}
        />
      ) : (
        <div className="space-y-3">
          {data.map((task) => (
            <Link key={task.id} href={`/cycle-count/${task.id}`}>
              <TaskCard
                title={task.binLocation}
                subtitle={`Zone ${task.zone} · ${task.items.length} SKUs`}
                count={task.items.filter((i) => !i.counted).length}
                status={task.status === 'DISCREPANCY' ? 'urgent' : task.status === 'IN_PROGRESS' ? 'in-progress' : 'pending'}
                icon={<MapPin className="h-8 w-8 text-orange-600" />}
                className="mb-3"
              >
                <p className="mt-1 text-xs text-gray-400">Scheduled: {formatDate(task.scheduledDate)}</p>
              </TaskCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
