'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Inbox as InboxIcon, Clock, AlertTriangle, Shield, Search,
  Plus, BookOpen, X,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Skeleton } from '@homebase/ui';

import { useSupportStats, useSupportList, useKnowledgeBase } from '../hooks/use-support';
import type { SupportListFilters } from '../hooks/use-support';
import { mockSupportTabs } from '../services/mock-data';
import type { SupportTicket, TicketStatus, TicketPriority, TicketType } from '../services/mock-data';

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Support Center',
  pageSubtitle: 'Manage support tickets and knowledge base',
  createTicket: 'Create Ticket',
  searchPlaceholder: 'Search tickets...',
  emptyTitle: 'No tickets found',
  emptySubtitle: 'Try adjusting your search or filter criteria.',
  errorTitle: 'Failed to load support data',
  retry: 'Retry',
  clearFilters: 'Clear Filters',
  knowledgeBase: 'Knowledge Base',
  addArticle: '+ Add Article',
  editArticle: 'Edit Article',
  viewTicket: 'View',
  colId: 'ID',
  colCustomer: 'Customer / Seller',
  colType: 'Type',
  colSubject: 'Subject',
  colPriority: 'Priority',
  colStatus: 'Status',
  colAssigned: 'Assigned To',
  colDate: 'Date',
  colActions: 'Actions',
  tableLabel: 'Support tickets list',
  sendReply: 'Send Reply',
  addInternalNote: 'Add Internal Note',
  markResolved: 'Mark Resolved',
  close: 'Close',
  reassignTo: 'Reassign to:',
  replyPlaceholder: 'Type your reply...',
} as const;

const PAGE_SIZE = 8;
const DEBOUNCE_MS = 300;

const STATUS_STYLES: Record<TicketStatus, string> = {
  Open: 'bg-blue-100 text-blue-700',
  Escalated: 'bg-red-100 text-red-700',
  Resolved: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-100 text-gray-600',
};

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-600',
};

const TYPE_STYLES: Record<TicketType, string> = {
  Customer: 'bg-blue-100 text-blue-700',
  Seller: 'bg-purple-100 text-purple-700',
};

const SUPPORT_AGENTS = ['Rahul K.', 'Priya M.', 'Vikram S.', 'Super Admin'];

// Mock conversation thread for the modal
interface ThreadMessage {
  author: string;
  authorRole: 'customer' | 'support' | 'internal';
  timestamp: string;
  body: string;
}

const MOCK_THREAD: ThreadMessage[] = [
  {
    author: 'Ananya Singh',
    authorRole: 'customer',
    timestamp: '27 Mar, 10:15 AM',
    body: 'I placed order #HB-78190 on 17 March and it has been 10 days now. The tracking shows it is stuck at the warehouse. I have not received any update. Please resolve this urgently.',
  },
  {
    author: 'Rahul K. (Support)',
    authorRole: 'support',
    timestamp: '27 Mar, 11:30 AM',
    body: 'Hi Ananya, apologies for the delay. I have escalated this to the logistics team. We are tracking down the package and will update you within 24 hours.',
  },
  {
    author: 'Internal Note',
    authorRole: 'internal',
    timestamp: '27 Mar, 11:45 AM',
    body: 'Contacted logistics partner Delhivery. AWB #DL78234567 shows package stuck at Bengaluru hub. Raised priority ticket with them.',
  },
];

const THREAD_STYLES: Record<ThreadMessage['authorRole'], { bg: string; border: string; authorColor: string }> = {
  customer: { bg: 'bg-blue-50', border: 'border-blue-100', authorColor: 'text-gray-900' },
  support: { bg: 'bg-gray-50', border: 'border-gray-100', authorColor: 'text-orange-600' },
  internal: { bg: 'bg-yellow-50', border: 'border-yellow-100', authorColor: 'text-yellow-700' },
};

// ----------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------

function SupportSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading support center">
      <div className="flex items-center justify-between">
        <div><Skeleton className="h-8 w-48" /><Skeleton className="mt-2 h-4 w-72" /></div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}

// ----------------------------------------------------------------
// Ticket Detail Modal
// ----------------------------------------------------------------

interface TicketModalProps {
  ticket: SupportTicket | null;
  onClose: () => void;
}

