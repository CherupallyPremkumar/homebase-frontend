'use client';

import { suppliersApi } from '@homebase/api-client';
import { DataTable, StateBadge } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { Supplier } from '@homebase/types';
import Link from 'next/link';

const columns: ColumnDef<Supplier, unknown>[] = [
  {
    accessorKey: 'businessName',
    header: 'Business',
    cell: ({ row }) => (
      <Link href={`/suppliers/${row.original.id}`} className="font-medium hover:text-primary">
        {row.original.businessName}
      </Link>
    ),
  },
  { accessorKey: 'contactPerson', header: 'Contact' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => row.original.rating ? `${row.original.rating.toFixed(1)} / 5` : 'N/A',
  },
  { accessorKey: 'productCount', header: 'Products' },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export function SupplierList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Suppliers</h1>
      <DataTable
        columns={columns}
        queryKey="platform-suppliers"
        queryFn={suppliersApi.search}
        searchable
        searchPlaceholder="Search suppliers..."
        emptyTitle="No suppliers found"
      />
    </div>
  );
}
