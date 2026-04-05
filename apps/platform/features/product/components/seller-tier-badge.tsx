import type { SellerTier } from '../types';

const TIER_STYLES: Record<SellerTier, string> = {
  PLATINUM: 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700',
  GOLD: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800',
  SILVER: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600',
  BRONZE: 'bg-gradient-to-r from-orange-200 to-orange-300 text-orange-800',
};

interface SellerTierBadgeProps {
  tier: SellerTier;
}

export function SellerTierBadge({ tier }: SellerTierBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${TIER_STYLES[tier]}`}>
      {tier}
    </span>
  );
}
