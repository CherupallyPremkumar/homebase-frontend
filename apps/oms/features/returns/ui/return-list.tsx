'use client';

import Link from 'next/link';
import { returnRequestsApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate, formatPriceRupees } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReturnRequest } from '@homebase/types';

const columns: ColumnDef<ReturnRequest, unknown>[] = [
  {
    accessorKey: 'id',
    header: 'Return #',
    cell: ({ row }) => (
      <Link href={`/returns/${row.original.id}`} className="font-medium hover:text-primary">
        {row.original.id.slice(0, 8)}...
      </Link>
    ),
  },
  {
    accessorKey: 'productName',
    header: 'Product',
    cell: ({ row }) => row.original.productName || 'N/A',
  },
  {
    accessorKey: 'userId',
    header: 'Customer',
    cell: ({ row }) => row.original.userId || 'N/A',
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate text-sm">{row.original.reason || 'N/A'}</span>
    ),
  },
  {
    accessorKey: 'refundAmount',
    header: 'Refund',
    cell: ({ row }) => row.original.refundAmount ? formatPriceRupees(row.original.refundAmount) : 'N/A',
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

export function ReturnList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Return Requests</h1>
      <DataTable
        columns={columns}
        queryKey="oms-returns"
        queryFn={returnRequestsApi.search}
        searchable
        searchPlaceholder="Search returns..."
        emptyTitle="No return requests"
      />
    </div>
  );
}
