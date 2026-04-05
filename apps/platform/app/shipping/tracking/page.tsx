'use client';

const TEXT = {
  title: 'Delivery Tracking',
  subtitle: 'Track shipments and delivery status across all carriers',
  comingSoon: 'Delivery tracking dashboard coming soon',
} as const;

export default function DeliveryTrackingPage() {
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
