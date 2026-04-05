import { FileText, Bell, Trash2 } from 'lucide-react';

const TEXT = {
  title: 'This product is still in draft',
  info: 'Submitted by seller on Mar 30, 2026. Not yet visible to customers.',
  remindSeller: 'Remind Seller',
  deleteDraft: 'Delete Draft',
} as const;

export function DraftBanner() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-200">
          <FileText className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">{TEXT.title}</p>
          <p className="mt-0.5 text-xs text-gray-500">{TEXT.info}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">
          <Bell className="h-3.5 w-3.5" /> {TEXT.remindSeller}
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50">
          <Trash2 className="h-3.5 w-3.5" /> {TEXT.deleteDraft}
        </button>
      </div>
    </div>
  );
}
