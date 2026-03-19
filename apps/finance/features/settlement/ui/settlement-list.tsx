'use client';

import { settlementsApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatPriceRupees, formatDate } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { Settlement } from '@homebase/types';
import Link from 'next/link';

const columns: ColumnDef<Settlement, unknown>[] = [
  {
    accessorKey: 'supplierName',
    header: 'Supplier',
    cell: ({ row }) => (
      <Link href={`/settlements/${row.original.id}`} className="font-medium text-primary hover:underline">
        {row.original.supplierName || row.original.supplierId}
      </Link>
    ),
  },
  {
    accessorKey: 'periodStart',
    header: 'Period',
    cell: ({ row }) => `${formatDate(row.original.periodStart)} \u2014 ${formatDate(row.original.periodEnd)}`,
  },
  {
    accessorKey: 'grossAmount',
    header: 'Gross',
    cell: ({ row }) => formatPriceRupees(row.original.grossAmount),
  },
  {
    accessorKey: 'commission',
    header: 'Commission',
    cell: ({ row }) => formatPriceRupees(row.original.commission),
  },
  {
    accessorKey: 'netPayout',
    header: 'Net Payout',
    cell: ({ row }) => <span className="font-semibold">{formatPriceRupees(row.original.netPayout)}</span>,
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export function SettlementList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settlements</h1>
      <DataTable
        columns={columns}
        queryKey="finance-settlements"
        queryFn={settlementsApi.search}
        searchable
        emptyTitle="No settlements"
        emptyDescription="Settlements will appear here once orders are completed and payouts are calculated."
      />
    </div>
  );
}
