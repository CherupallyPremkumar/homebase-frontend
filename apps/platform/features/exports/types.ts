/**
 * Types for the Data Exports feature.
 */

export type ExportFormat = 'CSV' | 'Excel' | 'JSON';

export type ExportStatus = 'Completed' | 'Processing' | 'Failed';

export type ScheduleFrequency = 'Daily' | 'Weekly' | 'Monthly';

export interface AvailableExport {
  id: string;
  name: string;
  description: string;
  lastExported: string;
  estimatedSize: string;
  formats: ExportFormat[];
  records: string;
  iconBg: string;
  iconColor: string;
}

export interface ScheduledExport {
  id: string;
  name: string;
  schedule: string;
  format: ExportFormat;
  recipients: string;
  status: 'Active' | 'Paused';
  iconBg: string;
  iconColor: string;
}

export interface ExportHistoryEntry {
  id: string;
  name: string;
  date: string;
  format: ExportFormat;
  size: string;
  status: ExportStatus;
}

export interface ExportsPageResponse {
  availableExports: AvailableExport[];
  scheduledExports: ScheduledExport[];
  history: ExportHistoryEntry[];
}
