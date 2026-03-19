'use client';

import { usersApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@homebase/types';
import Link from 'next/link';

const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: 'firstName',
    header: 'Name',
    cell: ({ row }) => (
      <Link href={`/users/${row.original.id}`} className="font-medium hover:text-primary">
        {row.original.firstName} {row.original.lastName}
      </Link>
    ),
  },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
  {
    accessorKey: 'createdTime',
    header: 'Joined',
    cell: ({ row }) => formatDate(row.original.createdTime),
  },
];

export function UserList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <DataTable
        columns={columns}
        queryKey="platform-users"
        queryFn={usersApi.search}
        searchable
        searchPlaceholder="Search users..."
        emptyTitle="No users found"
      />
    </div>
  );
}
