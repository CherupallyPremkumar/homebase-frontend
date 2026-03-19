'use client';

import { SectionSkeleton, ErrorSection, formatDate } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@homebase/ui';
import { FileText, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useSellerDocuments } from '../api/queries';
import { cn } from '@homebase/ui/src/lib/utils';

const DOC_LABELS: Record<string, string> = {
  GSTIN_CERTIFICATE: 'GSTIN Certificate',
  PAN_CARD: 'PAN Card',
  BUSINESS_REGISTRATION: 'Business Registration',
  BANK_PROOF: 'Bank Statement / Cancelled Cheque',
  ADDRESS_PROOF: 'Address Proof',
};

const REQUIRED_DOCS = ['GSTIN_CERTIFICATE', 'PAN_CARD', 'BUSINESS_REGISTRATION', 'BANK_PROOF'];

export function DocumentsPage() {
  const { data, isLoading, error, refetch } = useSellerDocuments();

  if (isLoading) return <SectionSkeleton rows={5} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;

  const docs = data ?? [];
  const uploadedTypes = new Set(docs.map((d) => d.type));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-sm text-gray-500">Upload and manage your KYC and business documents</p>
      </div>

      <div className="space-y-4">
        {REQUIRED_DOCS.map((type) => {
          const doc = docs.find((d) => d.type === type);
          return (
            <Card key={type}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{DOC_LABELS[type] || type}</p>
                    {doc ? (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">{doc.fileName}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-400">{formatDate(doc.uploadedAt)}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Not uploaded</p>
                    )}
                    {doc?.rejectionReason && (
                      <p className="text-sm text-red-500">Reason: {doc.rejectionReason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {doc ? (
                    <StatusBadge status={doc.status} />
                  ) : (
                    <Badge variant="outline" className="text-yellow-600">Required</Badge>
                  )}
                  <Button variant="outline" size="sm">
                    <Upload className="mr-1 h-3.5 w-3.5" />
                    {doc ? 'Re-upload' : 'Upload'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'VERIFIED') {
    return <Badge className="bg-green-100 text-green-700"><CheckCircle className="mr-1 h-3 w-3" />Verified</Badge>;
  }
  if (status === 'REJECTED') {
    return <Badge className="bg-red-100 text-red-700"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
  }
  return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
}
