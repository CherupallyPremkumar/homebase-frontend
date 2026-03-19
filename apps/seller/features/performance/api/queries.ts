'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
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
    queryFn: () => getApiClient().get<SellerPerformance>('/api/v1/seller/performance'),
    ...CACHE_TIMES.dashboard,
  });
}
