'use client';

import { fulfillmentApi } from '@homebase/api-client';
import { DataTable, StateBadge } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { FulfillmentOrder } from '@homebase/types';

const columns: ColumnDef<FulfillmentOrder, unknown>[] = [
  { accessorKey: 'orderId', header: 'Order ID' },
  { accessorKey: 'warehouseId', header: 'Warehouse' },
  { accessorKey: 'carrier', header: 'Carrier', cell: ({ row }) => row.original.carrier || 'N/A' },
  { accessorKey: 'lineItems', header: 'Items', cell: ({ row }) => `${row.original.lineItems.length} item(s)` },
  { accessorKey: 'stateId', header: 'Status', cell: ({ row }) => <StateBadge state={row.original.stateId} /> },
];

export function FulfillmentList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fulfillment</h1>
      <DataTable columns={columns} queryKey="admin-fulfillment" queryFn={fulfillmentApi.search} searchable emptyTitle="No fulfillment orders" />
    </div>
  );
}
