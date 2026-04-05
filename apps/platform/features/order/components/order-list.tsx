'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Clock, RefreshCw, Truck, CheckCircle, XCircle,
  Search, Download, Plus, Eye, MoreVertical,
  FileText, MapPin, Ban, AlertTriangle, Inbox,
  CreditCard, Smartphone, Banknote, Wallet,
  ArrowUpDown, SlidersHorizontal, Filter,
  ChevronLeft, ChevronRight, ChevronDown,
  X, Lightbulb, Star, Printer,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  Skeleton,
} from '@homebase/ui';

import { useOrderStats, useOrderList, useOrderStateCounts } from '../hooks/use-order';
import type { OrderListFilters } from '../types';

// ----------------------------------------------------------------
// TEXT Constants
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Order Management',
  pageSubtitle: 'Monitor and manage all platform orders across sellers',
  exportCsv: 'Export CSV',
  createOrder: 'Create Order',
  advancedFilters: 'Advanced Filters',
  searchPlaceholder: 'Search by Order ID, customer name, or product...',
  allSellers: 'All Sellers',
  clearFilters: 'Clear Filters',
  related: 'Related:',
  disputes: 'Disputes',
  colCheckbox: '',
  colOrderId: 'Order ID',
  colCustomer: 'Customer',
  colSeller: 'Seller',
  colProducts: 'Products',
  colAmount: 'Amount',
  colPayment: 'Payment',
  colRegion: 'Region',
  colStatus: 'Status',
  colSla: 'SLA',
  colDate: 'Date',
  colActions: 'Actions',
  viewDetails: 'View Details',
  trackOrder: 'Track Order',
  printInvoice: 'Print Invoice',
  cancelRefund: 'Cancel / Refund',
  emptyTitle: 'No orders found',
  emptySubtitle: 'Try adjusting your search or filter criteria.',
  errorTitle: 'Failed to load orders',
  retry: 'Retry',
  selectAll: 'Select All',
  sort: 'Sort',
  columns: 'Columns',
  ordersShown: 'orders shown',
  showing: 'Showing',
  of: 'of',
  orders: 'orders',
  previous: 'Previous',
  next: 'Next',
  tableLabel: 'Orders list',
  perPage: 'per page',
  to: 'to',
  smartTitle: '14 orders pending >4hrs -- take action',
  smartDesc: 'These orders risk breaching SLA. Auto-assign to available fulfillment centers to maintain delivery promise.',
  reviewNow: 'Review Now',
  bulkMarkShipped: 'Mark Shipped',
  bulkGenerateLabels: 'Generate Labels',
  bulkExportSelected: 'Export Selected',
  bulkCancelSelected: 'Cancel Selected',
  ordersSelected: 'orders selected',
  clearSelection: 'Clear Selection',
  apply: 'Apply',
  reset: 'Reset',
  paymentMethod: 'Payment Method',
  region: 'Region',
  orderValue: 'Order Value',
  carrier: 'Carrier',
  deliverySla: 'Delivery SLA',
} as const;

// ----------------------------------------------------------------
// Mock data matching prototype values exactly
// ----------------------------------------------------------------

const SELLERS = ['All Sellers', 'Rajesh Store', 'Priya Electronics', 'Kumar Fashions', 'Anita Home Decor', 'Vikram Sports', 'Meera Beauty'];

interface StatCardData {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend: string;
  trendColor: string;
  borderClass: string;
  valueColor?: string;
  pulse?: boolean;
}

