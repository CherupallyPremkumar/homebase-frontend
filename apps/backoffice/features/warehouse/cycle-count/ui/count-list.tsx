'use client';

import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Card, CardContent } from '@homebase/ui';
import { TaskCard } from '@/features/warehouse/ui/task-card';
import { RotateCcw, MapPin } from 'lucide-react';
import { useCountLocations } from '../api/queries';

export function CountList() {
  const { data, isLoading, error } = useCountLocations();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Cycle Count</h1>
        <p className="text-sm text-gray-500">Warehouse locations available for counting</p>
      </div>

      {!data?.length ? (
        <TaskCard
          title="No locations found"
          subtitle="Add warehouse locations to enable cycle counting"
          status="completed"
          icon={<RotateCcw className="h-8 w-8 text-green-600" />}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            {data.length} active location{data.length !== 1 ? 's' : ''} available for cycle counting.
            Scheduled counts will appear here when the cycle-count backend is ready.
          </p>
          {data.map((loc) => (
            <Card key={loc.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <MapPin className="h-6 w-6 text-orange-500" />
                <div className="flex-1">
                  <p className="font-bold font-mono">
                    {loc.locationCode || `${loc.zone}-${loc.aisle}-${loc.shelf}-${loc.bin}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Zone {loc.zone} &middot; {loc.locationType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{loc.currentUnits}</p>
                  <p className="text-xs text-gray-400">units</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
