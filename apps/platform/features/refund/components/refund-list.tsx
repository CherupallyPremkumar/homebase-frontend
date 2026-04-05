'use client';

import { useState, useCallback } from 'react';
import {
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Plus,
  X,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useRefunds } from '../hooks/use-refund';
import {
  MOCK_REFUND_TABS,
  MOCK_REFUND_DATA,
  MOCK_REFUND_DETAIL,
  SAMPLE_ORDERS,
} from '../services/mock-data';
import type { Refund, RefundStatus, RefundReason, RefundDetail } from '../types';

/* ------------------------------------------------------------------ */
/*  TEXT CONSTANTS                                                      */
/* ------------------------------------------------------------------ */

const TEXT = {
  PAGE_TITLE: 'Refund Management',
  PAGE_SUBTITLE: 'Track, process, and manage customer refunds across all orders.',
  EXPORT_CSV: 'Export CSV',
  INITIATE_REFUND: 'Initiate Refund',
  STAT_TOTAL_REFUNDS: 'Total Refunds',
  STAT_TOTAL_REFUNDS_SUB: 'This month',
  STAT_PROCESSING: 'Processing',
  STAT_PROCESSING_SUB: 'In progress',
  STAT_COMPLETED: 'Completed',
  STAT_COMPLETED_SUB: 'Successfully refunded',
  STAT_FAILED: 'Failed',
  STAT_FAILED_SUB: 'Require attention',
  SUMMARY_LABEL: 'Total Refunded This Month',
  SUMMARY_AVG_LABEL: 'Avg Refund Time',
  SUMMARY_RATE_LABEL: 'Refund Rate',
  TH_REFUND_ID: 'Refund ID',
  TH_ORDER_ID: 'Order ID',
  TH_CUSTOMER: 'Customer',
  TH_AMOUNT: 'Amount',
  TH_REASON: 'Reason',
  TH_METHOD: 'Method',
  TH_STATUS: 'Status',
  TH_INITIATED: 'Initiated',
  TH_COMPLETED: 'Completed',
  TH_ACTIONS: 'Actions',
  ACTION_VIEW: 'View',
  ACTION_RETRY: 'Retry',
  ACTION_APPROVE: 'Approve',
  FAILED_SECTION_TITLE: 'Failed Refunds - Requires Attention',
  DETAIL_TITLE: 'Refund Details',
  DETAIL_ORDER_ID: 'Order ID',
  DETAIL_AMOUNT: 'Amount',
  DETAIL_CUSTOMER: 'Customer',
  DETAIL_METHOD: 'Refund Method',
  DETAIL_REASON: 'Reason',
  DETAIL_BANK_REF: 'Bank Reference',
  DETAIL_TIMELINE: 'Refund Timeline',
  MODAL_TITLE: 'Initiate Manual Refund',
  MODAL_ORDER_ID: 'Order ID',
  MODAL_ORDER_PLACEHOLDER: 'e.g. HB-78234',
  MODAL_CUSTOMER: 'Customer Name',
  MODAL_CUSTOMER_PLACEHOLDER: 'Auto-filled from order',
  MODAL_AMOUNT: 'Refund Amount',
  MODAL_AMOUNT_PLACEHOLDER: 'e.g. 2500',
  MODAL_REASON: 'Reason',
  MODAL_REASON_PLACEHOLDER: 'Select reason',
  MODAL_METHOD: 'Refund Method',
  MODAL_METHOD_PLACEHOLDER: 'Select method',
  MODAL_NOTES: 'Admin Notes',
  MODAL_NOTES_HINT: '(optional)',
  MODAL_NOTES_PLACEHOLDER: 'Internal notes about this refund...',
  MODAL_CANCEL: 'Cancel',
  MODAL_SUBMIT: 'Process Refund',
  LOADING_LABEL: 'Loading refunds',
  ERROR_TITLE: 'Failed to load refunds',
  ERROR_SUBTITLE: 'Please try refreshing the page or contact support.',
  ERROR_RETRY: 'Retry',
  EMPTY_TITLE: 'No refunds yet',
  EMPTY_SUBTITLE: 'Refund records will appear here once customers request them.',
} as const;

/* ------------------------------------------------------------------ */
/*  Reason badge colors                                                */
/* ------------------------------------------------------------------ */

const REASON_STYLES: Record<RefundReason, string> = {
  Return:       'bg-blue-50 text-blue-700',
  Cancellation: 'bg-yellow-50 text-yellow-700',
  Dispute:      'bg-red-50 text-red-700',
  Damaged:      'bg-purple-50 text-purple-700',
};

