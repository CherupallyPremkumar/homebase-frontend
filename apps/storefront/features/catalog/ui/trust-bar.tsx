import { Shield, Undo2, Truck, Headphones } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Shield, label: 'Secure Payments', desc: '100% protected' },
  { icon: Undo2, label: 'Easy Returns', desc: '7-day returns' },
  { icon: Truck, label: 'Free Shipping', desc: 'Orders over ₹499' },
  { icon: Headphones, label: '24/7 Support', desc: 'Always here' },
];

export function TrustBar() {
  return (
    <section className="border-y bg-gray-50">
      <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
