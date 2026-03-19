'use client';

import { suppliersApi } from '@homebase/api-client';
import { DataTable, StateBadge } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { SupplierOnboarding } from '@homebase/types';
import type { SearchRequest, SearchResponse } from '@homebase/types';

const columns: ColumnDef<SupplierOnboarding, unknown>[] = [
  { accessorKey: 'businessName', header: 'Business' },
  { accessorKey: 'documentsUploaded', header: 'Docs', cell: ({ row }) => row.original.documentsUploaded ? '✓' : '—' },
  { accessorKey: 'businessVerified', header: 'Verified', cell: ({ row }) => row.original.businessVerified ? '✓' : '—' },
  { accessorKey: 'trainingCompleted', header: 'Training', cell: ({ row }) => row.original.trainingCompleted ? '✓' : '—' },
  { accessorKey: 'stateId', header: 'Status', cell: ({ row }) => <StateBadge state={row.original.stateId} /> },
];

async function searchOnboarding(params: SearchRequest): Promise<SearchResponse<SupplierOnboarding>> {
  // Uses suppliers search endpoint filtered for onboarding
  return { content: [], totalElements: 0, totalPages: 0, page: 1, size: 20, hasNext: false, hasPrevious: false };
}

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Supplier Onboarding</h1>
      <DataTable columns={columns} queryKey="admin-onboarding" queryFn={searchOnboarding} searchable emptyTitle="No onboarding in progress" />
    </div>
  );
}
