'use client';

import { DataTable, StateBadge } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { SupplierOnboarding, SearchRequest, SearchResponse } from '@homebase/types';

const columns: ColumnDef<SupplierOnboarding, unknown>[] = [
  { accessorKey: 'businessName', header: 'Business' },
  {
    accessorKey: 'documentsUploaded',
    header: 'Docs',
    cell: ({ row }) => row.original.documentsUploaded ? '\u2713' : '\u2014',
  },
  {
    accessorKey: 'businessVerified',
    header: 'Verified',
    cell: ({ row }) => row.original.businessVerified ? '\u2713' : '\u2014',
  },
  {
    accessorKey: 'trainingCompleted',
    header: 'Training',
    cell: ({ row }) => row.original.trainingCompleted ? '\u2713' : '\u2014',
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

async function searchOnboarding(params: SearchRequest): Promise<SearchResponse<SupplierOnboarding>> {
  return { content: [], totalElements: 0, totalPages: 0, page: 1, size: 20, hasNext: false, hasPrevious: false };
}

export function OnboardingList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Supplier Onboarding</h1>
      <DataTable
        columns={columns}
        queryKey="platform-onboarding"
        queryFn={searchOnboarding}
        searchable
        emptyTitle="No onboarding in progress"
      />
    </div>
  );
}
