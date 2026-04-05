'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@homebase/api-client';

import type { ProductAttributesData } from '../attribute-types';

// ----------------------------------------------------------------
// Product Attributes (all tabs in one query)
// ----------------------------------------------------------------

// Note: There is no dedicated product-attributes query endpoint yet.
// We use productsApi.search as a proxy to verify connectivity and
// return a minimal structure. When a product-attributes query module
// is available, replace the queryFn below.

export function useProductAttributes() {
  return useQuery<ProductAttributesData>({
    queryKey: ['product-attributes'],
    queryFn: async () => {
      // Verify backend connectivity; no dedicated attributes endpoint yet.
      await productsApi.search({ pageNum: 1, pageSize: 1 });
      return {
        stats: { totalAttributes: 0, activeAttributes: 0 },
        sizes: [],
        colors: [],
        materials: [],
        brands: [],
      };
    },
    staleTime: 60_000,
  });
}
