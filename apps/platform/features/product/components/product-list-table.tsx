'use client';

import { Checkbox } from '@homebase/ui';

import type { EnhancedProduct } from '../types';
import { ProductTableRow } from './product-table-row';

const COLUMNS = [
  { key: 'select', label: '', width: 'w-[1%]' },
  { key: 'product', label: 'Product', align: 'text-left' as const },
  { key: 'rating', label: 'Rating', align: 'text-center' as const },
  { key: 'reviews', label: 'Reviews', align: 'text-center' as const },
  { key: 'price', label: 'Price', align: 'text-right' as const },
  { key: 'stock', label: 'Stock', align: 'text-center' as const },
  { key: 'tier', label: 'Seller Tier', align: 'text-center' as const },
  { key: 'violations', label: 'Violations', align: 'text-center' as const },
  { key: 'status', label: 'Status', align: 'text-left' as const },
  { key: 'actions', label: 'Actions', align: 'text-right' as const },
];

interface ProductListTableProps {
  products: EnhancedProduct[];
  isAllSelected: boolean;
  isSelected: (id: string) => boolean;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}

export function ProductListTable({
  products, isAllSelected, isSelected, onToggle, onToggleAll,
}: ProductListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-[1%] px-6 py-3">
              <Checkbox checked={isAllSelected} onCheckedChange={onToggleAll} />
            </th>
            {COLUMNS.slice(1).map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 ${col.align} ${col.key === 'product' ? 'px-0' : ''} ${col.key === 'actions' ? 'px-6' : ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <ProductTableRow
              key={p.id}
              product={p}
              isSelected={isSelected(p.id)}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
