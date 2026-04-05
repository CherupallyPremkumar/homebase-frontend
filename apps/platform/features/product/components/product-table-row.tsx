'use client';

import Link from 'next/link';
import { Star, Eye, Check, X, Pause, ImageIcon } from 'lucide-react';
import { Checkbox } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

import type { EnhancedProduct } from '../types';
import { SellerTierBadge } from './seller-tier-badge';
import { ViolationBadge } from './violation-badge';

const STATUS_STYLE: Record<string, { dot: string; bg: string; text: string }> = {
  Published: { dot: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  'Under Review': { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  Suspended: { dot: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-700' },
  Draft: { dot: 'bg-gray-400', bg: 'bg-gray-100', text: 'text-gray-600' },
};

interface ProductTableRowProps {
  product: EnhancedProduct;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function ProductTableRow({ product: p, isSelected, onToggle }: ProductTableRowProps) {
  const style = STATUS_STYLE[p.status] ?? STATUS_STYLE.Draft;
  const isSuspended = p.status === 'Suspended';

  return (
    <tr className={cn('transition-colors hover:bg-brand-50/40', isSuspended && 'bg-orange-50/30')}>
      <td className="px-6 py-5">
        <Checkbox checked={isSelected} onCheckedChange={() => onToggle(p.id)} />
      </td>
      <td className="py-5">
        <div className="flex items-start gap-3">
          <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100', isSuspended && 'opacity-60')}>
            <ImageIcon className="h-6 w-6 text-gray-300" />
          </div>
          <div className="min-w-0">
            <Link href={`/products/${p.id}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline">
              {p.name}
            </Link>
            <p className="mt-0.5 font-mono text-[11px] text-gray-400">SKU: {p.sku}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">{p.categoryBreadcrumb}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[11px] text-gray-400">
                by <Link href={p.sellerHref} className="text-brand-600 hover:underline">{p.sellerName}</Link>
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-[11px] text-gray-400">{p.variantCount} variants</span>
            </div>
            {p.suspensionReason && (
              <p className="mt-1 text-[10px] text-red-500">Reason: {p.suspensionReason}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-3 py-5 text-center align-top">
        {p.rating != null ? (
          <>
            <div className="flex items-center justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn('h-3.5 w-3.5', i < Math.round(p.rating!) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} fill={i < Math.round(p.rating!) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <p className="mt-0.5 text-[10px] text-gray-400">{p.rating}</p>
          </>
        ) : (
          <span className="text-xs italic text-gray-300">No rating</span>
        )}
      </td>
      <td className="px-3 py-5 text-center align-top">
        <span className={cn('text-sm font-medium', p.reviewCount > 0 ? 'text-gray-700' : 'text-gray-300')}>
          {p.reviewCount}
        </span>
      </td>
      <td className="px-3 py-5 text-right align-top">
        <span className={cn('text-sm font-semibold', p.status === 'Draft' ? 'text-gray-500' : 'text-gray-900')}>
          {p.price}
        </span>
      </td>
      <td className="px-3 py-5 text-center align-top">
        <p className={cn('text-sm font-medium', p.stock === 0 ? 'text-red-600' : p.stock < 20 ? 'text-amber-600' : 'text-green-700')}>
          {p.stock === 0 && p.status === 'Suspended' ? '0' : p.stock === 0 && p.status === 'Draft' ? '-' : p.stock}
        </p>
        {p.stock > 0 && <p className="text-[10px] text-gray-400">{p.reservedStock} reserved</p>}
        {p.stock === 0 && p.status === 'Suspended' && <p className="text-[10px] text-gray-400">frozen</p>}
      </td>
      <td className="px-3 py-5 text-center align-top">
        <SellerTierBadge tier={p.sellerTier} />
      </td>
      <td className="px-3 py-5 text-center align-top">
        <ViolationBadge count={p.violationCount} />
      </td>
      <td className="px-3 py-5 align-top">
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', style.bg, style.text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
          {p.status}
        </span>
      </td>
      <td className="px-6 py-5 align-top">
        <div className="flex items-center justify-end gap-1.5">
          {p.status === 'Published' && (
            <>
              <Link href={`/products/${p.id}`} className="rounded-md p-1.5 text-gray-400 transition hover:bg-brand-50 hover:text-brand-500" title="View">
                <Eye className="h-4 w-4" />
              </Link>
              <button className="rounded-md p-1.5 text-orange-500 transition hover:bg-orange-50" title="Suspend">
                <Pause className="h-4 w-4" />
              </button>
            </>
          )}
          {p.status === 'Under Review' && (
            <>
              <button className="rounded-md p-1.5 text-green-600 transition hover:bg-green-50" title="Approve">
                <Check className="h-4 w-4" />
              </button>
              <button className="rounded-md p-1.5 text-red-500 transition hover:bg-red-50" title="Reject">
                <X className="h-4 w-4" />
              </button>
            </>
          )}
          {p.status === 'Suspended' && (
            <button className="rounded-md p-1.5 text-green-600 transition hover:bg-green-50" title="Reactivate">
              <Check className="h-4 w-4" />
            </button>
          )}
          {p.status === 'Draft' && (
            <button className="rounded-md px-2.5 py-1 text-xs font-medium text-brand-500 transition hover:bg-brand-50">
              Submit
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
