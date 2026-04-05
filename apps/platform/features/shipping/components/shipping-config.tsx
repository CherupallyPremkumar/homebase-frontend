'use client';

import { useState } from 'react';
import {
  Truck, Clock, CheckCircle, MapPin, Plus, Download,
  AlertTriangle, Inbox, Star, Pencil, Power, Search,
  Calculator,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Skeleton } from '@homebase/ui';

import {
  useShippingStats,
  useCarrierLiveStatus,
  useShippingCarriers,
  useShippingZones,
  useSlaRules,
  useSlaConfig,
  useCarrierPerformance,
  useRateCalculator,
  useServiceabilityCheck,
} from '../hooks/use-shipping';
import type { CarrierFilterTab, CarrierStatus } from '../types';

// ----------------------------------------------------------------
// Constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Shipping Management',
  pageSubtitle: 'Configure carriers, zones, rates and delivery SLAs',
  export: 'Export',
  addCarrier: 'Add Carrier',
  addZone: 'Add Zone',
  addSlaRule: 'Add SLA Rule',
  // Live status
  liveTitle: 'Real-time Carrier Status',
  liveSubtitle: 'Live operational status of all integrated carriers',
  liveLabel: 'Live',
  liveUpdated: 'Updated 30s ago',
  // Rate calculator
  rateCalcTitle: 'Shipping Rate Calculator',
  rateCalcSubtitle: 'Compare rates across carriers for a given shipment',
  rateCalcWeight: 'Weight (kg)',
  rateCalcFrom: 'From PIN',
  rateCalcTo: 'To PIN',
  rateCalcButton: 'Calculate Rates',
  // Serviceability
  serviceTitle: 'Serviceability Check',
  serviceSubtitle: 'Check which carriers deliver to a specific PIN code',
  servicePin: 'PIN Code',
  serviceCheck: 'Check',
  // Carrier table
  carrierTableAll: 'All Carriers',
  carrierTableActive: 'Active',
  carrierTableLimited: 'Limited',
  searchCarriers: 'Search carriers...',
  colCarrier: 'Carrier',
  colStatus: 'Status',
  colZones: 'Zones',
  colAvgDelivery: 'Avg Delivery',
  colCostKg: 'Cost/kg',
  colSla: 'SLA',
  colRating: 'Rating',
  colActions: 'Actions',
  // Zone table
  zoneTitle: 'Zone Mapping & Rates',
  zoneSubtitle: '6-zone configuration with base rates, per-kg pricing, and free shipping thresholds',
  colZone: 'Zone',
  colRegions: 'Regions / States',
  colDeliveryTime: 'Delivery Time',
  colBaseRate: 'Base Rate',
  colPerKg: 'Per Kg',
  colFreeAbove: 'Free Above',
  // SLA rules
  slaRulesTitle: 'Carrier SLA Rules',
  slaRulesSubtitle: 'SLA commitments, penalty rates, and auto-switch thresholds per carrier per zone',
  colSlaDays: 'SLA (days)',
  colPenalty: 'Penalty / Day Late',
  colAutoSwitch: 'Auto-switch Threshold',
  colPerformance: 'Current Performance',
  // SLA config
  slaConfigTitle: 'SLA Configuration',
  slaConfigSubtitle: 'Maximum allowed times for dispatch and delivery',
  saveSla: 'Save SLA Settings',
  // Performance
  perfTitle: 'Carrier Performance',
  perfSubtitle: 'On-time delivery rate comparison (last 30 days)',
  perfTarget: 'Target SLA: 90% on-time',
  perfFlagged: 'Below target flagged for review',
  // States
  errorTitle: 'Failed to load shipping data',
  errorSubtitle: 'Please try refreshing the page or contact support.',
  retry: 'Retry',
  emptyTitle: 'No data configured',
  emptySubtitle: 'Add your first entry to get started.',
} as const;

// ----------------------------------------------------------------
// Badge helpers
// ----------------------------------------------------------------

