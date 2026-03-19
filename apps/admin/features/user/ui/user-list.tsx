'use client';

import { usersApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@homebase/types';

const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: 'firstName',
    header: 'Name',
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
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
        queryKey="admin-users"
        queryFn={usersApi.search}
        searchable
        searchPlaceholder="Search users..."
        emptyTitle="No users found"
      />
    </div>
  );
}
