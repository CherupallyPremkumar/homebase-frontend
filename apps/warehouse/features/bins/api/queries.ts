'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';

export interface WarehouseLocation {
  id: string;
  warehouseId: string;
  locationCode: string;
  zone: string;
  aisle: string;
  shelf: string;
  bin: string;
  locationType: string;
  capacityUnits: number;
  currentUnits: number;
  isActive: boolean;
}

export interface ZoneSummary {
  zone: string;
  totalBins: number;
  occupiedBins: number;
  utilizationPercent: number;
}

/**
 * Fetches warehouse locations from Chenile query endpoint.
 * Groups by zone for the zone overview.
 */
export function useWarehouseLocations(zone?: string) {
  return useQuery({
    queryKey: ['wms-locations', zone ?? 'all'],
    queryFn: async () => {
      const api = getApiClient();
      const filters: Record<string, string> = {};
      if (zone) filters.zone = zone;

      const res = await api.post<SearchResponse<WarehouseLocation>>(
        '/warehouse/warehouse-locations',
        { filters, pageNum: 1, pageSize: 200 },
      );

      return res?.list?.map((entry) => entry.row) ?? [];
    },
    staleTime: 30_000,
  });
}

export function useWarehouseZones() {
  return useQuery({
    queryKey: ['wms-zones'],
    queryFn: async (): Promise<ZoneSummary[]> => {
      const api = getApiClient();
      const res = await api.post<SearchResponse<WarehouseLocation>>(
        '/warehouse/warehouse-locations',
        { filters: {}, pageNum: 1, pageSize: 500 },
      );

      const locations = res?.list?.map((entry) => entry.row) ?? [];
      const zoneMap = new Map<string, { total: number; occupied: number }>();
      for (const loc of locations) {
        const zone = loc.zone || 'Unknown';
        const entry = zoneMap.get(zone) || { total: 0, occupied: 0 };
        entry.total++;
        if (loc.currentUnits > 0) entry.occupied++;
        zoneMap.set(zone, entry);
      }

      return Array.from(zoneMap.entries()).map(([zone, stats]) => ({
        zone,
        totalBins: stats.total,
        occupiedBins: stats.occupied,
        utilizationPercent: stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0,
      }));
    },
    staleTime: 60_000,
  });
}

export function useLocationDetail(locationCode: string) {
  return useQuery({
    queryKey: ['wms-location', locationCode],
    queryFn: async (): Promise<WarehouseLocation | null> => {
      const api = getApiClient();
      const res = await api.post<SearchResponse<WarehouseLocation>>(
        '/warehouse/warehouse-locations',
        { filters: {}, pageNum: 1, pageSize: 500 },
      );

      const locations = res?.list?.map((entry) => entry.row) ?? [];
      return locations.find((l) =>
        l.locationCode === locationCode ||
        l.id === locationCode ||
        `${l.zone}-${l.aisle}-${l.shelf}` === locationCode ||
        `${l.zone}-${l.aisle}-${l.shelf}-${l.bin}` === locationCode,
      ) ?? null;
    },
    staleTime: 10_000,
    enabled: !!locationCode,
  });
}
