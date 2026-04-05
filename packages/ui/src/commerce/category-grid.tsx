import Link from 'next/link';
import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CategoryItem {
  name: string;
  icon: string;
  itemCount: number;
  href: string;
}

export interface CategoryGridProps {
  categories: CategoryItem[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CategoryGrid({ categories, className }: CategoryGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8',
        className,
      )}
    >
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={cat.href}
          className={cn(
            'flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-4',
            'transition-all duration-200',
            'hover:border-brand-500 hover:bg-brand-50',
          )}
        >
          <span className="mb-2 text-3xl">{cat.icon}</span>
          <span className="text-xs font-medium text-gray-700">{cat.name}</span>
          <span className="mt-0.5 text-[10px] text-gray-400">
            {cat.itemCount} items
          </span>
        </Link>
      ))}
    </div>
  );
}
