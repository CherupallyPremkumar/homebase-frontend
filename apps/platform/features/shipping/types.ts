/**
 * Types for the Shipping Management feature.
 *
 * All types are defined locally -- no re-exports from @homebase/types.
 * When the backend contract stabilises, align these with the real DTOs.
 */

// ----------------------------------------------------------------
// Status unions
// ----------------------------------------------------------------

export type CarrierOperationalStatus = 'Operational' | 'Degraded' | 'Down';

export type CarrierStatus = 'Active' | 'Limited' | 'Inactive';

export type CarrierFilterTab = 'all' | 'active' | 'limited';

export type RateTag = 'FASTEST' | 'BEST VALUE' | 'CHEAPEST' | '';

export type ServiceabilityStatus = 'Serviceable' | 'Limited' | 'Not Serviceable';

// ----------------------------------------------------------------
// Stat cards
// ----------------------------------------------------------------

export interface ShippingStatCard {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'neutral';
  iconBg: string;
  iconColor: string;
}

// ----------------------------------------------------------------
// Real-time carrier status (live panel)
// ----------------------------------------------------------------

export interface CarrierLiveStatus {
  id: string;
  name: string;
  shortCode: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  status: CarrierOperationalStatus;
  uptime: string;
  latency: string;
  alert?: string;
}

// ----------------------------------------------------------------
// Carrier table row
// ----------------------------------------------------------------

export interface CarrierRow {
  id: string;
  name: string;
  shortCode: string;
  services: string;
  bgColor: string;
  textColor: string;
  status: CarrierStatus;
  zones: string;
  avgDeliveryDays: number;
  costPerKg: number;
  sla: string;
  rating: number;
}

// ----------------------------------------------------------------
// Zone mapping row
// ----------------------------------------------------------------

export interface ZoneRow {
  id: string;
  name: string;
  dotColor: string;
  regions: string;
  deliveryTime: string;
  baseRate: number;
  perKgRate: number;
  freeAbove: string;
}

// ----------------------------------------------------------------
// Carrier SLA rule row
// ----------------------------------------------------------------

export interface SlaRuleRow {
  id: string;
  carrierName: string;
  carrierCode: string;
  carrierBg: string;
  carrierText: string;
  zone: string;
  slaDays: number;
  penaltyPerDay: number;
  autoSwitchThreshold: string;
  performancePct: number;
  performanceColor: string;
  performanceLabelColor: string;
}

// ----------------------------------------------------------------
// SLA configuration item
// ----------------------------------------------------------------

export interface SlaConfigItem {
  label: string;
  subtitle: string;
  value: number;
  unit: string;
}

// ----------------------------------------------------------------
// Carrier performance bar
// ----------------------------------------------------------------

export interface CarrierPerformanceItem {
  name: string;
  pct: number;
  barColor: string;
}

// ----------------------------------------------------------------
// Rate calculator result
// ----------------------------------------------------------------

export interface RateResult {
  carrier: string;
  code: string;
  codeBg: string;
  codeText: string;
  days: string;
  price: number;
  tag: RateTag;
  tagBg: string;
  tagText: string;
  highlighted: boolean;
}

// ----------------------------------------------------------------
// Serviceability check carrier row
// ----------------------------------------------------------------

export interface ServiceabilityCarrierRow {
  name: string;
  service: string;
  estDelivery: string;
  cod: boolean;
  status: CarrierStatus;
}

// ----------------------------------------------------------------
// Serviceability result
// ----------------------------------------------------------------

export interface ServiceabilityResult {
  pin: string;
  location: string;
  zone: string;
  carriersAvailable: number;
  status: ServiceabilityStatus;
  carriers: ServiceabilityCarrierRow[];
}
