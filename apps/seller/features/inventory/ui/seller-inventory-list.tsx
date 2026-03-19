'use client';

import { inventoryApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatNumber } from '@homebase/shared';
import { Card, CardContent } from '@homebase/ui';
import type { ColumnDef } from '@tanstack/react-table';
import type { InventoryItem } from '@homebase/types';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const columns: ColumnDef<InventoryItem, unknown>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.sku}</span>,
  },
  { accessorKey: 'productName', header: 'Product' },
  { accessorKey: 'warehouseName', header: 'Warehouse' },
  {
    accessorKey: 'quantity',
    header: 'Total Stock',
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
      const reorder = row.original.reorderLevel;
      let icon = <CheckCircle className="h-4 w-4 text-green-500" />;
      let color = 'text-green-600';
      if (qty === 0) {
        icon = <XCircle className="h-4 w-4 text-red-500" />;
        color = 'text-red-600';
      } else if (qty <= reorder) {
        icon = <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        color = 'text-yellow-600';
      }
      return (
        <div className="flex items-center gap-1.5">
          {icon}
          <span className={`font-medium ${color}`}>{formatNumber(qty)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'stateId',
    header: 'State',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export function SellerInventoryList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-sm text-gray-500">Track stock levels across your products</p>
      </div>

      {/* Stock summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">In Stock</p>
              <p className="text-xl font-bold text-green-600">—</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-xl font-bold text-yellow-600">—</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-xl font-bold text-red-600">—</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        queryKey="seller-inventory"
        queryFn={inventoryApi.search}
        searchable
        searchPlaceholder="Search by SKU or product..."
        emptyTitle="No inventory data"
        emptyDescription="Add products and stock to see inventory here."
      />
    </div>
  );
}
