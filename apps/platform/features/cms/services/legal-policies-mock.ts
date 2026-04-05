/**
 * Mock data for the Legal Policies page.
 *
 * Matches the shape backed by the `platform_policies` DB table.
 * When the backend endpoints are ready, swap the mock imports in
 * the hook for real fetch calls -- no component changes needed.
 */

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type LegalPolicyStatus = 'Published' | 'Draft';

export type LegalPolicyType =
  | 'terms'
  | 'privacy'
  | 'returns'
  | 'shipping'
  | 'seller-agreement'
  | 'cookies';

/** A version history entry for a legal policy. */
export interface PolicyVersionEntry {
  version: string;
  date: string;
  author: string;
}

/** A single legal policy document. */
export interface LegalPolicy {
  id: string;
  policyType: LegalPolicyType;
  title: string;
  description: string;
  status: LegalPolicyStatus;
  version: string;
  wordCount: number;
  lastUpdated: string;
  content: string;
  versionHistory: PolicyVersionEntry[];
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

const TERMS_CONTENT = `1. INTRODUCTION

These Terms and Conditions ("Terms") govern your use of the HomeBase marketplace platform ("Platform") operated by HomeBase Technologies Pvt. Ltd. ("Company", "we", "us"). By accessing or using our Platform, you agree to be bound by these Terms.

2. DEFINITIONS

"Buyer" means any person who purchases products through the Platform.
"Seller" means any person or entity that lists products for sale on the Platform.
"Products" means goods listed for sale by Sellers on the Platform.

3. ACCOUNT REGISTRATION

3.1 You must be at least 18 years old to create an account.
3.2 You must provide accurate and complete information during registration.
3.3 You are responsible for maintaining the confidentiality of your account credentials.

4. BUYING ON HOMEBASE

4.1 All purchases are subject to product availability.
4.2 Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.
4.3 We reserve the right to cancel orders if fraud or unauthorized activity is suspected.

5. PAYMENTS

5.1 We accept payments via UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.
5.2 All payment information is processed securely through our payment partners.

6. RETURNS AND REFUNDS

6.1 Return requests must be made within 30 days of delivery.
6.2 Products must be unused and in original packaging.
6.3 Refunds are processed within 5-7 business days after return receipt.`;

export const mockLegalPolicies: LegalPolicy[] = [
  {
    id: 'pol-001',
    policyType: 'terms',
    title: 'Terms & Conditions',
    description: 'Platform usage terms for customers',
    status: 'Published',
    version: '3.2',
    wordCount: 4250,
    lastUpdated: '15 Mar 2026',
    content: TERMS_CONTENT,
    versionHistory: [
      { version: 'v3.2', date: '15 Mar 2026', author: 'Super Admin' },
      { version: 'v3.1', date: '1 Feb 2026', author: 'Super Admin' },
      { version: 'v3.0', date: '15 Dec 2025', author: 'Super Admin' },
    ],
  },
  {
    id: 'pol-002',
    policyType: 'privacy',
    title: 'Privacy Policy',
    description: 'Data collection and usage policy',
    status: 'Published',
    version: '2.1',
    wordCount: 3800,
    lastUpdated: '10 Jan 2026',
    content: 'This privacy policy outlines how HomeBase collects, uses, and protects your personal information...',
    versionHistory: [
      { version: 'v2.1', date: '10 Jan 2026', author: 'Super Admin' },
      { version: 'v2.0', date: '15 Nov 2025', author: 'Super Admin' },
    ],
  },
  {
    id: 'pol-003',
    policyType: 'returns',
    title: 'Return & Refund Policy',
    description: 'Return window, refund rules, eligibility',
    status: 'Published',
    version: '4.0',
    wordCount: 2100,
    lastUpdated: '20 Feb 2026',
    content: 'Our return and refund policy ensures customer satisfaction while maintaining fair practices...',
    versionHistory: [
      { version: 'v4.0', date: '20 Feb 2026', author: 'Super Admin' },
      { version: 'v3.5', date: '10 Dec 2025', author: 'Super Admin' },
    ],
  },
  {
    id: 'pol-004',
    policyType: 'shipping',
    title: 'Shipping Policy',
    description: 'Delivery timelines, charges, zones',
    status: 'Published',
    version: '2.5',
    wordCount: 1500,
    lastUpdated: '5 Mar 2026',
    content: 'HomeBase partners with trusted logistics providers to deliver your orders safely and on time...',
    versionHistory: [
      { version: 'v2.5', date: '5 Mar 2026', author: 'Super Admin' },
      { version: 'v2.0', date: '1 Jan 2026', author: 'Super Admin' },
    ],
  },
  {
    id: 'pol-005',
    policyType: 'seller-agreement',
    title: 'Seller Agreement',
    description: 'Terms for marketplace sellers',
    status: 'Draft',
    version: '5.0-draft',
    wordCount: 6200,
    lastUpdated: '28 Mar 2026',
    content: 'This Seller Agreement governs the relationship between HomeBase and marketplace sellers...',
    versionHistory: [
      { version: 'v5.0-draft', date: '28 Mar 2026', author: 'Super Admin' },
      { version: 'v4.0', date: '1 Mar 2026', author: 'Super Admin' },
    ],
  },
  {
    id: 'pol-006',
    policyType: 'cookies',
    title: 'Cookie Policy',
    description: 'Cookie usage and consent',
    status: 'Published',
    version: '1.0',
    wordCount: 800,
    lastUpdated: '1 Jan 2026',
    content: 'This Cookie Policy explains how HomeBase uses cookies and similar technologies...',
    versionHistory: [
      { version: 'v1.0', date: '1 Jan 2026', author: 'Super Admin' },
    ],
  },
];
