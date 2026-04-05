'use client';

import { useQuery } from '@tanstack/react-query';
import { taxApi } from '@homebase/api-client';
import type { TaxRate as ApiTaxRate } from '@homebase/api-client';

import type { TaxRate } from '../services/mock-data';

// ----------------------------------------------------------------
// Adapter: ApiTaxRate (API) -> local TaxRate (UI)
// ----------------------------------------------------------------

function toLocalTaxRate(apiRate: ApiTaxRate): TaxRate {
  return {
    id: apiRate.id,
    name: apiRate.name,
    rate: apiRate.rate,
    type: apiRate.type,
    region: apiRate.region,
    stateId: apiRate.stateId ?? apiRate.status ?? '',
  };
}

// ----------------------------------------------------------------
// Tax Rates List
// ----------------------------------------------------------------

export function useTaxRates() {
  return useQuery<TaxRate[]>({
    queryKey: ['tax-rates'],
    queryFn: async () => {
      const res = await taxApi.searchTaxRates({ pageNum: 1, pageSize: 50 });
      return (res.list ?? []).map((entry) => toLocalTaxRate(entry.row));
    },
    staleTime: 60_000,
  });
}
