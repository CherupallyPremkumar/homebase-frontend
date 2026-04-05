'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  IndianRupee,
  Hash,
  ShieldCheck,
  Banknote,
  Download,
  Plus,
  Check,
  AlertTriangle,
  AlertCircle,
  Calendar,
  PieChart,
  Clock,
  ExternalLink,
  Pencil,
  FileText,
  Calculator,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type TabFilter = 'all' | 'active' | 'draft';

interface TaxSlab {
  hsnCode: string;
  description: string;
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
  effectiveDate: string;
  enabled: boolean;
  dotColor: string;
  rateColor: string;
}

interface TaxRule {
  id: string;
  category: string;
  subLabel: string;
  emoji: string;
  emojiBg: string;
  hsnCode: string;
  cgst: number;
  sgst: number;
  igst: number;
  rateColor: string;
  status: 'Active' | 'Draft';
}

interface FilingItem {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeVariant: 'green' | 'amber' | 'blue' | 'gray';
  iconBg: string;
  iconColor: string;
  extra?: string;
}

interface SimResult {
  isInterState: boolean;
  fromName: string;
  toName: string;
  basePrice: number;
  cgst: number;
  sgst: number;
  igst: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  totalTax: number;
  totalAmount: number;
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

const TAX_SLABS: TaxSlab[] = [
  { hsnCode: '0801', description: 'Fresh Fruits, Vegetables, Milk, Grains', cgst: 0, sgst: 0, igst: 0, cess: 0, effectiveDate: '2017-07-01', enabled: true, dotColor: 'bg-emerald-500', rateColor: 'text-emerald-600' },
  { hsnCode: '6109', description: 'Apparel below Rs.1000, Packaged Food, Footwear', cgst: 2.5, sgst: 2.5, igst: 5, cess: 0, effectiveDate: '2022-01-01', enabled: true, dotColor: 'bg-blue-500', rateColor: 'text-blue-600' },
  { hsnCode: '8517', description: 'Mobile Phones, Apparel above Rs.1000, Processed Food', cgst: 6, sgst: 6, igst: 12, cess: 0, effectiveDate: '2017-07-01', enabled: true, dotColor: 'bg-purple-500', rateColor: 'text-purple-600' },
  { hsnCode: '9403', description: 'Furniture, Electronics, Laptops, AC, Refrigerators', cgst: 9, sgst: 9, igst: 18, cess: 0, effectiveDate: '2017-07-01', enabled: true, dotColor: 'bg-amber-500', rateColor: 'text-amber-600' },
  { hsnCode: '8703', description: 'Automobiles, Luxury Watches, Premium Cosmetics', cgst: 14, sgst: 14, igst: 28, cess: 12, effectiveDate: '2017-07-01', enabled: true, dotColor: 'bg-red-500', rateColor: 'text-red-600' },
];

const SLAB_CARDS = [
  { rate: '0%', label: 'Exempt', count: '342 products', color: 'text-emerald-600' },
  { rate: '5%', label: 'Essential', count: '1,245 products', color: 'text-blue-600' },
  { rate: '12%', label: 'Standard Low', count: '2,890 products', color: 'text-purple-600' },
  { rate: '18%', label: 'Standard', count: '3,456 products', color: 'text-amber-600' },
  { rate: '28%', label: 'Luxury', count: '987 products', color: 'text-red-600' },
];

const TAX_RULES: TaxRule[] = [
  { id: '1', category: 'Fresh Fruits & Vegetables', subLabel: 'Essential goods', emoji: '\u{1F34E}', emojiBg: 'bg-emerald-50', hsnCode: '0801', cgst: 0, sgst: 0, igst: 0, rateColor: 'text-emerald-600', status: 'Active' },
  { id: '2', category: 'Apparel (below Rs.1000)', subLabel: 'Clothing & footwear', emoji: '\u{1F455}', emojiBg: 'bg-blue-50', hsnCode: '6109', cgst: 2.5, sgst: 2.5, igst: 5, rateColor: 'text-blue-600', status: 'Active' },
  { id: '3', category: 'Apparel (above Rs.1000)', subLabel: 'Premium clothing', emoji: '\u{1F457}', emojiBg: 'bg-purple-50', hsnCode: '6110', cgst: 6, sgst: 6, igst: 12, rateColor: 'text-purple-600', status: 'Active' },
  { id: '4', category: 'Furniture & Fixtures', subLabel: 'Home furnishing', emoji: '\u{1F3E0}', emojiBg: 'bg-amber-50', hsnCode: '9403', cgst: 9, sgst: 9, igst: 18, rateColor: 'text-amber-600', status: 'Active' },
  { id: '5', category: 'Automobiles & Parts', subLabel: 'Luxury goods', emoji: '\u{1F697}', emojiBg: 'bg-red-50', hsnCode: '8703', cgst: 14, sgst: 14, igst: 28, rateColor: 'text-red-600', status: 'Active' },
  { id: '6', category: 'Luxury Watches & Jewelry', subLabel: 'Luxury category', emoji: '\u{1F48E}', emojiBg: 'bg-yellow-50', hsnCode: '7113', cgst: 14, sgst: 14, igst: 28, rateColor: 'text-red-600', status: 'Draft' },
];

const FILINGS: FilingItem[] = [
  { title: 'GSTR-1 (Outward Supplies)', subtitle: 'March 2026 - Filed on 11 Apr 2026', badgeText: 'Filed', badgeVariant: 'green', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { title: 'GSTR-3B (Summary Return)', subtitle: 'March 2026 - Due 20 Apr 2026 (18 days left)', badgeText: 'Due', badgeVariant: 'amber', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { title: 'GSTR-2A (Inward Supplies)', subtitle: 'March 2026 - Auto-reconciliation running', badgeText: '98.2% Reconciled', badgeVariant: 'blue', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', extra: '27 invoices pending match' },
  { title: 'GSTR-9 (Annual Return)', subtitle: 'FY 2025-26 - Due 31 Dec 2026', badgeText: 'Upcoming', badgeVariant: 'gray', iconBg: 'bg-gray-200', iconColor: 'text-gray-600' },
];

const DEADLINES = [
  { label: 'GSTR-3B (Mar 2026)', date: '20 Apr 2026', dotColor: 'bg-amber-500', dateStyle: 'text-amber-600 font-semibold' },
  { label: 'GSTR-1 (Apr 2026)', date: '11 May 2026', dotColor: 'bg-gray-300', dateStyle: 'text-gray-500 font-medium' },
  { label: 'GSTR-3B (Apr 2026)', date: '20 May 2026', dotColor: 'bg-gray-300', dateStyle: 'text-gray-500 font-medium' },
];

const STATES = [
  { code: 'KA', name: 'Karnataka' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'DL', name: 'Delhi' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'WB', name: 'West Bengal' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'UP', name: 'Uttar Pradesh' },
];

const HSN_OPTIONS = [
  { value: 0, label: '0801 - Exempt (0%)' },
  { value: 5, label: '6109 - Essential (5%)' },
  { value: 12, label: '8517 - Standard Low (12%)' },
  { value: 18, label: '9403 - Standard (18%)' },
  { value: 28, label: '8703 - Luxury (28%)' },
];

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function formatINR(n: number): string {
  return 'Rs.' + n.toLocaleString('en-IN');
}

const badgeVariantClasses: Record<string, { bg: string; bgStrong: string; text: string; dot: string }> = {
  green: { bg: 'bg-green-50', bgStrong: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  amber: { bg: 'bg-amber-50', bgStrong: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  blue: { bg: 'bg-blue-50', bgStrong: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  gray: { bg: 'bg-gray-100', bgStrong: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

const alertBgClasses: Record<string, { bg: string; border: string; iconBg: string; iconColor: string; btnBg: string; btnHover: string }> = {
  red: { bg: 'bg-red-50', border: 'border-red-100', iconBg: 'bg-red-100', iconColor: 'text-red-600', btnBg: 'bg-red-600', btnHover: 'hover:bg-red-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', btnBg: 'bg-amber-600', btnHover: 'hover:bg-amber-700' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', btnBg: 'bg-blue-600', btnHover: 'hover:bg-blue-700' },
  gray: { bg: 'bg-gray-50', border: 'border-gray-100', iconBg: 'bg-gray-200', iconColor: 'text-gray-600', btnBg: 'bg-gray-700', btnHover: 'hover:bg-gray-800' },
};

// ----------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------

function StatCard({ label, icon, iconBg, value, footer }: {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  value: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBg)}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="flex items-center gap-1 mt-1">{footer}</div>
    </div>
  );
}

function StatusBadgeInline({ text, variant }: { text: string; variant: string }) {
  const v = badgeVariantClasses[variant] ?? badgeVariantClasses.gray;
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full', v.bg, v.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', v.dot)} />
      {text}
    </span>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
        checked ? 'bg-green-600' : 'bg-gray-300'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-0.5',
          'mt-0.5'
        )}
      />
    </button>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function TaxRateList() {
  // -- Tab & search state
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // -- Tax slab config state
  const [slabs, setSlabs] = useState<TaxSlab[]>(TAX_SLABS);

  // -- Simulator state
  const [simPrice, setSimPrice] = useState(15000);
  const [simHsnRate, setSimHsnRate] = useState(18);
  const [simFromState, setSimFromState] = useState('KA');
  const [simToState, setSimToState] = useState('KA');
  const [simResult, setSimResult] = useState<SimResult | null>({
    isInterState: false,
    fromName: 'Karnataka',
    toName: 'Karnataka',
    basePrice: 12712,
    cgst: 1144,
    sgst: 1144,
    igst: 0,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 0,
    totalTax: 2288,
    totalAmount: 15000,
  });

  // -- Report state
  const [reportType, setReportType] = useState('GSTR-1 (Outward Supplies)');
  const [reportFrom, setReportFrom] = useState('2026-03-01');
  const [reportTo, setReportTo] = useState('2026-03-31');

  // -- Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Tax Rule');

  // -- Filtered rules
  const filteredRules = useMemo(() => {
    let rules = TAX_RULES;
    if (activeTab === 'active') rules = rules.filter((r) => r.status === 'Active');
    if (activeTab === 'draft') rules = rules.filter((r) => r.status === 'Draft');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rules = rules.filter(
        (r) => r.hsnCode.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
      );
    }
    return rules;
  }, [activeTab, searchQuery]);

  const tabCounts = useMemo(() => ({
    all: TAX_RULES.length,
    active: TAX_RULES.filter((r) => r.status === 'Active').length,
    draft: TAX_RULES.filter((r) => r.status === 'Draft').length,
  }), []);

  // -- Slab update handler
  const updateSlab = useCallback((index: number, field: keyof TaxSlab, value: string | number | boolean) => {
    setSlabs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  // -- Tax calculator
  const calculateTax = useCallback(() => {
    const isInterState = simFromState !== simToState;
    const basePrice = Math.round(simPrice / (1 + simHsnRate / 100));
    const totalTax = simPrice - basePrice;
    const fromName = STATES.find((s) => s.code === simFromState)?.name ?? simFromState;
    const toName = STATES.find((s) => s.code === simToState)?.name ?? simToState;

    if (isInterState) {
      setSimResult({
        isInterState: true,
        fromName,
        toName,
        basePrice,
        cgst: 0,
        sgst: 0,
        igst: totalTax,
        cgstRate: 0,
        sgstRate: 0,
        igstRate: simHsnRate,
        totalTax,
        totalAmount: simPrice,
      });
    } else {
      const halfTax = Math.round(totalTax / 2);
      const halfRate = simHsnRate / 2;
      setSimResult({
        isInterState: false,
        fromName,
        toName,
        basePrice,
        cgst: halfTax,
        sgst: halfTax,
        igst: 0,
        cgstRate: halfRate,
        sgstRate: halfRate,
        igstRate: 0,
        totalTax,
        totalAmount: simPrice,
      });
    }
  }, [simPrice, simHsnRate, simFromState, simToState]);

  // -- Modal handlers
  const openAddModal = useCallback(() => {
    setModalTitle('Add Tax Rule');
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((name: string) => {
    setModalTitle(`Edit Tax Rule: ${name}`);
    setModalOpen(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* ===== PAGE HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax & GST Management</h1>
          <p className="text-sm text-gray-500 mt-1">Configure GST rates, HSN codes, and generate tax reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-orange-500 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Tax Rule
          </button>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Tax Rules"
          iconBg="bg-blue-50"
          icon={<IndianRupee className="w-5 h-5 text-blue-600" />}
          value="24"
          footer={
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-semibold text-green-600">All rules active</span>
            </>
          }
        />
        <StatCard
          label="HSN Codes"
          iconBg="bg-purple-50"
          icon={<Hash className="w-5 h-5 text-purple-600" />}
          value="156"
          footer={<span className="text-xs font-semibold text-gray-500">Mapped across categories</span>}
        />
        <StatCard
          label="Compliant Sellers"
          iconBg="bg-green-50"
          icon={<ShieldCheck className="w-5 h-5 text-green-600" />}
          value={<>220 <span className="text-base font-medium text-gray-400">/ 234</span></>}
          footer={
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-600">14 need GST verification</span>
            </>
          }
        />
        <StatCard
          label="GST Collected (Mar)"
          iconBg="bg-amber-50"
          icon={<Banknote className="w-5 h-5 text-amber-600" />}
          value="Rs.18.4L"
          footer={
            <>
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-semibold text-green-600">+12.3% vs last month</span>
            </>
          }
        />
      </div>

      {/* ===== TAX SLAB SUMMARY CARDS ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {SLAB_CARDS.map((slab) => (
          <div key={slab.rate} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
            <p className={cn('text-2xl font-bold', slab.color)}>{slab.rate}</p>
            <p className="text-xs text-gray-500 mt-1">{slab.label}</p>
            <p className="text-sm font-semibold text-gray-800 mt-2">{slab.count}</p>
          </div>
        ))}
      </div>

      {/* ===== COMPLIANCE ALERTS ===== */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Compliance Alerts</h2>
            <p className="text-sm text-gray-500 mt-0.5">Action items requiring immediate attention</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 4 Alerts
          </span>
        </div>
        <div className="space-y-3">
          {/* Alert 1: Missing GSTIN */}
          <AlertRow
            variant="red"
            icon={<AlertTriangle className="w-5 h-5" />}
            title="4 sellers with missing GSTIN"
            subtitle="Sellers cannot process orders without valid GSTIN. Last reminder sent 3 days ago."
            actionLabel="View Sellers"
            actionIcon={<ExternalLink className="w-3.5 h-3.5" />}
          />
          {/* Alert 2: Missing HSN */}
          <AlertRow
            variant="amber"
            icon={<AlertCircle className="w-5 h-5" />}
            title="12 products without HSN code"
            subtitle="Products listed in last 7 days need HSN mapping for correct tax calculation."
            actionLabel="Map HSN Codes"
            actionIcon={<Pencil className="w-3.5 h-3.5" />}
          />
          {/* Alert 3: GSTR-3B filing */}
          <AlertRow
            variant="blue"
            icon={<Calendar className="w-5 h-5" />}
            title="GSTR-3B filing due Apr 20, 2026"
            subtitle="18 days remaining. March data reconciliation is 98.2% complete."
            actionLabel="Prepare Filing"
            actionIcon={<FileText className="w-3.5 h-3.5" />}
          />
          {/* Alert 4: Rate revision */}
          <AlertRow
            variant="gray"
            icon={<PieChart className="w-5 h-5" />}
            title="GST rate revision effective May 1, 2026"
            subtitle="3 categories affected: Packaged food (5% to 12%), AC parts (28% to 18%), Solar panels (12% to 5%)"
            actionLabel="Schedule Update"
            actionIcon={<Clock className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* ===== TAX RATE CONFIGURATION TABLE ===== */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Tax Rate Configuration</h2>
            <p className="text-sm text-gray-500 mt-0.5">Configure GST rates for the 5 main tax slabs with HSN codes</p>
          </div>
          <button className="flex items-center gap-2 bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition">
            <Check className="w-4 h-4" />
            Save All Changes
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">HSN Code</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Description</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">CGST %</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">SGST %</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">IGST %</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Cess %</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Effective Date</th>
                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slabs.map((slab, i) => (
                <tr key={slab.hsnCode} className="hover:bg-orange-50/40 transition-colors duration-150">
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      value={slab.hsnCode}
                      onChange={(e) => updateSlab(i, 'hsnCode', e.target.value)}
                      className="font-mono text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 w-20 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', slab.dotColor)} />
                      <input
                        type="text"
                        value={slab.description}
                        onChange={(e) => updateSlab(i, 'description', e.target.value)}
                        className="text-sm text-gray-800 bg-transparent border border-transparent rounded-md px-2 py-1.5 w-64 outline-none hover:border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={slab.cgst}
                      step={0.5}
                      onChange={(e) => updateSlab(i, 'cgst', parseFloat(e.target.value) || 0)}
                      className={cn('text-sm font-semibold bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 w-16 text-right outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition', slab.rateColor)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={slab.sgst}
                      step={0.5}
                      onChange={(e) => updateSlab(i, 'sgst', parseFloat(e.target.value) || 0)}
                      className={cn('text-sm font-semibold bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 w-16 text-right outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition', slab.rateColor)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={slab.igst}
                      step={0.5}
                      onChange={(e) => updateSlab(i, 'igst', parseFloat(e.target.value) || 0)}
                      className={cn('text-sm font-semibold bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 w-16 text-right outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition', slab.rateColor)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={slab.cess}
                      step={0.5}
                      onChange={(e) => updateSlab(i, 'cess', parseFloat(e.target.value) || 0)}
                      className="text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 w-16 text-right outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={slab.effectiveDate}
                      onChange={(e) => updateSlab(i, 'effectiveDate', e.target.value)}
                      className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ToggleSwitch
                      checked={slab.enabled}
                      onChange={(v) => updateSlab(i, 'enabled', v)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== TAX CALCULATOR + GST FILING STATUS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* -- Tax Calculation Simulator -- */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">Tax Calculation Simulator</h2>
            <p className="text-sm text-gray-500 mt-0.5">Calculate GST breakdown for any product and route</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Price (Rs.)</label>
              <input
                type="number"
                value={simPrice}
                step={100}
                onChange={(e) => setSimPrice(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">HSN Code</label>
              <select
                value={simHsnRate}
                onChange={(e) => setSimHsnRate(parseInt(e.target.value, 10))}
                className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition bg-white font-mono"
              >
                {HSN_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">From State</label>
              <select
                value={simFromState}
                onChange={(e) => setSimFromState(e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition bg-white"
              >
                {STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">To State</label>
              <select
                value={simToState}
                onChange={(e) => setSimToState(e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition bg-white"
              >
                {STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={calculateTax}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition mb-5"
          >
            <Calculator className="w-4 h-4" />
            Calculate Tax
          </button>

          {/* Result */}
          {simResult && (
            <div className="border border-gray-200 rounded-xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    {simResult.isInterState
                      ? `Inter-state (${simResult.fromName} to ${simResult.toName})`
                      : `Intra-state (${simResult.fromName} to ${simResult.toName})`}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full',
                      simResult.isInterState
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {simResult.isInterState ? 'IGST Only' : 'CGST + SGST'}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base Price</span>
                  <span className="text-sm font-semibold text-gray-900">{formatINR(simResult.basePrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CGST @ {simResult.cgstRate}%</span>
                  <span className={cn('text-sm font-semibold', simResult.cgst > 0 ? 'text-blue-600' : 'text-gray-400')}>
                    {formatINR(simResult.cgst)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SGST @ {simResult.sgstRate}%</span>
                  <span className={cn('text-sm font-semibold', simResult.sgst > 0 ? 'text-blue-600' : 'text-gray-400')}>
                    {formatINR(simResult.sgst)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">IGST @ {simResult.igstRate}%</span>
                  <span className={cn('text-sm font-semibold', simResult.igst > 0 ? 'text-purple-600' : 'text-gray-400')}>
                    {formatINR(simResult.igst)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Total Tax</span>
                  <span className="text-sm font-bold text-orange-600">{formatINR(simResult.totalTax)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">{formatINR(simResult.totalAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* -- GST Filing Status -- */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">GST Filing Status</h2>
            <p className="text-sm text-gray-500 mt-0.5">Current status of all GST return filings</p>
          </div>
          <div className="space-y-4">
            {FILINGS.map((f) => {
              const v = badgeVariantClasses[f.badgeVariant] ?? badgeVariantClasses.gray;
              const bgMap: Record<string, string> = {
                green: 'bg-green-50 border-green-100',
                amber: 'bg-amber-50 border-amber-100',
                blue: 'bg-blue-50 border-blue-100',
                gray: 'bg-gray-50 border-gray-100',
              };
              const filingIconMap: Record<string, React.ReactNode> = {
                green: <Check className="w-5 h-5" />,
                amber: <Clock className="w-5 h-5" />,
                blue: <PieChart className="w-5 h-5" />,
                gray: <Calendar className="w-5 h-5" />,
              };
              return (
                <div
                  key={f.title}
                  className={cn('flex items-center justify-between p-4 border rounded-lg', bgMap[f.badgeVariant])}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', f.iconBg, f.iconColor)}>
                      {filingIconMap[f.badgeVariant]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                      <p className="text-xs text-gray-500">{f.subtitle}</p>
                    </div>
                  </div>
                  <div className={cn(f.extra ? 'text-right' : '')}>
                    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full', v.bgStrong, v.text)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', v.dot)} />
                      {f.badgeText}
                    </span>
                    {f.extra && <p className="text-[10px] text-gray-500 mt-1">{f.extra}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upcoming Deadlines */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming Deadlines</p>
            <div className="space-y-2">
              {DEADLINES.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className={cn('w-2 h-2 rounded-full', d.dotColor)} />
                  <span className="text-xs text-gray-700 flex-1">{d.label}</span>
                  <span className={cn('text-xs', d.dateStyle)}>{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== TCS / TDS SUMMARY ===== */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">TCS / TDS Summary</h2>
            <p className="text-sm text-gray-500 mt-0.5">Tax Collected at Source and Tax Deducted at Source for FY 2025-26</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {/* TCS */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">TCS Collected</p>
                <p className="text-xs text-gray-500">Tax Collected at Source (1% on marketplace)</p>
              </div>
            </div>
            <div className="space-y-3">
              <TcsTdsRow label="Total TCS Collected (YTD)" value="Rs.1,72,450" bold />
              <TcsTdsRow label="March 2026" value="Rs.18,320" />
              <TcsTdsRow label="Sellers Covered" value="234" />
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-600">Challan Status</span>
                <StatusBadgeInline text="Deposited" variant="green" />
              </div>
            </div>
          </div>
          {/* TDS */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">TDS Deducted</p>
                <p className="text-xs text-gray-500">Tax Deducted at Source (vendor payments)</p>
              </div>
            </div>
            <div className="space-y-3">
              <TcsTdsRow label="Total TDS Deducted (YTD)" value="Rs.8,12,300" bold />
              <TcsTdsRow label="March 2026" value="Rs.76,400" />
              <TcsTdsRow label="Vendors / Payees" value="47" />
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-600">Challan Status</span>
                <StatusBadgeInline text="Pending (Mar)" variant="amber" />
              </div>
            </div>
          </div>
        </div>
        {/* Challan Timeline */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600">Jan-Feb: Deposited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-600">Mar: Pending deposit by 7 Apr</span>
              </div>
            </div>
            <button className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition">
              Deposit Now
            </button>
          </div>
        </div>
      </div>

      {/* ===== GST RATES TABLE ===== */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <div className="flex items-center gap-0 border-b border-gray-200 -mb-px">
            {([
              { key: 'all' as const, label: 'All Rules', count: tabCounts.all, countBg: 'bg-gray-100 text-gray-600' },
              { key: 'active' as const, label: 'Active', count: tabCounts.active, countBg: 'bg-green-100 text-green-700' },
              { key: 'draft' as const, label: 'Draft', count: tabCounts.draft, countBg: 'bg-amber-100 text-amber-700' },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                className={cn(
                  'text-sm px-4 pb-3 border-b-2 transition-colors duration-150',
                  activeTab === tab.key
                    ? 'font-semibold text-orange-500 border-orange-500'
                    : 'font-medium text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.label}
                <span className={cn('ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full', tab.countBg)}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search HSN code..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Category</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">HSN Code</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">CGST %</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">SGST %</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">IGST %</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-orange-50/40 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm', rule.emojiBg)}>
                        {rule.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{rule.category}</p>
                        <p className="text-xs text-gray-400">{rule.subLabel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                      {rule.hsnCode}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={cn('text-sm font-semibold', rule.rateColor)}>{rule.cgst}%</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={cn('text-sm font-semibold', rule.rateColor)}>{rule.sgst}%</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={cn('text-sm font-semibold', rule.rateColor)}>{rule.igst}%</span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadgeInline
                      text={rule.status}
                      variant={rule.status === 'Active' ? 'green' : 'amber'}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(rule.category)}
                        className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-md transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRules.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">
                    No tax rules found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Showing</span>
            <select className="bg-white border border-gray-200 rounded-lg text-sm px-2.5 py-1.5 outline-none focus:border-orange-400">
              <option>10</option>
              <option>25</option>
            </select>
            <span className="text-sm text-gray-500">of 24 rules</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition',
                  currentPage === pg
                    ? 'bg-orange-500 text-white font-semibold'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              disabled={currentPage === 3}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== GENERATE GST REPORT ===== */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Generate GST Report</h2>
            <p className="text-sm text-gray-500 mt-0.5">Download GSTR-1, GSTR-3B or custom tax reports</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition bg-white"
            >
              <option>GSTR-1 (Outward Supplies)</option>
              <option>GSTR-3B (Summary Return)</option>
              <option>HSN Summary</option>
              <option>Tax Collected Report</option>
              <option>TCS Report</option>
              <option>TDS Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">From Date</label>
            <input
              type="date"
              value={reportFrom}
              onChange={(e) => setReportFrom(e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">To Date</label>
            <input
              type="date"
              value={reportTo}
              onChange={(e) => setReportTo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* ===== ADD / EDIT TAX RULE MODAL ===== */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">{modalTitle}</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition bg-white">
                  <option>Select category...</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home & Living</option>
                  <option>Automobiles</option>
                  <option>Luxury Goods</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">HSN Code</label>
                <input
                  type="text"
                  placeholder="e.g. 8517"
                  className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition font-mono"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">CGST %</label>
                  <input type="number" placeholder="0" step={0.5} className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SGST %</label>
                  <input type="number" placeholder="0" step={0.5} className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">IGST %</label>
                  <input type="number" placeholder="0" step={0.5} className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cess %</label>
                  <input type="number" placeholder="0" step={0.5} className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Effective Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition bg-white">
                    <option>Active</option>
                    <option>Draft</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition"
              >
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Alert Row
// ----------------------------------------------------------------

function AlertRow({ variant, icon, title, subtitle, actionLabel, actionIcon }: {
  variant: 'red' | 'amber' | 'blue' | 'gray';
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actionLabel: string;
  actionIcon: React.ReactNode;
}) {
  const s = alertBgClasses[variant];
  return (
    <div className={cn('flex items-center justify-between p-4 border rounded-lg', s.bg, s.border)}>
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.iconBg, s.iconColor)}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button className={cn('flex items-center gap-1.5 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition whitespace-nowrap', s.btnBg, s.btnHover)}>
        {actionIcon}
        {actionLabel}
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// TCS / TDS Row
// ----------------------------------------------------------------

function TcsTdsRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={cn('text-sm text-gray-900', bold ? 'font-bold' : 'font-semibold')}>{value}</span>
    </div>
  );
}
