'use client';

import { X } from 'lucide-react';
import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Seller {
  name: string;
  initials: string;
  rating: number;
  productCount: number;
  memberSince: number;
  color?: string;
}

export interface SellerBannerProps {
  seller: Seller;
  onClear?: () => void;
  visible?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SellerBanner({
  seller,
  onClear,
  visible = false,
  className,
}: SellerBannerProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'border-b border-brand-100 bg-gradient-to-r from-brand-50 to-orange-50',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: seller.color ?? '#F97316' }}
          >
            {seller.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F1B2D]">{seller.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{'\u2B50'} {seller.rating}</span>
              <span>&middot;</span>
              <span>{seller.productCount.toLocaleString()} products</span>
              <span>&middot;</span>
              <span>Member since {seller.memberSince}</span>
            </div>
          </div>
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-medium text-brand-500 hover:underline"
          >
            <X className="h-3 w-3" />
            Clear Filter
          </button>
        )}
      </div>
    </div>
  );
}
