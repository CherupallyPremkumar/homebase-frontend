/**
 * Mirrors Chenile's GenericResponse<T>.
 * Java field is "data" but serialized as "payload" via @JsonProperty("payload").
 */
export interface GenericResponse<T> {
  success: boolean;
  code: number;
  payload: T;
  description?: string;
  subErrorCode?: number;
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
  subErrorCode?: number;
  description: string;
  severity?: string;
}

/**
 * Chenile query SearchRequest — sent to query endpoints.
 * Pagination is 1-based: pageNum=1 is the first page.
 */
export interface SearchRequest<F = Record<string, unknown>> {
  queryName?: string;
  pageNum: number;
  pageSize: number;
  filters?: F;
  sortCriteria?: SortCriterion[];
}

export interface SortCriterion {
  field: string;
  order: 'ASC' | 'DESC';
}

/**
 * Chenile query SearchResponse — returned inside GenericResponse.payload.
 */
export interface SearchResponse<R = Record<string, unknown>> {
  list: ResponseRow<R>[];
  currentPage: number;
  maxPages: number;
  maxRows: number;
  numRowsInPage: number;
  numRowsReturned: number;
  startRow: number;
  endRow: number;
  columnMetadata: Record<string, ColumnMetadata>;
  hiddenColumns: string[];
  cannedReportName?: string;
  availableCannedReports: CannedReport[];
  data?: ResponseRow<R>;
}

export interface ResponseRow<R = Record<string, unknown>> {
  row: R;
  allowedActions: AllowedAction[];
}

export interface AllowedAction {
  allowedAction: string;
  acls?: string;
  bodyType?: string;
  mainPath?: string;
}

export interface ColumnMetadata {
  name: string;
  columnType: 'Text' | 'Number' | 'Date' | 'CheckBox';
  filterable: boolean;
  sortable: boolean;
  display: boolean;
  likeQuery: boolean;
  betweenQuery: boolean;
  containsQuery: boolean;
  customRender: boolean;
  group: string;
  columnName?: string;
  dropDownQuery?: string;
  dropDownValues?: Record<string, string>;
}

export interface CannedReport {
  name: string;
  description?: string;
}

/**
 * STM state entity response — returned by command (mutation) endpoints.
 * Wrapped in GenericResponse.payload.
 */
export interface StateEntityServiceResponse<T> {
  mutatedEntity: T;
  allowedActionsAndMetadata: AllowedAction[];
}

// Base entity fields matching backend BaseJpaEntity
export interface BaseEntity {
  id: string;
  createdTime?: string;
  lastModifiedTime?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  tenant?: string;
  version?: number;
}

// STM entity fields matching backend AbstractJpaStateEntity
export interface StateEntity extends BaseEntity {
  stateId: string;
  flowId: string;
  currentState?: {
    stateId: string;
    flowId: string;
  };
  stateEntryTime?: string;
  slaLate?: number;
  slaTendingLate?: number;
}

// Activity log entry
export interface ActivityLog {
  name: string;
  comment?: string;
  timestamp: string;
  performedBy?: string;
}

// Address
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

// Money
export interface Money {
  amount: number;
  currency: string;
}

// Pagination params for URL state (maps to SearchRequest)
export interface PaginationParams {
  pageNum: number;
  pageSize: number;
  sortCriteria?: SortCriterion[];
}
