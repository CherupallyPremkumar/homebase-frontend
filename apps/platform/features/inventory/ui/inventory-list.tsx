'use client';

import { inventoryApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatNumber } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';

// Use the actual fields returned by the inventory query, not the domain type
interface InventoryRow {
  id: string;
  sku: string;
  productId: string;
  variantId?: string;
  quantity: number;
  availableQuantity: number;
  reserved: number;
  damagedQuantity: number;
  inboundQuantity: number;
  lowStockThreshold: number;
  status: string;
  primaryFc: string;
  stateId: string;
}

const columns: ColumnDef<InventoryRow, unknown>[] = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'productId', header: 'Product ID' },
  { accessorKey: 'primaryFc', header: 'Fulfillment Center' },
  {
    accessorKey: 'quantity',
    header: 'Total',
    cell: ({ row }) => formatNumber(row.original.quantity ?? 0),
  },
  {
    accessorKey: 'reserved',
    header: 'Reserved',
    cell: ({ row }) => formatNumber(row.original.reserved ?? 0),
  },
  {
    accessorKey: 'availableQuantity',
    header: 'Available',
    cell: ({ row }) => {
      const qty = row.original.availableQuantity ?? 0;
      const threshold = row.original.lowStockThreshold ?? 0;
      const color = qty === 0 ? 'text-red-600' : qty <= threshold ? 'text-yellow-600' : 'text-green-600';
      return <span className={`font-medium ${color}`}>{formatNumber(qty)}</span>;
    },
  },
  {
    accessorKey: 'stateId',
    header: 'State',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export function InventoryList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>
      <DataTable
        columns={columns as any}
        queryKey="platform-inventory"
        queryFn={inventoryApi.search as any}
        searchable
        searchPlaceholder="Search by SKU or product..."
        emptyTitle="No inventory items"
      />
    </div>
  );
}
