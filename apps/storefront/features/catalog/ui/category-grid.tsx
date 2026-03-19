import Link from 'next/link';
import type { Category } from '@homebase/types';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const topCategories = categories.filter((c) => !c.parentId).slice(0, 6);

  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
      {topCategories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-shadow hover:shadow-md"
        >
          {category.imageUrl ? (
            <img src={category.imageUrl} alt={category.name} className="h-12 w-12 object-contain" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {category.name.charAt(0)}
            </div>
          )}
          <span className="text-center text-xs font-medium text-gray-700">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}
