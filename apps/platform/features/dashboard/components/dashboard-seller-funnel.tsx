import { SellerHealthPanel } from './seller-health-panel';
import { ConversionFunnel } from './conversion-funnel';

export function DashboardSellerFunnel() {
  return (
    <section aria-label="Seller health and conversion funnel">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SellerHealthPanel />
        <ConversionFunnel />
      </div>
    </section>
  );
}
