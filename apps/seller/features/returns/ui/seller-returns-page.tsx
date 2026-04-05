'use client';

import { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button, Badge,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from '@homebase/ui';
import { StatCard, StatusBadge } from '@homebase/ui';
import {
  RotateCcw, Clock, Truck, Banknote, CheckCircle2,
  Download, Info, Check, Eye, MoreHorizontal, MessageSquare,
} from 'lucide-react';

const tabs = [
  { label: 'All', count: 8 },
  { label: 'Pending', count: 3 },
  { label: 'Approved', count: 2 },
  { label: 'In Transit', count: 1 },
  { label: 'Received', count: 1 },
  { label: 'Refunded', count: 1 },
  { label: 'Rejected', count: 0 },
];

const returns = [
  {
    id: '#RTN-4501', orderId: '#ORD-8821', customer: 'Ananya Sharma', email: 'ananya@email.com',
    product: 'Cotton Kurta Set', emoji: '\uD83D\uDC5A', reason: 'Size mismatch',
    refund: 1299, status: 'Pending', date: '27 Mar 2026', actions: ['approve', 'reject'],
  },
  {
    id: '#RTN-4502', orderId: '#ORD-8793', customer: 'Vikram Patel', email: 'vikram.p@email.com',
    product: 'Wireless Keyboard', emoji: '\uD83D\uDCBB', reason: 'Defective keys',
    refund: 2499, status: 'Approved', date: '26 Mar 2026', actions: ['view'],
  },
  {
    id: '#RTN-4503', orderId: '#ORD-8756', customer: 'Priya Menon', email: 'priya.m@email.com',
    product: 'Silk Saree (Blue)', emoji: '\uD83C\uDF93', reason: 'Color different from image',
    refund: 4599, status: 'Pending', date: '25 Mar 2026', actions: ['approve', 'reject'],
  },
  {
    id: '#RTN-4504', orderId: '#ORD-8701', customer: 'Rahul Gupta', email: 'rahul.g@email.com',
    product: 'Running Shoes (42)', emoji: '\uD83D\uDC5F', reason: 'Wrong item delivered',
    refund: 3899, status: 'In Transit', date: '24 Mar 2026', actions: ['view'],
  },
  {
    id: '#RTN-4505', orderId: '#ORD-8688', customer: 'Deepika Nair', email: 'deepika.n@email.com',
    product: 'Smart Watch Pro', emoji: '\u231A', reason: 'Not working after 2 days',
    refund: 6999, status: 'Refund Processing', date: '22 Mar 2026', actions: ['view'],
  },
  {
    id: '#RTN-4506', orderId: '#ORD-8645', customer: 'Suresh Kumar', email: 'suresh.k@email.com',
    product: 'Ceramic Dinner Set', emoji: '\uD83C\uDF82', reason: 'Arrived broken/damaged',
    refund: 2199, status: 'Refunded', date: '20 Mar 2026', actions: ['view'],
  },
];

function statusVariant(status: string) {
  const map: Record<string, 'warning' | 'info' | 'purple' | 'success' | 'error' | 'neutral'> = {
    Pending: 'warning', Approved: 'info', 'In Transit': 'purple',
    'Refund Processing': 'warning', Refunded: 'success', Rejected: 'error',
  };
  return map[status] ?? 'neutral';
}

export function SellerReturnsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [viewReturn, setViewReturn] = useState<typeof returns[number] | null>(null);

  const filtered = activeTab === 'All'
    ? returns
    : returns.filter((r) => r.status === activeTab || (activeTab === 'Received' && r.status === 'Refund Processing'));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Returns Management</h1>
          <p className="text-sm text-gray-400 mt-1">Track and manage customer return requests</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Returns" value={8} icon={<RotateCcw className="h-5 w-5 text-blue-500" />} />
        <StatCard title="Pending Approval" value={3} icon={<Clock className="h-5 w-5 text-yellow-500" />} />
        <StatCard title="Pickup Scheduled" value={2} icon={<Truck className="h-5 w-5 text-purple-500" />} />
        <StatCard title="Refund Processing" value={2} icon={<Banknote className="h-5 w-5 text-orange-500" />} />
        <StatCard title="Completed" value={1} icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} />
      </div>

      {/* Filter Tabs + Table */}
      <Card>
        <div className="flex items-center gap-2 p-4 border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`text-xs font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.label
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Return ID</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Order ID</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Customer</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Reason</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Refund</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className="hover:bg-orange-50/50 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-orange-600">{r.id}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-600">{r.orderId}</TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-800 text-sm">{r.customer}</p>
                    <p className="text-[11px] text-gray-400">{r.email}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{r.emoji}</span>
                      <span className="text-sm text-gray-700">{r.product}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{r.reason}</TableCell>
                  <TableCell className="font-semibold text-sm text-gray-800">
                    {'\u20B9'}{r.refund.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} variant={statusVariant(r.status)} />
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{r.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewReturn(r)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" title="More actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setViewReturn(r)}>
                            <Eye className="mr-2 h-4 w-4 text-gray-400" /> View Details
                          </DropdownMenuItem>
                          {r.actions.includes('approve') && (
                            <DropdownMenuItem onClick={() => alert(`Approve return ${r.id}`)}>
                              <Check className="mr-2 h-4 w-4 text-green-500" /> Approve
                            </DropdownMenuItem>
                          )}
                          {r.actions.includes('reject') && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => alert(`Reject return ${r.id}`)} className="text-red-600 focus:text-red-600">
                                <RotateCcw className="mr-2 h-4 w-4" /> Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => alert(`Contact Customer: ${r.customer}`)}>
                            <MessageSquare className="mr-2 h-4 w-4 text-gray-400" /> Contact Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Return Policy Card */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Return Policy Reminder</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              All return requests must be processed within <strong>48 hours</strong> of receipt. Items must be inspected within <strong>24 hours</strong> of pickup.
              Refunds are automatically initiated once the returned item passes quality check. Late processing may affect your seller rating.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Check className="h-3.5 w-3.5 text-green-500" />
                7-day return window
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Check className="h-3.5 w-3.5 text-green-500" />
                Free return shipping
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Check className="h-3.5 w-3.5 text-green-500" />
                Refund within 5-7 days
              </div>
            </div>
          </div>
          <button onClick={() => alert('Return Policy: 7-day return window, free return shipping, refund within 5-7 business days.')} className="text-xs font-medium text-orange-600 hover:text-orange-700 whitespace-nowrap shrink-0">
            View Full Policy &rarr;
          </button>
        </div>
      </div>

      {/* View Return Details Dialog */}
      <Dialog open={!!viewReturn} onOpenChange={(open) => { if (!open) setViewReturn(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Return Details</DialogTitle>
            <DialogDescription>Full details for return {viewReturn?.id}</DialogDescription>
          </DialogHeader>
          {viewReturn && (
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Return ID</p>
                <p className="inline-block rounded bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-orange-600">{viewReturn.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Order ID</p>
                <p className="font-mono text-sm text-gray-600">{viewReturn.orderId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status</p>
                <StatusBadge status={viewReturn.status} variant={statusVariant(viewReturn.status)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Date</p>
                <p className="text-sm text-gray-700">{viewReturn.date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Customer</p>
                <p className="text-sm font-medium text-gray-900">{viewReturn.customer}</p>
                <p className="text-xs text-gray-400">{viewReturn.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Product</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{viewReturn.emoji}</span>
                  <span className="text-sm text-gray-700">{viewReturn.product}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Reason</p>
                <p className="text-sm text-gray-700">{viewReturn.reason}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Refund Amount</p>
                <p className="text-sm font-bold text-gray-900">{'\u20B9'}{viewReturn.refund.toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
