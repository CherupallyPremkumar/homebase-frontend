import type { StateEntity, Address, ActivityLog } from './common';

export interface Supplier extends StateEntity {
  businessName: string;
  legalName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin?: string;
  pan?: string;
  taxId?: string;
  businessAddress?: Address;
  warehouseAddress?: Address;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  productCount: number;
  rating?: number;
  performanceScore?: number;
  commissionRate?: number;
  activities: ActivityLog[];
}

export interface SupplierOnboarding extends StateEntity {
  supplierId: string;
  businessName: string;
  documentsUploaded: boolean;
  businessVerified: boolean;
  trainingCompleted: boolean;
  activities: ActivityLog[];
}

export interface SupplierPerformanceMetrics {
  supplierId: string;
  orderFulfillmentRate: number;
  averageShippingTime: number;
  returnRate: number;
  customerRating: number;
  responseTime: number;
  period: string;
}
