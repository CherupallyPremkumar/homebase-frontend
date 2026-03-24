import type { Metadata } from 'next';
import Link from 'next/link';
import { catalogApi } from '@homebase/api-client';
import { buildMetadata } from '@homebase/shared';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'All Categories — Shop by Category',
  description: 'Browse all product categories at HomeBase. Find exactly what you need.',
  path: '/categories',
});

export default async function CategoriesPage() {
  const response = await catalogApi.categoryMenu();
  const categories = response.list?.map((r) => r.row) ?? [];
  const topCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Shop by Category</h1>

      {topCategories.length === 0 ? (
        <p className="text-gray-500">No categories available at the moment.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {topCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-lg border bg-white p-6 transition-shadow hover:shadow-md"
            >
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-20 w-20 object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {category.name.charAt(0)}
                </div>
              )}
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">{category.name}</p>
                {category.productCount != null && category.productCount > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Subcategories grouped under parent */}
      {topCategories.some((c) => {
        const children = categories.filter((ch) => ch.parentId === c.id);
        return children.length > 0;
      }) && (
        <div className="mt-12 space-y-10">
          {topCategories.map((parent) => {
            const children = categories.filter((ch) => ch.parentId === parent.id);
            if (children.length === 0) return null;

            return (
              <section key={parent.id}>
                <h2 className="mb-4 text-lg font-bold text-gray-900">{parent.name}</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/categories/${child.slug}`}
                      className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-shadow hover:shadow-md"
                    >
                      {child.imageUrl ? (
                        <img src={child.imageUrl} alt={child.name} className="h-12 w-12 object-contain" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                          {child.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-center text-xs font-medium text-gray-700">{child.name}</span>
                      {child.productCount != null && child.productCount > 0 && (
                        <span className="text-xs text-gray-400">{child.productCount}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