function carrierStatusClasses(status: CarrierStatus): { badge: string; dot: string } {
  switch (status) {
    case 'Active':
      return { badge: 'bg-green-50 text-green-700', dot: 'bg-green-500' };
    case 'Limited':
      return { badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' };
    case 'Inactive':
      return { badge: 'bg-red-50 text-red-700', dot: 'bg-red-500' };
    default:
      return { badge: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };
  }
}

// ----------------------------------------------------------------
// Stat icon picker
// ----------------------------------------------------------------

function statIcon(index: number, colorClass: string) {
  const icons = [Truck, Clock, CheckCircle, MapPin];
  const Icon = icons[index] ?? Truck;
  return <Icon className={cn('h-5 w-5', colorClass)} />;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function ShippingConfig() {
  const statsQ = useShippingStats();
  const liveQ = useCarrierLiveStatus();
  const carriersQ = useShippingCarriers();
  const zonesQ = useShippingZones();
  const slaRulesQ = useSlaRules();
  const slaConfigQ = useSlaConfig();
  const perfQ = useCarrierPerformance();
  const rateQ = useRateCalculator();
  const serviceQ = useServiceabilityCheck();

  const [carrierFilter, setCarrierFilter] = useState<CarrierFilterTab>('all');
  const [carrierSearch, setCarrierSearch] = useState('');

  const isLoading =
    statsQ.isLoading || liveQ.isLoading || carriersQ.isLoading || zonesQ.isLoading ||
    slaRulesQ.isLoading || slaConfigQ.isLoading || perfQ.isLoading;

  const isError =
    statsQ.isError || liveQ.isError || carriersQ.isError || zonesQ.isError ||
    slaRulesQ.isError || slaConfigQ.isError || perfQ.isError;

  // ------ LOADING ------
  if (isLoading) return <ShippingConfigSkeleton />;

  // ------ ERROR ------
  if (isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{TEXT.errorSubtitle}</p>
        <button
          onClick={() => {
            statsQ.refetch(); liveQ.refetch(); carriersQ.refetch(); zonesQ.refetch();
            slaRulesQ.refetch(); slaConfigQ.refetch(); perfQ.refetch();
          }}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const stats = statsQ.data ?? [];
  const live = liveQ.data ?? [];
  const carriers = carriersQ.data ?? [];
  const zones = zonesQ.data ?? [];
  const slaRules = slaRulesQ.data ?? [];
  const slaConfig = slaConfigQ.data ?? [];
  const performance = perfQ.data ?? [];
  const rateResults = rateQ.data ?? [];
  const serviceResult = serviceQ.data;

  // Carrier filtering
  const activeCount = carriers.filter((c) => c.status === 'Active').length;
  const limitedCount = carriers.filter((c) => c.status === 'Limited').length;

  const filteredCarriers = carriers.filter((c) => {
    if (carrierFilter === 'active' && c.status !== 'Active') return false;
    if (carrierFilter === 'limited' && c.status !== 'Limited') return false;
    if (carrierSearch && !c.name.toLowerCase().includes(carrierSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* ===== PAGE HEADER ===== */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <Download className="h-4 w-4" /> {TEXT.export}
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
            <Plus className="h-4 w-4" /> {TEXT.addCarrier}
          </button>
        </div>
      </header>

      {/* ===== STATS CARDS ===== */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Shipping statistics">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{s.label}</span>
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', s.iconBg)}>
                {statIcon(i, s.iconColor)}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <div className="mt-1 flex items-center gap-1">
              {s.changeType === 'positive' && (
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              )}
              <span className={cn(
                'text-xs font-semibold',
                s.changeType === 'positive' ? 'text-green-600' : 'text-gray-500',
              )}>
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* ===== REAL-TIME CARRIER STATUS ===== */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{TEXT.liveTitle}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{TEXT.liveSubtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-[pulse-ring_2s_ease_infinite] shadow-[0_0_0_0_rgba(22,163,74,0.4)]" />
            <span className="text-xs font-medium text-gray-500">{TEXT.liveLabel}</span>
            <span className="ml-2 text-xs text-gray-400">{TEXT.liveUpdated}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
          {live.map((c) => (
            <div key={c.id} className="px-6 py-5">
              <div className="mb-3 flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold', c.bgColor, c.textColor)}>
                  {c.shortCode}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.subtitle}</p>
                </div>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  c.status === 'Operational' && 'bg-green-500 animate-[pulse-ring_2s_ease_infinite] shadow-[0_0_0_0_rgba(22,163,74,0.4)]',
                  c.status === 'Degraded' && 'bg-amber-500',
                  c.status === 'Down' && 'bg-red-500',
                )} />
                <span className={cn(
                  'text-sm font-semibold',
                  c.status === 'Operational' && 'text-green-700',
                  c.status === 'Degraded' && 'text-amber-700',
                  c.status === 'Down' && 'text-red-700',
                )}>
                  {c.status}
                </span>
              </div>
              {c.alert ? (
                <div className="mt-1 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-600">
                  {c.alert}
                </div>
              ) : (
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>Uptime: {c.uptime}</span>
                  <span>Latency: {c.latency}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== RATE CALCULATOR + SERVICEABILITY ===== */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Rate Calculator */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">{TEXT.rateCalcTitle}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{TEXT.rateCalcSubtitle}</p>
          </div>
          <div className="mb-5 grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{TEXT.rateCalcWeight}</label>
              <input
                type="number"
                defaultValue="2.5"
                step="0.1"
                min="0.1"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{TEXT.rateCalcFrom}</label>
              <input
                type="text"
                defaultValue="400001"
                maxLength={6}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-mono text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{TEXT.rateCalcTo}</label>
              <input
                type="text"
                defaultValue="560001"
                maxLength={6}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-mono text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
          <button className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
            <Calculator className="h-4 w-4" /> {TEXT.rateCalcButton}
          </button>
          <div className="space-y-3">
            {rateResults.map((r) => (
              <div
                key={r.code}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-3',
                  r.highlighted ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50',
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold', r.codeBg, r.codeText)}>
                    {r.code}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.carrier}</p>
                    <p className="text-xs text-gray-500">{r.days}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">Rs.{r.price}</p>
                  {r.tag && (
                    <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold', r.tagBg, r.tagText)}>
                      {r.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Serviceability Check */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">{TEXT.serviceTitle}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{TEXT.serviceSubtitle}</p>
          </div>
          <div className="mb-5 flex gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{TEXT.servicePin}</label>
              <input
                type="text"
                defaultValue="560001"
                maxLength={6}
                placeholder="Enter 6-digit PIN code"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-mono text-lg tracking-widest outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div className="flex items-end">
              <button className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
                <Search className="h-4 w-4" /> {TEXT.serviceCheck}
              </button>
            </div>
          </div>

          {serviceResult && (
            <div className="space-y-3">
              {/* Result header */}
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {serviceResult.pin} - {serviceResult.location}
                  </p>
                  <p className="text-xs text-gray-500">
                    Zone: {serviceResult.zone} | All {serviceResult.carriersAvailable} carriers available
                  </p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {serviceResult.status}
                </span>
              </div>

              {/* Carrier table */}
              <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Carrier</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Service</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Est. Delivery</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">COD</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {serviceResult.carriers.map((sc) => {
                      const scClasses = carrierStatusClasses(sc.status);
                      return (
                        <tr key={sc.name} className="transition-colors hover:bg-orange-50/30">
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-gray-900">{sc.name}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">{sc.service}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900">{sc.estDelivery}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                              sc.cod ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600',
                            )}>
                              {sc.cod ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold">
                              <span className={cn('h-1.5 w-1.5 rounded-full', scClasses.dot)} />
                              <span className={cn(sc.status === 'Active' ? 'text-green-700' : 'text-amber-700')}>
                                {sc.status}
                              </span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== CARRIER TABLE ===== */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs + search */}
        <div className="flex items-center justify-between px-6 pb-0 pt-5">
          <div className="-mb-px flex items-center gap-0 border-b border-gray-200">
            <button
              onClick={() => setCarrierFilter('all')}
              className={cn(
                'border-b-2 px-4 pb-3 text-sm font-semibold transition',
                carrierFilter === 'all'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {TEXT.carrierTableAll}
              <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] font-bold text-gray-600">
                {carriers.length}
              </span>
            </button>
            <button
              onClick={() => setCarrierFilter('active')}
              className={cn(
                'border-b-2 px-4 pb-3 text-sm font-medium transition',
                carrierFilter === 'active'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {TEXT.carrierTableActive}
              <span className="ml-1 rounded-full bg-green-100 px-1.5 py-0.5 text-[11px] font-bold text-green-700">
                {activeCount}
              </span>
            </button>
            <button
              onClick={() => setCarrierFilter('limited')}
              className={cn(
                'border-b-2 px-4 pb-3 text-sm font-medium transition',
                carrierFilter === 'limited'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {TEXT.carrierTableLimited}
              <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold text-amber-700">
                {limitedCount}
              </span>
            </button>
          </div>
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={TEXT.searchCarriers}
              value={carrierSearch}
              onChange={(e) => setCarrierSearch(e.target.value)}
              className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {filteredCarriers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Inbox className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colCarrier}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colStatus}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colZones}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colAvgDelivery}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colCostKg}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colSla}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colRating}</th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCarriers.map((c) => {
                  const cls = carrierStatusClasses(c.status);
                  return (
                    <tr key={c.id} className="transition-colors hover:bg-orange-50/30" tabIndex={0}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold', c.bgColor, c.textColor)}>
                            {c.shortCode}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.services}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', cls.badge)}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', cls.dot)} /> {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{c.zones}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-gray-900">{c.avgDeliveryDays} days</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-gray-900">Rs.{c.costPerKg}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{c.sla}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-gray-900">{c.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            className="rounded-md p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500"
                            aria-label={`Edit ${c.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className={cn(
                              'rounded-md p-1.5 text-gray-400 transition',
                              c.status === 'Limited'
                                ? 'hover:bg-green-50 hover:text-green-500'
                                : 'hover:bg-amber-50 hover:text-amber-500',
                            )}
                            aria-label={`Toggle ${c.name}`}
                          >
                            <Power className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ===== ZONE MAPPING & RATES ===== */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{TEXT.zoneTitle}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{TEXT.zoneSubtitle}</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Plus className="h-4 w-4" /> {TEXT.addZone}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colZone}</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colRegions}</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colDeliveryTime}</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colBaseRate}</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colPerKg}</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colFreeAbove}</th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {zones.map((z) => (
                <tr key={z.id} className="transition-colors hover:bg-orange-50/30" tabIndex={0}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2.5 w-2.5 rounded-full', z.dotColor)} />
                      <span className="text-sm font-semibold text-gray-900">{z.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">{z.regions}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900">{z.deliveryTime}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">Rs.{z.baseRate}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">Rs.{z.perKgRate}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-green-600">{z.freeAbove}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="rounded-md p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500"
                      aria-label={`Edit ${z.name} zone`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== CARRIER SLA RULES ===== */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{TEXT.slaRulesTitle}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{TEXT.slaRulesSubtitle}</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Plus className="h-4 w-4" /> {TEXT.addSlaRule}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colCarrier}</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colZone}</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colSlaDays}</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colPenalty}</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colAutoSwitch}</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colPerformance}</th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">{TEXT.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slaRules.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-orange-50/30" tabIndex={0}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold', r.carrierBg, r.carrierText)}>
                        {r.carrierCode}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{r.carrierName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{r.zone}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-bold text-gray-900">{r.slaDays}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-red-600">Rs.{r.penaltyPerDay}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-medium text-gray-700">{r.autoSwitchThreshold}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-gray-100">
                        <div className={cn('h-2 rounded-full', r.performanceColor)} style={{ width: `${r.performancePct}%` }} />
                      </div>
                      <span className={cn('text-xs font-semibold', r.performanceLabelColor)}>{r.performancePct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="rounded-md p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500"
                      aria-label={`Edit SLA rule for ${r.carrierName} ${r.zone}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== SLA CONFIG + CARRIER PERFORMANCE ===== */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* SLA Configuration */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">{TEXT.slaConfigTitle}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{TEXT.slaConfigSubtitle}</p>
          </div>
          <div className="space-y-4">
            {slaConfig.map((item, i) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center justify-between py-3',
                  i < slaConfig.length - 1 && 'border-b border-gray-100',
                )}
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={item.value}
                    className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-semibold outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                  <span className="text-sm text-gray-500">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-gray-100 pt-4">
            <button className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
              {TEXT.saveSla}
            </button>
          </div>
        </div>

        {/* Carrier Performance */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">{TEXT.perfTitle}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{TEXT.perfSubtitle}</p>
          </div>
          <div className="space-y-5">
            {performance.map((p) => (
              <div key={p.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  <span className="text-sm font-bold text-gray-900">{p.pct}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100">
                  <div
                    className={cn('h-3 rounded-full transition-all duration-600 ease-in-out', p.barColor)}
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-xs text-gray-400">{TEXT.perfTarget}</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-xs text-gray-500">{TEXT.perfFlagged}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------------------
// Loading skeleton
// ----------------------------------------------------------------

function ShippingConfigSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-60" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
      {/* Live status */}
      <Skeleton className="h-[180px] rounded-xl" />
      {/* Rate calc + service */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
      {/* Carrier table */}
      <Skeleton className="h-[400px] rounded-xl" />
      {/* Zone table */}
      <Skeleton className="h-[350px] rounded-xl" />
      {/* SLA rules */}
      <Skeleton className="h-[350px] rounded-xl" />
      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-[380px] rounded-xl" />
        <Skeleton className="h-[380px] rounded-xl" />
      </div>
    </div>
  );
}
