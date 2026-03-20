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
        { key: 'productName', header: 'Product' },
        { key: 'warehouseName', header: 'Warehouse' },
        { key: 'quantity', header: 'Total Stock', type: 'number' },
        { key: 'reservedQuantity', header: 'Reserved', type: 'number' },
        {
          key: 'availableQuantity',
          header: 'Available',
          render: (item) => {
            const qty = item.availableQuantity;
            const reorder = item.reorderLevel;
            const color = qty === 0 ? 'text-red-600' : qty <= reorder ? 'text-yellow-600' : 'text-green-600';
            return <span className={`font-medium ${color}`}>{formatNumber(qty)}</span>;
          },
        },
        { key: 'stateId', header: 'State', type: 'state' },
      ]}
    />
  );
}
