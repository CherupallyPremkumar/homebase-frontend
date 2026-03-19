'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { PriceDisplay } from '../display/price-display';
import { StarRating } from '../display/star-rating';
import { StateBadge } from '../display/state-badge';
import { StockIndicator } from '../display/stock-indicator';
import { formatDate, formatNumber, formatPercent } from '../display/format';
import type { EntityField, EntityAction, EntityBadge } from './types';

export interface EntityCardProps<T = unknown> {
  // Layout
  variant?: 'vertical' | 'horizontal' | 'stat' | 'compact';

  // Content
  image?: { src: string; alt: string; aspectRatio?: '1/1' | '16/9' | '4/3' };
  title: string;
  subtitle?: string;
  badges?: EntityBadge[];
  icon?: React.ReactNode;
  fields?: EntityField<T>[];
  actions?: EntityAction[];

  // Interaction
  href?: string;
  onClick?: () => void;
  selected?: boolean;

  // Semantic HTML
  as?: 'article' | 'li' | 'div';

  // Escape hatch
  children?: React.ReactNode;

  // Styling
  className?: string;
}

export function EntityCard<T = unknown>({
  variant = 'vertical',
  image,
  title,
  subtitle,
  badges,
  icon,
  fields,
  actions,
  href,
  onClick,
  selected,
  as: Tag = 'article',
  children,
  className,
}: EntityCardProps<T>) {
  // Dev warnings
  if (process.env.NODE_ENV === 'development') {
    if (variant === 'stat' && !icon) {
      console.warn('[EntityCard] variant="stat" works best with an icon prop');
    }
  }

  // Escape hatch — if children provided, render them directly
  if (children) {
    return <Tag className={cn('rounded-md border border-gray-200 bg-white', className)}>{children}</Tag>;
  }

  // Stat variant — different layout
  if (variant === 'stat') {
    return (
      <Tag className={cn('rounded-md border border-gray-200 bg-white p-4', className)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            {fields?.map((field, i) => (
              <React.Fragment key={i}>{renderField(field)}</React.Fragment>
            ))}
            {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
          </div>
          {icon && <div className="rounded-full bg-primary-50 p-2.5 text-primary-600">{icon}</div>}
        </div>
      </Tag>
    );
  }

  const isHorizontal = variant === 'horizontal' || variant === 'compact';

  const cardContent = (
    <div className={cn(
      'flex',
      isHorizontal ? 'flex-row items-center gap-3' : 'flex-col',
    )}>
      {/* Image */}
      {image && (
        <div className={cn(
          'flex-shrink-0 overflow-hidden bg-gray-50',
          isHorizontal
            ? variant === 'compact' ? 'h-12 w-12 rounded' : 'h-20 w-20 rounded-md'
            : 'aspect-square w-full rounded-t-md',
        )}>
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
      )}

      {/* Icon (for non-image cards like WMS tasks) */}
      {!image && icon && isHorizontal && (
        <div className="flex-shrink-0">{icon}</div>
      )}

      {/* Content */}
      <div className={cn('flex flex-1 flex-col', !isHorizontal && 'p-3')}>
        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="mb-1 flex flex-wrap gap-1">
            {badges.map((badge, i) => (
              badge.variant === 'state'
                ? <StateBadge key={i} state={badge.label} />
                : <span key={i} className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    badge.variant === 'priority' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-600',
                  )}>{badge.label}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className={cn(
          'font-medium text-gray-900',
          isHorizontal ? 'text-sm' : 'text-sm line-clamp-2',
          href && 'group-hover:text-primary-600',
        )}>
          {title}
        </h3>

        {/* Subtitle */}
        {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}

        {/* Fields */}
        {fields && fields.length > 0 && (
          <div className={cn('mt-auto', !isHorizontal && 'pt-1.5')}>
            {fields.map((field, i) => (
              <React.Fragment key={i}>{renderField(field)}</React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Actions — right side for horizontal, bottom for vertical */}
      {actions && actions.length > 0 && isHorizontal && (
        <div className="flex flex-shrink-0 items-center gap-1.5">
          {actions.map((action, i) => renderAction(action, i))}
        </div>
      )}
    </div>
  );

  // Bottom actions for vertical cards
  const bottomActions = actions && actions.length > 0 && !isHorizontal ? (
    <div className="flex gap-1.5 border-t border-gray-100 p-3 pt-2">
      {actions.map((action, i) => renderAction(action, i, true))}
    </div>
  ) : null;

  // Wrap in link if href provided
  const card = (
    <Tag
      className={cn(
        'group overflow-hidden rounded-md border bg-white transition-colors',
        selected ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-200',
        (href || onClick) && 'cursor-pointer hover:bg-gray-50',
        isHorizontal && 'p-3',
        className,
      )}
      onClick={onClick}
    >
      {cardContent}
      {bottomActions}
    </Tag>
  );

  if (href) {
    return <Link href={href} className="block">{card}</Link>;
  }

  return card;
}

// Field renderer — maps field type to display component
function renderField<T>(field: EntityField<T>): React.ReactNode {
  switch (field.type) {
    case 'price':
      return <PriceDisplay price={field.value as number} mrp={field.extra as number} size="sm" />;
    case 'rating':
      return <StarRating rating={field.value as number} count={field.extra as number} />;
    case 'state':
      return <StateBadge state={String(field.value)} />;
    case 'stock':
      return <StockIndicator inStock={!!field.value} quantity={field.extra as number} />;
    case 'date':
      return <p className="text-xs text-gray-400">{formatDate(String(field.value))}</p>;
    case 'number':
      return (
        <p className="text-2xl font-bold text-gray-900">
          {typeof field.value === 'number' ? formatNumber(field.value) : field.value}
        </p>
      );
    case 'change': {
      const change = field.value as number;
      return (
        <p className={cn('text-xs font-medium', change >= 0 ? 'text-success-600' : 'text-error-600')}>
          {formatPercent(change)}
        </p>
      );
    }
    case 'text':
      return field.label
        ? <div className="flex justify-between text-sm"><span className="text-gray-500">{field.label}</span><span className="font-medium">{String(field.value)}</span></div>
        : <p className="text-xs text-gray-500">{String(field.value)}</p>;
    case 'custom':
      return field.render ? field.render() : null;
    default:
      return <p className="text-sm">{String(field.value)}</p>;
  }
}

// Action renderer
function renderAction(action: EntityAction, index: number, fullWidth = false): React.ReactNode {
  const className = cn(
    'inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors',
    'px-3 py-1.5',
    fullWidth && 'flex-1',
    action.variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700',
    action.variant === 'destructive' && 'bg-error-600 text-white hover:bg-error-700',
    action.variant === 'ghost' && 'text-gray-600 hover:bg-gray-100',
    (!action.variant || action.variant === 'secondary') && 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
    action.disabled && 'pointer-events-none opacity-50',
  );

  if (action.href) {
    return <Link key={index} href={action.href} className={className}>{action.icon}{action.label}</Link>;
  }

  return (
    <button key={index} onClick={action.onClick} disabled={action.disabled} className={className}>
      {action.loading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : action.icon}
      {action.label}
    </button>
  );
}
