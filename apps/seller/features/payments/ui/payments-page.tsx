'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Label, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@homebase/ui';
import {
  CalendarDays, CreditCard, Wallet, Receipt, History, Building2, Plus, Edit, Trash2,
  CheckCircle2, Clock, AlertTriangle, Download, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

/* ---------- mock data ---------- */

const payoutSchedule = {
  frequency: 'Weekly',
  nextPayout: 'Apr 01, 2026',
  nextAmount: '24,580',
  minPayout: '500',
  pendingAmount: '1,24,350',
};

const bankAccounts = [
  {
    id: '1',
    bankName: 'HDFC Bank',
    accountNumber: '****4567',
    ifsc: 'HDFC0001234',
    accountHolder: 'Rajesh Enterprises Pvt. Ltd.',
    accountType: 'Current Account',
    branch: 'Koramangala, Bengaluru',
    isPrimary: true,
    verified: true,
  },
  {
    id: '2',
    bankName: 'ICICI Bank',
    accountNumber: '****8901',
    ifsc: 'ICIC0002345',
    accountHolder: 'Rajesh Enterprises Pvt. Ltd.',
    accountType: 'Savings Account',
    branch: 'Indiranagar, Bengaluru',
    isPrimary: false,
    verified: true,
  },
];

const upiSettings = {
  upiId: 'rajeshstore@hdfcbank',
  enabled: true,
  dailyLimit: '50,000',
};

const taxInfo = {
  gstin: '29ABCDE1234F1Z5',
  pan: 'ABCDE1234F',
  tdsRate: '1%',
  gstRate: '18%',
};

interface PaymentHistory {
  id: string;
  date: string;
  type: 'Settlement' | 'Refund' | 'Adjustment' | 'Commission';
  description: string;
  amount: string;
  isCredit: boolean;
  status: 'Completed' | 'Processing' | 'Failed';
  reference: string;
}

const paymentHistory: PaymentHistory[] = [
  { id: 'PAY-4521', date: 'Mar 28, 2026', type: 'Settlement', description: 'Weekly settlement (Mar 22-28)', amount: '24,580', isCredit: true, status: 'Processing', reference: 'STL-2026-0328' },
  { id: 'PAY-4518', date: 'Mar 21, 2026', type: 'Settlement', description: 'Weekly settlement (Mar 15-21)', amount: '31,250', isCredit: true, status: 'Completed', reference: 'STL-2026-0321' },
  { id: 'PAY-4515', date: 'Mar 19, 2026', type: 'Refund', description: 'Order #ORD-8745 return refund', amount: '1,299', isCredit: false, status: 'Completed', reference: 'RFN-8745' },
  { id: 'PAY-4512', date: 'Mar 14, 2026', type: 'Settlement', description: 'Weekly settlement (Mar 8-14)', amount: '28,900', isCredit: true, status: 'Completed', reference: 'STL-2026-0314' },
  { id: 'PAY-4509', date: 'Mar 12, 2026', type: 'Commission', description: 'Platform commission deduction', amount: '3,450', isCredit: false, status: 'Completed', reference: 'COM-2026-03' },
  { id: 'PAY-4506', date: 'Mar 10, 2026', type: 'Adjustment', description: 'COD remittance adjustment', amount: '2,100', isCredit: true, status: 'Completed', reference: 'ADJ-2026-0310' },
  { id: 'PAY-4503', date: 'Mar 07, 2026', type: 'Settlement', description: 'Weekly settlement (Mar 1-7)', amount: '19,750', isCredit: true, status: 'Completed', reference: 'STL-2026-0307' },
];

const statusStyles: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700',
  Processing: 'bg-orange-50 text-orange-700',
  Failed: 'bg-red-50 text-red-700',
};

const typeStyles: Record<string, string> = {
  Settlement: 'bg-blue-50 text-blue-700',
  Refund: 'bg-red-50 text-red-700',
  Adjustment: 'bg-purple-50 text-purple-700',
  Commission: 'bg-orange-50 text-orange-700',
};

