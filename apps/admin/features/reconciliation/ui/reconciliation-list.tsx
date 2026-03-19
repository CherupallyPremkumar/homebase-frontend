'use client';

import { reconciliationApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate, formatNumber } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReconciliationBatch } from '@homebase/types';

const columns: ColumnDef<ReconciliationBatch, unknown>[] = [
  { accessorKey: 'batchDate', header: 'Date', cell: ({ row }) => formatDate(row.original.batchDate) },
  { accessorKey: 'gatewayName', header: 'Gateway' },
  { accessorKey: 'totalTransactions', header: 'Total', cell: ({ row }) => formatNumber(row.original.totalTransactions) },
  { accessorKey: 'matchedCount', header: 'Matched', cell: ({ row }) => formatNumber(row.original.matchedCount) },
  { accessorKey: 'mismatchedCount', header: 'Mismatches', cell: ({ row }) => {
    const count = row.original.mismatchedCount;
    return <span className={count > 0 ? 'font-medium text-red-600' : ''}>{formatNumber(count)}</span>;
  }},
  { accessorKey: 'stateId', header: 'Status', cell: ({ row }) => <StateBadge state={row.original.stateId} /> },
];

export function ReconciliationList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reconciliation</h1>
      <DataTable columns={columns} queryKey="admin-reconciliation" queryFn={reconciliationApi.search} searchable emptyTitle="No batches" />
    </div>
  );
}
