'use client';

import { shippingApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { Shipment } from '@homebase/types';

const columns: ColumnDef<Shipment, unknown>[] = [
  { accessorKey: 'trackingNumber', header: 'Tracking #', cell: ({ row }) => row.original.trackingNumber || 'Pending' },
  { accessorKey: 'orderId', header: 'Order ID' },
  { accessorKey: 'carrier', header: 'Carrier', cell: ({ row }) => row.original.carrier || 'N/A' },
  { accessorKey: 'estimatedDelivery', header: 'Est. Delivery', cell: ({ row }) => row.original.estimatedDelivery ? formatDate(row.original.estimatedDelivery) : 'N/A' },
  { accessorKey: 'stateId', header: 'Status', cell: ({ row }) => <StateBadge state={row.original.stateId} /> },
];

export function ShipmentList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shipments</h1>
      <DataTable columns={columns} queryKey="admin-shipments" queryFn={shippingApi.search} searchable emptyTitle="No shipments found" />
    </div>
  );
}
