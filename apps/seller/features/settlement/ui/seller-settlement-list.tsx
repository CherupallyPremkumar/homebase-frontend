'use client';

import Link from 'next/link';
import { settlementsApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatPriceRupees, formatDate } from '@homebase/shared';
import { Button, Card, CardContent } from '@homebase/ui';
import type { ColumnDef } from '@tanstack/react-table';
import type { Settlement } from '@homebase/types';
import { Wallet, Eye } from 'lucide-react';

const columns: ColumnDef<Settlement, unknown>[] = [
  {
    accessorKey: 'periodStart',
    header: 'Period',
    cell: ({ row }) => (
      <span className="text-sm">{formatDate(row.original.periodStart)} — {formatDate(row.original.periodEnd)}</span>
    ),
  },
  {
    accessorKey: 'grossAmount',
    header: 'Gross Sales',
    cell: ({ row }) => formatPriceRupees(row.original.grossAmount),
  },
  {
    accessorKey: 'commission',
    header: 'Commission',
    cell: ({ row }) => (
      <span className="text-red-600">-{formatPriceRupees(row.original.commission)}</span>
    ),
  },
  {
    accessorKey: 'netPayout',
    header: 'Net Payout',
    cell: ({ row }) => <span className="font-bold text-green-600">{formatPriceRupees(row.original.netPayout)}</span>,
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link href={`/settlements/${row.original.id}`}>
        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
      </Link>
    ),
  },
];

export function SellerSettlementList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settlements</h1>
        <p className="text-sm text-gray-500">Your payout history and upcoming settlements</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Next Payout</p>
            <p className="mt-1 text-2xl font-bold text-green-600">—</p>
            <p className="text-xs text-gray-400">Estimated date: —</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">This Month</p>
            <p className="mt-1 text-2xl font-bold">—</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Earned</p>
            <p className="mt-1 text-2xl font-bold">—</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        queryKey="seller-settlements"
        queryFn={settlementsApi.search}
        searchable={false}
        emptyTitle="No settlements yet"
        emptyDescription="Settlements will appear after your first order is delivered."
      />
    </div>
  );
}
