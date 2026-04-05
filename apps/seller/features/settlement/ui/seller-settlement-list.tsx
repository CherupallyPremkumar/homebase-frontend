'use client';

import { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@homebase/ui';
import { StatusBadge } from '@homebase/ui';
import {
  Wallet, Clock, TrendingUp, Download, CalendarDays,
  Info, CreditCard, Building2, Shield, Eye,
} from 'lucide-react';

const settlements = [
  { id: '#STL-20260328', period: '22 Mar - 28 Mar', orders: 48, gross: 124500, platformFee: 6225, gst: 3735, net: 114540, status: 'Pending', payoutDate: '02 Apr 2026' },
  { id: '#STL-20260321', period: '15 Mar - 21 Mar', orders: 62, gross: 158200, platformFee: 7910, gst: 4746, net: 145544, status: 'Processing', payoutDate: '28 Mar 2026' },
  { id: '#STL-20260314', period: '08 Mar - 14 Mar', orders: 55, gross: 142800, platformFee: 7140, gst: 4284, net: 131376, status: 'Completed', payoutDate: '21 Mar 2026' },
  { id: '#STL-20260307', period: '01 Mar - 07 Mar', orders: 41, gross: 98600, platformFee: 4930, gst: 2958, net: 90712, status: 'Completed', payoutDate: '14 Mar 2026' },
  { id: '#STL-20260228', period: '22 Feb - 28 Feb', orders: 58, gross: 135400, platformFee: 6770, gst: 4062, net: 124568, status: 'Completed', payoutDate: '07 Mar 2026' },
  { id: '#STL-20260221', period: '15 Feb - 21 Feb', orders: 67, gross: 168900, platformFee: 8445, gst: 5067, net: 155388, status: 'Completed', payoutDate: '28 Feb 2026' },
  { id: '#STL-20260214', period: '08 Feb - 14 Feb', orders: 72, gross: 189200, platformFee: 9460, gst: 5676, net: 174064, status: 'Completed', payoutDate: '21 Feb 2026' },
  { id: '#STL-20260207', period: '01 Feb - 07 Feb', orders: 38, gross: 87500, platformFee: 4375, gst: 2625, net: 80500, status: 'Completed', payoutDate: '14 Feb 2026' },
];

const breakdownItems = [
  { label: 'Product Sales', amount: 124500, type: 'credit' },
  { label: 'Shipping Reimbursement', amount: 4800, type: 'credit' },
  { label: 'Platform Commission (5%)', amount: -6225, type: 'debit' },
  { label: 'GST on Commission (18%)', amount: -3735, type: 'debit' },
  { label: 'Payment Gateway Fee', amount: -1200, type: 'debit' },
  { label: 'Return Adjustments', amount: -3600, type: 'debit' },
];

function statusVariant(status: string) {
  if (status === 'Completed') return 'success' as const;
  if (status === 'Processing') return 'warning' as const;
  return 'info' as const;
}

function formatINR(n: number) {
  return '\u20B9' + Math.abs(n).toLocaleString('en-IN');
}

export function SellerSettlementList() {
  const [viewSettlement, setViewSettlement] = useState<typeof settlements[number] | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settlements &amp; Payments</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your payouts, view settlement history, and track earnings</p>
        </div>
        <Button variant="outline" className="gap-1.5">
          <Download className="h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* 3 Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Available Balance */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">Available</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatINR(152340)}</p>
          <p className="text-xs text-gray-400 mt-1">Available Balance</p>
          <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-lg transition">
            Request Payout
          </button>
        </div>

        {/* Pending Settlement */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Processing
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatINR(45680)}</p>
          <p className="text-xs text-gray-400 mt-1">Pending Settlement</p>
          <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full animate-pulse" style={{ width: '65%' }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">Settlement cycle: 7 days</p>
        </div>

        {/* Total Earned */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +18.3%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatINR(452890)}</p>
          <p className="text-xs text-gray-400 mt-1">Total Earned (This Month)</p>
          <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">vs {formatINR(382500)} last month</p>
        </div>
      </div>

      {/* Next Payout Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
          <CalendarDays className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Next payout of {formatINR(45680)} scheduled for April 2, 2026</p>
          <p className="text-xs text-gray-500 mt-0.5">Amount will be credited to your registered bank account via NEFT/IMPS</p>
        </div>
        <button className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-white border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition">
          <Info className="w-3.5 h-3.5" />
          View Details
        </button>
      </div>

      {/* Settlement History Table */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Settlement History</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">All past and upcoming settlement transactions</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs outline-none text-gray-600">
                <option>All Status</option>
                <option>Paid</option>
                <option>Processing</option>
                <option>Pending</option>
              </select>
              <select className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs outline-none text-gray-600">
                <option>March 2026</option>
                <option>February 2026</option>
                <option>January 2026</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Settlement ID</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Period</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Orders</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Gross Amount</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Platform Fee</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">GST</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Net Amount</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Status</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Payout Date</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlements.map((s) => (
                <TableRow key={s.id} className="hover:bg-orange-50/50 transition-colors">
                  <TableCell className="font-mono text-sm font-medium text-orange-600">{s.id}</TableCell>
                  <TableCell className="text-sm text-gray-600">{s.period}</TableCell>
                  <TableCell className="text-center text-sm font-medium text-gray-800">{s.orders}</TableCell>
                  <TableCell className="text-right text-sm font-semibold text-gray-900">{formatINR(s.gross)}</TableCell>
                  <TableCell className="text-right text-sm text-red-600">-{formatINR(s.platformFee)}</TableCell>
                  <TableCell className="text-right text-sm text-red-600">-{formatINR(s.gst)}</TableCell>
                  <TableCell className="text-right text-sm font-bold text-gray-900">{formatINR(s.net)}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={s.status} variant={statusVariant(s.status)} />
                  </TableCell>
                  <TableCell className="text-right text-sm text-gray-500">{s.payoutDate}</TableCell>
                  <TableCell className="text-center">
                    <button onClick={() => setViewSettlement(s)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500" title="View Breakdown">
                      <Eye className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Transaction Breakdown + Bank Account */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction Breakdown</CardTitle>
            <p className="text-xs text-gray-400">Current settlement period (22 Mar - 28 Mar)</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {breakdownItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className={`text-sm font-semibold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.amount >= 0 ? '+' : '-'}{formatINR(item.amount)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-gray-200">
              <span className="text-sm font-bold text-gray-900">Net Payout</span>
              <span className="text-lg font-bold text-green-600">{formatINR(114540)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Bank Account Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-base">Bank Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 text-white mb-4">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Savings Account</span>
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-lg font-mono tracking-widest mb-4">**** **** **** 4521</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Account Holder</p>
                  <p className="text-sm font-medium">Rajesh Kumar</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase">Bank</p>
                  <p className="text-sm font-medium">HDFC Bank</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">IFSC Code</span>
                <span className="font-mono font-medium text-gray-800">HDFC0001234</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Account Type</span>
                <span className="font-medium text-gray-800">Current Account</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <Shield className="h-3.5 w-3.5" /> Verified
                </span>
              </div>
            </div>
            <button className="mt-4 w-full text-sm font-medium text-orange-600 border border-orange-200 py-2 rounded-lg hover:bg-orange-50 transition">
              Update Bank Details
            </button>
          </CardContent>
        </Card>
      </div>

      {/* View Settlement Details Dialog */}
      <Dialog open={!!viewSettlement} onOpenChange={(open) => { if (!open) setViewSettlement(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Settlement Breakdown</DialogTitle>
            <DialogDescription>Details for {viewSettlement?.id} ({viewSettlement?.period})</DialogDescription>
          </DialogHeader>
          {viewSettlement && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Settlement ID</p>
                  <p className="inline-block rounded bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-orange-600">{viewSettlement.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status</p>
                  <StatusBadge status={viewSettlement.status} variant={statusVariant(viewSettlement.status)} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Period</p>
                  <p className="text-sm text-gray-700">{viewSettlement.period}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Orders</p>
                  <p className="text-sm font-medium text-gray-900">{viewSettlement.orders}</p>
                </div>
              </div>
              <div className="space-y-2 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Gross Amount</span>
                  <span className="font-semibold text-gray-900">{formatINR(viewSettlement.gross)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Platform Fee (5%)</span>
                  <span className="text-red-600">-{formatINR(viewSettlement.platformFee)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">GST on Commission (18%)</span>
                  <span className="text-red-600">-{formatINR(viewSettlement.gst)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-sm">
                  <span className="font-bold text-gray-900">Net Payout</span>
                  <span className="text-lg font-bold text-green-600">{formatINR(viewSettlement.net)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Payout Date</p>
                <p className="text-sm text-gray-700">{viewSettlement.payoutDate}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
