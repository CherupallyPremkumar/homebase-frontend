'use client';

import {
  Card, CardContent, CardHeader, CardTitle,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button,
} from '@homebase/ui';
import { StatCard, BarChart, RatingStars } from '@homebase/ui';
import {
  CheckCircle2, Star, Clock, RotateCcw,
  Download, TrendingUp, Lightbulb, ThumbsUp,
} from 'lucide-react';

const revenueData = [
  { label: 'Jan', value: 175000 },
  { label: 'Feb', value: 240000 },
  { label: 'Mar', value: 290000 },
  { label: 'Apr', value: 225000 },
  { label: 'May', value: 310000 },
  { label: 'Jun', value: 275000 },
  { label: 'Jul', value: 360000 },
  { label: 'Aug', value: 325000 },
  { label: 'Sep', value: 390000 },
  { label: 'Oct', value: 440000 },
  { label: 'Nov', value: 410000 },
  { label: 'Dec', value: 475000 },
];

const topProducts = [
  { rank: 1, name: 'Wireless Bluetooth Speaker', revenue: 89500, orders: 142, rating: 4.8 },
  { rank: 2, name: 'Cotton Kurta Set', revenue: 67200, orders: 98, rating: 4.5 },
  { rank: 3, name: 'Stainless Steel Water Bottle', revenue: 52800, orders: 176, rating: 4.7 },
  { rank: 4, name: 'Organic Face Cream', revenue: 41300, orders: 87, rating: 4.2 },
  { rank: 5, name: 'Ceramic Dinner Set', revenue: 38900, orders: 64, rating: 4.6 },
];

const ratingBreakdown = [
  { stars: 5, pct: 46 },
  { stars: 4, pct: 29 },
  { stars: 3, pct: 13 },
  { stars: 2, pct: 8 },
  { stars: 1, pct: 4 },
];

const recentReviews = [
  {
    name: 'Ananya S.', rating: 5, date: '27 Mar', product: 'Bluetooth Speaker',
    text: 'Amazing sound quality for this price. Bass is deep and battery lasts forever!',
  },
  {
    name: 'Vikram P.', rating: 4, date: '26 Mar', product: 'Kurta Set',
    text: 'Good quality fabric and nice stitching. Slightly loose fit but manageable.',
  },
  {
    name: 'Priya M.', rating: 2, date: '25 Mar', product: 'Silk Saree',
    text: 'Color looks different from what was shown online. Disappointed.',
  },
];

const tips = [
  {
    title: 'Improve Response Time',
    description: 'Respond to customer queries within 2 hours to maintain your seller score. Consider using quick reply templates.',
    icon: Clock,
  },
  {
    title: 'Reduce Return Rate',
    description: 'Add detailed size charts and high-quality product images to reduce size-related returns by up to 30%.',
    icon: RotateCcw,
  },
  {
    title: 'Boost Product Ratings',
    description: 'Follow up with customers post-delivery and request reviews. Sellers with 4.5+ ratings get 2x more visibility.',
    icon: Star,
  },
];

export function PerformancePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-sm text-gray-400 mt-1">Track your store's performance metrics and customer satisfaction</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This Year</option>
          </select>
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Order Fulfillment Rate" value="96.5%"
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          trend={2.1} trendDirection="up" trendIsPositive
          progressBar={96.5} progressColor="bg-green-500"
        />
        <StatCard
          title="Average Rating" value="4.6/5"
          icon={<Star className="h-5 w-5 text-yellow-500" />}
          progressBar={92} progressColor="bg-yellow-400"
        />
        <StatCard
          title="Response Time" value="2.4 hrs"
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          progressBar={76} progressColor="bg-blue-500"
        />
        <StatCard
          title="Return Rate" value="3.2%"
          icon={<RotateCcw className="h-5 w-5 text-green-500" />}
          trend={0.8} trendDirection="down" trendIsPositive
          progressBar={97} progressColor="bg-green-500"
        />
      </div>

      {/* Revenue Chart + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Revenue Overview</CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">Monthly revenue for the current year</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">Weekly</button>
                <button className="text-xs font-medium text-white bg-orange-500 px-3 py-1.5 rounded-lg">Monthly</button>
                <button className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">Yearly</button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <BarChart data={revenueData} height={260} />
            {/* Revenue Summary */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Revenue</p>
                <p className="text-lg font-bold text-gray-900">{'\u20B9'}38,15,000</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Avg Monthly</p>
                <p className="text-lg font-bold text-gray-900">{'\u20B9'}3,17,917</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Best Month</p>
                <p className="text-lg font-bold text-gray-900">Dec ({'\u20B9'}4.75L)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-sm font-bold text-gray-900">1,284</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-bold text-green-600">1,239</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm text-gray-600">Processing</span>
              <span className="text-sm font-bold text-yellow-600">33</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-600">Returned</span>
              <span className="text-sm font-bold text-red-600">12</span>
            </div>
            <div className="mt-2 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Fulfillment Rate</span>
                <span>96.5%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '96.5%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Top Performing Products</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">Products with highest revenue this month</p>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider w-12">#</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Revenue</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Orders</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((p) => (
                <TableRow key={p.rank} className="hover:bg-orange-50/50 transition-colors">
                  <TableCell>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      p.rank <= 3 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.rank}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-sm text-gray-800">{p.name}</TableCell>
                  <TableCell className="text-right font-semibold text-sm text-gray-900">
                    {'\u20B9'}{p.revenue.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600">{p.orders}</TableCell>
                  <TableCell>
                    <RatingStars rating={p.rating} size="sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Customer Satisfaction + Performance Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Rating Breakdown */}
            <div className="space-y-2.5">
              {ratingBreakdown.map((r) => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-12 flex items-center gap-1">
                    {r.stars}
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  </span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>

            {/* Recent Reviews */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Reviews</h4>
              <div className="space-y-3">
                {recentReviews.map((r, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700">{r.name}</span>
                        <RatingStars rating={r.rating} size="sm" />
                      </div>
                      <span className="text-[10px] text-gray-400">{r.date}</span>
                    </div>
                    <p className="text-xs text-gray-600">{r.text}</p>
                    <span className="text-[10px] text-gray-400 mt-1 inline-block">{r.product}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Tips */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-base">Performance Tips</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-lg border border-orange-100">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <tip.icon className="h-4.5 w-4.5 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{tip.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}

            {/* Overall Score */}
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Overall Seller Score</p>
              <p className="text-3xl font-bold text-green-600">4.6<span className="text-base font-normal text-gray-400">/5.0</span></p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs font-medium text-green-600">Top 15% of sellers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
