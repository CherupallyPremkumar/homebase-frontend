'use client';

import { productsApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatPriceRupees, formatDate } from '@homebase/shared';
import { Button } from '@homebase/ui';
import type { ColumnDef } from '@tanstack/react-table';
import type { Product } from '@homebase/types';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) => (
      <Link href={`/products/${row.original.id}`} className="font-medium hover:text-primary">
        {row.original.name}
      </Link>
    ),
  },
  { accessorKey: 'sku', header: 'SKU' },
  {
    accessorKey: 'sellingPrice',
    header: 'Price',
    cell: ({ row }) => formatPriceRupees(row.original.sellingPrice),
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
  {
    accessorKey: 'createdTime',
    header: 'Created',
    cell: ({ row }) => formatDate(row.original.createdTime),
  },
];

export function ProductList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/products/new">
          <Button><Plus className="mr-1 h-4 w-4" />New Product</Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        queryKey="admin-products"
        queryFn={productsApi.search}
        searchable
        searchPlaceholder="Search products..."
        emptyTitle="No products found"
      />
    </div>
  );
}
