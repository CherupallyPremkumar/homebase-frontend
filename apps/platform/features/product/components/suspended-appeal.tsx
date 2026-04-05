import { HelpCircle, Upload } from 'lucide-react';

const TEXT = {
  title: 'Submit Appeal',
  description: 'If you believe this suspension is incorrect, the seller can submit an appeal with supporting evidence.',
  notesLabel: 'Appeal Notes',
  notesPlaceholder: 'Describe why this product should be reinstated...',
  uploadLabel: 'Supporting Documents',
  uploadHint: 'Drag and drop files here, or click to browse',
  submit: 'Submit Appeal',
} as const;

export function SuspendedAppeal() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-brand-500" />
        <h4 className="text-sm font-semibold text-gray-900">{TEXT.title}</h4>
      </div>
      <p className="mb-4 text-xs text-gray-500">{TEXT.description}</p>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">{TEXT.notesLabel}</label>
          <textarea
            rows={3}
            placeholder={TEXT.notesPlaceholder}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">{TEXT.uploadLabel}</label>
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6">
            <div className="text-center">
              <Upload className="mx-auto h-6 w-6 text-gray-400" />
              <p className="mt-1 text-xs text-gray-500">{TEXT.uploadHint}</p>
            </div>
          </div>
        </div>
        <button className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600">
          {TEXT.submit}
        </button>
      </div>
    </div>
  );
}