const MOCK_STATS: StatCardData[] = [
  { label: 'Total Orders', value: '12,450', icon: 'bag', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', trend: '+12.5%', trendColor: 'bg-green-50 text-green-600', borderClass: 'border-gray-100' },
  { label: 'Pending', value: '234', icon: 'clock', iconBg: 'bg-yellow-50', iconColor: 'text-yellow-500', trend: '+8.2%', trendColor: 'bg-red-50 text-red-600', borderClass: 'border-gray-100' },
  { label: 'Processing', value: '567', icon: 'refresh', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', trend: '-3.1%', trendColor: 'bg-green-50 text-green-600', borderClass: 'border-gray-100' },
  { label: 'Shipped', value: '1,890', icon: 'truck', iconBg: 'bg-purple-50', iconColor: 'text-purple-500', trend: '+5.7%', trendColor: 'bg-green-50 text-green-600', borderClass: 'border-gray-100' },
  { label: 'Delivered', value: '9,200', icon: 'check', iconBg: 'bg-green-50', iconColor: 'text-green-500', trend: '+15.3%', trendColor: 'bg-green-50 text-green-600', borderClass: 'border-gray-100' },
  { label: 'Cancelled', value: '559', icon: 'x', iconBg: 'bg-red-50', iconColor: 'text-red-500', trend: '+2.1%', trendColor: 'bg-red-50 text-red-600', borderClass: 'border-gray-100' },
  { label: 'SLA Breaches', value: '12', icon: 'alert', iconBg: 'bg-red-50', iconColor: 'text-red-600', trend: 'Critical', trendColor: 'bg-red-50 text-red-600', borderClass: 'border-red-200', valueColor: 'text-red-600', pulse: true },
  { label: 'High Value Orders', value: '34', icon: 'star', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', trend: '\u20B910K+', trendColor: 'bg-amber-50 text-amber-600', borderClass: 'border-amber-200', valueColor: 'text-amber-600' },
];

interface TabData {
  key: string;
  label: string;
  count: string;
  badge?: boolean;
}

const MOCK_TABS: TabData[] = [
  { key: 'all', label: 'All Orders', count: '12,450' },
  { key: 'pending', label: 'Pending', count: '234' },
  { key: 'processing', label: 'Processing', count: '567' },
  { key: 'shipped', label: 'Shipped', count: '1,890' },
  { key: 'delivered', label: 'Delivered', count: '9,200' },
  { key: 'cancelled', label: 'Cancelled', count: '559' },
  { key: 'disputes', label: 'Disputes', count: '8', badge: true },
];

type SlaStatus = 'On Track' | 'At Risk' | 'Breached';

interface MockOrder {
  id: string;
  customer: string;
  initials: string;
  avatarBg: string;
  email: string;
  seller: string;
  product: string;
  items: string;
  amount: string;
  payment: string;
  region: string;
  status: string;
  statusBg: string;
  statusText: string;
  statusDot: string;
  statusBorder: string;
  sla: SlaStatus;
  date: string;
  time: string;
  isCancelled: boolean;
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: '#HB-10234', customer: 'Arun Mehta', initials: 'AM', avatarBg: 'bg-blue-100 text-blue-700',
    email: 'arun.mehta@email.com', seller: 'Rajesh Store', product: 'iPhone 15 Pro Max', items: '1 item',
    amount: '\u20B91,34,999', payment: 'Card', region: 'Maharashtra',
    status: 'Delivered', statusBg: 'bg-green-50', statusText: 'text-green-700', statusDot: 'bg-green-500', statusBorder: 'border-green-200',
    sla: 'On Track', date: 'Mar 27, 2026', time: '10:45 AM', isCancelled: false,
  },
  {
    id: '#HB-10233', customer: 'Sneha Patel', initials: 'SP', avatarBg: 'bg-pink-100 text-pink-700',
    email: 'sneha.p@email.com', seller: 'Priya Electronics', product: 'Samsung 65" QLED TV', items: '1 item',
    amount: '\u20B989,990', payment: 'UPI', region: 'Karnataka',
    status: 'Processing', statusBg: 'bg-blue-50', statusText: 'text-blue-700', statusDot: 'bg-blue-500', statusBorder: 'border-blue-200',
    sla: 'On Track', date: 'Mar 27, 2026', time: '09:12 AM', isCancelled: false,
  },
  {
    id: '#HB-10232', customer: 'Vikram Kumar', initials: 'VK', avatarBg: 'bg-green-100 text-green-700',
    email: 'vikram.k@email.com', seller: 'Kumar Fashions', product: "Levi's Denim Jacket, Nike Shoes", items: '2 items',
    amount: '\u20B98,450', payment: 'COD', region: 'Delhi NCR',
    status: 'Pending', statusBg: 'bg-yellow-50', statusText: 'text-yellow-700', statusDot: 'bg-yellow-500', statusBorder: 'border-yellow-200',
    sla: 'At Risk', date: 'Mar 26, 2026', time: '11:30 PM', isCancelled: false,
  },
  {
    id: '#HB-10231', customer: 'Deepa Gupta', initials: 'DG', avatarBg: 'bg-purple-100 text-purple-700',
    email: 'deepa.g@email.com', seller: 'Anita Home Decor', product: 'Ceramic Vase Set, Wall Art', items: '3 items',
    amount: '\u20B94,275', payment: 'Card', region: 'Tamil Nadu',
    status: 'Shipped', statusBg: 'bg-purple-50', statusText: 'text-purple-700', statusDot: 'bg-purple-500', statusBorder: 'border-purple-200',
    sla: 'On Track', date: 'Mar 26, 2026', time: '04:18 PM', isCancelled: false,
  },
  {
    id: '#HB-10230', customer: 'Rahul Sharma', initials: 'RS', avatarBg: 'bg-orange-100 text-orange-700',
    email: 'rahul.s@email.com', seller: 'Vikram Sports', product: 'Cricket Bat (MRF Genius)', items: '1 item',
    amount: '\u20B912,500', payment: 'UPI', region: 'Gujarat',
    status: 'Cancelled', statusBg: 'bg-red-50', statusText: 'text-red-700', statusDot: 'bg-red-500', statusBorder: 'border-red-200',
    sla: 'Breached', date: 'Mar 25, 2026', time: '02:05 PM', isCancelled: true,
  },
  {
    id: '#HB-10229', customer: 'Neha Reddy', initials: 'NR', avatarBg: 'bg-teal-100 text-teal-700',
    email: 'neha.r@email.com', seller: 'Meera Beauty', product: 'Lakme Combo, Maybelline Set', items: '4 items',
    amount: '\u20B93,890', payment: 'Card', region: 'Karnataka',
    status: 'Delivered', statusBg: 'bg-green-50', statusText: 'text-green-700', statusDot: 'bg-green-500', statusBorder: 'border-green-200',
    sla: 'On Track', date: 'Mar 25, 2026', time: '01:20 PM', isCancelled: false,
  },
  {
    id: '#HB-10228', customer: 'Karthik Jain', initials: 'KJ', avatarBg: 'bg-indigo-100 text-indigo-700',
    email: 'karthik.j@email.com', seller: 'Rajesh Store', product: 'MacBook Air M3, Magic Mouse', items: '2 items',
    amount: '\u20B91,24,900', payment: 'Card', region: 'Maharashtra',
    status: 'Shipped', statusBg: 'bg-purple-50', statusText: 'text-purple-700', statusDot: 'bg-purple-500', statusBorder: 'border-purple-200',
    sla: 'At Risk', date: 'Mar 24, 2026', time: '06:55 PM', isCancelled: false,
  },
  {
    id: '#HB-10227', customer: 'Pooja Singh', initials: 'PS', avatarBg: 'bg-rose-100 text-rose-700',
    email: 'pooja.s@email.com', seller: 'Priya Electronics', product: 'Sony WH-1000XM5, Case', items: '2 items',
    amount: '\u20B928,990', payment: 'COD', region: 'West Bengal',
    status: 'Pending', statusBg: 'bg-yellow-50', statusText: 'text-yellow-700', statusDot: 'bg-yellow-500', statusBorder: 'border-yellow-200',
    sla: 'Breached', date: 'Mar 24, 2026', time: '03:40 PM', isCancelled: false,
  },
];

const FILTER_PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI', icon: 'phone', iconColor: 'text-green-500', count: '4,230' },
  { value: 'Card', label: 'Card', icon: 'card', iconColor: 'text-blue-500', count: '5,120' },
  { value: 'COD', label: 'COD', icon: 'cash', iconColor: 'text-amber-500', count: '2,340' },
  { value: 'Wallet', label: 'Wallet', icon: 'wallet', iconColor: 'text-purple-500', count: '760' },
] as const;

const FILTER_REGIONS = [
  { value: 'Maharashtra', count: '3,450' },
  { value: 'Karnataka', count: '2,890' },
  { value: 'Delhi NCR', count: '2,130' },
  { value: 'Tamil Nadu', count: '1,980' },
  { value: 'Gujarat', count: '1,200' },
  { value: 'West Bengal', count: '800' },
] as const;

const FILTER_ORDER_VALUES = [
  { value: '0-500', label: '\u20B90 - \u20B9500', count: '1,230' },
  { value: '500-2000', label: '\u20B9500 - \u20B92,000', count: '3,450' },
  { value: '2000-5000', label: '\u20B92,000 - \u20B95,000', count: '4,120' },
  { value: '5000+', label: '\u20B95,000+', count: '3,650' },
] as const;

const FILTER_CARRIERS = [
  { value: 'Delhivery', count: '4,800' },
  { value: 'BlueDart', count: '3,200' },
  { value: 'DTDC', count: '2,100' },
  { value: 'Ecom Express', count: '1,550' },
  { value: 'India Post', count: '800' },
] as const;

const FILTER_SLA = [
  { value: 'On Track', dotColor: 'bg-green-500', count: '8,920' },
  { value: 'At Risk', dotColor: 'bg-yellow-500', count: '2,340' },
  { value: 'Breached', dotColor: 'bg-red-500', count: '1,190' },
] as const;

const PAGE_SIZE_OPTIONS = [8, 20, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 8;
const DEBOUNCE_MS = 300;

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function StatIcon({ icon, className }: { icon: string; className?: string }) {
  const props = { className: cn('h-5 w-5', className) };
  switch (icon) {
    case 'bag': return <ShoppingBag {...props} />;
    case 'clock': return <Clock {...props} />;
    case 'refresh': return <RefreshCw {...props} />;
    case 'truck': return <Truck {...props} />;
    case 'check': return <CheckCircle {...props} />;
    case 'x': return <XCircle {...props} />;
    case 'alert': return <AlertTriangle {...props} />;
    case 'star': return <Star {...props} />;
    default: return <ShoppingBag {...props} />;
  }
}

function PaymentFilterIcon({ icon, className }: { icon: string; className?: string }) {
  const props = { className: cn('h-4 w-4', className) };
  switch (icon) {
    case 'phone': return <Smartphone {...props} />;
    case 'card': return <CreditCard {...props} />;
    case 'cash': return <Banknote {...props} />;
    case 'wallet': return <Wallet {...props} />;
    default: return <CreditCard {...props} />;
  }
}

function PaymentIcon({ method }: { method: string }) {
  const m = method.toUpperCase();
  if (m === 'CARD' || m === 'CREDIT_CARD' || m === 'DEBIT_CARD') return <CreditCard className="h-3.5 w-3.5 text-blue-500" />;
  if (m === 'UPI') return <Smartphone className="h-3.5 w-3.5 text-green-500" />;
  if (m === 'COD') return <Banknote className="h-3.5 w-3.5 text-amber-500" />;
  if (m === 'WALLET') return <Wallet className="h-3.5 w-3.5 text-purple-500" />;
  return <CreditCard className="h-3.5 w-3.5 text-gray-400" />;
}

function SlaLabel({ sla }: { sla: SlaStatus }) {
  const config: Record<SlaStatus, { bg: string; text: string; border: string }> = {
    'On Track': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'At Risk': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Breached': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };
  const c = config[sla];
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold', c.bg, c.text, c.border)}>
      {sla}
    </span>
  );
}

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [];
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('ellipsis');
    pages.push(total);
  } else if (current >= total - 3) {
    pages.push(1);
    pages.push('ellipsis');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push('ellipsis');
    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);
    pages.push('ellipsis');
    pages.push(total);
  }
  return pages;
}

