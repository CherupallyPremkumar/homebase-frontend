/**
 * Types for the Returns feature.
 */

// ----------------------------------------------------------------
// Returns List types
// ----------------------------------------------------------------

export type ReturnListStatus =
  | 'Pending'
  | 'Approved'
  | 'Shipped'
  | 'Processing'
  | 'Completed'
  | 'Rejected';

export interface ReturnListItem {
  id: string;
  orderId: string;
  initials: string;
  avatarBg: string;
  customer: string;
  seller: string;
  product: string;
  reason: string;
  reasonBg: string;
  amount: string;
  status: string;
  date: string;
  images: number;
}

export interface ReturnListTab {
  label: string;
  count: string;
}

// ----------------------------------------------------------------
// Return Detail types
// ----------------------------------------------------------------

export type ReturnTimelineStepStatus = 'completed' | 'current' | 'pending';

export interface ReturnTimelineStep {
  label: string;
  date: string | null;
  actor: string | null;
  status: ReturnTimelineStepStatus;
}

export interface ReturnItem {
  id: string;
  name: string;
  sku: string;
  emoji: string;
  qty: number;
  price: number;
  reason: string;
  condition: string;
}

export interface ReturnRefundBreakdown {
  itemValue: number;
  shippingRefund: number;
  shippingLabel: string;
  discountAdjustment: number;
  totalRefund: number;
  refundMethod: string;
}

export interface ReturnPolicyCheck {
  label: string;
  passed: boolean;
  detail: string;
}

export interface ReturnEvidence {
  filename: string;
}

export interface ReturnDetailData {
  id: string;
  status: string;
  statusColor: string;

  timeline: ReturnTimelineStep[];
  items: ReturnItem[];

  originalOrder: {
    id: string;
    placedDate: string;
    deliveredDate: string;
    amount: number;
    status: string;
    statusColor: string;
  };

  refund: ReturnRefundBreakdown;

  customerComment: string;
  commentDate: string;
  evidence: ReturnEvidence[];

  customer: {
    id: string;
    name: string;
    initials: string;
    avatarBg: string;
    email: string;
    phone: string;
    totalReturns: number;
  };

  seller: {
    id: string;
    name: string;
    initials: string;
    avatarBg: string;
    tier: string;
    responseStatus: string;
    responseStatusColor: string;
    responseDate: string;
  };

  policyChecks: ReturnPolicyCheck[];
  policyVerdict: string;
  policyVerdictColor: string;

  pickup: {
    scheduledDate: string;
    timeSlot: string;
    carrier: string;
    address: string;
  };
}
