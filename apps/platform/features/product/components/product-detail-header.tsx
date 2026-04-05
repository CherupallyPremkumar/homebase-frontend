import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@homebase/ui/src/lib/utils';
import type { ProductDetailState } from '../types';

const BADGE_STYLES: Record<ProductDetailState, { bg: string; text: string; dot: string; pulse?: boolean }> = {
  Published: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Draft: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  'Under Review': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', pulse: true },
  Suspended: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', pulse: true },
};

interface ProductDetailHeaderProps {
  name: string;
  status: ProductDetailState;
  actions?: ReactNode;
  opacity?: string;
}

export function ProductDetailHeader({ name, status, actions, opacity }: ProductDetailHeaderProps) {
  const badge = BADGE_STYLES[status] ?? BADGE_STYLES.Published;

  return (
    <>
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <Link href="/products" className="text-gray-400 hover:text-orange-500">Products</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <span className="font-medium text-gray-700">{name}</span>
      </nav>

      <div className={cn('flex items-center justify-between', opacity)}>
        <div className="flex items-center gap-3">
          <Link href="/products" className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50" aria-label="Back">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', badge.bg, badge.text)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', badge.dot, badge.pulse && 'animate-pulse')} />
            {status}
          </span>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </>
  );
}
