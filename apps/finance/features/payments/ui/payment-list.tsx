'use client';

import { getApiClient } from '@homebase/api-client';
import { DataTable, StateBadge, formatPriceRupees, formatDate } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { Payment, SearchRequest, SearchResponse } from '@homebase/types';
import Link from 'next/link';

const columns: ColumnDef<Payment, unknown>[] = [
  {
    accessorKey: 'orderId',
    header: 'Order',
    cell: ({ row }) => (
      <Link href={`/payments/${row.original.id}`} className="font-medium text-primary hover:underline">
        {row.original.orderId}
      </Link>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <span className="font-semibold">{formatPriceRupees(row.original.amount)}</span>,
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Method',
    cell: ({ row }) => row.original.paymentMethod?.replace(/_/g, ' ') || 'N/A',
  },
  {
    accessorKey: 'gatewayName',
    header: 'Gateway',
    cell: ({ row }) => row.original.gatewayName || 'N/A',
  },
  {
    accessorKey: 'createdTime',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdTime),
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

const searchPayments = (params: SearchRequest) =>
  getApiClient().post<SearchResponse<Payment>>('/api/v1/payments/search', params);

export function PaymentList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payments</h1>
      <DataTable
        columns={columns}
        queryKey="finance-payments"
        queryFn={searchPayments}
        searchable
        emptyTitle="No payments"
        emptyDescription="Payment records will appear here as transactions are processed."
      />
    </div>
  );
}
