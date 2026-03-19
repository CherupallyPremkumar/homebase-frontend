'use client';

import Link from 'next/link';
import { productsApi } from '@homebase/api-client';
import { DataTable, StateBadge, formatPriceRupees, formatDate } from '@homebase/shared';
import { Button } from '@homebase/ui';
import type { ColumnDef } from '@tanstack/react-table';
import type { Product } from '@homebase/types';
import { Plus, Eye } from 'lucide-react';

const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.media?.[0]?.url ? (
          <img src={row.original.media[0].url} alt="" className="h-10 w-10 rounded object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">No img</div>
        )}
        <div>
          <Link href={`/products/${row.original.id}`} className="font-medium hover:text-primary">
            {row.original.name}
          </Link>
          <p className="text-xs text-gray-500">SKU: {row.original.sku || 'N/A'}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'sellingPrice',
    header: 'Price',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{formatPriceRupees(row.original.sellingPrice)}</p>
        {row.original.mrp > row.original.sellingPrice && (
          <p className="text-xs text-gray-400 line-through">{formatPriceRupees(row.original.mrp)}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'stateId',
    header: 'Status',
    cell: ({ row }) => <StateBadge state={row.original.stateId} />,
  },
  {
    accessorKey: 'createdTime',
    header: 'Listed',
    cell: ({ row }) => formatDate(row.original.createdTime),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link href={`/products/${row.original.id}`}>
        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
      </Link>
    ),
  },
];

export function SellerProductList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-sm text-gray-500">Manage your product listings</p>
        </div>
        <Link href="/products/new">
          <Button><Plus className="mr-1 h-4 w-4" />Add Product</Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        queryKey="seller-products"
        queryFn={productsApi.search}
        searchable
        searchPlaceholder="Search your products..."
        emptyTitle="No products yet"
        emptyDescription="List your first product to start selling."
      />
    </div>
  );
}
