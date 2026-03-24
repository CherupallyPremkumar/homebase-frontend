// Matches Dashboard.overviewStats SQL output
export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  publishedProducts: number;
  pendingReviewProducts: number;
  activeSuppliers: number;
  openTickets: number;
}

// Matches Dashboard.dailyOrderStats SQL output
export interface DailyOrderStats {
  date: string;
  orderCount: number;
  revenue: number;
}

// Matches Dashboard.ordersByState SQL output
export interface OrdersByState {
  state: string;
  count: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  returnRate: number;
  averageRating: number;
}

export interface ConversionFunnel {
  stage: string;
  count: number;
  dropoffRate: number;
}
