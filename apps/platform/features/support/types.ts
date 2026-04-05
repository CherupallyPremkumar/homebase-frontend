/**
 * Types for the Support Center feature.
 */

export type TicketStatus = 'Open' | 'Escalated' | 'Resolved' | 'Closed';
export type TicketPriority = 'High' | 'Medium' | 'Low';
export type TicketType = 'Customer' | 'Seller';

export interface SupportTicket {
  id: string;
  customerName: string;
  type: TicketType;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  date: string;
}

export interface SupportStats {
  open: number;
  escalated: number;
  avgResponseHrs: number;
  slaBreach: number;
}

export interface SupportTab {
  key: string;
  label: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  views: number;
}

export interface SupportListResponse {
  tickets: SupportTicket[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SupportListFilters {
  search: string;
  tab: string;
  page: number;
  pageSize: number;
}
