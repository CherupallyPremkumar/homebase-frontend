import { AlertTriangle, Check, Ban, MessageSquare } from 'lucide-react';
import { mockSuspensionInfo } from '../services/product-detail-state-mock';

const TEXT = {
  title: 'This product has been suspended',
  suspensionReason: 'SUSPENSION REASON',
  buyerComplaints: 'BUYER COMPLAINTS',
  reactivate: 'Reactivate',
  disable: 'Permanently Disable',
  messageSeller: 'Message Seller',
} as const;

export function SuspendedBanner() {
  const info = mockSuspensionInfo;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">{TEXT.title}</p>
            <p className="mt-0.5 text-xs text-red-600">
              Suspended on {new Date(info.suspendedAt).toLocaleDateString('en-IN')} by {info.suspendedBy}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700">
            <Check className="h-3.5 w-3.5" /> {TEXT.reactivate}
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700">
            <Ban className="h-3.5 w-3.5" /> {TEXT.disable}
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">
            <MessageSquare className="h-3.5 w-3.5" /> {TEXT.messageSeller}
          </button>
        </div>
      </div>

      {/* Suspension Reason */}
      <div className="mb-3 rounded-lg border border-red-200 bg-white p-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-red-600">{TEXT.suspensionReason}</p>
        <p className="text-sm text-gray-700">{info.reason}</p>
      </div>

      {/* Buyer Complaints */}
      <div className="rounded-lg border border-amber-200 bg-white p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-red-600">
          {TEXT.buyerComplaints} ({info.complaints.length})
        </p>
        <ol className="space-y-2">
          {info.complaints.map((c, i) => (
            <li key={i} className="flex gap-2 text-xs text-gray-600">
              <span className="shrink-0 font-semibold text-gray-400">{i + 1}.</span>
              <span>{c.text} <span className="text-gray-400">— {c.date}</span></span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
