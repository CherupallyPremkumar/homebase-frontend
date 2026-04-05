/**
 * Mock data for the Dispute Management page.
 *
 * All values match the HTML prototype at:
 *   design-prototype/admin/orders/disputes.html
 */

import type {
  Dispute,
  DisputeStats,
  DisputeTab,
  RootCauseCategory,
  SlaResolutionType,
  StepperStep,
  EvidenceThumb,
  ChargebackData,
  DisputeListResponse,
} from '../types';

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */

export const mockDisputeStats: DisputeStats = {
  open: 8,
  underReview: 5,
  resolved: 45,
  escalated: 2,
};

/* ------------------------------------------------------------------ */
/*  Tabs                                                               */
/* ------------------------------------------------------------------ */

export const mockDisputeTabs: DisputeTab[] = [
  { label: 'All', count: '60' },
  { label: 'Open', count: '8' },
  { label: 'Under Review', count: '5' },
  { label: 'Resolved', count: '45' },
  { label: 'Escalated', count: '2', countColor: 'text-red-500 font-bold' },
];

/* ------------------------------------------------------------------ */
/*  Resolution Workflow Stepper (DSP-2045)                             */
/* ------------------------------------------------------------------ */

export const mockStepperSteps: StepperStep[] = [
  { label: 'Received', subtitle: '15 Mar, 10:22 AM', state: 'completed' },
  { label: 'Under Review', subtitle: '16 Mar, 3:15 PM', state: 'completed' },
  { label: 'Mediation', subtitle: 'In progress', state: 'active' },
  { label: 'Resolved', subtitle: 'Pending', state: 'pending' },
];

/* ------------------------------------------------------------------ */
/*  Evidence Viewer (DSP-2045)                                         */
/* ------------------------------------------------------------------ */

export const mockCustomerEvidence = {
  name: 'Rajesh Kumar',
  statement:
    '"I ordered a Samsung 55-inch TV but the box arrived with visible dents. Upon opening, the screen has a crack running across the bottom third. The delivery agent did not wait for me to inspect. I have CCTV footage of the delivery."',
  thumbs: [
    { label: 'Box damage' },
    { label: 'Screen crack' },
    { label: 'CCTV clip' },
  ] as EvidenceThumb[],
};

export const mockSellerEvidence = {
  name: 'Sharma Electronics',
  statement:
    '"The product was packed in original Samsung packaging with foam inserts and shipped via BlueDart with insurance. Our warehouse QC photos show the item was in perfect condition before dispatch. The damage likely occurred during transit. We have filed a claim with the courier."',
  thumbs: [
    { label: 'AWB proof' },
    { label: 'QC photo' },
  ] as EvidenceThumb[],
};

export const mockAdminNotes =
  'Courier (BlueDart) claim filed. Awaiting transit damage investigation report. Customer CCTV footage is compelling \u2014 box was already dented on arrival. Likely transit damage.';

/* ------------------------------------------------------------------ */
/*  Chargeback Tracking                                                */
/* ------------------------------------------------------------------ */

export const mockChargebackData: ChargebackData = {
  thisMonth: 3,
  winRate: 67,
  winRateLabel: '2 of 3 chargebacks won in your favor',
  totalDisputedAmount: '\u20B918,400',
  trendLabel: '+12% vs last month',
  won: 2,
  lost: 1,
  pending: 0,
};

/* ------------------------------------------------------------------ */
/*  Root Cause Analysis                                                */
/* ------------------------------------------------------------------ */

export const mockRootCauses: RootCauseCategory[] = [
  { label: 'Quality Issue', percentage: 34, cases: 20, color: 'bg-yellow-500' },
  { label: 'Delivery Problem', percentage: 28, cases: 17, color: 'bg-blue-500' },
  { label: 'Wrong Item', percentage: 18, cases: 11, color: 'bg-purple-500' },
  { label: 'Not as Described', percentage: 12, cases: 7, color: 'bg-orange-500' },
  { label: 'Other', percentage: 8, cases: 5, color: 'bg-gray-400' },
];

/* ------------------------------------------------------------------ */
/*  SLA Performance                                                    */
/* ------------------------------------------------------------------ */

export const mockSlaResolutions: SlaResolutionType[] = [
  { label: 'Refund to Customer', days: '2.1 days', barPercent: 40, barColor: 'bg-blue-500' },
  { label: 'Sided with Seller', days: '2.8 days', barPercent: 55, barColor: 'bg-green-500' },
  { label: 'Partial Refund', days: '3.5 days', barPercent: 70, barColor: 'bg-yellow-500' },
  { label: 'Escalated / Legal', days: '4.8 days', barPercent: 95, barColor: 'bg-red-500' },
];

/* ------------------------------------------------------------------ */
/*  Dispute Table Rows                                                 */
/* ------------------------------------------------------------------ */

export const mockDisputes: Dispute[] = [
  {
    id: 'DSP-2045',
    orderId: '#HB-78102',
    customer: 'Rajesh Kumar',
    seller: 'Sharma Electronics',
    issueType: 'Not Received',
    amount: '\u20B945,000',
    status: 'Escalated',
    opened: '15 Mar 2026',
  },
  {
    id: 'DSP-2042',
    orderId: '#HB-78056',
    customer: 'Anish Joshi',
    seller: 'Patel Home Goods',
    issueType: 'Damaged',
    amount: '\u20B978,500',
    status: 'Escalated',
    opened: '12 Mar 2026',
  },
  {
    id: 'DSP-2050',
    orderId: '#HB-78390',
    customer: 'Priya Sharma',
    seller: 'GreenLeaf Organics',
    issueType: 'Quality',
    amount: '\u20B93,200',
    status: 'Open',
    opened: '27 Mar 2026',
  },
  {
    id: 'DSP-2048',
    orderId: '#HB-78345',
    customer: 'Amit Patel',
    seller: 'TechZone India',
    issueType: 'Wrong Item',
    amount: '\u20B918,900',
    status: 'Under Review',
    opened: '25 Mar 2026',
  },
  {
    id: 'DSP-2049',
    orderId: '#HB-78378',
    customer: 'Sunita Reddy',
    seller: 'Sharma Electronics',
    issueType: 'Delivery',
    amount: '\u20B912,400',
    status: 'Open',
    opened: '26 Mar 2026',
  },
  {
    id: 'DSP-2040',
    orderId: '#HB-78210',
    customer: 'Vikram Singh',
    seller: 'HomeStyle Decor',
    issueType: 'Damaged',
    amount: '\u20B98,750',
    status: 'Resolved',
    opened: '18 Mar 2026',
  },
  {
    id: 'DSP-2047',
    orderId: '#HB-78320',
    customer: 'Meena Gupta',
    seller: 'FreshMart Daily',
    issueType: 'Quality',
    amount: '\u20B92,100',
    status: 'Under Review',
    opened: '24 Mar 2026',
  },
  {
    id: 'DSP-2038',
    orderId: '#HB-78180',
    customer: 'Kavita Nair',
    seller: 'BuildRight Supplies',
    issueType: 'Not Received',
    amount: '\u20B934,600',
    status: 'Resolved',
    opened: '14 Mar 2026',
  },
];

/* ------------------------------------------------------------------ */
/*  Aggregate Response                                                 */
/* ------------------------------------------------------------------ */

export const mockDisputeListResponse: DisputeListResponse = {
  disputes: mockDisputes,
  stats: mockDisputeStats,
};