export function PaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage payout methods, bank accounts, and view payment history</p>
        </div>
        <Button variant="outline"><Download className="mr-1.5 h-4 w-4" />Export Statement</Button>
      </div>

      {/* Payout Schedule */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-base">Payout Schedule</CardTitle>
              <p className="text-xs text-gray-400">Configure when you receive your earnings</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <Label>Payout Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 font-medium">Next Payout</p>
              <p className="text-lg font-bold text-blue-700 mt-1">{payoutSchedule.nextPayout}</p>
              <p className="text-xs text-blue-500">Est. Rs. {payoutSchedule.nextAmount}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600 font-medium">Pending Amount</p>
              <p className="text-lg font-bold text-green-700 mt-1">Rs. {payoutSchedule.pendingAmount}</p>
              <p className="text-xs text-green-500">Available for next cycle</p>
            </div>
            <div>
              <Label>Minimum Payout</Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rs.</span>
                <Input defaultValue={payoutSchedule.minPayout} className="pl-10" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Minimum amount for auto-payout</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Accounts */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-base">Bank Accounts</CardTitle>
                <p className="text-xs text-gray-400">Manage linked bank accounts for payouts</p>
              </div>
            </div>
            <Button variant="outline" size="sm"><Plus className="mr-1.5 h-4 w-4" />Add Account</Button>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map((bank) => (
              <div key={bank.id} className={`p-5 rounded-xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-md ${bank.isPrimary ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{bank.bankName}</p>
                      <p className="text-xs text-gray-400">{bank.branch}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {bank.isPrimary && <Badge className="bg-orange-100 text-orange-700">Primary</Badge>}
                    {bank.verified && <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="mr-1 h-3 w-3" />Verified</Badge>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Account Number</p>
                    <p className="font-medium">{bank.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">IFSC Code</p>
                    <p className="font-medium">{bank.ifsc}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Account Holder</p>
                    <p className="font-medium">{bank.accountHolder}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Type</p>
                    <p className="font-medium">{bank.accountType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                  {!bank.isPrimary && <Button variant="outline" size="sm">Set as Primary</Button>}
                  <Button variant="ghost" size="sm"><Edit className="mr-1 h-3.5 w-3.5" />Edit</Button>
                  {!bank.isPrimary && <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="mr-1 h-3.5 w-3.5" />Remove</Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* UPI Settings */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-base">UPI Settings</CardTitle>
                <p className="text-xs text-gray-400">Configure UPI payment acceptance</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between py-1.5">
              <div>
                <p className="text-sm font-medium text-gray-700">Accept UPI Payments</p>
                <p className="text-xs text-gray-400">Allow customers to pay via UPI</p>
              </div>
              <Switch defaultChecked={upiSettings.enabled} />
            </div>
            <div>
              <Label>UPI ID</Label>
              <Input defaultValue={upiSettings.upiId} className="mt-1.5" />
            </div>
            <div>
              <Label>Daily Transaction Limit</Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rs.</span>
                <Input defaultValue={upiSettings.dailyLimit} className="pl-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-base">Tax Information</CardTitle>
                <p className="text-xs text-gray-400">Tax IDs and deduction settings</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>GSTIN</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input defaultValue={taxInfo.gstin} readOnly className="bg-gray-50" />
                  <Badge className="bg-green-100 text-green-700 shrink-0">Verified</Badge>
                </div>
              </div>
              <div>
                <Label>PAN</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input defaultValue={taxInfo.pan} readOnly className="bg-gray-50" />
                  <Badge className="bg-green-100 text-green-700 shrink-0">Verified</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">TDS Rate</p>
                <p className="text-lg font-bold mt-0.5">{taxInfo.tdsRate}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">GST Rate</p>
                <p className="text-lg font-bold mt-0.5">{taxInfo.gstRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <History className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <CardTitle className="text-base">Payment History</CardTitle>
                <p className="text-xs text-gray-400">Recent payment transactions and settlements</p>
              </div>
            </div>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" />Download CSV</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((p) => (
                <TableRow key={p.id} className="hover:bg-orange-50/30">
                  <TableCell className="font-mono text-sm">{p.id}</TableCell>
                  <TableCell className="text-sm text-gray-500">{p.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={typeStyles[p.type]}>{p.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{p.description}</TableCell>
                  <TableCell className="text-right">
                    <span className={`text-sm font-semibold flex items-center justify-end gap-1 ${p.isCredit ? 'text-green-600' : 'text-red-500'}`}>
                      {p.isCredit ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {p.isCredit ? '+' : '-'} Rs. {p.amount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusStyles[p.status]}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400 font-mono">{p.reference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
