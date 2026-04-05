/**
 * Mock data for the Seller Onboarding page.
 *
 * Matches the design prototype pixel-for-pixel.
 * When the backend endpoints are ready, swap the mock imports in
 * use-onboarding.ts for real fetch calls -- no component changes needed.
 */

import type {
  PipelineCount,
  OnboardingStats,
  OnboardingApplication,
  DocumentChecklistItem,
  ApplicantPreview,
  AutoApprovalRule,
  TrainingSeller,
  SlaTimerEntry,
} from '../types';

export type {
  PipelineStage,
  PipelineCount,
  OnboardingStats,
  BusinessType,
  OnboardingApplication,
  DocumentChecklistItem,
  ApplicantPreview,
  AutoApprovalRule,
  TrainingSeller,
  SlaTimerEntry,
} from '../types';

// ----------------------------------------------------------------
// Pipeline Kanban
// ----------------------------------------------------------------

export const mockPipelineCounts: PipelineCount[] = [
  {
    stage: 'Applied',
    count: 5,
    color: 'text-blue-600',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    slaHealth: 'ON TRACK',
    slaBadgeStyle: 'bg-green-100 text-green-700',
    avgDays: 1.2,
    slaLabel: 'SLA: 3d',
    slaPercent: 40,
    slaBarColor: 'bg-green-500',
    slaPercentColor: 'text-green-600',
  },
  {
    stage: 'Documents',
    count: 3,
    color: 'text-yellow-600',
    borderColor: 'border-yellow-200',
    bgColor: 'bg-yellow-100',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    slaHealth: 'AT RISK',
    slaBadgeStyle: 'bg-yellow-100 text-yellow-700',
    avgDays: 3.8,
    slaLabel: 'SLA: 5d',
    slaPercent: 76,
    slaBarColor: 'bg-yellow-500',
    slaPercentColor: 'text-yellow-600',
  },
  {
    stage: 'Verification',
    count: 2,
    color: 'text-purple-600',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    slaHealth: 'ON TRACK',
    slaBadgeStyle: 'bg-green-100 text-green-700',
    avgDays: 2.1,
    slaLabel: 'SLA: 7d',
    slaPercent: 30,
    slaBarColor: 'bg-green-500',
    slaPercentColor: 'text-green-600',
  },
  {
    stage: 'Training',
    count: 3,
    color: 'text-orange-600',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-100',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    slaHealth: 'ON TRACK',
    slaBadgeStyle: 'bg-green-100 text-green-700',
    avgDays: 5.4,
    slaLabel: 'SLA: 10d',
    slaPercent: 54,
    slaBarColor: 'bg-green-500',
    slaPercentColor: 'text-green-600',
  },
  {
    stage: 'Active',
    count: 198,
    color: 'text-green-600',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-100',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    slaHealth: 'HEALTHY',
    slaBadgeStyle: 'bg-green-100 text-green-700',
    avgDays: 0,
    slaLabel: '',
    slaPercent: 0,
    slaBarColor: '',
    slaPercentColor: '',
    bottomLeftLabel: 'This Month',
    bottomLeftValue: '+12',
    bottomLeftColor: 'text-green-600',
    bottomRightLabel: 'Avg Onboard',
    bottomRightValue: '4.2d',
  },
];

// ----------------------------------------------------------------
// Stats Row
// ----------------------------------------------------------------

export const mockOnboardingStats: OnboardingStats = {
  totalApplications: 13,
  totalSubtext: 'Across all stages',
  thisWeek: 3,
  thisWeekChange: '+50% vs last week',
  approvalRate: 92,
  approvalSubtext: '8% rejected (docs incomplete)',
  avgTimeDays: 4.2,
  avgTimeChange: '-0.8d vs last month',
};

// ----------------------------------------------------------------
// Applicant Preview
// ----------------------------------------------------------------

