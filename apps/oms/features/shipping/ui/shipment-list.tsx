'use client';

import Link from 'next/link';
import { shippingApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { Shipment } from '@homebase/types';

const columns: ColumnDef<Shipment, unknown>[] = [
  {
    accessorKey: 'trackingNumber',
    header: 'Tracking #',
    cell: ({ row }) => (
      <Link href={`/shipments/${row.original.id}`} className="font-medium hover:text-primary">
        {row.original.trackingNumber || 'Pending'}
      </Link>
    ),
  },
  {
    accessorKey: 'orderId',
    header: 'Order',
    cell: ({ row }) => (
      <Link href={`/orders/${row.original.orderId}`} className="hover:text-primary">
        {row.original.orderId.slice(0, 8)}...
      </Link>
    ),
  },
  { accessorKey: 'carrier', header: 'Carrier', cell: ({ row }) => row.original.carrier || 'N/A' },
  {
    accessorKey: 'estimatedDelivery',
    header: 'Est. Delivery',
    cell: ({ row }) => row.original.estimatedDelivery ? formatDate(row.original.estimatedDelivery) : 'N/A',
  },
  { accessorKey: 'stateId', header: 'State', cell: ({ row }) => <StateBadge state={row.original.stateId} /> },
];

export function ShipmentList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shipments</h1>
      <DataTable
        columns={columns}
        queryKey="oms-shipments"
        queryFn={shippingApi.search}
        searchable
        searchPlaceholder="Search by tracking #..."
        emptyTitle="No shipments found"
      />
    </div>
  );
}
