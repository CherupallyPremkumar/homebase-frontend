'use client';

import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';

export interface SellerPerformance {
  fulfillmentRate: number;
  averageShippingDays: number;
  returnRate: number;
  customerRating: number;
  responseTimeHours: number;
  defectRate: number;
  lateShipmentRate: number;
  cancellationRate: number;
}

export function useSellerPerformance() {
  return useQuery({
    queryKey: ['seller-performance'],
    queryFn: () => suppliersApi.getPerformance('me'),
    select: (data) => data.list?.[0]?.row,
    ...CACHE_TIMES.dashboard,
  });
}