export const mockApplicantPreview: ApplicantPreview = {
  initials: 'RS',
  avatarColor: 'bg-blue-100 text-blue-600',
  sellerName: 'Raj Sharma Textiles',
  appliedDate: 'Applied 28 Mar 2026',
  stage: 'Applied',
  business: {
    name: 'Raj Sharma Textiles',
    category: 'Fashion & Apparel',
    type: 'Sole Proprietorship',
    gstin: '07AABCU9603R1ZM',
    location: 'Delhi, India',
    estRevenue: '\u20B915-25 Lakh/yr',
  },
  documents: [
    { name: 'GST Certificate', status: 'Uploaded' },
    { name: 'PAN Card', status: 'Pending' },
    { name: 'Bank Account Proof', status: 'Pending' },
    { name: 'Trade License', status: 'Pending' },
    { name: 'Address Proof', status: 'Pending' },
    { name: 'Business Registration', status: 'Pending' },
  ],
  documentsUploaded: 1,
  documentsTotal: 6,
  kycScore: 62,
  kycMax: 100,
  riskLevel: 'MEDIUM',
  riskBadgeStyle: 'bg-yellow-100 text-yellow-700',
  riskFactors: [
    { color: 'bg-green-500', text: 'GSTIN verified via government portal' },
    { color: 'bg-yellow-500', text: 'Bank verification pending' },
    { color: 'bg-yellow-500', text: 'New business (< 2 years)' },
    { color: 'bg-green-500', text: 'Category not gated' },
  ],
};

// ----------------------------------------------------------------
// Auto-Approval Rules
// ----------------------------------------------------------------

export const mockAutoApprovalRules: AutoApprovalRule[] = [
  { id: 'aar-1', label: 'All required documents verified', checked: true, badgeText: '6/6 docs', badgeStyle: 'bg-green-100 text-green-700' },
  { id: 'aar-2', label: 'KYC score above threshold', checked: true, badgeText: '', badgeStyle: '', hasInput: true, inputValue: 80 },
  { id: 'aar-3', label: 'Category is not gated', checked: true, badgeText: 'Gated: Jewelry, Pharma, Weapons', badgeStyle: 'bg-gray-100 text-gray-600' },
  { id: 'aar-4', label: 'Risk assessment is Low', checked: false, badgeText: 'Optional', badgeStyle: 'bg-blue-100 text-blue-700', optional: true },
  { id: 'aar-5', label: 'Business registered for 2+ years', checked: false, badgeText: 'Optional', badgeStyle: 'bg-blue-100 text-blue-700', optional: true },
];

// ----------------------------------------------------------------
// Training Progress
// ----------------------------------------------------------------

export const mockTrainingSellers: TrainingSeller[] = [
  {
    id: 'ts-1',
    initials: 'PE',
    avatarColor: 'bg-green-100 text-green-600',
    sellerName: 'Priya Enterprises',
    modulesCompleted: 7,
    modulesTotal: 8,
    barColor: 'bg-green-500',
    remaining: 'Remaining: Seller Dashboard Walkthrough',
    statusText: 'Almost done!',
    statusColor: 'text-green-600',
  },
  {
    id: 'ts-2',
    initials: 'AK',
    avatarColor: 'bg-blue-100 text-blue-600',
    sellerName: 'Anand Kitchen Essentials',
    modulesCompleted: 5,
    modulesTotal: 8,
    barColor: 'bg-orange-500',
    remaining: 'Next: Return Handling, Shipping Labels, Dashboard',
    statusText: 'In progress',
    statusColor: 'text-gray-500',
  },
  {
    id: 'ts-3',
    initials: 'VB',
    avatarColor: 'bg-purple-100 text-purple-600',
    sellerName: 'Varun Books & Stationery',
    modulesCompleted: 3,
    modulesTotal: 8,
    barColor: 'bg-yellow-500',
    remaining: 'Next: Product Listing, Pricing, Returns, Shipping, Dashboard',
    statusText: 'Needs attention',
    statusColor: 'text-yellow-600',
  },
];

