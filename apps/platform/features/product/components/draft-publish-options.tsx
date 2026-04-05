import { Calendar, FileText, Info } from 'lucide-react';
import { mockCategoryRequirements } from '../services/product-detail-state-mock';

const TEXT = {
  catReqTitle: 'Category Requirements',
  publishOptions: 'Publish Options',
  scheduleLabel: 'Schedule Publish For',
  schedule: 'Schedule',
  saveTemplate: 'Save as Template',
} as const;

export function DraftPublishOptions() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Category Requirements */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-600" />
          <h4 className="text-sm font-semibold text-blue-800">{TEXT.catReqTitle}</h4>
        </div>
        <ul className="space-y-1.5">
          {mockCategoryRequirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Publish Options */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">{TEXT.publishOptions}</h4>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">{TEXT.scheduleLabel}</label>
            <div className="flex items-center gap-2">
              <input
                type="datetime-local"
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100"
              />
              <button className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600">
                <Calendar className="h-4 w-4" /> {TEXT.schedule}
              </button>
            </div>
          </div>
          <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
            <FileText className="h-4 w-4" /> {TEXT.saveTemplate}
          </button>
        </div>
      </div>
    </div>
  );
}
