import type { CatalogItem } from '@homebase/types';
import { ProductCard } from '@/features/product/ui';

interface FeaturedProductsProps {
  products: CatalogItem[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
      {products.slice(0, 8).map((product) => (
        <div key={product.id} className="w-44 flex-shrink-0 md:w-auto">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
