import type { StateEntity, ActivityLog } from './common';

export interface SupportTicket extends StateEntity {
  userId: string;
  orderId?: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  assignedTo?: string;
  messages: TicketMessage[];
  activities: ActivityLog[];
  slaDeadline?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'CUSTOMER' | 'AGENT' | 'SYSTEM';
  body: string;
  attachments?: string[];
  createdAt: string;
}