// ----------------------------------------------------------------
// SLA Timers
// ----------------------------------------------------------------

export const mockSlaTimers: SlaTimerEntry[] = [
  {
    id: 'sla-1',
    initials: 'SE',
    avatarColor: 'bg-purple-100 text-purple-600',
    sellerName: 'Sharma Electronics',
    stage: 'Documents',
    stageBadgeStyle: 'bg-yellow-100 text-yellow-700',
    daysInStage: 4,
    slaDays: 5,
    slaStatus: 'yellow',
    slaText: '1 day remaining',
    slaBarPercent: 80,
    slaBarColor: 'bg-yellow-500',
    slaTextColor: 'text-yellow-600',
    isBreached: false,
  },
  {
    id: 'sla-2',
    initials: 'KH',
    avatarColor: 'bg-orange-100 text-orange-600',
    sellerName: 'Krishna Handicrafts',
    stage: 'Documents',
    stageBadgeStyle: 'bg-yellow-100 text-yellow-700',
    daysInStage: 6,
    slaDays: 5,
    slaStatus: 'red',
    slaText: '1 day overdue',
    slaBarPercent: 100,
    slaBarColor: 'bg-red-500',
    slaTextColor: 'text-red-600',
    isBreached: true,
  },
  {
    id: 'sla-3',
    initials: 'GO',
    avatarColor: 'bg-yellow-100 text-yellow-600',
    sellerName: 'GreenLeaf Organics',
    stage: 'Verification',
    stageBadgeStyle: 'bg-purple-100 text-purple-700',
    daysInStage: 2,
    slaDays: 7,
    slaStatus: 'green',
    slaText: '5 days remaining',
    slaBarPercent: 28,
    slaBarColor: 'bg-green-500',
    slaTextColor: 'text-green-600',
    isBreached: false,
  },
  {
    id: 'sla-4',
    initials: 'MW',
    avatarColor: 'bg-red-100 text-red-600',
    sellerName: 'MetalWorks India',
    stage: 'Verification',
    stageBadgeStyle: 'bg-purple-100 text-purple-700',
    daysInStage: 3,
    slaDays: 7,
    slaStatus: 'green',
    slaText: '4 days remaining',
    slaBarPercent: 43,
    slaBarColor: 'bg-green-500',
    slaTextColor: 'text-green-600',
    isBreached: false,
  },
];

// ----------------------------------------------------------------
// Applications Table (full prototype data)
// ----------------------------------------------------------------

