'use client';

import { inventoryApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatNumber } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { InventoryItem } from '@homebase/types';

const columns: ColumnDef<InventoryItem, unknown>[] = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'productName', header: 'Product' },
  { accessorKey: 'warehouseName', header: 'Warehouse' },
  {
    accessorKey: 'quantity',
    header: 'Total',
    cell: ({ row }) => formatNumber(row.original.quantity),
  },
  {
    accessorKey: 'reservedQuantity',
    header: 'Reserved',
    cell: ({ row }) => formatNumber(row.original.reservedQuantity),
  },
  {
    accessorKey: 'availableQuantity',
    header: 'Available',
    cell: ({ row }) => {
      const qty = row.original.availableQuantity;
      const color = qty === 0 ? 'text-red-600' : qty < row.original.reorderLevel ? 'text-yellow-600' : 'text-green-600';
      return <span className={`font-medium ${color}`}>{formatNumber(qty)}</span>;
    },
  },
  {
    accessorKey: 'stateId',
    header: 'State',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>
      <DataTable
        columns={columns}
        queryKey="admin-inventory"
        queryFn={inventoryApi.search}
        searchable
        searchPlaceholder="Search by SKU or product..."
        emptyTitle="No inventory items"
      />
    </div>
  );
}
