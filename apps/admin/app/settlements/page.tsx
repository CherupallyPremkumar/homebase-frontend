'use client';

import { settlementsApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatPriceRupees, formatDate } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { Settlement } from '@homebase/types';

const columns: ColumnDef<Settlement, unknown>[] = [
  { accessorKey: 'supplierName', header: 'Supplier' },
  { accessorKey: 'periodStart', header: 'Period', cell: ({ row }) => `${formatDate(row.original.periodStart)} — ${formatDate(row.original.periodEnd)}` },
  { accessorKey: 'grossAmount', header: 'Gross', cell: ({ row }) => formatPriceRupees(row.original.grossAmount) },
  { accessorKey: 'netPayout', header: 'Net Payout', cell: ({ row }) => formatPriceRupees(row.original.netPayout) },
  { accessorKey: 'stateId', header: 'Status', cell: ({ row }) => <StateBadge state={row.original.stateId} /> },
];

export default function SettlementsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settlements</h1>
      <DataTable columns={columns} queryKey="admin-settlements" queryFn={settlementsApi.search} searchable emptyTitle="No settlements" />
    </div>
  );
}
