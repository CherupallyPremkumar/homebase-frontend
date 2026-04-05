import type { ProductDetailData } from '../types';

interface ProductDetailActivityProps {
  history: ProductDetailData['moderationHistory'];
}

export function ProductDetailActivity({ history }: ProductDetailActivityProps) {
  if (history.length === 0) return null;

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Moderation history">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Moderation History</h3>
      <div className="space-y-3" role="list">
        {history.map((entry, i) => (
          <div key={i} className="flex gap-3" role="listitem">
            <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${entry.color}`} />
            <div>
              <p className="text-sm text-gray-900">{entry.event}</p>
              <p className="text-xs text-gray-400">By {entry.actor} &middot; {entry.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
