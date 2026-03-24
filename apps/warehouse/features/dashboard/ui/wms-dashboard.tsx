'use client';

import Link from 'next/link';
import { Warehouse, MapPin, Boxes, Building2 } from 'lucide-react';
import { SectionSkeleton, ErrorSection, formatNumber } from '@homebase/shared';
import { Card, CardContent, Badge } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';
import { useDashboardData } from '../api/queries';

export function WmsDashboard() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) return <SectionSkeleton variant="card" rows={4} />;
  if (error) return <ErrorSection error={error} />;
  if (!data) return null;

  const activeWarehouses = data.warehouses.filter((w) => w.isActive);
  const totalCapacity = data.warehouses.reduce((sum, w) => sum + (w.maxCapacityUnits || 0), 0);
  const avgUtilization = data.warehouses.length > 0
    ? Math.round(data.warehouses.reduce((sum, w) => sum + (w.currentUtilizationPct || 0), 0) / data.warehouses.length)
    : 0;
  const activeLocations = data.locations.filter((l) => l.isActive);

  // Group locations by zone
  const zoneMap = new Map<string, { total: number; occupied: number }>();
  for (const loc of data.locations) {
    const zone = loc.zone || 'Unknown';
    const entry = zoneMap.get(zone) || { total: 0, occupied: 0 };
    entry.total++;
    if (loc.currentUnits > 0) entry.occupied++;
    zoneMap.set(zone, entry);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Warehouse Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of all warehouses</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Warehouses"
          value={formatNumber(activeWarehouses.length)}
          icon={<Building2 className="h-5 w-5 text-primary" />}
        />
        <StatTile
          label="Total Locations"
          value={formatNumber(activeLocations.length)}
          icon={<MapPin className="h-5 w-5 text-blue-500" />}
        />
        <StatTile
          label="Total Capacity"
          value={formatNumber(totalCapacity)}
          icon={<Boxes className="h-5 w-5 text-gray-500" />}
        />
        <StatTile
          label="Avg Utilization"
          value={`${avgUtilization}%`}
          icon={<Warehouse className="h-5 w-5 text-green-600" />}
        />
      </div>

      {/* Warehouses list */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Warehouses</h2>
        {data.warehouses.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No warehouses found. Add warehouses in the admin panel.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {data.warehouses.map((wh) => (
              <Card key={wh.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold">{wh.warehouseName}</p>
                        <Badge variant={wh.isActive ? 'default' : 'secondary'}>
                          {wh.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {wh.warehouseCode} &middot; {wh.warehouseType} &middot; {wh.city}, {wh.state}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-lg font-bold',
                        (wh.currentUtilizationPct || 0) > 90 ? 'text-red-600' :
                        (wh.currentUtilizationPct || 0) > 70 ? 'text-yellow-600' : 'text-green-600',
                      )}>
                        {wh.currentUtilizationPct || 0}%
                      </p>
                      <p className="text-xs text-gray-400">utilization</p>
                    </div>
                  </div>
                  {/* Utilization bar */}
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        (wh.currentUtilizationPct || 0) > 90 ? 'bg-red-500' :
                        (wh.currentUtilizationPct || 0) > 70 ? 'bg-yellow-500' : 'bg-green-500',
                      )}
                      style={{ width: `${Math.min(wh.currentUtilizationPct || 0, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Zones overview from locations */}
      {zoneMap.size > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Zones</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {Array.from(zoneMap.entries()).map(([zone, stats]) => {
              const pct = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;
              return (
                <Link key={zone} href="/bins">
                  <Card className="cursor-pointer transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">Zone {zone}</span>
                        <span className={cn(
                          'text-sm font-bold',
                          pct > 90 ? 'text-red-600' : pct > 70 ? 'text-yellow-600' : 'text-green-600',
                        )}>
                          {pct}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-green-500',
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{stats.occupied}/{stats.total} bins occupied</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
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
