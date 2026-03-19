'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';

export interface WarehouseBin {
  id: string;
  location: string;
  zone: string;
  aisle: string;
  rack: string;
  level: string;
  type: 'STANDARD' | 'BULK' | 'PICK_FACE' | 'COLD_STORAGE' | 'HAZMAT';
  capacity: number;
  utilization: number;
  itemCount: number;
  items: BinItem[];
}

export interface BinItem {
  sku: string;
  productName: string;
  quantity: number;
  lastUpdated: string;
}

export interface WarehouseZone {
  zone: string;
  totalBins: number;
  occupiedBins: number;
  utilizationPercent: number;
}

export function useWarehouseZones() {
  return useQuery({
    queryKey: ['wms-zones'],
    queryFn: () => getApiClient().get<WarehouseZone[]>('/api/v1/warehouse/zones'),
    staleTime: 60_000,
  });
}

export function useBinSearch(query: string) {
  return useQuery({
    queryKey: ['wms-bins', 'search', query],
    queryFn: () => getApiClient().get<WarehouseBin[]>(`/api/v1/warehouse/bins?q=${encodeURIComponent(query)}`),
    staleTime: 10_000,
    enabled: query.length >= 1,
  });
}

export function useBinDetail(location: string) {
  return useQuery({
    queryKey: ['wms-bins', location],
    queryFn: () => getApiClient().get<WarehouseBin>(`/api/v1/warehouse/bins/${encodeURIComponent(location)}`),
    staleTime: 10_000,
    enabled: !!location,
  });
}
