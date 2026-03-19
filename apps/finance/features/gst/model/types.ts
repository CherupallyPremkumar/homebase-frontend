export interface GstSummary {
  month: string;
  year: number;
  totalTaxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  tcs: number;
  filingStatus: 'FILED' | 'PENDING' | 'OVERDUE';
  filingDate?: string;
}

export interface GstSummaryResponse {
  summaries: GstSummary[];
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalGst: number;
  totalTcs: number;
}
