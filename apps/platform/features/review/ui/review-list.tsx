'use client';

import { reviewsApi } from '@homebase/api-client';
import { DataTable, StateBadge } from '@homebase/shared';
import type { ColumnDef } from '@tanstack/react-table';
import type { Review } from '@homebase/types';
import Link from 'next/link';

const columns: ColumnDef<Review, unknown>[] = [
  {
    accessorKey: 'productId',
    header: 'Product',
    cell: ({ row }) => (
      <Link href={`/reviews/${row.original.id}`} className="font-medium hover:text-primary">
        {row.original.productId}
      </Link>
    ),
  },
  { accessorKey: 'userName', header: 'User' },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => `${row.original.rating} / 5`,
  },
  {
    accessorKey: 'isVerifiedPurchase',
    header: 'Verified',
    cell: ({ row }) => row.original.isVerifiedPurchase ? 'Yes' : 'No',
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
];

export function ReviewList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reviews</h1>
      <DataTable
        columns={columns}
        queryKey="platform-reviews"
        queryFn={reviewsApi.search}
        searchable
        searchPlaceholder="Search reviews..."
        emptyTitle="No reviews found"
      />
    </div>
  );
}
