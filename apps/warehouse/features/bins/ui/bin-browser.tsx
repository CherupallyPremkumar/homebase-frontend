'use client';

import { useState } from 'react';
import { SectionSkeleton, ErrorSection, formatDate } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@homebase/ui';
import { ScannerInput } from '@/components/scanner-input';
import { MapPin, Boxes } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useWarehouseZones, useBinDetail } from '../api/queries';

export function BinBrowser() {
  const { data: zones, isLoading, error } = useWarehouseZones();
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const { data: binData, isLoading: binLoading } = useBinDetail(selectedBin || '');

  if (isLoading) return <SectionSkeleton variant="card" rows={4} />;
  if (error) return <ErrorSection error={error} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Bin Locations</h1>
        <p className="text-sm text-gray-500">Search or scan a bin to view contents</p>
      </div>

      {/* Scan a bin */}
      <ScannerInput
        onScan={(code) => setSelectedBin(code)}
        placeholder="Scan bin barcode or type location (e.g., A-01-03)..."
      />

      {/* Bin detail if selected */}
      {selectedBin && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Bin {selectedBin}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {binLoading ? (
              <SectionSkeleton rows={3} />
            ) : binData ? (
              <div className="space-y-3">
                <div className="flex gap-2 text-sm">
                  <Badge variant="outline">Zone: {binData.zone}</Badge>
                  <Badge variant="outline">Type: {binData.type}</Badge>
                  <Badge variant={binData.utilization > 80 ? 'destructive' : 'secondary'}>
                    {binData.utilization}% full
                  </Badge>
                </div>

                {binData.items.length === 0 ? (
                  <p className="text-sm text-gray-500">This bin is empty</p>
                ) : (
                  <div className="space-y-2">
                    {binData.items.map((item) => (
                      <div key={item.sku} className="flex items-center justify-between rounded border p-3">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{item.quantity}</p>
                          <p className="text-xs text-gray-400">{formatDate(item.lastUpdated)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-red-500">Bin not found</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Zone overview */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Zones</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {zones?.map((zone) => (
            <Card key={zone.zone}>
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
                <p className="mt-1 text-xs text-gray-500">{zone.occupiedBins}/{zone.totalBins} bins used</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
