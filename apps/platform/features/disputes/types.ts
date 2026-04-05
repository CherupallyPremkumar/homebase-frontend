/**
 * Types for the Dispute Management feature.
 */

export type DisputeStatus = 'Open' | 'Under Review' | 'Escalated' | 'Resolved';

export type DisputeIssueType =
  | 'Not Received'
  | 'Damaged'
  | 'Quality'
  | 'Wrong Item'
  | 'Delivery'
  | 'Refund Issue';

export interface DisputeStats {
  open: number;
  underReview: number;
  resolved: number;
  escalated: number;
}

export interface Dispute {
  id: string;
  orderId: string;
  customer: string;
  seller: string;
  issueType: DisputeIssueType;
  amount: string;
  status: DisputeStatus;
  opened: string;
}

export interface DisputeTab {
  label: string;
  count: string;
  countColor?: string;
}

export interface RootCauseCategory {
  label: string;
  percentage: number;
  cases: number;
  color: string;
}

export interface SlaResolutionType {
  label: string;
  days: string;
  barPercent: number;
  barColor: string;
}

export interface StepperStep {
  label: string;
  subtitle: string;
  state: 'completed' | 'active' | 'pending';
}

export interface EvidenceThumb {
  label: string;
}

export interface ChargebackData {
  thisMonth: number;
  winRate: number;
  winRateLabel: string;
  totalDisputedAmount: string;
  trendLabel: string;
  won: number;
  lost: number;
  pending: number;
}

export interface DisputeListResponse {
  disputes: Dispute[];
  stats: DisputeStats;
}
