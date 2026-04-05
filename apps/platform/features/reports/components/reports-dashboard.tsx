'use client';

import { useState, useCallback } from 'react';
import {
  FileText, Download, AlertTriangle, Calendar, Inbox,
  Plus, Pencil, Pause, Play, Trash2, X,
  Banknote, Store, IndianRupee, Package, BarChart3, Users,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Skeleton } from '@homebase/ui';

import { useReportCards, useScheduledReports, useDownloadHistory } from '../hooks/use-reports';
import type { ReportFormat, ScheduleStatus, ReportCard } from '../types';

// ----------------------------------------------------------------
// Constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Reports',
  pageSubtitle: 'Generate, schedule, and download platform reports',
  generateReport: 'Generate Report',
  scheduleNew: 'Schedule New',
  allScheduled: 'All Scheduled',
  active: 'Active',
  paused: 'Paused',
  generate: 'Generate',
  last: 'Last:',
  downloadHistory: 'Download History',
  downloadHistorySubtitle: 'Recently generated reports',
  download: 'Download',
  showing: 'Showing',
  of: 'of',
  reports: 'reports',
  colReportName: 'Report Name',
  colFrequency: 'Frequency',
  colNextRun: 'Next Run',
  colRecipient: 'Recipient',
  colStatus: 'Status',
  colActions: 'Actions',
  colGeneratedOn: 'Generated On',
  colFormat: 'Format',
  colSize: 'Size',
  emptyScheduledTitle: 'No scheduled reports',
  emptyScheduledSubtitle: 'Create a schedule to automatically generate reports.',
  emptyHistoryTitle: 'No reports generated yet',
  emptyHistorySubtitle: 'Generate your first report to see it here.',
  errorTitle: 'Failed to load reports',
  errorSubtitle: 'Please try refreshing the page or contact support.',
  retry: 'Retry',
  modalTitle: 'Generate Report',
  modalReportType: 'Report Type',
  modalFromDate: 'From Date',
  modalToDate: 'To Date',
  modalFormat: 'Format',
  modalEmail: 'Email to (optional)',
  modalEmailPlaceholder: 'admin@homebase.in',
  modalCancel: 'Cancel',
  modalGenerate: 'Generate & Download',
} as const;

// ----------------------------------------------------------------
// Card icon mapping
// ----------------------------------------------------------------

const CARD_ICONS: Record<string, React.ReactNode> = {
  'Sales Report': <Banknote className="h-6 w-6" />,
  'Seller Performance': <Store className="h-6 w-6" />,
  'Tax Report (GSTR-1/3B)': <IndianRupee className="h-6 w-6" />,
  'Inventory Report': <Package className="h-6 w-6" />,
  'Financial Reconciliation': <BarChart3 className="h-6 w-6" />,
  'Customer Analytics': <Users className="h-6 w-6" />,
};

// ----------------------------------------------------------------
// Badge helpers
// ----------------------------------------------------------------

function scheduleStatusClasses(status: ScheduleStatus): string {
  return status === 'Active'
    ? 'bg-green-50 text-green-700'
    : 'bg-amber-50 text-amber-700';
}

function scheduleStatusDot(status: ScheduleStatus): string {
  return status === 'Active' ? 'bg-green-500' : 'bg-amber-500';
}

function formatBadgeClasses(format: ReportFormat): string {
  switch (format) {
    case 'CSV': return 'bg-green-50 text-green-700';
    case 'Excel': return 'bg-blue-50 text-blue-700';
    case 'PDF': return 'bg-red-50 text-red-700';
  }
}

// ----------------------------------------------------------------
// Report type options for modal
// ----------------------------------------------------------------

