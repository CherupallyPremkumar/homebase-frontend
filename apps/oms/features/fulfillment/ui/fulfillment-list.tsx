'use client';

import Link from 'next/link';
import { fulfillmentApi } from '@homebase/api-client';
import { DataTable, StateBadge } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { FulfillmentOrder } from '@homebase/types';

const columns: ColumnDef<FulfillmentOrder, unknown>[] = [
  {
    accessorKey: 'orderId',
    header: 'Order',
    cell: ({ row }) => (
      <Link href={`/fulfillment/${row.original.id}`} className="font-medium hover:text-primary">
        {row.original.orderId.slice(0, 8)}...
      </Link>
    ),
  },
  { accessorKey: 'warehouseId', header: 'Warehouse' },
  {
    accessorKey: 'lineItems',
    header: 'Items',
    cell: ({ row }) => `${row.original.lineItems.length} item(s)`,
  },
  { accessorKey: 'carrier', header: 'Carrier', cell: ({ row }) => row.original.carrier || 'N/A' },
  { accessorKey: 'stateId', header: 'State', cell: ({ row }) => <StateBadge state={row.original.stateId} /> },
];

export function FulfillmentList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fulfillment</h1>
      <DataTable
        columns={columns}
        queryKey="oms-fulfillment"
        queryFn={fulfillmentApi.search}
        searchable
        searchPlaceholder="Search fulfillment orders..."
        emptyTitle="No fulfillment orders"
      />
    </div>
  );
}
