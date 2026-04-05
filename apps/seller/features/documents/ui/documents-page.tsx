'use client';

import { useState } from 'react';
import { Card, CardContent, Badge, Button, Tabs, TabsList, TabsTrigger } from '@homebase/ui';
import {
  FileText, Upload, CheckCircle2, Clock, AlertTriangle, Eye, Download, RefreshCw,
  Calendar, File, CheckSquare, Square,
} from 'lucide-react';

/* ---------- mock data ---------- */

const docStats = [
  { label: 'Total Documents', value: '5', icon: FileText, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { label: 'Verified', value: '3', icon: CheckCircle2, iconBg: 'bg-green-50', iconColor: 'text-green-500', valueColor: 'text-green-600' },
  { label: 'Pending Review', value: '1', icon: Clock, iconBg: 'bg-orange-50', iconColor: 'text-orange-500', valueColor: 'text-orange-500' },
  { label: 'Expired', value: '1', icon: AlertTriangle, iconBg: 'bg-red-50', iconColor: 'text-red-500', valueColor: 'text-red-500' },
];

interface DocItem {
  id: string;
  name: string;
  status: 'Verified' | 'Pending Review' | 'Expired';
  category: 'tax' | 'identity' | 'business' | 'bank';
  uploadedDate: string;
  fileSize: string;
  reference: string;
  fileType: string;
}

const documents: DocItem[] = [
  { id: '1', name: 'GST Registration Certificate', status: 'Verified', category: 'tax', uploadedDate: '15 Jan 2024', fileSize: '245 KB', reference: 'GSTIN: 29ABCDE1234F1Z5', fileType: 'PDF' },
  { id: '2', name: 'PAN Card', status: 'Verified', category: 'identity', uploadedDate: '15 Jan 2024', fileSize: '180 KB', reference: 'PAN: ABCDE1234F', fileType: 'PDF' },
  { id: '3', name: 'Business Registration Certificate', status: 'Verified', category: 'business', uploadedDate: '12 Jan 2024', fileSize: '512 KB', reference: 'CIN: U74120KA2020PTC123456', fileType: 'PDF' },
  { id: '4', name: 'Bank Statement', status: 'Pending Review', category: 'bank', uploadedDate: '20 Mar 2026', fileSize: '1.2 MB', reference: 'Estimated review: 2-3 business days', fileType: 'PDF' },
  { id: '5', name: 'Trade License', status: 'Expired', category: 'business', uploadedDate: '10 Jun 2023', fileSize: '890 KB', reference: 'Expired on 10 Jun 2024', fileType: 'PDF' },
];

const complianceChecklist = [
  { label: 'GST Registration Certificate', done: true },
  { label: 'PAN Card Verification', done: true },
  { label: 'Business Registration', done: true },
  { label: 'Bank Account Verification', done: false },
  { label: 'Trade License (Current)', done: false },
  { label: 'Address Proof', done: false },
];

/* ---------- helpers ---------- */

const statusConfig: Record<string, { cls: string; icon: typeof CheckCircle2 }> = {
  'Verified': { cls: 'bg-green-50 text-green-700 border-green-100', icon: CheckCircle2 },
  'Pending Review': { cls: 'bg-orange-50 text-orange-700 border-orange-200', icon: Clock },
  'Expired': { cls: 'bg-red-50 text-red-700 border-red-100', icon: AlertTriangle },
};

export function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = documents.filter((d) => {
    if (activeTab === 'all') return true;
    return d.category === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your business verification documents and compliance records</p>
        </div>
        <Button><Upload className="mr-1.5 h-4 w-4" />Upload Document</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {docStats.map((s) => (
          <Card key={s.label} className="hover:-translate-y-0.5 transition-transform">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.iconColor}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${s.valueColor || ''}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Tabs + Document List */}
      <Card>
        <div className="border-b px-5">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="-mb-px">
              <TabsTrigger value="all">All Documents <Badge variant="secondary" className="ml-1.5 text-[10px]">5</Badge></TabsTrigger>
              <TabsTrigger value="business">Business Registration</TabsTrigger>
              <TabsTrigger value="tax">Tax Documents</TabsTrigger>
              <TabsTrigger value="bank">Bank Verification</TabsTrigger>
              <TabsTrigger value="identity">Identity Proof</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-5 space-y-4">
          {filtered.map((doc) => {
            const sc = statusConfig[doc.status];
            const StatusIcon = sc.icon;
            const isPending = doc.status === 'Pending Review';
            const isExpired = doc.status === 'Expired';
            return (
              <div key={doc.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${isPending ? 'bg-orange-50/50 border-orange-100' : isExpired ? 'bg-red-50/30 border-red-100' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                {/* File Icon */}
                <div className="w-12 h-14 rounded-lg bg-red-50 border border-red-100 flex flex-col items-center justify-center shrink-0">
                  <File className="h-6 w-6 text-red-500" />
                  <span className="text-[8px] font-bold text-red-500 mt-0.5 uppercase">{doc.fileType}</span>
                </div>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-sm font-semibold">{doc.name}</h4>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.cls}`}>
                      <StatusIcon className="h-3 w-3" />{doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="h-3 w-3" />Uploaded {doc.uploadedDate}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><FileText className="h-3 w-3" />{doc.fileSize}</span>
                    <span className={`text-xs ${isExpired ? 'text-red-500 font-medium' : isPending ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>{doc.reference}</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm"><Eye className="mr-1.5 h-3.5 w-3.5" />View</Button>
                  <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" />Download</Button>
                  <Button variant="outline" size="sm" className={isExpired ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-orange-600 border-orange-200 hover:bg-orange-50'}>
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />{isExpired ? 'Re-upload' : 'Replace'}
                  </Button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-gray-400">No documents in this category.</div>
          )}
        </div>
      </Card>

      {/* Upload Zone + Compliance Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Zone */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-base font-semibold mb-4">Upload New Document</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-400 hover:bg-orange-50/30 transition cursor-pointer">
              <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-600">Drag & drop files here, or click to browse</p>
              <p className="text-xs text-gray-400 mt-1.5">PDF, JPG, PNG up to 10MB each</p>
              <Button variant="outline" className="mt-4">Browse Files</Button>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Checklist */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Compliance Checklist</h3>
              <Badge variant="secondary" className="bg-orange-50 text-orange-600">3 of 6 complete</Badge>
            </div>
            <div className="space-y-3">
              {complianceChecklist.map((item) => (
                <div key={item.label} className="flex items-center gap-3 py-1.5">
                  {item.done ? (
                    <CheckSquare className="h-5 w-5 text-green-500 shrink-0" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-300 shrink-0" />
                  )}
                  <span className={`text-sm ${item.done ? 'text-gray-600 line-through' : 'text-gray-700 font-medium'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
