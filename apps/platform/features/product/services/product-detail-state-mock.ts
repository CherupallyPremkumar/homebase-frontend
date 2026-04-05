import type {
  ComplianceCheckItem,
  ListingField,
  SlaInfo,
  ReviewerInfo,
  SubmissionInfo,
  ComplianceIssue,
  SuspensionInfo,
  RemediationStep,
  SuspensionHistoryEntry,
} from '../types';

// ----------------------------------------------------------------
// Draft State Mock Data
// ----------------------------------------------------------------

export const mockComplianceChecklist: ComplianceCheckItem[] = [
  { label: 'Title', status: 'ready', detail: '42/200 chars', progress: '42/200' },
  { label: 'Description', status: 'missing', detail: '0/100+ chars required' },
  { label: 'Images', status: 'partial', detail: '2 of 3 minimum', progress: '2/3' },
  { label: 'HSN Code', status: 'ready', detail: 'Valid' },
  { label: 'Brand Authorization', status: 'missing', detail: 'Not Uploaded' },
  { label: 'GST Category', status: 'ready', detail: 'Configured' },
];

export const mockListingFields: ListingField[] = [
  { label: 'Product Title', completed: true },
  { label: 'SKU', completed: true },
  { label: 'Category', completed: true },
  { label: 'Base Price', completed: true },
  { label: 'Description', completed: false },
  { label: 'Images (min 3)', completed: false },
  { label: 'Brand Authorization', completed: false },
  { label: 'Shipping Weight', completed: false },
];

export const mockCategoryRequirements = [
  'Minimum 3 product images (white background)',
  'Description must be 100+ characters',
  'Brand authorization document required',
  'HSN code must match category',
  'ISI/BIS certification for electrical products',
];

// ----------------------------------------------------------------
// Review State Mock Data
// ----------------------------------------------------------------

export const mockSlaInfo: SlaInfo = {
  remainingHours: 18,
  totalHours: 48,
  submittedAt: '2026-03-28T14:30:00',
  dueAt: '2026-03-30T14:30:00',
  isWarning: true,
};

export const mockReviewerInfo: ReviewerInfo = {
  name: 'Priya Sharma',
  title: 'Senior Content Moderator',
  avatar: 'PS',
  assignedAt: '2026-03-28T15:00:00',
  queuePosition: 3,
  avgReviewTime: '4.2 hours',
};

export const mockSubmissionInfo: SubmissionInfo = {
  attemptNumber: 2,
  previousRejection: {
    reason: 'Missing brand authorization document. Description too short (42 chars, minimum 100).',
    date: '2026-03-25',
  },
};

export const mockComplianceIssues: ComplianceIssue[] = [
  { label: 'Brand Authorization Missing', description: 'Seller has not uploaded brand authorization document for "Asian Paints". Required for all branded products.', status: 'fail', action: 'Request Upload' },
  { label: 'Description Too Short', description: 'Product description is 42 characters. Minimum required is 100 characters for this category.', status: 'fail', action: 'Request Edit' },
  { label: 'Product Title', status: 'pass', description: 'Title meets guidelines (42/200 chars)' },
  { label: 'Images', status: 'pass', description: '4 images uploaded, minimum 3 required' },
  { label: 'HSN Code', status: 'pass', description: 'HSN 3209 valid for Paints category' },
  { label: 'Pricing', status: 'pass', description: 'Price within category range' },
  { label: 'GST Category', status: 'pass', description: '18% GST correctly configured' },
];

// ----------------------------------------------------------------
// Suspended State Mock Data
// ----------------------------------------------------------------

export const mockSuspensionInfo: SuspensionInfo = {
  reason: 'Misleading wattage claim reported by 3 buyers. Product description states 9W but actual measurement shows 6.5W output.',
  suspendedAt: '2026-03-15T10:30:00',
  suspendedBy: 'Admin (Auto-flagged by system)',
  complaints: [
    { text: 'Bulb is not 9W as described. My electrician measured it at 6.5W.', date: '2026-03-12' },
    { text: 'Misleading product. Bought pack of 10, none of them are actually 9W.', date: '2026-03-13' },
    { text: 'Wattage claim is false. Returning entire order.', date: '2026-03-14' },
  ],
};

export const mockRemediationSteps: RemediationStep[] = [
  { label: 'Fix product description', status: 'pending', description: 'Update wattage claim to match actual output' },
  { label: 'Upload test certificate', status: 'pending', description: 'Provide BIS test certificate showing actual wattage' },
  { label: 'Respond to buyer complaints', status: 'done', description: 'Seller has responded to all 3 complaints' },
];

export const mockSuspensionHistory: SuspensionHistoryEntry[] = [
  { number: 2, date: '2026-03-15', reason: 'Misleading wattage claim reported by 3 buyers', status: 'active' },
  { number: 1, date: '2025-11-20', reason: 'Incorrect product image (stock photo used)', status: 'resolved', resolvedDate: '2025-11-25' },
];

export const mockAccountImpact = {
  activeSuspensions: 1,
  maxSuspensions: 3,
  warning: '2 more suspensions will trigger full seller account review',
};
