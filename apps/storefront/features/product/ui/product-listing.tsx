'use client';

import { useMemo } from 'react';
import { EntityList } from '@homebase/ui';
import { catalogApi } from '@homebase/api-client';
import type { CatalogItem } from '@homebase/types';
import { ProductCard } from './product-card';

interface ProductListingProps {
  categorySlug?: string;
}

export function ProductListing({ categorySlug }: ProductListingProps) {
  const baseFilter = useMemo(
    () => (categorySlug ? { categorySlug } : undefined),
    [categorySlug],
  );

  return (
    <EntityList<CatalogItem>
      title="All Products"
      subtitle="Browse our complete collection"
      queryKey={categorySlug ? `storefront-products-${categorySlug}` : 'storefront-products'}
      queryFn={catalogApi.search}
      display="grid"
      searchable
      searchPlaceholder="Search products..."
      baseFilter={baseFilter}
      renderItem={(product) => <ProductCard product={product} />}
      tabs={[
        { label: 'All', filter: {} },
        { label: 'New Arrivals', filter: { sort: 'newest' } },
        { label: 'Top Rated', filter: { sort: 'rating_desc' } },
      ]}
      emptyTitle="No products found"
      emptyDescription="Try adjusting your search or filters."
    />
  );
}
