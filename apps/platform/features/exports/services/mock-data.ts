/**
 * Mock data for the Data Exports page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in
 * queries.ts for real fetch calls -- no component changes needed.
 */

import type {
  AvailableExport,
  ScheduledExport,
  ExportHistoryEntry,
  ExportsPageResponse,
} from '../types';

export type {
  ExportFormat,
  ExportStatus,
  ScheduleFrequency,
  AvailableExport,
  ScheduledExport,
  ExportHistoryEntry,
  ExportsPageResponse,
} from '../types';

// ----------------------------------------------------------------
// Available Exports
// ----------------------------------------------------------------

export const mockAvailableExports: AvailableExport[] = [
  {
    id: 'exp-orders',
    name: 'Orders',
    description: 'All orders with line items',
    lastExported: 'Mar 28, 2026',
    estimatedSize: '~8.7 MB',
    formats: ['CSV', 'Excel', 'JSON'],
    records: '12,450',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'exp-products',
    name: 'Products',
    description: 'Full product catalog',
    lastExported: 'Mar 25, 2026',
    estimatedSize: '~4.2 MB',
    formats: ['CSV', 'Excel', 'JSON'],
    records: '8,240',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'exp-customers',
    name: 'Customers',
    description: 'Active customer profiles',
    lastExported: 'Mar 22, 2026',
    estimatedSize: '~3.1 MB',
    formats: ['CSV', 'Excel'],
    records: '24,100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'exp-sellers',
    name: 'Sellers',
    description: 'Seller profiles and metrics',
    lastExported: 'Mar 20, 2026',
    estimatedSize: '~1.8 MB',
    formats: ['CSV', 'Excel'],
    records: '234',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: 'exp-transactions',
    name: 'Transactions',
    description: 'Payment and refund records',
    lastExported: 'Mar 27, 2026',
    estimatedSize: '~12.3 MB',
    formats: ['CSV', 'Excel', 'JSON'],
    records: '34,200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'exp-inventory',
    name: 'Inventory',
    description: 'Stock levels and SKU data',
    lastExported: 'Mar 23, 2026',
    estimatedSize: '~5.4 MB',
    formats: ['CSV', 'JSON'],
    records: '15,670',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
];

// ----------------------------------------------------------------
// Scheduled Exports
// ----------------------------------------------------------------

export const mockScheduledExports: ScheduledExport[] = [
  {
    id: 'sched-001',
    name: 'Daily Orders Export',
    schedule: 'Every day at 2:00 AM IST',
    format: 'CSV',
    recipients: 'ops@homebase.in, finance@homebase.in',
    status: 'Active',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'sched-002',
    name: 'Weekly Revenue Report',
    schedule: 'Every Monday at 8:00 AM IST',
    format: 'Excel',
    recipients: 'cfo@homebase.in, finance@homebase.in',
    status: 'Active',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
];

// ----------------------------------------------------------------
// Export History
// ----------------------------------------------------------------

export const mockExportHistory: ExportHistoryEntry[] = [
  { id: 'hist-001', name: 'Orders - March 2026', date: 'Mar 28, 2026 at 2:00 AM', format: 'CSV', size: '8.5 MB', status: 'Completed' },
  { id: 'hist-002', name: 'Products - Full Catalog', date: 'Mar 25, 2026 at 10:32 AM', format: 'CSV', size: '4.1 MB', status: 'Completed' },
  { id: 'hist-003', name: 'Weekly Revenue Report', date: 'Mar 24, 2026 at 8:00 AM', format: 'Excel', size: '12.1 MB', status: 'Completed' },
  { id: 'hist-004', name: 'Customers - Active', date: 'Mar 22, 2026 at 9:45 AM', format: 'CSV', size: '3.0 MB', status: 'Completed' },
  { id: 'hist-005', name: 'Sellers - All', date: 'Mar 20, 2026 at 11:20 AM', format: 'CSV', size: '1.7 MB', status: 'Completed' },
];

// ----------------------------------------------------------------
// Combined Response
// ----------------------------------------------------------------

export const mockExportsPage: ExportsPageResponse = {
  availableExports: mockAvailableExports,
  scheduledExports: mockScheduledExports,
  history: mockExportHistory,
};
