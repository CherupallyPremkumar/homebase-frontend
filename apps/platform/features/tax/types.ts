/**
 * Types for the Tax feature.
 */

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: string;
  region: string;
  stateId: string;
}
