'use client';

import Link from 'next/link';
import { ordersApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatPriceRupees, formatDate } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { Order } from '@homebase/types';

const columns: ColumnDef<Order, unknown>[] = [
  {
    accessorKey: 'orderNumber',
    header: 'Order #',
    cell: ({ row }) => (
      <Link href={`/orders/${row.original.id}`} className="font-medium hover:text-primary">
        #{row.original.orderNumber}
      </Link>
    ),
  },
  {
    accessorKey: 'userId',
    header: 'Customer',
    cell: ({ row }) => row.original.shippingAddress?.fullName ?? 'N/A',
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }) => `${row.original.items.length} item(s)`,
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => formatPriceRupees(row.original.total),
  },
  {
    accessorKey: 'stateId',
    header: 'State',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
  {
    accessorKey: 'createdTime',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdTime),
  },
];

export function OrderList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <DataTable
        columns={columns}
        queryKey="oms-orders"
        queryFn={ordersApi.search}
        searchable
        searchPlaceholder="Search by order #, customer..."
        emptyTitle="No orders found"
      />
    </div>
  );
}
