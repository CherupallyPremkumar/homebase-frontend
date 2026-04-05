/**
 * Types for the Audit Log feature.
 */

export type AuditAction =
  | 'Suspended'
  | 'Approved'
  | 'Flagged'
  | 'Updated'
  | 'Processed'
  | 'Override'
  | 'Created'
  | 'Deleted'
  | 'Modified'
  | 'Published'
  | 'Force Refund';

export type EntityType = 'User' | 'Seller' | 'Product' | 'Order' | 'Settings';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  admin: {
    name: string;
    initials: string;
    avatarGradient: string;
  };
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  details: string;
  ipAddress: string;
  isCritical: boolean;
  expandedData?: {
    before: Record<string, string>;
    after: Record<string, string>;
  };
}

export interface AuditStats {
  totalActionsToday: number;
  adminUsersActive: number;
  criticalActions: number;
}

export interface AuditListResponse {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditListFilters {
  search: string;
  admin: string;
  action: string;
  entity: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  pageSize: number;
}
