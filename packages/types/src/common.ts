// Generic response wrapper from backend
export interface GenericResponse<T> {
  success: boolean;
  code: number;
  data: T;
  description?: string;
  severity?: 'ERROR' | 'WARNING' | 'INFO';
  errors?: ResponseError[];
  warningMessages?: ResponseWarning[];
}

export interface ResponseError {
  errorNum: number;
  subErrorNum: number;
  description: string;
  field?: string;
  params?: string[];
}

export interface ResponseWarning {
  code: number;
  description: string;
}

// Search/Query types (CQRS read side)
export interface SearchRequest {
  queryName?: string;
  page: number;
  size: number;
  sort?: string;
  sortOrder?: 'ASC' | 'DESC';
  filters?: Record<string, unknown>;
  q?: string;
}

export interface SearchResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// STM types
export interface StateEntityServiceResponse<T> {
  mutatedEntity: T;
  allowedActionsAndMetadata: AllowedAction[];
}

export interface AllowedAction {
  eventId: string;
  metadata: Record<string, string>;
  bodyType?: string;
}

// Base entity fields matching backend BaseEntity/BaseJpaEntity
export interface BaseEntity {
  id: string;
  createdTime: string;
  lastModifiedTime: string;
  createdBy?: string;
  lastModifiedBy?: string;
  version: number;
}

// STM entity fields matching backend AbstractExtendedStateEntity
export interface StateEntity extends BaseEntity {
  stateId: string;
  flowId: string;
  stateEntryTime?: string;
  slaLate?: boolean;
  slaTendingLate?: boolean;
}

// Activity log entry
export interface ActivityLog {
  name: string;
  comment?: string;
  timestamp: string;
  performedBy?: string;
}

// Address (used across user, order, checkout, shipping)
export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
  type?: 'HOME' | 'WORK' | 'OTHER';
}

// Money type
export interface Money {
  amount: number;
  currency: string;
}

// Pagination params for URL state
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  sortOrder?: 'ASC' | 'DESC';
}
