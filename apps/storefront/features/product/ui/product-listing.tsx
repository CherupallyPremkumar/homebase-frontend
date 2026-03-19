'use client';

import { EntityList } from '@homebase/ui';
import { catalogApi } from '@homebase/api-client';
import type { CatalogItem } from '@homebase/types';
import { ProductCard } from './product-card';

export function ProductListing() {
  return (
    <EntityList<CatalogItem>
      title="All Products"
      subtitle="Browse our complete collection"
      queryKey="storefront-products"
      queryFn={catalogApi.search}
      display="grid"
      searchable
      searchPlaceholder="Search products..."
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
