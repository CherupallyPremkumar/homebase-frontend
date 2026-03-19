'use client';

import { rulesEngineApi } from '@homebase/api-client';
import { DataTable, StateBadge } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { RuleSet } from '@homebase/types';
import Link from 'next/link';

const columns: ColumnDef<RuleSet, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link href={`/settings/rules/${row.original.id}`} className="font-medium hover:text-primary">
        {row.original.name}
      </Link>
    ),
  },
  { accessorKey: 'policyType', header: 'Type' },
  { accessorKey: 'priority', header: 'Priority' },
  {
    accessorKey: 'rules',
    header: 'Rules',
    cell: ({ row }) => `${row.original.rules.length} rule(s)`,
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export function RulesetList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Rules Engine</h1>
      <DataTable
        columns={columns}
        queryKey="platform-rules"
        queryFn={rulesEngineApi.searchRuleSets}
        searchable
        searchPlaceholder="Search rule sets..."
        emptyTitle="No rule sets"
      />
    </div>
  );
}