const REPORT_TYPES = [
  'Sales Report',
  'Seller Performance',
  'Tax Report (GSTR-1/3B)',
  'Inventory Report',
  'Financial Reconciliation',
  'Customer Analytics',
];

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function ReportsDashboard() {
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReportType, setModalReportType] = useState(REPORT_TYPES[0]);
  const [modalFormat, setModalFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const cardsQuery = useReportCards();
  const scheduledQuery = useScheduledReports();
  const historyQuery = useDownloadHistory();

  const handleScheduleFilter = useCallback((f: 'all' | 'active' | 'paused') => {
    setScheduleFilter(f);
  }, []);

  const openModal = useCallback((reportType?: string) => {
    if (reportType) setModalReportType(reportType);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // ------ LOADING STATE ------
  if (cardsQuery.isLoading || scheduledQuery.isLoading || historyQuery.isLoading) {
    return <ReportsDashboardSkeleton />;
  }

  // ------ ERROR STATE ------
  if (cardsQuery.isError || scheduledQuery.isError || historyQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{TEXT.errorSubtitle}</p>
        <button
          onClick={() => { cardsQuery.refetch(); scheduledQuery.refetch(); historyQuery.refetch(); }}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const cards = cardsQuery.data ?? [];
  const scheduled = scheduledQuery.data ?? [];
  const history = historyQuery.data ?? [];

  const filteredScheduled = scheduleFilter === 'all'
    ? scheduled
    : scheduled.filter((s) => s.status.toLowerCase() === scheduleFilter);

  const activeCount = scheduled.filter((s) => s.status === 'Active').length;
  const pausedCount = scheduled.filter((s) => s.status === 'Paused').length;

  // Pagination
  const totalHistory = 28; // mock total
  const totalPages = Math.ceil(totalHistory / pageSize);
  const paginatedHistory = history.slice(0, pageSize);

  return (
    <div className="space-y-8">
      {/* ===== PAGE HEADER ===== */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <FileText className="h-4 w-4" />
          {TEXT.generateReport}
        </button>
      </header>

      {/* ===== REPORT CARDS GRID (2x3) ===== */}
      {cards.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <ReportCardItem key={card.id} card={card} onGenerate={openModal} />
          ))}
        </div>
      )}

      {/* ===== SCHEDULED REPORTS ===== */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 pb-0 pt-5">
          <nav className="-mb-px flex items-center gap-0 border-b border-gray-200" role="tablist" aria-label="Scheduled reports filter">
            {([
              { key: 'all' as const, label: TEXT.allScheduled, count: scheduled.length, countBg: 'bg-gray-100', countText: 'text-gray-600' },
              { key: 'active' as const, label: TEXT.active, count: activeCount, countBg: 'bg-green-100', countText: 'text-green-700' },
              { key: 'paused' as const, label: TEXT.paused, count: pausedCount, countBg: 'bg-amber-100', countText: 'text-amber-700' },
            ]).map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={scheduleFilter === tab.key}
                onClick={() => handleScheduleFilter(tab.key)}
                className={cn(
                  'whitespace-nowrap border-b-2 px-4 pb-3 text-sm font-medium transition',
                  scheduleFilter === tab.key
                    ? 'border-orange-500 text-orange-500 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
              >
                {tab.label}{' '}
                <span className={cn('ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-bold', tab.countBg, tab.countText)}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
          <div className="mb-3">
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              <Plus className="h-4 w-4" />
              {TEXT.scheduleNew}
            </button>
          </div>
        </div>

        {filteredScheduled.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Calendar className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyScheduledTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{TEXT.emptyScheduledSubtitle}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th scope="col" className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colReportName}</th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colFrequency}</th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colNextRun}</th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colRecipient}</th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colStatus}</th>
                  <th scope="col" className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredScheduled.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className={cn(
                      'transition-colors',
                      schedule.status === 'Paused'
                        ? 'bg-amber-50/30 hover:bg-amber-50/60'
                        : 'hover:bg-orange-50/40',
                    )}
                    tabIndex={0}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', schedule.iconBg)}>
                          <FileText className={cn('h-4 w-4', schedule.iconColor)} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{schedule.reportName}</p>
                          <p className="text-xs text-gray-400">{schedule.reportType} - {schedule.format}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{schedule.frequency}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn('text-sm', schedule.status === 'Paused' ? 'text-gray-400' : 'text-gray-700')}>
                        {schedule.nextRun}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{schedule.recipient}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', scheduleStatusClasses(schedule.status))}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', scheduleStatusDot(schedule.status))} />
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          className="rounded-md p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500"
                          aria-label={`Edit ${schedule.reportName}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className={cn(
                            'rounded-md p-1.5 text-gray-400 transition',
                            schedule.status === 'Paused'
                              ? 'hover:bg-green-50 hover:text-green-500'
                              : 'hover:bg-amber-50 hover:text-amber-500',
                          )}
                          aria-label={`${schedule.status === 'Paused' ? 'Resume' : 'Pause'} ${schedule.reportName}`}
                        >
                          {schedule.status === 'Paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </button>
                        <button
                          className="rounded-md p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${schedule.reportName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ===== DOWNLOAD HISTORY ===== */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{TEXT.downloadHistory}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{TEXT.downloadHistorySubtitle}</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Inbox className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyHistoryTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{TEXT.emptyHistorySubtitle}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th scope="col" className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colReportName}</th>
                    <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colGeneratedOn}</th>
                    <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colFormat}</th>
                    <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colSize}</th>
                    <th scope="col" className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedHistory.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-orange-50/40" tabIndex={0}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', item.iconBg)}>
                            <FileText className={cn('h-4 w-4', item.iconColor)} />
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{item.fileName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{item.generatedOn}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('rounded px-2 py-0.5 font-mono text-xs font-semibold', formatBadgeClasses(item.format))}>
                          {item.format}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{item.size}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 transition hover:text-orange-600"
                          aria-label={`Download ${item.fileName}`}
                        >
                          <Download className="h-4 w-4" />
                          {TEXT.download}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{TEXT.showing}</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-orange-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <span className="text-sm text-gray-500">{TEXT.of} {totalHistory} {TEXT.reports}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition',
                    currentPage === 1 ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-50',
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {paginationRange(currentPage, totalPages).map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="flex h-9 w-9 items-center justify-center text-sm text-gray-400">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition',
                        currentPage === page
                          ? 'bg-orange-500 font-semibold text-white'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50',
                      )}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition',
                    currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ===== GENERATE REPORT MODAL ===== */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          onKeyDown={(e) => { if (e.key === 'Escape') closeModal(); }}
          role="dialog"
          aria-modal="true"
          aria-label={TEXT.modalTitle}
        >
          <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">{TEXT.modalTitle}</h3>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{TEXT.modalReportType}</label>
                <select
                  value={modalReportType}
                  onChange={(e) => setModalReportType(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  {REPORT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">{TEXT.modalFromDate}</label>
                  <input
                    type="date"
                    defaultValue="2026-03-01"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">{TEXT.modalToDate}</label>
                  <input
                    type="date"
                    defaultValue="2026-03-28"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{TEXT.modalFormat}</label>
                <div className="flex items-center gap-3">
                  {(['csv', 'pdf', 'excel'] as const).map((f) => (
                    <label key={f} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="report-format"
                        value={f}
                        checked={modalFormat === f}
                        onChange={() => setModalFormat(f)}
                        className="text-orange-500 focus:ring-orange-400"
                      />
                      <span className="text-sm text-gray-700">{f.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{TEXT.modalEmail}</label>
                <input
                  type="email"
                  placeholder={TEXT.modalEmailPlaceholder}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                {TEXT.modalCancel}
              </button>
              <button
                onClick={closeModal}
                className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {TEXT.modalGenerate}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Report card sub-component
// ----------------------------------------------------------------

function ReportCardItem({ card, onGenerate }: { card: ReportCard; onGenerate: (name: string) => void }) {
  const icon = CARD_ICONS[card.name] ?? <FileText className="h-6 w-6" />;

  return (
    <article
      onClick={() => onGenerate(card.name)}
      className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', card.iconBg)}>
          <span className={card.iconColor}>{icon}</span>
        </div>
        {card.badge && (
          <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase', card.badgeBg, card.badgeText)}>
            {card.badge}
          </span>
        )}
      </div>
      <h3 className="mb-1 text-base font-bold text-gray-900">{card.name}</h3>
      <p className="mb-4 text-sm text-gray-500">{card.description}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); onGenerate(card.name); }}
          className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
        >
          <FileText className="h-3.5 w-3.5" />
          {TEXT.generate}
        </button>
        <span className="text-[11px] text-gray-400">
          {TEXT.last} {card.lastGenerated}
        </span>
      </div>
    </article>
  );
}

// ----------------------------------------------------------------
// Pagination helper
// ----------------------------------------------------------------

function paginationRange(current: number, total: number): (number | '...')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [];
  pages.push(1);

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}

// ----------------------------------------------------------------
// Loading skeleton
// ----------------------------------------------------------------

function ReportsDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      {/* Report cards grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[210px] rounded-xl" />
        ))}
      </div>
      {/* Scheduled table */}
      <Skeleton className="h-[300px] rounded-xl" />
      {/* Download history */}
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}
