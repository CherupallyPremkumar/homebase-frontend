'use client';

import Link from 'next/link';
import { supportApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatDate } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { SupportTicket } from '@homebase/types';

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-gray-100 text-gray-700',
};

const columns: ColumnDef<SupportTicket, unknown>[] = [
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <Link href={`/support/${row.original.id}`} className="font-medium hover:text-primary">
        {row.original.subject}
      </Link>
    ),
  },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const p = row.original.priority;
      return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[p] || PRIORITY_STYLES.LOW}`}>
          {p}
        </span>
      );
    },
  },
  {
    accessorKey: 'userId',
    header: 'Customer',
    cell: ({ row }) => row.original.userId || 'N/A',
  },
  {
    accessorKey: 'createdTime',
    header: 'Created',
    cell: ({ row }) => formatDate(row.original.createdTime),
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export function TicketList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Support Tickets</h1>
      <DataTable
        columns={columns}
        queryKey="oms-support"
        queryFn={supportApi.search}
        searchable
        searchPlaceholder="Search tickets..."
        emptyTitle="No tickets found"
      />
    </div>
  );
}
