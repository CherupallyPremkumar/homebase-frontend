'use client';

import { EntityList } from '@homebase/ui';
import { productsApi } from '@homebase/api-client';

export function ProductList() {
  return (
    <EntityList
      title="Products"
      queryKey="platform-products"
      queryFn={productsApi.search}
      display="table"
      searchable
      searchPlaceholder="Search products..."
      createAction={{ label: 'New Product', href: '/products/new' }}
      emptyTitle="No products found"
      columns={[
        { key: 'name', header: 'Product', linkTo: (item) => `/products/${item.id}` },
        { key: 'sku', header: 'SKU' },
        { key: 'sellingPrice', header: 'Price', type: 'price' },
        { key: 'stateId', header: 'Status', type: 'state' },
        { key: 'createdTime', header: 'Created', type: 'date' },
      ]}
    />
  );
}
