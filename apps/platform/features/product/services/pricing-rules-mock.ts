/**
 * Mock data for the Pricing Rules feature.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in
 * use-pricing-rules.ts for real fetch calls -- no component changes needed.
 */

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type PricingRuleType = 'Markup' | 'Discount' | 'Floor' | 'Ceiling';

export type PricingRuleStatus = 'Active' | 'Inactive' | 'Draft';

export type PricingRuleScope = 'Category' | 'Brand' | 'All';

export interface PricingRule {
  id: string;
  name: string;
  type: PricingRuleType;
  typeLabel: string;
  scope: PricingRuleScope;
  value: string;
  status: PricingRuleStatus;
  enabled: boolean;
  productsAffected: number;
  conversions: string;
  revenueImpact: string;
  revenueImpactColor: 'emerald' | 'red' | 'muted';
}

export interface PricingRuleStat {
  label: string;
  value: string;
  subtitle: string;
  subtitleColor?: string;
}

export interface PricingRuleStats {
  activeRules: PricingRuleStat;
  productsAffected: PricingRuleStat;
  avgDiscount: PricingRuleStat;
  revenueImpact: PricingRuleStat;
}

export interface RuleConflict {
  id: string;
  title: string;
  ruleA: string;
  ruleADetail: string;
  ruleB: string;
  ruleBDetail: string;
  resultLine: string;
  resultHighlight: string;
  affectedLine: string;
}

export interface PriceChangeLogEntry {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
}

// ----------------------------------------------------------------
// Mock Stats
// ----------------------------------------------------------------

export const mockPricingRuleStats: PricingRuleStats = {
  activeRules: { label: 'Active Rules', value: '12', subtitle: '3 added this month' },
  productsAffected: { label: 'Products Affected', value: '2,340', subtitle: 'Across 8 categories' },
  avgDiscount: { label: 'Avg Discount', value: '8.5%', subtitle: 'Weighted average' },
  revenueImpact: { label: 'Revenue Impact', value: '+\u20B94.2L', subtitle: 'This month vs baseline', subtitleColor: 'text-green-600' },
};

// ----------------------------------------------------------------
// Mock Conflict
// ----------------------------------------------------------------

export const mockRuleConflict: RuleConflict = {
  id: 'CONFLICT-001',
  title: 'Rule Conflict Detected',
  ruleA: 'Min Price - Fashion',
  ruleADetail: 'Floor \u20B9500',
  ruleB: 'Clearance Sale',
  ruleBDetail: 'Discount 60%',
  resultLine: '\u20B9500 base price - 60% = ',
  resultHighlight: '\u20B9200 (below floor!)',
  affectedLine: 'Affects 3 products in Fashion category: SKU-2241, SKU-2245, SKU-2250',
};

// ----------------------------------------------------------------
// Mock Pricing Rules
// ----------------------------------------------------------------

export const mockPricingRules: PricingRule[] = [
  {
    id: 'PR-001',
    name: 'Electronics Markup',
    type: 'Markup',
    typeLabel: 'Markup +15%',
    scope: 'Category',
    value: '+15%',
    status: 'Active',
    enabled: true,
    productsAffected: 580,
    conversions: '12.4%',
    revenueImpact: '+\u20B91.8L',
    revenueImpactColor: 'emerald',
  },
  {
    id: 'PR-002',
    name: 'Festival Discount',
    type: 'Discount',
    typeLabel: 'Discount -10%',
    scope: 'All',
    value: '-10%',
    status: 'Active',
    enabled: true,
    productsAffected: 2340,
    conversions: '18.2%',
    revenueImpact: '+\u20B93.1L',
    revenueImpactColor: 'emerald',
  },
  {
    id: 'PR-003',
    name: 'Min Price - Fashion',
    type: 'Floor',
    typeLabel: 'Floor \u20B9199',
    scope: 'Category',
    value: '\u20B9199',
    status: 'Active',
    enabled: true,
    productsAffected: 420,
    conversions: '9.8%',
    revenueImpact: '+\u20B90.6L',
    revenueImpactColor: 'emerald',
  },
  {
    id: 'PR-004',
    name: 'Max Price - Samsung',
    type: 'Ceiling',
    typeLabel: 'Ceiling \u20B999,999',
    scope: 'Brand',
    value: '\u20B999,999',
    status: 'Active',
    enabled: true,
    productsAffected: 145,
    conversions: '14.5%',
    revenueImpact: '--',
    revenueImpactColor: 'muted',
  },
  {
    id: 'PR-005',
    name: 'Home & Kitchen Markup',
    type: 'Markup',
    typeLabel: 'Markup +12%',
    scope: 'Category',
    value: '+12%',
    status: 'Active',
    enabled: true,
    productsAffected: 310,
    conversions: '11.1%',
    revenueImpact: '+\u20B90.9L',
    revenueImpactColor: 'emerald',
  },
  {
    id: 'PR-006',
    name: 'Clearance Sale',
    type: 'Discount',
    typeLabel: 'Discount -25%',
    scope: 'All',
    value: '-25%',
    status: 'Inactive',
    enabled: false,
    productsAffected: 890,
    conversions: '--',
    revenueImpact: '--',
    revenueImpactColor: 'muted',
  },
  {
    id: 'PR-007',
    name: 'Min Price - Electronics',
    type: 'Floor',
    typeLabel: 'Floor \u20B9499',
    scope: 'Category',
    value: '\u20B9499',
    status: 'Active',
    enabled: true,
    productsAffected: 580,
    conversions: '10.2%',
    revenueImpact: '+\u20B90.4L',
    revenueImpactColor: 'emerald',
  },
  {
    id: 'PR-008',
    name: 'New Seller Discount',
    type: 'Discount',
    typeLabel: 'Discount -5%',
    scope: 'All',
    value: '-5%',
    status: 'Active',
    enabled: true,
    productsAffected: 2340,
    conversions: '15.8%',
    revenueImpact: '-\u20B92.6L',
    revenueImpactColor: 'red',
  },
];

// ----------------------------------------------------------------
// Mock Price Change Log
// ----------------------------------------------------------------

export const mockPriceChangeLog: PriceChangeLogEntry[] = [
  {
    id: 'PCL-001',
    title: 'Festival Discount applied to All Products',
    description: '-10% across 2,340 products',
    timeAgo: '2 days ago',
  },
  {
    id: 'PCL-002',
    title: 'Electronics Markup updated from 12% to 15%',
    description: 'Affected 580 products',
    timeAgo: '5 days ago',
  },
  {
    id: 'PCL-003',
    title: 'Clearance Sale paused',
    description: '890 products reverted to original price',
    timeAgo: '1 week ago',
  },
  {
    id: 'PCL-004',
    title: 'Floor price set for Fashion category',
    description: 'Minimum price \u20B9199 for 420 products',
    timeAgo: '2 weeks ago',
  },
  {
    id: 'PCL-005',
    title: 'Samsung ceiling price added',
    description: 'Max \u20B999,999 for 145 Samsung products',
    timeAgo: '3 weeks ago',
  },
];
