'use client';

import { suppliersApi } from '@homebase/api-client';
import { DataTable, StateBadge } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { Supplier } from '@homebase/types';

const columns: ColumnDef<Supplier, unknown>[] = [
  { accessorKey: 'businessName', header: 'Business' },
  { accessorKey: 'contactPerson', header: 'Contact' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'productCount', header: 'Products' },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => row.original.rating ? `${row.original.rating.toFixed(1)} ★` : 'N/A',
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Suppliers</h1>
      <DataTable
        columns={columns}
        queryKey="admin-suppliers"
        queryFn={suppliersApi.search}
        searchable
        searchPlaceholder="Search suppliers..."
        emptyTitle="No suppliers found"
      />
    </div>
  );
}
