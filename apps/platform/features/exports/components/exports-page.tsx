'use client';

import { useState } from 'react';
import {
  Download, AlertTriangle, Inbox, Clock,
  ClipboardList, Package, Users, Store, DollarSign, Archive,
  Calendar, X,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Skeleton } from '@homebase/ui';

import { useExportsPage } from '../hooks/use-exports';
import type {
  AvailableExport,
  ScheduledExport,
  ExportHistoryEntry,
  ExportFormat,
  ExportStatus,
} from '../types';

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Data Exports',
  pageSubtitle: 'Export platform data in CSV, Excel, and JSON formats',
  scheduleExport: 'Schedule Export',
  availableExports: 'Available Exports',
  scheduledExports: 'Scheduled Exports',
  exportHistory: 'Export History',
  exportNow: 'Export Now',
  download: 'Download',
  editSchedule: 'Edit Schedule',
  delete: 'Delete',
  errorTitle: 'Failed to load exports',
  retry: 'Retry',
  emptyHistory: 'No export history yet',
  // Available Exports table
  colExport: 'Export',
  colLastExported: 'Last Exported',
  colEstSize: 'Est. Size',
  colFormat: 'Format',
  colRecords: 'Records',
  colAction: 'Action',
  // History table
  colExportName: 'Export Name',
  colDate: 'Date',
  colSize: 'Size',
  colStatus: 'Status',
  // Modal
  modalTitle: 'Schedule Export',
  modalExportType: 'Export Type',
  modalFrequency: 'Frequency',
  modalFormat: 'Format',
  modalRecipients: 'Email Recipients',
  modalRecipientsPlaceholder: 'e.g., ops@homebase.in, finance@homebase.in',
  modalCancel: 'Cancel',
  modalCreate: 'Create Schedule',
} as const;

const FORMAT_BADGE: Record<ExportFormat, string> = {
  CSV: 'bg-blue-100 text-blue-700',
  Excel: 'bg-emerald-100 text-emerald-700',
  JSON: 'bg-purple-100 text-purple-700',
};

const STATUS_BADGE: Record<ExportStatus, string> = {
  Completed: 'bg-green-50 text-green-600',
  Processing: 'bg-yellow-50 text-yellow-600',
  Failed: 'bg-red-50 text-red-600',
};

const EXPORT_ICONS: Record<string, typeof Package> = {
  'exp-orders': ClipboardList,
  'exp-products': Package,
  'exp-customers': Users,
  'exp-sellers': Store,
  'exp-transactions': DollarSign,
  'exp-inventory': Archive,
};

const SCHEDULE_ICONS: Record<string, typeof Clock> = {
  'sched-001': Clock,
  'sched-002': Calendar,
};

// ----------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------

function ExportsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading exports">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-44 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

// ----------------------------------------------------------------
// Schedule Export Modal
// ----------------------------------------------------------------

function ScheduleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{TEXT.modalTitle}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {TEXT.modalExportType}
            </label>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option>Orders</option>
              <option>Products</option>
              <option>Customers</option>
              <option>Sellers</option>
              <option>Transactions</option>
              <option>Inventory</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {TEXT.modalFrequency}
            </label>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {TEXT.modalFormat}
            </label>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option>CSV</option>
              <option>Excel</option>
              <option>JSON</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {TEXT.modalRecipients}
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder={TEXT.modalRecipientsPlaceholder}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {TEXT.modalCancel}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {TEXT.modalCreate}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Available Exports Table
// ----------------------------------------------------------------

function AvailableExportsTable({ exports }: { exports: AvailableExport[] }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">
          {TEXT.availableExports}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {TEXT.colExport}
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {TEXT.colLastExported}
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {TEXT.colEstSize}
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {TEXT.colFormat}
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {TEXT.colRecords}
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                {TEXT.colAction}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exports.map((item) => {
              const Icon = EXPORT_ICONS[item.id] ?? Package;
              return (
                <tr
                  key={item.id}
                  className="transition hover:bg-orange-50/40"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg',
                          item.iconBg,
                        )}
                      >
                        <Icon
                          className={cn('h-4 w-4', item.iconColor)}
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {item.lastExported}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {item.estimatedSize}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {item.formats.map((fmt) => (
                        <span
                          key={fmt}
                          className={cn(
                            'inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold',
                            FORMAT_BADGE[fmt],
                          )}
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.records}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600">
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      {TEXT.exportNow}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------
// Scheduled Exports Section
// ----------------------------------------------------------------

function ScheduledExportsSection({
  schedules,
}: {
  schedules: ScheduledExport[];
}) {
  const activeCount = schedules.filter((s) => s.status === 'Active').length;

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">
            {TEXT.scheduledExports}
          </h2>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
            {activeCount} Active
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {schedules.map((sched) => {
          const Icon = SCHEDULE_ICONS[sched.id] ?? Clock;
          return (
            <div
              key={sched.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    sched.iconBg,
                  )}
                >
                  <Icon
                    className={cn('h-5 w-5', sched.iconColor)}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {sched.name}
                  </p>
                  <p className="text-xs text-gray-500">{sched.schedule}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Format: {sched.format} &middot; Recipients:{' '}
                    {sched.recipients}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                    sched.status === 'Active'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-100 text-gray-500',
                  )}
                >
                  {sched.status}
                </span>
                <button className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-semibold text-orange-500 transition hover:bg-orange-50">
                  {TEXT.editSchedule}
                </button>
                <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50">
                  {TEXT.delete}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------
// Export History Table
// ----------------------------------------------------------------

function ExportHistoryTable({ history }: { history: ExportHistoryEntry[] }) {
  const isEmpty = history.length === 0;

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">
          {TEXT.exportHistory}
        </h2>
      </div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Inbox className="h-10 w-10 text-gray-300" aria-hidden="true" />
          <p className="mt-3 text-sm text-gray-500">{TEXT.emptyHistory}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colExportName}
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colDate}
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colFormat}
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colSize}
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colStatus}
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colAction}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((entry) => (
                <tr
                  key={entry.id}
                  className="transition hover:bg-orange-50/40"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {entry.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{entry.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                        FORMAT_BADGE[entry.format],
                      )}
                    >
                      {entry.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{entry.size}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-semibold',
                        STATUS_BADGE[entry.status],
                      )}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-orange-500 transition hover:text-orange-600">
                      <Download
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                      {TEXT.download}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function ExportsPage() {
  const exportsQuery = useExportsPage();
  const [modalOpen, setModalOpen] = useState(false);

  // ------ LOADING STATE ------
  if (exportsQuery.isLoading) {
    return <ExportsSkeleton />;
  }

  // ------ ERROR STATE ------
  if (exportsQuery.isError) {
    return (
      <section
        className="flex flex-col items-center justify-center py-32"
        role="alert"
      >
        <AlertTriangle
          className="h-12 w-12 text-red-400"
          aria-hidden="true"
        />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          {TEXT.errorTitle}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {exportsQuery.error?.message}
        </p>
        <button
          onClick={() => exportsQuery.refetch()}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const data = exportsQuery.data;
  if (!data) return null;

  const { availableExports, scheduledExports, history } = data;

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {TEXT.pageTitle}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            {TEXT.scheduleExport}
          </button>
        </div>

        {/* Available Exports */}
        <AvailableExportsTable exports={availableExports} />

        {/* Scheduled Exports */}
        {scheduledExports.length > 0 && (
          <ScheduledExportsSection schedules={scheduledExports} />
        )}

        {/* Export History */}
        <ExportHistoryTable history={history} />
      </div>

      {/* Schedule Export Modal */}
      <ScheduleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
