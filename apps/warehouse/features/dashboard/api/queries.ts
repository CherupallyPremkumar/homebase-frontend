'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse, ResponseRow } from '@homebase/types';

export interface Warehouse {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  warehouseType: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  contactPhone: string;
  contactEmail: string;
  managerId: string;
  maxCapacityUnits: number;
  currentUtilizationPct: number;
  isActive: boolean;
  isReturnsCenter: boolean;
  createdTime: string;
}

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

export interface DashboardData {
  warehouses: Warehouse[];
  warehouseCount: number;
  locationCount: number;
  locations: WarehouseLocation[];
}

/**
 * Fetches warehouses and locations from Chenile query endpoints
 * to build the dashboard stats.
 */
export function useDashboardData() {
  return useQuery({
    queryKey: ['wms-dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      const api = getApiClient();

      // Chenile query endpoints use pageNum (1-based), return list[].row
      const [warehouseRes, locationRes] = await Promise.all([
        api.post<SearchResponse<Warehouse>>('/warehouse/warehouses', {
          pageNum: 1,
          pageSize: 100,
        }),
        api.post<SearchResponse<WarehouseLocation>>('/warehouse/warehouse-locations', {
          pageNum: 1,
          pageSize: 100,
        }),
      ]);

      // Extract row from each ResponseRow entry
      const warehouses = warehouseRes?.list?.map((entry) => entry.row) ?? [];
      const locations = locationRes?.list?.map((entry) => entry.row) ?? [];

      return {
        warehouses,
        warehouseCount: warehouseRes?.maxRows ?? warehouses.length,
        locations,
        locationCount: locationRes?.maxRows ?? locations.length,
      };
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
