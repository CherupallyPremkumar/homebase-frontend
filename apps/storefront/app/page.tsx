import Link from 'next/link';
import { catalogApi } from '@homebase/api-client';
import { JsonLd, organizationJsonLd, websiteJsonLd } from '@homebase/shared';
import { HeroBanner, CategoryGrid, FeaturedProducts, TrustBar } from '@/features/catalog/ui';

export const revalidate = 60;

export default async function HomePage() {
  const [banners, categories, featured] = await Promise.allSettled([
    catalogApi.banners(),
    catalogApi.categoryMenu(),
    catalogApi.featuredProducts(),
  ]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      <div className="space-y-8">
        {banners.status === 'fulfilled' && banners.value.length > 0 && (
          <HeroBanner banners={banners.value} />
        )}

        {categories.status === 'fulfilled' && (
          <section className="container mx-auto px-4">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Shop by Category</h2>
            <CategoryGrid categories={categories.value.categories} />
          </section>
        )}

        {featured.status === 'fulfilled' && featured.value.length > 0 && (
          <section className="container mx-auto px-4">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Featured Products</h2>
            <FeaturedProducts products={featured.value} />
          </section>
        )}

        <TrustBar />
      </div>
    </>
  );
}
