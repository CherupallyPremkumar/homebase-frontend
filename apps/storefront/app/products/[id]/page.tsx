import type { Metadata } from 'next';
import { catalogApi } from '@homebase/api-client';
import { buildProductMetadata, JsonLd, productJsonLd, breadcrumbJsonLd } from '@homebase/shared';
import { ProductDetail } from '@/features/product/ui';

export const revalidate = 300;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await catalogApi.getProduct(id);
    return buildProductMetadata({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      price: product.price,
      id: product.id,
    });
  } catch {
    return { title: 'Product Not Found' };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  let product;
  try {
    product = await catalogApi.getProduct(id);
  } catch {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://homebase.com';

  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          currency: product.currency,
          brandName: product.brandName,
          inStock: product.inStock,
          averageRating: product.averageRating,
          reviewCount: product.reviewCount,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: siteUrl },
          { name: 'Products', url: `${siteUrl}/products` },
          { name: product.name, url: `${siteUrl}/products/${product.id}` },
        ])}
      />
      <ProductDetail product={product} />
    </>
  );
}
