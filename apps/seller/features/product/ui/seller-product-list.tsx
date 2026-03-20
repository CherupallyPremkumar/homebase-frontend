'use client';

import { EntityList } from '@homebase/ui';
import { productsApi } from '@homebase/api-client';

export function SellerProductList() {
  return (
    <EntityList
      title="My Products"
      subtitle="Manage your product listings"
      queryKey="seller-products"
      queryFn={productsApi.search}
      display="grid"
      searchable
      searchPlaceholder="Search your products..."
      createAction={{ label: 'Add Product', href: '/products/new' }}
      emptyTitle="No products yet"
      emptyDescription="List your first product to start selling."
      cardConfig={{
        variant: 'vertical',
        map: (item) => ({
          title: item.name,
          href: `/products/${item.id}`,
          image: item.media?.[0]?.url ? { src: item.media[0].url, alt: item.name } : undefined,
          fields: [
            { type: 'price', value: item.sellingPrice, extra: item.mrp > item.sellingPrice ? item.mrp : undefined },
            { type: 'text', value: `SKU: ${item.sku || 'N/A'}` },
          ],
          state: item.stateId,
        }),
      }}
    />
  );
}
