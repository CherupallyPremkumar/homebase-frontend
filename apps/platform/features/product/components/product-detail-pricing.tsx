import { formatPriceRupees } from '@homebase/shared';
import { cn } from '@homebase/ui/src/lib/utils';
import type { ProductDetailData } from '../types';

interface ProductDetailPricingProps {
  product: ProductDetailData;
  priceStyle?: string;
  stockLabel?: string;
  stockColor?: string;
}

export function ProductDetailPricing({ product, priceStyle, stockLabel, stockColor }: ProductDetailPricingProps) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Pricing and inventory">
      <h3 className="mb-4 font-semibold text-gray-900">Pricing &amp; Inventory</h3>
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-400">MRP</p>
          <p className={cn('text-lg font-bold text-gray-900', priceStyle)}>{formatPriceRupees(product.mrp)}</p>
        </div>
        <div className="rounded-lg bg-orange-50 p-4 text-center">
          <p className="text-xs text-gray-400">Selling Price</p>
          <p className={cn('text-lg font-bold text-orange-600', priceStyle)}>{formatPriceRupees(product.sellingPrice)}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <p className="text-xs text-gray-400">Discount</p>
          <p className="text-lg font-bold text-green-600">{product.discountPercent}%</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <p className="text-xs text-gray-400">Stock</p>
          <p className={cn('text-lg font-bold text-blue-600', stockColor)}>
            {stockLabel ?? product.stock}
          </p>
        </div>
      </div>
    </section>
  );
}
