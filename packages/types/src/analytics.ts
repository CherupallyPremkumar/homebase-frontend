export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
  activeUsers: number;
  ordersChange: number;
  revenueChange: number;
  productsChange: number;
  usersChange: number;
}

export interface DailyOrderStats {
  date: string;
  orders: number;
  revenue: number;
  averageOrderValue: number;
}

export interface OrdersByState {
  state: string;
  count: number;
  percentage: number;
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
