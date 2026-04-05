/**
 * Mock data for the Tax Rates feature.
 *
 * The TaxRateList component currently uses @homebase/api-client directly.
 * This file provides fallback mock data for development and testing.
 * When offline or testing, queries.ts can return this mock data instead.
 */

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: string;
  region: string;
  stateId: string;
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockTaxRates: TaxRate[] = [
  { id: 'TAX-001', name: 'GST Standard', rate: 18, type: 'GST', region: 'All India', stateId: 'ACTIVE' },
  { id: 'TAX-002', name: 'GST Reduced', rate: 12, type: 'GST', region: 'All India', stateId: 'ACTIVE' },
  { id: 'TAX-003', name: 'GST Low', rate: 5, type: 'GST', region: 'All India', stateId: 'ACTIVE' },
  { id: 'TAX-004', name: 'GST Exempt', rate: 0, type: 'GST', region: 'All India', stateId: 'ACTIVE' },
  { id: 'TAX-005', name: 'GST Luxury', rate: 28, type: 'GST', region: 'All India', stateId: 'ACTIVE' },
  { id: 'TAX-006', name: 'IGST Standard', rate: 18, type: 'IGST', region: 'Interstate', stateId: 'ACTIVE' },
  { id: 'TAX-007', name: 'Cess - Luxury', rate: 15, type: 'Cess', region: 'All India', stateId: 'DRAFT' },
];