function TicketModal({ ticket, onClose }: TicketModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!ticket) return null;

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">Ticket {ticket.id}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* Ticket Info Badges */}
          <div className="flex items-center gap-4 text-sm">
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', STATUS_STYLES[ticket.status])}>
              {ticket.status}
            </span>
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', PRIORITY_STYLES[ticket.priority])}>
              {ticket.priority} Priority
            </span>
            <span className="text-gray-500">
              Assigned to: <span className="font-medium text-gray-700">{ticket.assignedTo}</span>
            </span>
          </div>

          {/* Conversation Thread */}
          <div className="space-y-4">
            {MOCK_THREAD.map((msg, i) => {
              const style = THREAD_STYLES[msg.authorRole];
              return (
                <div key={i} className={cn('rounded-lg border p-4', style.bg, style.border)}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className={cn('text-sm font-semibold', style.authorColor)}>{msg.author}</span>
                    <span className="text-xs text-gray-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.body}</p>
                </div>
              );
            })}
          </div>

          {/* Reassign Dropdown */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">{TEXT.reassignTo}</label>
            <select
              defaultValue={ticket.assignedTo}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              {SUPPORT_AGENTS.map((agent) => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>

          {/* Reply Box */}
          <div>
            <textarea
              rows={3}
              placeholder={TEXT.replyPlaceholder}
              className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
            <div className="mt-2 flex items-center gap-2">
              <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
                {TEXT.sendReply}
              </button>
              <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                {TEXT.addInternalNote}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex shrink-0 justify-end gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100">
            {TEXT.markResolved}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {TEXT.close}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function SupportCenter() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters: SupportListFilters = {
    search: debouncedSearch,
    tab: mockSupportTabs[activeTab]?.key ?? 'all',
    page,
    pageSize: PAGE_SIZE,
  };

  const statsQuery = useSupportStats();
  const listQuery = useSupportList(filters);
  const kbQuery = useKnowledgeBase();

  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setActiveTab(0);
    setPage(1);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedTicket(null);
  }, []);

  // ------ LOADING STATE ------
  if (statsQuery.isLoading || listQuery.isLoading) {
    return <SupportSkeleton />;
  }

  // ------ ERROR STATE ------
  if (statsQuery.isError || listQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{(statsQuery.error ?? listQuery.error)?.message}</p>
        <button
          onClick={() => { statsQuery.refetch(); listQuery.refetch(); }}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const stats = statsQuery.data;
  const { tickets } = listQuery.data ?? { tickets: [] };
  const kbArticles = kbQuery.data ?? [];
  const isEmpty = tickets.length === 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
          <Plus className="h-4 w-4" aria-hidden="true" />
          {TEXT.createTicket}
        </button>
      </header>

      {/* Stat Cards */}
      {stats && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-4" aria-label="Support statistics">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Open</p>
                <p className="mt-1 text-2xl font-bold text-blue-600">{stats.open}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <InboxIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Escalated</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{stats.escalated}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Avg Response</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stats.avgResponseHrs} <span className="text-sm font-normal text-gray-500">hrs</span>
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Clock className="h-5 w-5 text-green-600" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">SLA Breach</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{stats.slaBreach}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <Shield className="h-5 w-5 text-yellow-600" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ticket Table */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Tabs + Search */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <nav className="flex flex-wrap gap-1" role="tablist" aria-label="Ticket status filter">
            {mockSupportTabs.map((tab, i) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === i}
                onClick={() => handleTabChange(i)}
                className={cn(
                  'rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium transition',
                  activeTab === i
                    ? 'border-orange-500 bg-orange-50 text-orange-500'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
              placeholder={TEXT.searchPlaceholder}
              className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              aria-label="Search tickets"
            />
          </div>
        </div>

        {/* Table or Empty State */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20">
            <InboxIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
            <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
            <button
              onClick={handleClearFilters}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              {TEXT.clearFilters}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label={TEXT.tableLabel}>
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colId}</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colCustomer}</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colType}</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colSubject}</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colPriority}</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colStatus}</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colAssigned}</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colDate}</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="transition hover:bg-orange-50/40">
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-gray-500">{ticket.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{ticket.customerName}</td>
                    <td className="px-6 py-4">
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', TYPE_STYLES[ticket.type])}>{ticket.type}</span>
                    </td>
                    <td className="max-w-[200px] truncate px-6 py-4 text-gray-700">{ticket.subject}</td>
                    <td className="px-6 py-4">
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', PRIORITY_STYLES[ticket.priority])}>{ticket.priority}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', STATUS_STYLES[ticket.status])}>{ticket.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{ticket.assignedTo}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">{ticket.date}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-xs font-medium text-orange-500 transition hover:text-orange-600"
                      >
                        {TEXT.viewTicket}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Knowledge Base */}
      <section aria-label="Knowledge base">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{TEXT.knowledgeBase}</h2>
          <button className="text-sm font-medium text-orange-500 transition hover:text-orange-600">{TEXT.addArticle}</button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kbArticles.map((article) => (
            <article key={article.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider', article.categoryColor)}>
                {article.category}
              </span>
              <h3 className="mt-3 text-sm font-bold text-gray-900">{article.title}</h3>
              <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <BookOpen className="h-3 w-3" aria-hidden="true" />
                {article.views.toLocaleString()} views
              </p>
              <button className="mt-3 text-xs font-medium text-orange-500 transition hover:text-orange-600">
                {TEXT.editArticle}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Ticket Detail Modal */}
      <TicketModal ticket={selectedTicket} onClose={handleCloseModal} />
    </div>
  );
}
