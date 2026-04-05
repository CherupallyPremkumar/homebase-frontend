import { cn } from '../lib/utils';

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'purple';

export interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, { bg: string; text: string; dot: string; border: string }> = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
    border: 'border-green-200',
  },
  warning: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    border: 'border-orange-200',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    border: 'border-red-200',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    border: 'border-blue-200',
  },
  neutral: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    dot: 'bg-gray-400',
    border: 'border-gray-200',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
    border: 'border-purple-200',
  },
};

const statusVariantMap: Record<string, StatusVariant> = {
  // Order states
  created: 'warning',
  payment_pending: 'warning',
  paid: 'info',
  confirmed: 'info',
  processing: 'info',
  on_hold: 'warning',
  shipped: 'purple',
  partially_shipped: 'purple',
  delivered: 'success',
  completed: 'success',
  cancelled: 'error',
  refund_initiated: 'warning',
  refunded: 'neutral',
  failed: 'error',
  fraud_hold: 'error',
  // Generic states (used across modules)
  active: 'success',
  verified: 'success',
  approved: 'success',
  published: 'success',
  pending: 'warning',
  pending_approval: 'warning',
  under_review: 'warning',
  scheduled: 'warning',
  suspended: 'error',
  rejected: 'error',
  expired: 'error',
  closed: 'neutral',
  resolved: 'success',
  in_progress: 'info',
  open: 'warning',
  draft: 'neutral',
  inactive: 'neutral',
  // Shipping
  label_created: 'neutral',
  picked_up: 'info',
  in_transit: 'info',
  out_for_delivery: 'purple',
  // Inventory
  in_stock: 'success',
  low_stock: 'warning',
  out_of_stock: 'error',
  // Return
  requested: 'warning',
  pickup_scheduled: 'info',
  received: 'info',
};

/**
 * Formats a backend state like "PAYMENT_PENDING" → "Payment Pending"
 */
function formatState(state: string): string {
  return state
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function resolveVariant(status: string, explicitVariant?: StatusVariant): StatusVariant {
  if (explicitVariant) return explicitVariant;
  return statusVariantMap[status.toLowerCase()] ?? 'neutral';
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolved = resolveVariant(status, variant);
  const styles = variantStyles[resolved];
  const displayText = status.includes('_') || status === status.toUpperCase()
    ? formatState(status)
    : status;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border',
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', styles.dot)} />
      {displayText}
    </span>
  );
}
