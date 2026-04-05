'use client';

import { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Button, Badge,
} from '@homebase/ui';
import { RatingStars } from '@homebase/ui';
import { Star, MessageSquare, ThumbsUp, Filter } from 'lucide-react';

const tabs = [
  { label: 'All Reviews', count: 48 },
  { label: '5 Stars', count: 22 },
  { label: '4 Stars', count: 14 },
  { label: '3 Stars', count: 6 },
  { label: '2 Stars', count: 4 },
  { label: '1 Star', count: 2 },
  { label: 'Unreplied', count: 8 },
];

const ratingBreakdown = [
  { stars: 5, count: 22, pct: 46 },
  { stars: 4, count: 14, pct: 29 },
  { stars: 3, count: 6, pct: 13 },
  { stars: 2, count: 4, pct: 8 },
  { stars: 1, count: 2, pct: 4 },
];

const reviews = [
  {
    id: 1, name: 'Ananya Sharma', initials: 'AS', color: 'from-pink-400 to-pink-600',
    rating: 5, date: '27 Mar 2026', product: 'Wireless Bluetooth Speaker',
    text: 'Amazing sound quality for this price range! Bass is deep and the battery lasts forever. Very happy with my purchase.',
    helpful: 12, reply: 'Thank you so much, Ananya! We\'re glad you\'re enjoying the speaker. Do check out our new portable range too!',
  },
  {
    id: 2, name: 'Vikram Patel', initials: 'VP', color: 'from-blue-400 to-blue-600',
    rating: 4, date: '26 Mar 2026', product: 'Cotton Kurta Set (M)',
    text: 'Good quality fabric and nice stitching. The fit is slightly loose but manageable. Would recommend for everyday wear.',
    helpful: 8, reply: null,
  },
  {
    id: 3, name: 'Priya Menon', initials: 'PM', color: 'from-green-400 to-green-600',
    rating: 2, date: '25 Mar 2026', product: 'Silk Saree (Blue)',
    text: 'The color looks very different from what was shown online. Disappointed with the purchase. The material quality is okay though.',
    helpful: 3, reply: 'We\'re sorry about the color difference, Priya. We\'ve updated our product photos. Please reach out for an exchange!',
  },
  {
    id: 4, name: 'Rahul Gupta', initials: 'RG', color: 'from-amber-400 to-amber-600',
    rating: 5, date: '24 Mar 2026', product: 'Stainless Steel Water Bottle',
    text: 'Perfect insulation - keeps water cold for 24 hours! Sturdy build and no leaks. Best bottle I\'ve owned.',
    helpful: 15, reply: null,
  },
  {
    id: 5, name: 'Deepika Nair', initials: 'DN', color: 'from-purple-400 to-purple-600',
    rating: 3, date: '22 Mar 2026', product: 'Organic Face Cream',
    text: 'The cream is decent but nothing extraordinary. Took about 2 weeks to see any results. Packaging could be better.',
    helpful: 5, reply: null,
  },
  {
    id: 6, name: 'Suresh Kumar', initials: 'SK', color: 'from-teal-400 to-teal-600',
    rating: 4, date: '20 Mar 2026', product: 'Ceramic Dinner Set',
    text: 'Beautiful design and good quality ceramics. One plate had a tiny chip but seller replaced it quickly. Good service!',
    helpful: 9, reply: 'Thanks for your patience, Suresh! Glad we could resolve the issue quickly. Enjoy your dinner set!',
  },
];

export function SellerReviewsPage() {
  const [activeTab, setActiveTab] = useState('All Reviews');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-sm text-gray-400 mt-1">Monitor and respond to customer feedback</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Rating Summary + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Average Rating Card */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <p className="text-5xl font-bold text-gray-900">4.6</p>
            <RatingStars rating={4.6} size="lg" className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">Based on 48 reviews</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" /> 92% Positive
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> 83% Replied
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Rating Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Rating Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingBreakdown.map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-12 flex items-center gap-1">
                  {r.stars}
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                </span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{r.count} ({r.pct}%)</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`text-xs font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.label
                ? 'bg-orange-500 text-white'
                : 'text-gray-500 bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-5">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RatingStars rating={review.rating} size="sm" />
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{review.product}</span>
                </div>
              </div>

              {/* Review Body */}
              <p className="text-sm text-gray-700 leading-relaxed">{review.text}</p>

              {/* Helpful count */}
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <ThumbsUp className="w-3.5 h-3.5" /> {review.helpful} found helpful
                </span>
              </div>

              {/* Reply Section */}
              {review.reply ? (
                <div className="mt-4 bg-orange-50 border border-orange-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[9px] font-bold">
                      RS
                    </div>
                    <span className="text-xs font-semibold text-gray-700">Your Reply</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{review.reply}</p>
                </div>
              ) : (
                <div className="mt-4">
                  {replyingTo === review.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none"
                        rows={3}
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-xs"
                          onClick={() => { setReplyingTo(null); setReplyText(''); }}
                        >
                          Post Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => { setReplyingTo(null); setReplyText(''); }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(review.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Reply to this review
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
