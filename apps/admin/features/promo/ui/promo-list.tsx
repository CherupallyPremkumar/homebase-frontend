'use client';

import Link from 'next/link';
import { promosApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate, formatPriceRupees } from '@homebase/shared';
import { Button } from '@homebase/ui';
import type { ColumnDef } from '@tanstack/react-table';
import type { Coupon } from '@homebase/types';
import { Plus } from 'lucide-react';

const columns: ColumnDef<Coupon, unknown>[] = [
  { accessorKey: 'code', header: 'Code', cell: ({ row }) => <span className="font-mono font-medium">{row.original.code}</span> },
  { accessorKey: 'discountType', header: 'Type' },
  {
    accessorKey: 'discountValue',
    header: 'Discount',
    cell: ({ row }) => row.original.discountType === 'PERCENTAGE' ? `${row.original.discountValue}%` : formatPriceRupees(row.original.discountValue),
  },
  {
    accessorKey: 'usedCount',
    header: 'Usage',
    cell: ({ row }) => `${row.original.usedCount}${row.original.usageLimit ? `/${row.original.usageLimit}` : ''}`,
  },
  {
    accessorKey: 'validUntil',
    header: 'Expires',
    cell: ({ row }) => formatDate(row.original.validUntil),
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export function PromoList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Link href="/promotions/new"><Button><Plus className="mr-1 h-4 w-4" />New Coupon</Button></Link>
      </div>
      <DataTable
        columns={columns}
        queryKey="admin-promotions"
        queryFn={promosApi.search}
        searchable
        searchPlaceholder="Search coupons..."
        emptyTitle="No coupons found"
      />
    </div>
  );
}
