import { cn } from '../lib/utils';

interface StateBadgeProps {
  state: string;
  className?: string;
}

const stateColors: Record<string, { bg: string; text: string; dot: string }> = {
  CREATED: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  ACTIVE: { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500' },
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  PENDING: { bg: 'bg-accent-50', text: 'text-accent-700', dot: 'bg-accent-500' },
  PROCESSING: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  COMPLETED: { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500' },
  CANCELLED: { bg: 'bg-error-50', text: 'text-error-700', dot: 'bg-error-500' },
  SUSPENDED: { bg: 'bg-error-50', text: 'text-error-700', dot: 'bg-error-500' },
  PAID: { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500' },
  SHIPPED: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  DELIVERED: { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500' },
  FAILED: { bg: 'bg-error-50', text: 'text-error-700', dot: 'bg-error-500' },
  REJECTED: { bg: 'bg-error-50', text: 'text-error-700', dot: 'bg-error-500' },
  APPROVED: { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500' },
  IN_STOCK: { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500' },
  LOW_STOCK: { bg: 'bg-accent-50', text: 'text-accent-700', dot: 'bg-accent-500' },
  OUT_OF_STOCK: { bg: 'bg-error-50', text: 'text-error-700', dot: 'bg-error-500' },
  OPEN: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  RESOLVED: { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500' },
  CLOSED: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

const defaultColor = { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };

export function StateBadge({ state, className }: StateBadgeProps) {
  const color = stateColors[state] || defaultColor;

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium', color.bg, color.text, className)}
      role="status"
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', color.dot)} aria-hidden="true" />
      {state.replace(/_/g, ' ')}
    </span>
  );
}
