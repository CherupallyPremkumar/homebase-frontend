import type {
  ReturnDetailData,
  ReturnTimelineStep,
  ReturnRefundBreakdown,
  ReturnPolicyCheck,
} from '../types';

// ----------------------------------------------------------------
// Adapter: Raw ReturnDetailData -> UI-ready view models
// ----------------------------------------------------------------

export interface TimelineStepView {
  label: string;
  date: string;
  actor: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

/**
 * Transforms raw return timeline steps into display-ready items.
 */
export function adaptReturnTimeline(steps: ReturnTimelineStep[]): TimelineStepView[] {
  return steps.map((step) => ({
    label: step.label,
    date: step.date ?? '--',
    actor: step.actor ?? '',
    isCompleted: step.status === 'completed',
    isCurrent: step.status === 'current',
  }));
}

export interface RefundBreakdownView {
  rows: { label: string; value: string; isNegative: boolean }[];
  totalLabel: string;
  totalValue: string;
  method: string;
}

/**
 * Transforms raw refund breakdown into formatted display rows.
 */
export function adaptRefundBreakdown(refund: ReturnRefundBreakdown): RefundBreakdownView {
  return {
    rows: [
      { label: 'Item Value', value: formatINR(refund.itemValue), isNegative: false },
      {
        label: `Shipping Refund`,
        value: refund.shippingRefund === 0 ? refund.shippingLabel : formatINR(refund.shippingRefund),
        isNegative: false,
      },
      {
        label: 'Discount Adjustment',
        value: refund.discountAdjustment > 0 ? `-${formatINR(refund.discountAdjustment)}` : formatINR(0),
        isNegative: refund.discountAdjustment > 0,
      },
    ],
    totalLabel: 'Total Refund',
    totalValue: formatINR(refund.totalRefund),
    method: refund.refundMethod,
  };
}

export interface PolicyCheckView {
  label: string;
  passed: boolean;
  detail: string;
  icon: 'check' | 'x';
}

/**
 * Transforms raw policy checks into display items.
 */
export function adaptPolicyChecks(checks: ReturnPolicyCheck[]): PolicyCheckView[] {
  return checks.map((check) => ({
    label: check.label,
    passed: check.passed,
    detail: check.detail,
    icon: check.passed ? 'check' : 'x',
  }));
}

function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
