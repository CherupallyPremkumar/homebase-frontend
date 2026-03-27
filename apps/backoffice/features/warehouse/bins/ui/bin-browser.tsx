'use client';

import { useState } from 'react';
import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@homebase/ui';
import { ScannerInput } from '@/features/warehouse/ui/scanner-input';
import { MapPin, Boxes } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useWarehouseZones, useWarehouseLocations, useLocationDetail } from '../api/queries';

export function BinBrowser() {
  const { data: zones, isLoading, error } = useWarehouseZones();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [searchedBin, setSearchedBin] = useState<string | null>(null);

  const { data: zoneLocations, isLoading: zoneLoading } = useWarehouseLocations(selectedZone ?? undefined);
  const { data: binData, isLoading: binLoading } = useLocationDetail(searchedBin || '');

  if (isLoading) return <SectionSkeleton variant="card" rows={4} />;
  if (error) return <ErrorSection error={error} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Bin Locations</h1>
        <p className="text-sm text-gray-500">Search or browse warehouse locations</p>
      </div>

      <ScannerInput
        onScan={(code) => { setSearchedBin(code); setSelectedZone(null); }}
        placeholder="Search by location code (e.g., A-01-03)..."
      />

      {searchedBin && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location: {searchedBin}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {binLoading ? (
              <SectionSkeleton rows={3} />
            ) : binData ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="outline">Zone: {binData.zone}</Badge>
                  <Badge variant="outline">Aisle: {binData.aisle}</Badge>
                  <Badge variant="outline">Shelf: {binData.shelf}</Badge>
                  <Badge variant="outline">Bin: {binData.bin}</Badge>
                  <Badge variant="outline">Type: {binData.locationType}</Badge>
                  <Badge variant={binData.isActive ? 'default' : 'secondary'}>
                    {binData.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Units</p>
                    <p className="text-2xl font-bold">{binData.currentUnits}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Capacity</p>
                    <p className="text-2xl font-bold">{binData.capacityUnits}</p>
                  </div>
                </div>
                {binData.capacityUnits > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Utilization</span>
                      <span className="font-bold">
                        {Math.round((binData.currentUnits / binData.capacityUnits) * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(Math.round((binData.currentUnits / binData.capacityUnits) * 100), 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-red-500">Location not found</p>
            )}
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">Zones</h2>
        {!zones?.length ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No warehouse locations found.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {zones.map((zone) => (
              <button
                key={zone.zone}
                onClick={() => { setSelectedZone(zone.zone); setSearchedBin(null); }}
                className="text-left"
              >
                <Card className={cn(
                  'transition-shadow hover:shadow-md',
                  selectedZone === zone.zone && 'ring-2 ring-primary',
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Boxes className="h-5 w-5 text-primary" />
                        <span className="text-lg font-bold">Zone {zone.zone}</span>
                      </div>
                      <span className={cn(
                        'text-sm font-bold',
                        zone.utilizationPercent > 90 ? 'text-red-600' : zone.utilizationPercent > 70 ? 'text-yellow-600' : 'text-green-600',
                      )}>
                        {zone.utilizationPercent}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          zone.utilizationPercent > 90 ? 'bg-red-500' : zone.utilizationPercent > 70 ? 'bg-yellow-500' : 'bg-green-500',
                        )}
                        style={{ width: `${zone.utilizationPercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{zone.occupiedBins}/{zone.totalBins} bins occupied</p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedZone && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Zone {selectedZone} Locations</h2>
          {zoneLoading ? (
            <SectionSkeleton rows={4} />
          ) : !zoneLocations?.length ? (
            <p className="text-sm text-gray-500">No locations in this zone</p>
          ) : (
            <div className="space-y-2">
              {zoneLocations.map((loc) => (
                <Card key={loc.id}>
                  <CardContent className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium font-mono">{loc.locationCode || `${loc.zone}-${loc.aisle}-${loc.shelf}-${loc.bin}`}</p>
                        <p className="text-xs text-gray-500">{loc.locationType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{loc.currentUnits}/{loc.capacityUnits}</p>
                      <p className="text-xs text-gray-400">units</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
