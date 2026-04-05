'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  X,
  Bell,
  Star,
} from 'lucide-react';
import { AccountSidebar } from '@homebase/ui';

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

interface WishlistItem {
  id: string;
  emoji: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: number;
  rating: number;
  reviews: number;
  inStock: boolean;
}

const INITIAL_ITEMS: WishlistItem[] = [
  {
    id: '1',
    emoji: '\uD83C\uDFA7',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    price: '\u20B922,490',
    originalPrice: '\u20B932,129',
    discount: 30,
    rating: 4,
    reviews: 128,
    inStock: true,
  },
  {
    id: '2',
    emoji: '\uD83D\uDCBB',
    name: 'MacBook Air M3 15-inch 16GB RAM 512GB SSD',
    price: '\u20B91,24,900',
    originalPrice: '\u20B91,46,900',
    discount: 15,
    rating: 5,
    reviews: 342,
    inStock: true,
  },
  {
    id: '3',
    emoji: '\uD83D\uDCF1',
    name: 'Samsung Galaxy S24 Ultra 256GB Titanium Black',
    price: '\u20B91,09,999',
    originalPrice: '\u20B91,46,999',
    discount: 25,
    rating: 4,
    reviews: 89,
    inStock: false,
  },
  {
    id: '4',
    emoji: '\u26BD',
    name: 'Nike Air Jordan 1 Retro High OG University Blue',
    price: '\u20B914,995',
    originalPrice: '\u20B918,745',
    discount: 20,
    rating: 5,
    reviews: 256,
    inStock: true,
  },
  {
    id: '5',
    emoji: '\uD83C\uDFAE',
    name: 'PlayStation 5 Slim Digital Edition Console',
    price: '\u20B939,990',
    originalPrice: '\u20B944,990',
    discount: 11,
    rating: 5,
    reviews: 512,
    inStock: true,
  },
  {
    id: '6',
    emoji: '\uD83D\uDCF7',
    name: 'Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Lens',
    price: '\u20B965,990',
    originalPrice: '\u20B974,995',
    discount: 12,
    rating: 4,
    reviews: 67,
    inStock: false,
  },
];

// ---------------------------------------------------------------------------
// Star rating
// ---------------------------------------------------------------------------
function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1 mb-1.5">
      <div className="flex text-amber-400 text-xs">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'fill-none text-gray-300'}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400">({reviews})</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WishlistPage
// ---------------------------------------------------------------------------
export function WishlistPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <AccountSidebar
            userName="Premkumar"
            userEmail="premkumar@email.com"
            activePage="wishlist"
          />
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-navy-900">
                My Wishlist <span className="text-gray-400 font-medium text-lg">({items.length} items)</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">Products you have saved for later</p>
            </div>
            <button className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all hover:-translate-y-px hover:shadow-md">
              <ShoppingCart className="w-4 h-4" />
              Add All to Cart
            </button>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden relative group hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 z-10 w-7 h-7 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Discount Badge */}
                <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  -{item.discount}%
                </span>

                {/* Image */}
                <Link href={`/products/${item.id}`} className="block bg-gray-50 p-6 flex items-center justify-center h-48">
                  <span className="text-7xl">{item.emoji}</span>
                </Link>

                {/* Details */}
                <div className="p-4">
                  <StarRating rating={item.rating} reviews={item.reviews} />

                  <Link
                    href={`/products/${item.id}`}
                    className="text-sm font-semibold text-navy-900 hover:text-brand-500 transition line-clamp-2 leading-snug"
                  >
                    {item.name}
                  </Link>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-navy-900">{item.price}</span>
                    <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-xs font-medium ${item.inStock ? 'text-green-600' : 'text-red-500'}`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                    {item.inStock ? (
                      <button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 transition">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    ) : (
                      <button className="flex-1 bg-navy-900 hover:bg-navy-800 text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 transition">
                        <Bell className="w-4 h-4" />
                        Notify Me
                      </button>
                    )}
                    <Link
                      href={`/products/${item.id}`}
                      className="text-xs text-brand-500 hover:text-brand-600 font-medium whitespace-nowrap"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">Your wishlist is empty.</p>
              <Link href="/products" className="text-brand-500 font-medium text-sm mt-2 inline-block hover:underline">
                Browse Products
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
