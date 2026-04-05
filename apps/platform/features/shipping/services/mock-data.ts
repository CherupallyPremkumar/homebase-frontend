/**
 * Mock data for the Shipping Management page.
 *
 * Each export matches the shape used by the component.
 * When backend endpoints are ready, swap mock imports in
 * use-shipping.ts for real fetch calls -- no component changes needed.
 */

import type {
  ShippingStatCard,
  CarrierLiveStatus,
  CarrierRow,
  ZoneRow,
  SlaRuleRow,
  SlaConfigItem,
  CarrierPerformanceItem,
  RateResult,
  ServiceabilityResult,
} from '../types';

// ----------------------------------------------------------------
// Stats
// ----------------------------------------------------------------

export const mockStats: ShippingStatCard[] = [
  {
    label: 'Active Carriers',
    value: '5',
    change: 'All carriers operational',
    changeType: 'positive',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Avg Delivery Time',
    value: '4.2 days',
    change: '-0.3 days vs last month',
    changeType: 'positive',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    label: 'On-time Delivery',
    value: '94.5%',
    change: '+1.2% this month',
    changeType: 'positive',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    label: 'PIN Code Coverage',
    value: '98%',
    change: '19,200 / 19,600 PIN codes',
    changeType: 'neutral',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

// ----------------------------------------------------------------
// Real-time carrier status
// ----------------------------------------------------------------

export const mockCarrierLiveStatus: CarrierLiveStatus[] = [
  {
    id: 'live-dl',
    name: 'Delhivery',
    shortCode: 'DL',
    subtitle: 'All services',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    status: 'Operational',
    uptime: '99.8%',
    latency: '120ms',
  },
  {
    id: 'live-bd',
    name: 'BlueDart',
    shortCode: 'BD',
    subtitle: 'All services',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    status: 'Operational',
    uptime: '99.9%',
    latency: '95ms',
  },
  {
    id: 'live-dt',
    name: 'DTDC',
    shortCode: 'DT',
    subtitle: 'Partial disruption',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    status: 'Degraded',
    uptime: '',
    latency: '',
    alert: 'Delays in NE region. ETA: 2-3 extra days for Assam, Meghalaya, Nagaland.',
  },
  {
    id: 'live-ip',
    name: 'India Post',
    shortCode: 'IP',
    subtitle: 'All services',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    status: 'Operational',
    uptime: '98.5%',
    latency: '340ms',
  },
];

// ----------------------------------------------------------------
// Carrier table
// ----------------------------------------------------------------

export const mockCarriers: CarrierRow[] = [
  {
    id: 'CAR-001',
    name: 'Delhivery',
    shortCode: 'DL',
    services: 'Express & Standard',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    status: 'Active',
    zones: 'All 6 zones',
    avgDeliveryDays: 3.5,
    costPerKg: 42,
    sla: '48h dispatch',
    rating: 4.6,
  },
  {
    id: 'CAR-002',
    name: 'BlueDart',
    shortCode: 'BD',
    services: 'Express & Priority',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    status: 'Active',
    zones: '4 zones',
    avgDeliveryDays: 3.2,
    costPerKg: 55,
    sla: '24h dispatch',
    rating: 4.8,
  },
  {
    id: 'CAR-003',
    name: 'DTDC',
    shortCode: 'DT',
    services: 'Standard & Economy',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    status: 'Active',
    zones: 'All 6 zones',
    avgDeliveryDays: 4.8,
    costPerKg: 35,
    sla: '48h dispatch',
    rating: 4.1,
  },
  {
    id: 'CAR-004',
    name: 'India Post',
    shortCode: 'IP',
    services: 'Economy & Speed Post',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    status: 'Limited',
    zones: 'All 6 zones',
    avgDeliveryDays: 6.5,
    costPerKg: 22,
    sla: '72h dispatch',
    rating: 3.8,
  },
  {
    id: 'CAR-005',
    name: 'Ecom Express',
    shortCode: 'EE',
    services: 'Standard & COD',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    status: 'Active',
    zones: '4 zones',
    avgDeliveryDays: 4.0,
    costPerKg: 38,
    sla: '48h dispatch',
    rating: 4.3,
  },
];

// ----------------------------------------------------------------
// Zone mapping
// ----------------------------------------------------------------

export const mockZones: ZoneRow[] = [
  {
    id: 'ZONE-001',
    name: 'Metro',
    dotColor: 'bg-green-500',
    regions: 'Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata',
    deliveryTime: '1-2 days',
    baseRate: 40,
    perKgRate: 15,
    freeAbove: 'Rs.499',
  },
  {
    id: 'ZONE-002',
    name: 'Tier-1',
    dotColor: 'bg-blue-500',
    regions: 'Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh + 15 more',
    deliveryTime: '2-4 days',
    baseRate: 50,
    perKgRate: 20,
    freeAbove: 'Rs.699',
  },
  {
    id: 'ZONE-003',
    name: 'Tier-2',
    dotColor: 'bg-purple-500',
    regions: 'Smaller cities, district HQs across India',
    deliveryTime: '4-6 days',
    baseRate: 60,
    perKgRate: 25,
    freeAbove: 'Rs.999',
  },
  {
    id: 'ZONE-004',
    name: 'Remote',
    dotColor: 'bg-amber-500',
    regions: 'Rural areas, hill stations, border regions',
    deliveryTime: '7-10 days',
    baseRate: 80,
    perKgRate: 35,
    freeAbove: 'Rs.1,499',
  },
  {
    id: 'ZONE-005',
    name: 'NE India',
    dotColor: 'bg-teal-500',
    regions: 'Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, Sikkim',
    deliveryTime: '8-12 days',
    baseRate: 100,
    perKgRate: 45,
    freeAbove: 'Rs.1,999',
  },
  {
    id: 'ZONE-006',
    name: 'J&K / Islands',
    dotColor: 'bg-red-500',
    regions: 'Jammu & Kashmir, Ladakh, A&N Islands, Lakshadweep',
    deliveryTime: '10-14 days',
    baseRate: 120,
    perKgRate: 50,
    freeAbove: 'Rs.2,499',
  },
];

// ----------------------------------------------------------------
// SLA rules
// ----------------------------------------------------------------

export const mockSlaRules: SlaRuleRow[] = [
  {
    id: 'SLA-001',
    carrierName: 'Delhivery',
    carrierCode: 'DL',
    carrierBg: 'bg-red-50',
    carrierText: 'text-red-600',
    zone: 'Metro',
    slaDays: 3,
    penaltyPerDay: 25,
    autoSwitchThreshold: '3 consecutive SLA breaches',
    performancePct: 96,
    performanceColor: 'bg-green-500',
    performanceLabelColor: 'text-green-600',
  },
  {
    id: 'SLA-002',
    carrierName: 'Delhivery',
    carrierCode: 'DL',
    carrierBg: 'bg-red-50',
    carrierText: 'text-red-600',
    zone: 'NE India',
    slaDays: 10,
    penaltyPerDay: 15,
    autoSwitchThreshold: '5 consecutive SLA breaches',
    performancePct: 88,
    performanceColor: 'bg-amber-500',
    performanceLabelColor: 'text-amber-600',
  },
  {
    id: 'SLA-003',
    carrierName: 'BlueDart',
    carrierCode: 'BD',
    carrierBg: 'bg-blue-50',
    carrierText: 'text-blue-600',
    zone: 'Metro',
    slaDays: 2,
    penaltyPerDay: 50,
    autoSwitchThreshold: '2 consecutive SLA breaches',
    performancePct: 97,
    performanceColor: 'bg-green-500',
    performanceLabelColor: 'text-green-600',
  },
  {
    id: 'SLA-004',
    carrierName: 'BlueDart',
    carrierCode: 'BD',
    carrierBg: 'bg-blue-50',
    carrierText: 'text-blue-600',
    zone: 'Tier-1',
    slaDays: 4,
    penaltyPerDay: 35,
    autoSwitchThreshold: '3 consecutive SLA breaches',
    performancePct: 95,
    performanceColor: 'bg-green-500',
    performanceLabelColor: 'text-green-600',
  },
  {
    id: 'SLA-005',
    carrierName: 'DTDC',
    carrierCode: 'DT',
    carrierBg: 'bg-orange-50',
    carrierText: 'text-orange-600',
    zone: 'J&K / Islands',
    slaDays: 12,
    penaltyPerDay: 10,
    autoSwitchThreshold: '5 consecutive SLA breaches',
    performancePct: 82,
    performanceColor: 'bg-red-500',
    performanceLabelColor: 'text-red-600',
  },
  {
    id: 'SLA-006',
    carrierName: 'India Post',
    carrierCode: 'IP',
    carrierBg: 'bg-amber-50',
    carrierText: 'text-amber-600',
    zone: 'Remote',
    slaDays: 10,
    penaltyPerDay: 8,
    autoSwitchThreshold: '7 consecutive SLA breaches',
    performancePct: 85,
    performanceColor: 'bg-amber-500',
    performanceLabelColor: 'text-amber-600',
  },
];

// ----------------------------------------------------------------
// SLA configuration
// ----------------------------------------------------------------

export const mockSlaConfig: SlaConfigItem[] = [
  { label: 'Max Dispatch Time', subtitle: 'After order confirmation', value: 48, unit: 'hours' },
  { label: 'Max Delivery - Metro', subtitle: 'Tier 0 cities', value: 3, unit: 'days' },
  { label: 'Max Delivery - Tier 1', subtitle: 'Major cities', value: 5, unit: 'days' },
  { label: 'Max Delivery - Tier 2', subtitle: 'Smaller cities', value: 7, unit: 'days' },
  { label: 'Max Delivery - Remote/Special', subtitle: 'Hard-to-reach areas', value: 14, unit: 'days' },
];

// ----------------------------------------------------------------
// Carrier performance
// ----------------------------------------------------------------

export const mockCarrierPerformance: CarrierPerformanceItem[] = [
  { name: 'BlueDart', pct: 97.2, barColor: 'bg-blue-500' },
  { name: 'Delhivery', pct: 95.8, barColor: 'bg-red-500' },
  { name: 'Ecom Express', pct: 93.5, barColor: 'bg-green-500' },
  { name: 'DTDC', pct: 91.0, barColor: 'bg-orange-500' },
  { name: 'India Post', pct: 85.3, barColor: 'bg-amber-500' },
];

// ----------------------------------------------------------------
// Rate calculator defaults
// ----------------------------------------------------------------

export const mockRateResults: RateResult[] = [
  {
    carrier: 'BlueDart Express',
    code: 'BD',
    codeBg: 'bg-blue-100',
    codeText: 'text-blue-700',
    days: '2-3 days delivery',
    price: 137,
    tag: 'FASTEST',
    tagBg: 'bg-green-100',
    tagText: 'text-green-700',
    highlighted: true,
  },
  {
    carrier: 'Delhivery Standard',
    code: 'DL',
    codeBg: 'bg-red-100',
    codeText: 'text-red-700',
    days: '3-4 days delivery',
    price: 105,
    tag: 'BEST VALUE',
    tagBg: 'bg-blue-100',
    tagText: 'text-blue-700',
    highlighted: false,
  },
  {
    carrier: 'Ecom Express',
    code: 'EE',
    codeBg: 'bg-green-100',
    codeText: 'text-green-700',
    days: '3-5 days delivery',
    price: 95,
    tag: 'CHEAPEST',
    tagBg: 'bg-gray-200',
    tagText: 'text-gray-600',
    highlighted: false,
  },
  {
    carrier: 'DTDC Standard',
    code: 'DT',
    codeBg: 'bg-orange-100',
    codeText: 'text-orange-700',
    days: '4-5 days delivery',
    price: 88,
    tag: '',
    tagBg: '',
    tagText: '',
    highlighted: false,
  },
  {
    carrier: 'India Post Speed Post',
    code: 'IP',
    codeBg: 'bg-amber-100',
    codeText: 'text-amber-700',
    days: '5-7 days delivery',
    price: 55,
    tag: '',
    tagBg: '',
    tagText: '',
    highlighted: false,
  },
];

// ----------------------------------------------------------------
// Serviceability check default
// ----------------------------------------------------------------

export const mockServiceabilityResult: ServiceabilityResult = {
  pin: '560001',
  location: 'Bangalore, Karnataka',
  zone: 'Metro',
  carriersAvailable: 5,
  status: 'Serviceable',
  carriers: [
    { name: 'Delhivery', service: 'Express + Standard', estDelivery: '1-2 days', cod: true, status: 'Active' },
    { name: 'BlueDart', service: 'Express + Priority', estDelivery: '1-2 days', cod: true, status: 'Active' },
    { name: 'DTDC', service: 'Standard + Economy', estDelivery: '2-3 days', cod: true, status: 'Active' },
    { name: 'Ecom Express', service: 'Standard + COD', estDelivery: '2-3 days', cod: true, status: 'Active' },
    { name: 'India Post', service: 'Speed Post', estDelivery: '3-5 days', cod: false, status: 'Limited' },
  ],
};