// ----------------------------------------------------------------
// Filter Sidebar Section (collapsible)
// ----------------------------------------------------------------

function FilterSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-50 pb-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer select-none items-center justify-between py-2"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">{title}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>
      <div className={cn('mt-1 space-y-2 overflow-hidden transition-[max-height] duration-250', open ? 'max-h-[400px]' : 'max-h-0')}>
        {children}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function OrderList() {
  // -- State --
  const [activeTab, setActiveTab] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-03-01');
  const [dateTo, setDateTo] = useState('2026-03-28');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Filter sidebar state
  const [filterPayment, setFilterPayment] = useState<Set<string>>(new Set());
  const [filterRegion, setFilterRegion] = useState<Set<string>>(new Set());
  const [filterOrderValue, setFilterOrderValue] = useState('');
  const [filterCarrier, setFilterCarrier] = useState<Set<string>>(new Set());
  const [filterSla, setFilterSla] = useState<Set<string>>(new Set());

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchInput); setPage(1); }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Hook-based queries (fall through to mock data for display)
  const filters: OrderListFilters = {
    search: debouncedSearch,
    status: activeTab,
    seller: selectedSeller,
    page,
    pageSize,
  };

  const statsQuery = useOrderStats();
  const listQuery = useOrderList(filters);
  const stateCountsQuery = useOrderStateCounts();

  // -- Handlers --
  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
    setPage(1);
    setSelectedRows(new Set());
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setSelectedSeller('');
    setDateFrom('2026-03-01');
    setDateTo('2026-03-28');
    setActiveTab('all');
    setPage(1);
    setSelectedRows(new Set());
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const toggleCheckbox = useCallback((name: string, set: Set<string>, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }, []);

  const toggleRowSelection = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleAllRows = useCallback(() => {
    if (selectedRows.size === MOCK_ORDERS.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(MOCK_ORDERS.map((o) => o.id)));
    }
  }, [selectedRows.size]);

  const resetAdvancedFilters = useCallback(() => {
    setFilterPayment(new Set());
    setFilterRegion(new Set());
    setFilterOrderValue('');
    setFilterCarrier(new Set());
    setFilterSla(new Set());
  }, []);

  // Pagination
  const totalOrders = 12450;
  const totalPages = Math.ceil(totalOrders / pageSize);
  const pageNumbers = useMemo(() => buildPageNumbers(page, totalPages), [page, totalPages]);
  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalOrders);

  const allSelected = selectedRows.size === MOCK_ORDERS.length && MOCK_ORDERS.length > 0;
  const someSelected = selectedRows.size > 0;

  // -- Loading State --
  if (!statsQuery.data && statsQuery.isLoading) {
    return <OrderListSkeleton />;
  }

  // -- Error State --
  if (statsQuery.isError || listQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32">
        <AlertTriangle className="h-12 w-12 text-red-400" />
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

  // Use mock orders for display (prototype pixel-match)
  const orders = MOCK_ORDERS;
  const isEmpty = orders.length === 0;

  return (
    <div className="space-y-6">
      {/* ===== Page Title ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterSidebarOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            {TEXT.advancedFilters}
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Download className="h-4 w-4" />
            {TEXT.exportCsv}
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600">
            <Plus className="h-4 w-4" />
            {TEXT.createOrder}
          </button>
        </div>
      </div>

      {/* ===== Sub-page Navigation ===== */}
      <nav className="flex items-center gap-2" aria-label="Related pages">
        <span className="text-xs text-gray-400">{TEXT.related}</span>
        <Link href="/orders/disputes" className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100">
          {TEXT.disputes}
        </Link>
      </nav>

      {/* ===== 8 Stat Cards ===== */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8" aria-label="Order statistics">
        {MOCK_STATS.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
              stat.borderClass,
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.iconBg)}>
                <StatIcon
                  icon={stat.icon}
                  className={cn(stat.iconColor, stat.pulse && 'animate-pulse')}
                />
              </div>
              <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-semibold', stat.trendColor)}>
                {stat.trend}
              </span>
            </div>
            <p className={cn('text-2xl font-bold', stat.valueColor ?? 'text-gray-900')}>{stat.value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ===== Smart Recommendations Widget ===== */}
      {showRecommendation && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">{TEXT.smartTitle}</p>
              <p className="mt-0.5 text-xs text-amber-600">{TEXT.smartDesc}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button className="rounded-lg bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-200 hover:text-amber-900">
              {TEXT.reviewNow}
            </button>
            <button
              onClick={() => setShowRecommendation(false)}
              className="rounded-lg p-1.5 text-amber-400 transition hover:text-amber-600"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===== Content Area with Optional Filter Sidebar ===== */}
      <div className="flex gap-6">

        {/* ===== Advanced Filters Sidebar ===== */}
        <div
          className={cn(
            'shrink-0 transition-all duration-250',
            filterSidebarOpen ? 'w-64 opacity-100' : 'w-0 overflow-hidden opacity-0',
          )}
        >
          <div className="sticky top-24 w-64 rounded-xl border border-gray-100 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
              <h3 className="text-sm font-bold text-gray-800">{TEXT.advancedFilters}</h3>
              <button
                onClick={() => setFilterSidebarOpen(false)}
                className="rounded p-1 text-gray-400 transition hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Sections */}
            <div className="max-h-[calc(100vh-200px)] space-y-1 overflow-y-auto p-4">
              {/* Payment Method */}
              <FilterSection title={TEXT.paymentMethod}>
                {FILTER_PAYMENT_METHODS.map((pm) => (
                  <label key={pm.value} className="group flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={filterPayment.has(pm.value)}
                      onChange={() => toggleCheckbox(pm.value, filterPayment, setFilterPayment)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <PaymentFilterIcon icon={pm.icon} className={pm.iconColor} />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{pm.label}</span>
                    <span className="ml-auto text-[10px] text-gray-400">{pm.count}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Region */}
              <FilterSection title={TEXT.region}>
                {FILTER_REGIONS.map((r) => (
                  <label key={r.value} className="group flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={filterRegion.has(r.value)}
                      onChange={() => toggleCheckbox(r.value, filterRegion, setFilterRegion)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{r.value}</span>
                    <span className="ml-auto text-[10px] text-gray-400">{r.count}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Order Value */}
              <FilterSection title={TEXT.orderValue}>
                {FILTER_ORDER_VALUES.map((ov) => (
                  <label key={ov.value} className="group flex cursor-pointer items-center gap-2.5">
                    <input
                      type="radio"
                      name="orderValue"
                      checked={filterOrderValue === ov.value}
                      onChange={() => setFilterOrderValue(ov.value)}
                      className="h-3.5 w-3.5 border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{ov.label}</span>
                    <span className="ml-auto text-[10px] text-gray-400">{ov.count}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Carrier */}
              <FilterSection title={TEXT.carrier}>
                {FILTER_CARRIERS.map((c) => (
                  <label key={c.value} className="group flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={filterCarrier.has(c.value)}
                      onChange={() => toggleCheckbox(c.value, filterCarrier, setFilterCarrier)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{c.value}</span>
                    <span className="ml-auto text-[10px] text-gray-400">{c.count}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Delivery SLA */}
              <div className="pb-2">
                <FilterSection title={TEXT.deliverySla}>
                  {FILTER_SLA.map((s) => (
                    <label key={s.value} className="group flex cursor-pointer items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filterSla.has(s.value)}
                        onChange={() => toggleCheckbox(s.value, filterSla, setFilterSla)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                      />
                      <span className={cn('h-2 w-2 rounded-full', s.dotColor)} />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{s.value}</span>
                      <span className="ml-auto text-[10px] text-gray-400">{s.count}</span>
                    </label>
                  ))}
                </FilterSection>
              </div>

              {/* Apply / Reset */}
              <div className="flex items-center gap-2 pt-3">
                <button className="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-medium text-white transition hover:bg-orange-600">
                  {TEXT.apply}
                </button>
                <button
                  onClick={resetAdvancedFilters}
                  className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  {TEXT.reset}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Table + Filters Column ===== */}
        <div className="min-w-0 flex-1">

          {/* ===== Filters & Search Card ===== */}
          <section className="mb-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            {/* Filter Tabs */}
            <div className="border-b border-gray-100 px-6">
              <nav className="scrollbar-hide flex items-center gap-0 overflow-x-auto" role="tablist" aria-label="Order status filter">
                {MOCK_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={cn(
                      'whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-medium transition',
                      activeTab === tab.key
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700',
                    )}
                  >
                    {tab.label}{' '}
                    {tab.badge ? (
                      <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">{tab.count}</span>
                    ) : (
                      <span className="font-normal text-gray-400">({tab.count})</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Search & Filters Row */}
            <div className="flex flex-wrap items-center gap-3 px-6 py-4">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                  placeholder={TEXT.searchPlaceholder}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  aria-label="Search orders"
                />
              </div>
              {/* Date From */}
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                  className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  aria-label="Date from"
                />
              </div>
              <span className="text-sm text-gray-400">{TEXT.to}</span>
              {/* Date To */}
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                  className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  aria-label="Date to"
                />
              </div>
              {/* Seller Filter */}
              <select
                value={selectedSeller}
                onChange={(e) => { setSelectedSeller(e.target.value); setPage(1); }}
                className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pr-8 text-sm text-gray-600 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                aria-label="Filter by seller"
              >
                {SELLERS.map((s) => (
                  <option key={s} value={s === 'All Sellers' ? '' : s}>{s}</option>
                ))}
              </select>
              {/* Clear Filters */}
              <button
                onClick={handleClearFilters}
                className="whitespace-nowrap text-sm font-medium text-gray-500 transition hover:text-orange-500"
              >
                {TEXT.clearFilters}
              </button>
            </div>
          </section>

          {/* ===== Bulk Actions Toolbar ===== */}
          {someSelected && (
            <div className="mb-4 transition-all duration-200">
              <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
                      <span className="text-xs font-bold text-white">{selectedRows.size}</span>
                    </div>
                    <span className="text-sm font-medium text-orange-700">{selectedRows.size} {TEXT.ordersSelected}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-600">
                    <Truck className="h-3.5 w-3.5" />
                    {TEXT.bulkMarkShipped} ({selectedRows.size})
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-600">
                    <Printer className="h-3.5 w-3.5" />
                    {TEXT.bulkGenerateLabels}
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-600">
                    <Download className="h-3.5 w-3.5" />
                    {TEXT.bulkExportSelected}
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700">
                    <Ban className="h-3.5 w-3.5" />
                    {TEXT.bulkCancelSelected}
                  </button>
                </div>
                <button
                  onClick={() => setSelectedRows(new Set())}
                  className="text-sm font-medium text-gray-500 transition hover:text-gray-700"
                >
                  {TEXT.clearSelection}
                </button>
              </div>
            </div>
          )}

          {/* ===== Empty State ===== */}
          {isEmpty ? (
            <section className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-24 shadow-sm">
              <Inbox className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
              <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
              <button
                onClick={handleClearFilters}
                className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                {TEXT.clearFilters}
              </button>
            </section>
          ) : (
            /* ===== Orders Table Card ===== */
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              {/* Table Header Actions */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAllRows}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    aria-label="Select all orders"
                  />
                  <span className="text-sm text-gray-500">{TEXT.selectAll}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                    {orders.length} {TEXT.ordersShown}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-700">
                    <ArrowUpDown className="h-4 w-4" />
                    {TEXT.sort}
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-700">
                    <SlidersHorizontal className="h-4 w-4" />
                    {TEXT.columns}
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className={cn('overflow-x-auto transition-opacity duration-200', listQuery.isFetching ? 'opacity-50' : 'opacity-100')}>
                <table className="w-full" aria-label={TEXT.tableLabel}>
                  <thead>
                    <tr className="bg-gray-50/80">
                      <th scope="col" className="w-10 px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleAllRows}
                          className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                          aria-label="Select all orders"
                        />
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colOrderId}</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colCustomer}</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colSeller}</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colProducts}</th>
                      <th scope="col" className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colAmount}</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colPayment}</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colRegion}</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colStatus}</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colSla}</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colDate}</th>
                      <th scope="col" className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">{TEXT.colActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((o) => {
                      const linkId = o.id.replace('#', '');
                      const isSelected = selectedRows.has(o.id);

                      return (
                        <tr
                          key={o.id}
                          className={cn(
                            'transition-colors duration-150 hover:bg-[#FFF7ED]',
                            isSelected && 'bg-[#FFF7ED]',
                          )}
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = `/orders/${linkId}`; }}
                        >
                          <td className="px-6 py-3.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRowSelection(o.id)}
                              className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                              aria-label={`Select order ${o.id}`}
                            />
                          </td>
                          <td className="px-4 py-3.5">
                            <Link href={`/orders/${linkId}`} className="text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline">
                              {o.id}
                            </Link>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold', o.avatarBg)}>
                                {o.initials}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{o.customer}</p>
                                <p className="text-[11px] text-gray-400">{o.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-sm text-gray-700">{o.seller}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-sm text-gray-700">{o.product}</p>
                            <p className="text-[11px] text-gray-400">{o.items}</p>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <p className={cn('text-sm font-semibold', o.isCancelled ? 'text-gray-400 line-through' : 'text-gray-800')}>
                              {o.amount}
                            </p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                              <PaymentIcon method={o.payment} />
                              {o.payment}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs text-gray-600">{o.region}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn(
                              'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                              o.statusBg, o.statusText, o.statusBorder,
                            )}>
                              <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', o.statusDot)} />
                              {o.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <SlaLabel sla={o.sla} />
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-sm text-gray-600">{o.date}</p>
                            <p className="text-[11px] text-gray-400">{o.time}</p>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Link
                                href={`/orders/${linkId}`}
                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500"
                                title={TEXT.viewDetails}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" title="More actions">
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/orders/${linkId}`}>
                                      <Eye className="mr-2 h-4 w-4 text-gray-400" /> {TEXT.viewDetails}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MapPin className="mr-2 h-4 w-4 text-gray-400" /> {TEXT.trackOrder}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4 text-gray-400" /> {TEXT.printInvoice}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                    <Ban className="mr-2 h-4 w-4" /> {TEXT.cancelRefund}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ===== Pagination ===== */}
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {TEXT.showing}{' '}
                    <span className="font-medium text-gray-700">{rangeStart}-{rangeEnd}</span>{' '}
                    {TEXT.of}{' '}
                    <span className="font-medium text-gray-700">{totalOrders.toLocaleString('en-IN')}</span>{' '}
                    {TEXT.orders}
                  </p>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-600 outline-none transition focus:border-orange-400"
                    aria-label="Rows per page"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>{size} {TEXT.perPage}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  {/* Previous */}
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                    aria-label={TEXT.previous}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {/* Page Numbers */}
                  {pageNumbers.map((pn, idx) =>
                    pn === 'ellipsis' ? (
                      <span key={`ellipsis-${idx}`} className="flex h-8 w-8 items-center justify-center text-sm text-gray-400">...</span>
                    ) : (
                      <button
                        key={pn}
                        onClick={() => setPage(pn)}
                        className={cn(
                          'h-8 w-8 rounded-lg text-sm font-medium transition',
                          pn === page
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100',
                        )}
                      >
                        {pn.toLocaleString('en-IN')}
                      </button>
                    ),
                  )}
                  {/* Next */}
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                    aria-label={TEXT.next}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Loading Skeleton
// ----------------------------------------------------------------

function OrderListSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      {/* Related pills */}
      <Skeleton className="h-6 w-40" />
      {/* 8 Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
      {/* Recommendation bar */}
      <Skeleton className="h-16 rounded-xl" />
      {/* Tabs + search */}
      <Skeleton className="h-[120px] rounded-xl" />
      {/* Table */}
      <Skeleton className="h-[500px] rounded-xl" />
    </div>
  );
}
