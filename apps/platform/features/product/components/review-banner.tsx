import { Clock, Check, X } from 'lucide-react';

const TEXT = {
  title: 'This product is awaiting your review',
  info: 'Submitted Mar 28, 2026 by Krishna Home Decor. 2 compliance issues found.',
  approve: 'Approve',
  reject: 'Reject',
} as const;

export function ReviewBanner() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <Clock className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">{TEXT.title}</p>
          <p className="mt-0.5 text-xs text-amber-600">{TEXT.info}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700">
          <Check className="h-3.5 w-3.5" /> {TEXT.approve}
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700">
          <X className="h-3.5 w-3.5" /> {TEXT.reject}
        </button>
      </div>
    </div>
  );
}
