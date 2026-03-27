'use client';

import Link from 'next/link';
import { Trash2, Loader2 } from 'lucide-react';
import { PriceDisplay, QuantitySelector } from '@homebase/shared';
import type { CartItem as CartItemType } from '@homebase/types';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  /** Whether a remove mutation is in progress */
  isRemoving?: boolean;
  /** Whether an update mutation is in progress */
  isUpdating?: boolean;
}

export function CartItem({ item, onRemove, onUpdateQuantity, isRemoving, isUpdating }: CartItemProps) {
  return (
    <div className="relative flex gap-4 rounded-lg border p-4">
      {/* Overlay during mutations */}
      {(isRemoving || isUpdating) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        </div>
      )}

      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <Link href={`/products/${item.productId}`} className="text-sm font-medium hover:text-primary">
          {item.productName}
        </Link>
        {item.variantName && <p className="text-xs text-gray-500">{item.variantName}</p>}
        <PriceDisplay price={item.unitPrice} mrp={item.mrp} size="sm" className="mt-1" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => onUpdateQuantity(item.id, qty)}
            max={item.maxQuantity}
          />
          <button
            onClick={() => {
              onRemove(item.id);
              toast('Item removed from cart', { action: { label: 'Undo', onClick: () => {} } });
            }}
            disabled={isRemoving}
            className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
