'use client';

import { reconciliationApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate, formatNumber } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReconciliationBatch } from '@homebase/types';
import Link from 'next/link';

const columns: ColumnDef<ReconciliationBatch, unknown>[] = [
  {
    accessorKey: 'batchDate',
    header: 'Date',
    cell: ({ row }) => (
      <Link href={`/reconciliation/${row.original.id}`} className="font-medium text-primary hover:underline">
        {formatDate(row.original.batchDate)}
      </Link>
    ),
  },
  { accessorKey: 'gatewayName', header: 'Gateway' },
  {
    accessorKey: 'totalTransactions',
    header: 'Total Txns',
    cell: ({ row }) => formatNumber(row.original.totalTransactions),
  },
  {
    accessorKey: 'matchedCount',
    header: 'Matched',
    cell: ({ row }) => (
      <span className="text-green-600">{formatNumber(row.original.matchedCount)}</span>
    ),
  },
  {
    accessorKey: 'mismatchedCount',
    header: 'Mismatches',
    cell: ({ row }) => {
      const count = row.original.mismatchedCount;
      return <span className={count > 0 ? 'font-medium text-red-600' : ''}>{formatNumber(count)}</span>;
    },
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export function ReconciliationList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reconciliation</h1>
      <DataTable
        columns={columns}
        queryKey="finance-reconciliation"
        queryFn={reconciliationApi.search}
        searchable
        emptyTitle="No reconciliation batches"
        emptyDescription="Batches will appear here after daily reconciliation runs."
      />
    </div>
  );
}
