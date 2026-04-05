import { Truck, Shield, RefreshCw, MessageCircle, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export interface TrustItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconBg?: string;
  iconColor?: string;
}

export interface TrustBarProps {
  items?: TrustItem[];
  className?: string;
}

const defaultItems: TrustItem[] = [
  {
    icon: Truck,
    title: 'Free Shipping',
    subtitle: 'On orders over \u20B9999',
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-500',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    subtitle: '100% protected',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: RefreshCw,
    title: '30-Day Returns',
    subtitle: 'Money back guarantee',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    icon: MessageCircle,
    title: '24/7 Support',
    subtitle: 'Live chat & phone',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
];

export function TrustBar({ items = defaultItems, className }: TrustBarProps) {
  return (
    <section className={cn('border-b border-gray-100', className)}>
      <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  item.iconBg ?? 'bg-gray-50'
                )}
              >
                <Icon className={cn('w-5 h-5', item.iconColor ?? 'text-gray-600')} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F1B2D]">{item.title}</p>
                <p className="text-xs text-gray-400">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
