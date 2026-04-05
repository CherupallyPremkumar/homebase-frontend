/**
 * Types for the Reports feature.
 *
 * All types are defined locally -- no re-exports from @homebase/types.
 * When the backend contract stabilises, align these with the real DTOs.
 */

// ----------------------------------------------------------------
// Status unions
// ----------------------------------------------------------------

export type ReportFormat = 'PDF' | 'CSV' | 'Excel';

export type ScheduleStatus = 'Active' | 'Paused';

// ----------------------------------------------------------------
// Report card (top grid)
// ----------------------------------------------------------------

export interface ReportCard {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
}

// ----------------------------------------------------------------
// Scheduled report (middle table)
// ----------------------------------------------------------------

export interface ScheduledReport {
  id: string;
  reportName: string;
  reportType: string;
  format: ReportFormat;
  frequency: string;
  nextRun: string;
  recipient: string;
  status: ScheduleStatus;
  iconBg: string;
  iconColor: string;
}

// ----------------------------------------------------------------
// Download history row (bottom table)
// ----------------------------------------------------------------

export interface DownloadHistoryItem {
  id: string;
  fileName: string;
  generatedOn: string;
  format: ReportFormat;
  size: string;
  iconBg: string;
  iconColor: string;
}
