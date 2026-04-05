import { ImageIcon } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import type { ProductDetailData } from '../types';

interface ProductDetailBasicInfoProps {
  product: ProductDetailData;
  imageStyle?: string;
}

export function ProductDetailBasicInfo({ product, imageStyle }: ProductDetailBasicInfoProps) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Basic information">
      <h3 className="mb-4 font-semibold text-gray-900">Basic Information</h3>
      <div className="flex gap-6">
        <div className={cn('flex h-48 w-48 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-6xl', imageStyle)}>
          {product.emoji || <ImageIcon className="h-12 w-12 text-gray-300" />}
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Product Name</p>
            <p className="text-lg font-bold text-gray-900">{product.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">SKU</p>
              <p className="mt-1 inline-block rounded bg-gray-50 px-2 py-1 font-mono text-sm">{product.sku}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Category</p>
              <p className="mt-1 text-sm">{product.category}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Brand</p>
              <p className="mt-1 text-sm">{product.brand}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Listed Date</p>
              <p className="mt-1 text-sm">{product.listedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
