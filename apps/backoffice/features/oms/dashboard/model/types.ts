export type {
  DashboardStats,
  DailyOrderStats,
  OrdersByState,
  Order,
} from '@homebase/types';

export interface OmsAlert {
  id: string;
  type: 'DELAYED_SHIPMENT' | 'SLA_BREACH' | 'STUCK_ORDER';
  message: string;
  entityId: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  createdTime: string;
}
