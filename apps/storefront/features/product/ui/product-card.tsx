'use client';

import { EntityCard } from '@homebase/ui';
import type { CatalogItem } from '@homebase/types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: CatalogItem;
}

/**
 * Specialized wrapper — domain-specific UX on top of generic EntityCard.
 * This is the Chenile pattern: generic engine + domain config.
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <EntityCard
      variant="vertical"
      as="article"
      image={product.imageUrl ? { src: product.imageUrl, alt: product.name, aspectRatio: '1/1' } : undefined}
      title={product.name}
      subtitle={product.brandName}
      badges={product.discount > 0 ? [{ label: `${product.discount}% OFF`, variant: 'priority' }] : []}
      fields={[
        { type: 'price', value: product.price, extra: product.mrp },
        ...(product.averageRating ? [{ type: 'rating' as const, value: product.averageRating, extra: product.reviewCount }] : []),
        { type: 'stock', value: product.inStock ? 1 : 0 },
      ]}
      actions={[
        {
          label: product.inStock ? 'Add to Cart' : 'Out of Stock',
          variant: 'secondary' as const,
          icon: <ShoppingCart className="h-3.5 w-3.5" />,
          disabled: !product.inStock,
        },
      ]}
      href={`/products/${product.id}`}
    />
  );
}
