/**
 * Mock data for the Reports page.
 *
 * Each export matches the shape returned by the real API contract.
 * When the backend endpoints are ready, swap the mock imports in
 * use-reports.ts for real fetch calls -- no component changes needed.
 */

import type {
  ReportCard,
  ScheduledReport,
  DownloadHistoryItem,
} from '../types';

// ----------------------------------------------------------------
// Report Cards (6 cards, 3-col grid)
// ----------------------------------------------------------------

export const mockReportCards: ReportCard[] = [
  {
    id: 'RPT-001',
    name: 'Sales Report',
    description: 'Revenue, orders, GMV breakdown by period, category, and seller with trend analysis.',
    lastGenerated: 'Mar 25, 2026',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    badge: 'Popular',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-700',
  },
  {
    id: 'RPT-002',
    name: 'Seller Performance',
    description: 'Individual seller metrics: order fulfillment, returns, ratings, SLA compliance, and revenue.',
    lastGenerated: 'Mar 22, 2026',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'RPT-003',
    name: 'Tax Report (GSTR-1/3B)',
    description: 'GST-compliant tax reports for filing. GSTR-1 outward supplies and GSTR-3B summary returns.',
    lastGenerated: 'Mar 20, 2026',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    badge: 'Compliance',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
  },
  {
    id: 'RPT-004',
    name: 'Inventory Report',
    description: 'Stock levels, low inventory alerts, dead stock identification, and warehouse utilization.',
    lastGenerated: 'Mar 18, 2026',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'RPT-005',
    name: 'Financial Reconciliation',
    description: 'Payment gateway reconciliation, settlement summaries, commission tracking, and refund ledger.',
    lastGenerated: 'Mar 15, 2026',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    badge: 'Finance',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
  },
  {
    id: 'RPT-006',
    name: 'Customer Analytics',
    description: 'User acquisition, retention cohorts, LTV analysis, geographic distribution, and behavior funnels.',
    lastGenerated: 'Mar 24, 2026',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
];

// ----------------------------------------------------------------
// Scheduled Reports
// ----------------------------------------------------------------

export const mockScheduledReports: ScheduledReport[] = [
  {
    id: 'SCH-001',
    reportName: 'Weekly Sales Summary',
    reportType: 'Sales Report',
    format: 'CSV',
    frequency: 'Weekly (Monday)',
    nextRun: 'Mar 31, 2026',
    recipient: 'admin@homebase.in',
    status: 'Active',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 'SCH-002',
    reportName: 'Monthly GSTR-1 Report',
    reportType: 'Tax Report',
    format: 'Excel',
    frequency: 'Monthly (1st)',
    nextRun: 'Apr 1, 2026',
    recipient: 'finance@homebase.in',
    status: 'Active',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'SCH-003',
    reportName: 'Seller KPI Dashboard',
    reportType: 'Seller Performance',
    format: 'PDF',
    frequency: 'Bi-weekly (Fri)',
    nextRun: 'Apr 4, 2026',
    recipient: 'ops@homebase.in',
    status: 'Active',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'SCH-004',
    reportName: 'Inventory Snapshot',
    reportType: 'Inventory Report',
    format: 'CSV',
    frequency: 'Daily (6 AM)',
    nextRun: 'Paused',
    recipient: 'warehouse@homebase.in',
    status: 'Paused',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

// ----------------------------------------------------------------
// Download History
// ----------------------------------------------------------------

export const mockDownloadHistory: DownloadHistoryItem[] = [
  {
    id: 'DL-001',
    fileName: 'Sales_Report_Mar2026_Week4.csv',
    generatedOn: 'Mar 25, 2026 09:15 AM',
    format: 'CSV',
    size: '2.4 MB',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 'DL-002',
    fileName: 'GSTR1_February_2026.xlsx',
    generatedOn: 'Mar 20, 2026 11:30 AM',
    format: 'Excel',
    size: '5.8 MB',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'DL-003',
    fileName: 'Inventory_Snapshot_20260318.csv',
    generatedOn: 'Mar 18, 2026 06:00 AM',
    format: 'CSV',
    size: '1.2 MB',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'DL-004',
    fileName: 'Financial_Recon_March_W2.pdf',
    generatedOn: 'Mar 15, 2026 02:45 PM',
    format: 'PDF',
    size: '3.1 MB',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  {
    id: 'DL-005',
    fileName: 'Customer_Analytics_Q1_2026.xlsx',
    generatedOn: 'Mar 24, 2026 10:00 AM',
    format: 'Excel',
    size: '4.7 MB',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
];
