'use client';

import { supportApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { SupportTicket } from '@homebase/types';

const columns: ColumnDef<SupportTicket, unknown>[] = [
  { accessorKey: 'subject', header: 'Subject' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'priority', header: 'Priority', cell: ({ row }) => {
    const p = row.original.priority;
    const color = p === 'URGENT' ? 'text-red-600' : p === 'HIGH' ? 'text-orange-600' : p === 'MEDIUM' ? 'text-yellow-600' : 'text-gray-600';
    return <span className={`font-medium ${color}`}>{p}</span>;
  }},
  { accessorKey: 'createdTime', header: 'Created', cell: ({ row }) => formatDate(row.original.createdTime) },
  { accessorKey: 'stateId', header: 'Status', cell: ({ row }) => <StateBadge state={row.original.stateId} /> },
];

export function SupportList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Support Tickets</h1>
      <DataTable columns={columns} queryKey="admin-support" queryFn={supportApi.search} searchable emptyTitle="No tickets found" />
    </div>
  );
}
