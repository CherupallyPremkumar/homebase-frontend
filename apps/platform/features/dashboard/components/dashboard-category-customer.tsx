import { CategoryPerformancePanel } from './category-performance';
import { CustomerHealthPanel } from './customer-health';

export function DashboardCategoryCustomer() {
  return (
    <section aria-label="Category performance and customer health">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CategoryPerformancePanel />
        <CustomerHealthPanel />
      </div>
    </section>
  );
}
