/**
 * Types for the Seller Onboarding feature.
 */

export type PipelineStage = 'Applied' | 'Documents' | 'Verification' | 'Training' | 'Active';

export type SlaHealth = 'ON TRACK' | 'AT RISK' | 'HEALTHY';

export interface PipelineCount {
  stage: PipelineStage;
  count: number;
  color: string;
  borderColor: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  slaHealth: SlaHealth;
  slaBadgeStyle: string;
  avgDays: number;
  slaLabel: string;
  slaPercent: number;
  slaBarColor: string;
  slaPercentColor: string;
  /** Extra bottom-left label (override for "Active" stage) */
  bottomLeftLabel?: string;
  bottomLeftValue?: string;
  bottomLeftColor?: string;
  /** Extra bottom-right label (override for "Active" stage) */
  bottomRightLabel?: string;
  bottomRightValue?: string;
}

export interface OnboardingStats {
  totalApplications: number;
  totalSubtext: string;
  thisWeek: number;
  thisWeekChange: string;
  approvalRate: number;
  approvalSubtext: string;
  avgTimeDays: number;
  avgTimeChange: string;
}

export type BusinessType = 'Sole Proprietorship' | 'Partnership' | 'Private Limited' | 'Pvt Ltd' | 'LLP';

export type SlaStatus = 'green' | 'yellow' | 'red';

export interface OnboardingApplication {
  id: string;
  initials: string;
  avatarColor: string;
  sellerName: string;
  businessType: BusinessType;
  appliedDate: string;
  currentStage: PipelineStage;
  documentsProgress: string;
  slaStatus: SlaStatus;
  slaText: string;
  trainingStatus: string;
  trainingProgress?: number;
  trainingTotal?: number;
}

export interface DocumentChecklistItem {
  id: string;
  name: string;
  required: boolean;
  status: 'Uploaded' | 'Pending' | 'Rejected' | 'Verified' | 'Missing';
}

export interface ApplicantPreview {
  initials: string;
  avatarColor: string;
  sellerName: string;
  appliedDate: string;
  stage: PipelineStage;
  business: {
    name: string;
    category: string;
    type: string;
    gstin: string;
    location: string;
    estRevenue: string;
  };
  documents: {
    name: string;
    status: 'Uploaded' | 'Pending';
  }[];
  documentsUploaded: number;
  documentsTotal: number;
  kycScore: number;
  kycMax: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskBadgeStyle: string;
  riskFactors: {
    color: string;
    text: string;
  }[];
}

export interface AutoApprovalRule {
  id: string;
  label: string;
  checked: boolean;
  badgeText: string;
  badgeStyle: string;
  hasInput?: boolean;
  inputValue?: number;
  optional?: boolean;
}

export interface TrainingSeller {
  id: string;
  initials: string;
  avatarColor: string;
  sellerName: string;
  modulesCompleted: number;
  modulesTotal: number;
  barColor: string;
  remaining: string;
  statusText: string;
  statusColor: string;
}

export interface SlaTimerEntry {
  id: string;
  initials: string;
  avatarColor: string;
  sellerName: string;
  stage: PipelineStage;
  stageBadgeStyle: string;
  daysInStage: number;
  slaDays: number;
  slaStatus: SlaStatus;
  slaText: string;
  slaBarPercent: number;
  slaBarColor: string;
  slaTextColor: string;
  isBreached: boolean;
}
