/**
 * Types for the Compliance & KYC feature.
 */

export interface ComplianceStats {
  totalSellers: number;
  fullyCompliant: number;
  fullyCompliantPercent: string;
  partiallyCompliant: number;
  partiallyCompliantPercent: string;
  nonCompliant: number;
  nonCompliantPercent: string;
  pendingReview: number;
}

export type GstPanStatus = 'Verified' | 'Pending' | 'Expired';
export type BankVerified = 'verified' | 'pending' | 'rejected';
export type OverallComplianceStatus = 'Fully Compliant' | 'Partially Compliant' | 'Non-Compliant';
export type ComplianceTab = 'all' | 'fully-compliant' | 'partially-compliant' | 'non-compliant' | 'pending-review';

export interface SellerCompliance {
  id: string;
  sellerId: string;
  sellerName: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  storeName: string;
  gstStatus: GstPanStatus;
  panStatus: GstPanStatus;
  bankVerified: BankVerified;
  docsCompleted: number;
  docsTotal: number;
  overallStatus: OverallComplianceStatus;
  actions: ('Review' | 'Approve' | 'Reject')[];
}

export type DocIconColor = 'blue' | 'purple' | 'green' | 'orange' | 'red';

export interface DocumentQueueItem {
  id: string;
  documentName: string;
  sellerInfo: string;
  uploadDate: string;
  iconColor: DocIconColor;
}
