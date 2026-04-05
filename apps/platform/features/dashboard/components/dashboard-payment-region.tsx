import { PaymentMixPanel } from './payment-mix-panel';
import { RevenueByRegion } from './revenue-by-region';

export function DashboardPaymentRegion() {
  return (
    <section aria-label="Payment and region analytics">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PaymentMixPanel />
        <RevenueByRegion />
      </div>
    </section>
  );
}