/* ------------------------------------------------------------------ */
/*  Status badge colors                                                */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<RefundStatus, string> = {
  Completed:  'bg-green-50 text-green-700',
  Processing: 'bg-yellow-50 text-yellow-700',
  Initiated:  'bg-blue-50 text-blue-700',
  Failed:     'bg-red-50 text-red-700',
};

/* ------------------------------------------------------------------ */
/*  Refund reason options for the modal                                */
/* ------------------------------------------------------------------ */

const REASON_OPTIONS = [
  'Customer Request',
  'Quality Issue',
  'Wrong Item',
  'Damaged',
  'Admin Decision',
] as const;

const METHOD_OPTIONS = [
  'Original Payment',
  'Bank Transfer',
  'Wallet Credit',
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RefundList() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = MOCK_REFUND_TABS;
  const { data, isLoading, isError } = useRefunds(tabs[activeTab]?.label);

  /* Modal state */
  const [detailOpen, setDetailOpen] = useState(false);
  const [initiateOpen, setInitiateOpen] = useState(false);

  /* Initiate refund form state */
  const [formOrderId, setFormOrderId] = useState('');
  const [formCustomer, setFormCustomer] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formAmountHint, setFormAmountHint] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formMethod, setFormMethod] = useState('');
  const [formNotes, setFormNotes] = useState('');

  /* Order ID lookup for the initiate modal */
  const handleOrderLookup = useCallback((value: string) => {
    setFormOrderId(value);
    const cleanId = value.trim().replace('#', '');
    const match = SAMPLE_ORDERS[cleanId];
    if (match) {
      setFormCustomer(match.customer);
      setFormAmountHint(`Order value: \u20B9${match.amount.toLocaleString('en-IN')} (refund must be \u2264 order value)`);
    } else {
      setFormCustomer('');
      setFormAmountHint('');
    }
  }, []);

  const resetInitiateForm = useCallback(() => {
    setFormOrderId('');
    setFormCustomer('');
    setFormAmount('');
    setFormAmountHint('');
    setFormReason('');
    setFormMethod('');
    setFormNotes('');
  }, []);

  const closeInitiateModal = useCallback(() => {
    setInitiateOpen(false);
    resetInitiateForm();
  }, [resetInitiateForm]);

  /* Use mock data as fallback when API fails / loading */
  const dashboard = data ?? MOCK_REFUND_DATA;
  const detail: RefundDetail = MOCK_REFUND_DETAIL;

  /* ---------------------------------------------------------------- */
  /*  Loading state                                                    */
  /* ---------------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label={TEXT.LOADING_LABEL}>
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
        <div className="h-20 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Error state                                                      */
  /* ---------------------------------------------------------------- */

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.ERROR_TITLE}</h2>
        <p className="text-sm text-gray-500">{TEXT.ERROR_SUBTITLE}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.ERROR_RETRY}
        </button>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Empty state                                                      */
  /* ---------------------------------------------------------------- */

  if (dashboard.refunds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <RotateCcw className="h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.EMPTY_TITLE}</h2>
        <p className="text-sm text-gray-500">{TEXT.EMPTY_SUBTITLE}</p>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Main render                                                      */
  /* ---------------------------------------------------------------- */

  return (
    <>
      <section className="space-y-6" aria-label={TEXT.PAGE_TITLE}>

        {/* ---- Page Header ---- */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{TEXT.PAGE_TITLE}</h1>
            <p className="mt-1 text-sm text-gray-500">{TEXT.PAGE_SUBTITLE}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              <Download className="h-4 w-4" />
              {TEXT.EXPORT_CSV}
            </button>
            <button
              onClick={() => setInitiateOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              {TEXT.INITIATE_REFUND}
            </button>
          </div>
        </header>

        {/* ---- Stats Cards ---- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<RotateCcw className="h-4 w-4 text-blue-600" />}
            iconBg="bg-blue-50"
            title={TEXT.STAT_TOTAL_REFUNDS}
            value="234"
            subtitle={TEXT.STAT_TOTAL_REFUNDS_SUB}
          />
          <StatCard
            icon={<Clock className="h-4 w-4 text-yellow-600" />}
            iconBg="bg-yellow-50"
            title={TEXT.STAT_PROCESSING}
            value="12"
            valueColor="text-yellow-600"
            subtitle={TEXT.STAT_PROCESSING_SUB}
          />
          <StatCard
            icon={<CheckCircle className="h-4 w-4 text-green-600" />}
            iconBg="bg-green-50"
            title={TEXT.STAT_COMPLETED}
            value="215"
            valueColor="text-green-600"
            subtitle={TEXT.STAT_COMPLETED_SUB}
          />
          <StatCard
            icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
            iconBg="bg-red-50"
            title={TEXT.STAT_FAILED}
            value="7"
            valueColor="text-red-600"
            subtitle={TEXT.STAT_FAILED_SUB}
          />
        </div>

        {/* ---- Refund Summary Banner ---- */}
        <div className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{TEXT.SUMMARY_LABEL}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{dashboard.summary.totalRefunded}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.SUMMARY_AVG_LABEL}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{dashboard.summary.avgRefundTime}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.SUMMARY_RATE_LABEL}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{dashboard.summary.refundRate}</p>
              <p className="text-xs text-gray-400">{dashboard.summary.refundRateSubtext}</p>
            </div>
          </div>
        </div>

        {/* ---- Filter Tabs + Table ---- */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

          {/* Tabs */}
          <div className="border-b border-gray-100 px-6 pt-4">
            <nav className="flex gap-6" aria-label="Refund status filter">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    'border-b-2 pb-3 text-sm font-semibold transition',
                    activeTab === i
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-orange-500',
                  )}
                >
                  {tab.label}
                  <span className="ml-1 text-xs text-gray-400">{tab.count}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="Refunds table">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <th scope="col" className="px-6 py-3 font-semibold">{TEXT.TH_REFUND_ID}</th>
                  <th scope="col" className="px-6 py-3 font-semibold">{TEXT.TH_ORDER_ID}</th>
                  <th scope="col" className="px-6 py-3 font-semibold">{TEXT.TH_CUSTOMER}</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-right">{TEXT.TH_AMOUNT}</th>
                  <th scope="col" className="px-6 py-3 font-semibold">{TEXT.TH_REASON}</th>
                  <th scope="col" className="px-6 py-3 font-semibold">{TEXT.TH_METHOD}</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-center">{TEXT.TH_STATUS}</th>
                  <th scope="col" className="px-6 py-3 font-semibold">{TEXT.TH_INITIATED}</th>
                  <th scope="col" className="px-6 py-3 font-semibold">{TEXT.TH_COMPLETED}</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-center">{TEXT.TH_ACTIONS}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboard.refunds.map((r) => (
                  <RefundRow
                    key={r.id}
                    refund={r}
                    onView={() => setDetailOpen(true)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---- Failed Refunds Section ---- */}
        {dashboard.failedRefunds.length > 0 && (
          <article
            className="overflow-hidden rounded-xl border border-red-200 bg-white"
            aria-label="Failed refunds requiring attention"
          >
            <div className="border-b border-red-100 bg-red-50/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-semibold text-red-800">{TEXT.FAILED_SECTION_TITLE}</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {dashboard.failedRefunds.map((fr) => (
                <div key={fr.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <span className="text-sm font-medium text-orange-600">{fr.id}</span>
                      <span className="text-sm text-gray-700">{fr.customer}</span>
                      <span className="text-sm font-semibold">{fr.amount}</span>
                    </div>
                    <p className="text-xs font-medium text-red-600">Reason: {fr.reason}</p>
                    <p className="mt-0.5 text-xs text-gray-400">Failed on {fr.failedOn}</p>
                  </div>
                  <button className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600">
                    {TEXT.ACTION_RETRY}
                  </button>
                </div>
              ))}
            </div>
          </article>
        )}
      </section>

      {/* ================================================================ */}
      {/*  REFUND DETAIL SLIDE-OVER MODAL                                  */}
      {/* ================================================================ */}
      {detailOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDetailOpen(false)}
          />
          <div className="absolute bottom-0 right-0 top-0 w-full max-w-lg overflow-y-auto bg-white shadow-2xl">

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">{TEXT.DETAIL_TITLE}</h3>
              <button
                onClick={() => setDetailOpen(false)}
                className="rounded-lg p-1 transition hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-6 p-6">
              {/* Refund Info */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-lg font-bold text-orange-600">{detail.id}</span>
                  <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', STATUS_STYLES[detail.status])}>
                    {detail.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">{TEXT.DETAIL_ORDER_ID}</p>
                    <p className="font-medium text-orange-600 hover:underline">{detail.orderId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{TEXT.DETAIL_AMOUNT}</p>
                    <p className="font-semibold">{detail.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{TEXT.DETAIL_CUSTOMER}</p>
                    <p className="font-medium">{detail.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{TEXT.DETAIL_METHOD}</p>
                    <p className="font-medium">{detail.method}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{TEXT.DETAIL_REASON}</p>
                    <p className="font-medium">{detail.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{TEXT.DETAIL_BANK_REF}</p>
                    <p className="font-mono text-xs">{detail.bankRef}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-900">{TEXT.DETAIL_TIMELINE}</h4>
                <div className="space-y-0">
                  {detail.timeline.map((entry, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 ring-4 ring-green-100" />
                        {!entry.isFinal && <div className="h-8 w-0.5 bg-green-200" />}
                      </div>
                      <div className={entry.isFinal ? '' : 'pb-6'}>
                        <p className="text-sm font-medium text-gray-900">{entry.label}</p>
                        <p className="text-xs text-gray-500">{entry.date}</p>
                        <p className="mt-0.5 text-xs text-gray-400">{entry.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  INITIATE REFUND MODAL                                           */}
      {/* ================================================================ */}
      {initiateOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeInitiateModal(); }}
        >
          <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">{TEXT.MODAL_TITLE}</h3>
              <button
                onClick={closeInitiateModal}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">

              {/* Order ID */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {TEXT.MODAL_ORDER_ID} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formOrderId}
                  onChange={(e) => handleOrderLookup(e.target.value)}
                  placeholder={TEXT.MODAL_ORDER_PLACEHOLDER}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {TEXT.MODAL_CUSTOMER}
                </label>
                <input
                  type="text"
                  value={formCustomer}
                  readOnly
                  placeholder={TEXT.MODAL_CUSTOMER_PLACEHOLDER}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600"
                />
              </div>

              {/* Refund Amount */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {TEXT.MODAL_AMOUNT} <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                    {'\u20B9'}
                  </span>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder={TEXT.MODAL_AMOUNT_PLACEHOLDER}
                    min="1"
                    className="flex-1 rounded-r-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                {formAmountHint && (
                  <p className="mt-1 text-xs text-gray-400">{formAmountHint}</p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {TEXT.MODAL_REASON} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">{TEXT.MODAL_REASON_PLACEHOLDER}</option>
                  {REASON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Method */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {TEXT.MODAL_METHOD} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formMethod}
                  onChange={(e) => setFormMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">{TEXT.MODAL_METHOD_PLACEHOLDER}</option>
                  {METHOD_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {TEXT.MODAL_NOTES} <span className="text-xs text-gray-400">{TEXT.MODAL_NOTES_HINT}</span>
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={3}
                  placeholder={TEXT.MODAL_NOTES_PLACEHOLDER}
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                onClick={closeInitiateModal}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                {TEXT.MODAL_CANCEL}
              </button>
              <button
                onClick={closeInitiateModal}
                className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                {TEXT.MODAL_SUBMIT}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================================================================== */
/*  Stat Card (matches prototype exactly)                              */
/* ================================================================== */

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  valueColor?: string;
  subtitle: string;
}

function StatCard({ icon, iconBg, title, value, valueColor, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</span>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconBg)}>
          {icon}
        </div>
      </div>
      <p className={cn('text-2xl font-bold', valueColor ?? 'text-gray-900')}>{value}</p>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

/* ================================================================== */
/*  Refund Table Row                                                   */
/* ================================================================== */

interface RefundRowProps {
  refund: Refund;
  onView: () => void;
}

function RefundRow({ refund: r, onView }: RefundRowProps) {
  return (
    <tr
      className="cursor-pointer transition-colors hover:bg-orange-50/60"
      onClick={onView}
    >
      <td className="px-6 py-3.5 font-medium text-orange-600">{r.id}</td>
      <td className="px-6 py-3.5 text-gray-700">{r.orderId}</td>
      <td className="px-6 py-3.5">{r.customer}</td>
      <td className="px-6 py-3.5 text-right font-medium">{r.amount}</td>
      <td className="px-6 py-3.5">
        <span className={cn('rounded px-2 py-0.5 text-xs font-medium', REASON_STYLES[r.reason])}>
          {r.reason}
        </span>
      </td>
      <td className="px-6 py-3.5 text-xs text-gray-600">{r.method}</td>
      <td className="px-6 py-3.5 text-center">
        <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', STATUS_STYLES[r.status])}>
          {r.status}
        </span>
      </td>
      <td className="px-6 py-3.5 text-xs text-gray-500">{r.initiated}</td>
      <td className={cn('px-6 py-3.5 text-xs', r.completed === '-' ? 'text-gray-400' : 'text-gray-500')}>
        {r.completed}
      </td>
      <td className="px-6 py-3.5 text-center">
        {r.status === 'Failed' ? (
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="text-xs font-semibold text-red-500 transition hover:text-red-600"
          >
            {TEXT.ACTION_RETRY}
          </button>
        ) : r.status === 'Initiated' ? (
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="text-xs font-semibold text-orange-500 transition hover:text-orange-600"
          >
            {TEXT.ACTION_APPROVE}
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onView(); }}
            className="text-xs font-semibold text-orange-500 transition hover:text-orange-600"
          >
            {TEXT.ACTION_VIEW}
          </button>
        )}
      </td>
    </tr>
  );
}
