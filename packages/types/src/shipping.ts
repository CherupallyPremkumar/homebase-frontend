import type { StateEntity, Address, ActivityLog } from './common';

export interface Shipment extends StateEntity {
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  carrierTrackingUrl?: string;
  shippingAddress: Address;
  estimatedDelivery?: string;
  estimatedDeliveryDate?: string;
  actualDelivery?: string;
  actualDeliveryDate?: string;
  weight?: number;
  dimensions?: ShipmentDimensions;
  shippingCost: number;
  currency: string;
  trackingEvents: TrackingEvent[];
  activities: ActivityLog[];
}

export interface ShipmentDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface TrackingEvent {
  status: string;
  location?: string;
  timestamp: string;
  description: string;
}

export interface ShippingRate {
  carrierId: string;
  carrierName: string;
  serviceName: string;
  rate: number;
  currency: string;
  estimatedDays: number;
  estimatedDelivery: string;
}

export interface DeliveryEstimateRequest {
  pincode: string;
  productIds: string[];
}
