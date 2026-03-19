'use client';

import Link from 'next/link';
import { ordersApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatPriceRupees, formatDate } from '@homebase/shared';
import { Button } from '@homebase/ui';
import type { ColumnDef } from '@tanstack/react-table';
import type { Order } from '@homebase/types';
import { Eye } from 'lucide-react';

const columns: ColumnDef<Order, unknown>[] = [
  {
    accessorKey: 'orderNumber',
    header: 'Order',
    cell: ({ row }) => (
      <Link href={`/orders/${row.original.id}`} className="font-medium hover:text-primary">
        #{row.original.orderNumber}
      </Link>
    ),
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.items.slice(0, 2).map((item) => (
          <p key={item.id} className="truncate">{item.productName} × {item.quantity}</p>
        ))}
        {row.original.items.length > 2 && (
          <p className="text-xs text-gray-400">+{row.original.items.length - 2} more</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'total',
    header: 'Amount',
    cell: ({ row }) => <span className="font-medium">{formatPriceRupees(row.original.total)}</span>,
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
  {
    accessorKey: 'createdTime',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdTime),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link href={`/orders/${row.original.id}`}>
        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
      </Link>
    ),
  },
];

export function SellerOrderList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-gray-500">Orders containing your products</p>
      </div>
      <DataTable
        columns={columns}
        queryKey="seller-orders"
        queryFn={ordersApi.search}
        searchable
        searchPlaceholder="Search orders..."
        emptyTitle="No orders yet"
        emptyDescription="Orders will appear here when customers buy your products."
      />
    </div>
  );
}
