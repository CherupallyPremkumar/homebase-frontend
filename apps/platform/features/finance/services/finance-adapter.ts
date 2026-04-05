import type { TransactionStatus, GatewayStatus } from '../types';

// ----------------------------------------------------------------
// View-model helpers for the Finance Dashboard
// ----------------------------------------------------------------

/** Map transaction status to badge styling */
export function getStatusBadgeClass(status: TransactionStatus): string {
  switch (status) {
    case 'Settled':
      return 'bg-green-50 text-green-700';
    case 'Pending':
      return 'bg-yellow-50 text-yellow-700';
    case 'Processing':
      return 'bg-blue-50 text-blue-700';
    case 'Failed':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

/** Map gateway status to card styling */
export function getGatewayCardClass(status: GatewayStatus): {
  bg: string;
  border: string;
  dotColor: string;
  dotAnimate: boolean;
  subtitleColor: string;
  uptimeColor: string;
  latencyColor: string;
} {
  switch (status) {
    case 'healthy':
      return {
        bg: 'bg-green-50',
        border: 'border-green-100',
        dotColor: 'bg-green-500',
        dotAnimate: false,
        subtitleColor: 'text-gray-500',
        uptimeColor: 'text-green-600',
        latencyColor: 'text-gray-400',
      };
    case 'degraded':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        dotColor: 'bg-amber-500',
        dotAnimate: true,
        subtitleColor: 'text-amber-600',
        uptimeColor: 'text-amber-600',
        latencyColor: 'text-amber-500',
      };
    case 'down':
      return {
        bg: 'bg-red-50',
        border: 'border-red-100',
        dotColor: 'bg-red-500',
        dotAnimate: true,
        subtitleColor: 'text-red-600',
        uptimeColor: 'text-red-600',
        latencyColor: 'text-red-500',
      };
  }
}

/** Revenue chart bar color based on height percentage */
export function getBarColor(heightPct: number): string {
  if (heightPct >= 90) return 'bg-orange-500';
  if (heightPct >= 75) return 'bg-orange-400';
  if (heightPct >= 55) return 'bg-orange-300';
  if (heightPct >= 40) return 'bg-orange-200';
  return 'bg-orange-100';
}
