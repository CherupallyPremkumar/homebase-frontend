'use client';

const TEXT = {
  title: 'Financial Reconciliation',
  subtitle: 'Match transactions across payment gateways, orders, and settlements',
  comingSoon: 'Reconciliation dashboard coming soon',
} as const;

export default function ReconciliationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{TEXT.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{TEXT.subtitle}</p>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-32">
        <p className="text-sm text-gray-400">{TEXT.comingSoon}</p>
      </div>
    </div>
  );
}
