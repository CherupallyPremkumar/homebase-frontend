import * as React from 'react';
import { cn } from '../lib/utils';
import { PriceDisplay } from './price-display';
import { StateBadge } from './state-badge';
import { formatDate } from './format';

interface InfoField {
  label: string;
  value: unknown;
  type?: 'text' | 'price' | 'date' | 'state' | 'custom';
  span?: 1 | 2;  // grid column span
  render?: () => React.ReactNode;
}

interface InfoGridProps {
  fields: InfoField[];
  columns?: 1 | 2 | 3;
  className?: string;
}

export function InfoGrid({ fields, columns = 2, className }: InfoGridProps) {
  return (
    <div className={cn(
      'grid gap-4',
      columns === 1 && 'grid-cols-1',
      columns === 2 && 'grid-cols-1 sm:grid-cols-2',
      columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      className,
    )}>
      {fields.map((field, i) => (
        <div key={i} className={cn(field.span === 2 && 'sm:col-span-2')}>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{field.label}</p>
          <div className="mt-1">
            {field.render ? field.render() : renderFieldValue(field)}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderFieldValue(field: InfoField): React.ReactNode {
  if (field.value == null || field.value === '') {
    return <p className="text-sm text-gray-300">&mdash;</p>;
  }

  switch (field.type) {
    case 'price':
      return <PriceDisplay price={field.value as number} size="md" />;
    case 'date':
      return <p className="text-sm font-medium text-gray-900">{formatDate(String(field.value))}</p>;
    case 'state':
      return <StateBadge state={String(field.value)} />;
    default:
      return <p className="text-sm font-medium text-gray-900">{String(field.value)}</p>;
  }
}
