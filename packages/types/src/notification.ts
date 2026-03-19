import type { StateEntity, ActivityLog } from './common';

export interface Notification extends StateEntity {
  userId: string;
  type: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  subject?: string;
  body: string;
  referenceId?: string;
  referenceType?: string;
  readAt?: string;
  sentAt?: string;
  activities: ActivityLog[];
}

export interface NotificationPreference {
  id: string;
  userId: string;
  channel: string;
  eventType: string;
  enabled: boolean;
}