export const mockApplications: OnboardingApplication[] = [
  { id: 'onb-001', initials: 'RS', avatarColor: 'bg-blue-100 text-blue-600', sellerName: 'Raj Sharma Textiles', businessType: 'Sole Proprietorship', appliedDate: '28 Mar 2026', currentStage: 'Applied', documentsProgress: '1/6', slaStatus: 'green', slaText: '2d left', trainingStatus: '--' },
  { id: 'onb-002', initials: 'NF', avatarColor: 'bg-green-100 text-green-600', sellerName: 'NatureFresh Foods', businessType: 'Partnership', appliedDate: '27 Mar 2026', currentStage: 'Applied', documentsProgress: '0/6', slaStatus: 'green', slaText: '1d left', trainingStatus: '--' },
  { id: 'onb-003', initials: 'SE', avatarColor: 'bg-purple-100 text-purple-600', sellerName: 'Sharma Electronics', businessType: 'Pvt Ltd', appliedDate: '25 Mar 2026', currentStage: 'Documents', documentsProgress: '3/6', slaStatus: 'yellow', slaText: '1d left', trainingStatus: '--' },
  { id: 'onb-004', initials: 'KH', avatarColor: 'bg-orange-100 text-orange-600', sellerName: 'Krishna Handicrafts', businessType: 'Sole Proprietorship', appliedDate: '24 Mar 2026', currentStage: 'Documents', documentsProgress: '4/6', slaStatus: 'red', slaText: '1d overdue', trainingStatus: '--' },
  { id: 'onb-005', initials: 'RE', avatarColor: 'bg-yellow-100 text-yellow-600', sellerName: 'Ravi Electronics', businessType: 'Pvt Ltd', appliedDate: '26 Mar 2026', currentStage: 'Documents', documentsProgress: '3/6', slaStatus: 'green', slaText: '2d left', trainingStatus: '--' },
  { id: 'onb-006', initials: 'GO', avatarColor: 'bg-yellow-100 text-yellow-600', sellerName: 'GreenLeaf Organics', businessType: 'LLP', appliedDate: '22 Mar 2026', currentStage: 'Verification', documentsProgress: '5/6', slaStatus: 'green', slaText: '5d left', trainingStatus: '--' },
  { id: 'onb-007', initials: 'MW', avatarColor: 'bg-red-100 text-red-600', sellerName: 'MetalWorks India', businessType: 'Pvt Ltd', appliedDate: '21 Mar 2026', currentStage: 'Verification', documentsProgress: '6/6', slaStatus: 'green', slaText: '4d left', trainingStatus: '--' },
  { id: 'onb-008', initials: 'PE', avatarColor: 'bg-green-100 text-green-600', sellerName: 'Priya Enterprises', businessType: 'Partnership', appliedDate: '18 Mar 2026', currentStage: 'Training', documentsProgress: '6/6', slaStatus: 'green', slaText: '3d left', trainingStatus: '7/8', trainingProgress: 7, trainingTotal: 8 },
  { id: 'onb-009', initials: 'AK', avatarColor: 'bg-blue-100 text-blue-600', sellerName: 'Anand Kitchen Essentials', businessType: 'LLP', appliedDate: '19 Mar 2026', currentStage: 'Training', documentsProgress: '6/6', slaStatus: 'green', slaText: '5d left', trainingStatus: '5/8', trainingProgress: 5, trainingTotal: 8 },
  { id: 'onb-010', initials: 'VB', avatarColor: 'bg-purple-100 text-purple-600', sellerName: 'Varun Books & Stationery', businessType: 'Sole Proprietorship', appliedDate: '20 Mar 2026', currentStage: 'Training', documentsProgress: '6/6', slaStatus: 'yellow', slaText: '2d left', trainingStatus: '3/8', trainingProgress: 3, trainingTotal: 8 },
  { id: 'onb-011', initials: 'DB', avatarColor: 'bg-gray-100 text-gray-600', sellerName: 'DevBhumi Spices', businessType: 'Sole Proprietorship', appliedDate: '28 Mar 2026', currentStage: 'Applied', documentsProgress: '0/6', slaStatus: 'green', slaText: '2d left', trainingStatus: '--' },
];

// ----------------------------------------------------------------
// Document Checklist (modal)
// ----------------------------------------------------------------

export const mockDocumentChecklist: DocumentChecklistItem[] = [
  { id: 'chk-001', name: 'GST Certificate', required: true, status: 'Verified' },
  { id: 'chk-002', name: 'PAN Card', required: true, status: 'Verified' },
  { id: 'chk-003', name: 'Bank Account Proof', required: true, status: 'Pending' },
  { id: 'chk-004', name: 'Trade License', required: true, status: 'Missing' },
  { id: 'chk-005', name: 'Address Proof', required: true, status: 'Verified' },
  { id: 'chk-006', name: 'Business Registration', required: true, status: 'Missing' },
];

// ----------------------------------------------------------------
// Training Module Legend
// ----------------------------------------------------------------

export const TRAINING_MODULES_LEGEND =
  '8 Modules: Platform Intro, Account Setup, Product Listing, Pricing & Offers, Order Management, Return Handling, Shipping Labels, Seller Dashboard Walkthrough';
