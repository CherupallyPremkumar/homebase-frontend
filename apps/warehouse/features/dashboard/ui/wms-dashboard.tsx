'use client';

import Link from 'next/link';
import { PackageOpen, ClipboardList, ScanBarcode, RotateCcw, TrendingUp, Boxes } from 'lucide-react';
import { SectionSkeleton, ErrorSection, formatNumber } from '@homebase/shared';
import { Card, CardContent } from '@homebase/ui';
import { TaskCard } from '@/components/task-card';
import { useWarehouseStats } from '../api/queries';

export function WmsDashboard() {
  const { data, isLoading, error } = useWarehouseStats();

  if (isLoading) return <SectionSkeleton variant="card" rows={4} />;
  if (error) return <ErrorSection error={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Warehouse Dashboard</h1>
        <p className="text-sm text-gray-500">Today's overview</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Items Processed" value={formatNumber(data.itemsProcessedToday)} icon={<Boxes className="h-5 w-5 text-primary" />} />
        <StatTile label="Orders Shipped" value={formatNumber(data.ordersShippedToday)} icon={<TrendingUp className="h-5 w-5 text-green-600" />} />
        <StatTile label="Total Items" value={formatNumber(data.totalItems)} icon={<Boxes className="h-5 w-5 text-gray-500" />} />
        <StatTile label="Utilization" value={`${data.utilizationPercent}%`} icon={<Boxes className="h-5 w-5 text-blue-500" />} />
      </div>

      {/* Task cards -- tap to start */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Pending Tasks</h2>

        <Link href="/receiving">
          <TaskCard
            title="Receiving"
            subtitle="Inbound shipments waiting to be received"
            count={data.pendingReceiving}
            status={data.pendingReceiving > 0 ? 'pending' : 'completed'}
            icon={<PackageOpen className="h-8 w-8 text-yellow-600" />}
          />
        </Link>

        <Link href="/picking">
          <TaskCard
            title="Picking"
            subtitle="Orders ready to be picked from shelves"
            count={data.activePicks}
            status={data.activePicks > 5 ? 'urgent' : data.activePicks > 0 ? 'in-progress' : 'completed'}
            icon={<ClipboardList className="h-8 w-8 text-blue-600" />}
          />
        </Link>

        <Link href="/packing">
          <TaskCard
            title="Packing"
            subtitle="Picked items ready for packing"
            count={data.pendingPacks}
            status={data.pendingPacks > 0 ? 'pending' : 'completed'}
            icon={<ScanBarcode className="h-8 w-8 text-purple-600" />}
          />
        </Link>

        <Link href="/cycle-count">
          <TaskCard
            title="Cycle Counts"
            subtitle="Scheduled inventory counts"
            count={data.pendingCycleCounts}
            status={data.pendingCycleCounts > 0 ? 'pending' : 'completed'}
            icon={<RotateCcw className="h-8 w-8 text-orange-600" />}
          />
        </Link>
      </div>
    </div>
  );
}

function StatTile({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        {icon}
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
