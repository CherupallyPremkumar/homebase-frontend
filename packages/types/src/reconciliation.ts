import type { StateEntity, ActivityLog } from './common';

export interface ReconciliationBatch extends StateEntity {
  batchDate: string;
  gatewayName: string;
  gatewayType?: string;
  totalTransactions: number;
  matchedCount: number;
  mismatchedCount: number;
  mismatchCount?: number;
  duplicateCount: number;
  totalAmount: number;
  matchedAmount: number;
  mismatchedAmount: number;
  activities: ActivityLog[];
}

export interface TransactionMismatch {
  id: string;
  batchId: string;
  gatewayTransactionId: string;
  systemTransactionId?: string;
  type: 'MISSING_IN_SYSTEM' | 'MISSING_IN_GATEWAY' | 'AMOUNT_MISMATCH' | 'STATUS_MISMATCH';
  gatewayAmount?: number;
  systemAmount?: number;
  resolution?: string;
  resolvedAt?: string;
}
