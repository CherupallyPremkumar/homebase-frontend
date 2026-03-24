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
          fields: [
            { type: 'text', value: `Brand: ${item.brand || 'N/A'}` },
            { type: 'text', value: `Category: ${item.categoryId || 'N/A'}` },
          ],
          state: item.stateId,
        }),
      }}
    />
  );
}
