import { Check, X } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { mockListingFields } from '../services/product-detail-state-mock';

const TEXT = {
  title: 'Listing Completion',
} as const;

export function DraftListingProgress() {
  const fields = mockListingFields;
  const completed = fields.filter((f) => f.completed).length;
  const total = fields.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">{TEXT.title}</h3>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-gray-500">{completed} of {total} required fields</span>
        <span className={cn('font-semibold', percent === 100 ? 'text-green-600' : 'text-amber-600')}>{percent}%</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <div className={cn('h-full rounded-full', percent === 100 ? 'bg-green-500' : 'bg-amber-500')} style={{ width: `${percent}%` }} />
      </div>
      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className={cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm', field.completed ? 'bg-green-50' : 'bg-red-50')}
          >
            {field.completed ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            <span className={cn(field.completed ? 'text-green-700' : 'text-red-700')}>{field.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
