'use client';

import { EntityList, formatNumber } from '@homebase/ui';
import { inventoryApi } from '@homebase/api-client';

export function SellerInventoryList() {
  return (
    <EntityList
      title="Inventory"
      subtitle="Track stock levels across your products"
      queryKey="seller-inventory"
      queryFn={inventoryApi.search}
      display="table"
      searchable
      searchPlaceholder="Search by SKU or product..."
      emptyTitle="No inventory data"
      emptyDescription="Add products and stock to see inventory here."
      columns={[
        { key: 'sku', header: 'SKU', render: (item) => <span className="font-mono text-sm">{item.sku}</span> },
        { key: 'productId', header: 'Product ID' },
        { key: 'primaryFc', header: 'Fulfillment Center' },
        { key: 'quantity', header: 'Total Stock', type: 'number' },
        { key: 'reserved', header: 'Reserved', type: 'number' },
        {
          key: 'availableQuantity',
          header: 'Available',
          render: (item) => {
            const qty = item.availableQuantity ?? 0;
            const threshold = item.lowStockThreshold ?? 0;
            const color = qty === 0 ? 'text-red-600' : qty <= threshold ? 'text-yellow-600' : 'text-green-600';
            return <span className={`font-medium ${color}`}>{formatNumber(qty)}</span>;
          },
        },
        { key: 'stateId', header: 'State', type: 'state' },
      ]}
    />
  );
}
