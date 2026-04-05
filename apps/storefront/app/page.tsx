import Link from 'next/link';
import { catalogApi } from '@homebase/api-client';
import { JsonLd, organizationJsonLd, websiteJsonLd } from '@homebase/shared';
import {
  HeroBanner,
  CategoryGrid,
  DealSection,
  ProductCard,
  TrustBar,
  NewsletterBar,
} from '@homebase/ui';
import type {
  HeroBannerCategory,
  HeroBannerPromo,
  CategoryItem,
  DealProduct,
  ProductCardProps,
} from '@homebase/ui';

export const revalidate = 60;

// ---------------------------------------------------------------------------
// Mock data (used until APIs provide this content)
// ---------------------------------------------------------------------------

const heroCategories: HeroBannerCategory[] = [
  { name: 'Laptops', icon: '\uD83D\uDCBB', href: '/products?category=laptops' },
  { name: 'Smartphones', icon: '\uD83D\uDCF1', href: '/products?category=smartphones' },
  { name: 'Headphones', icon: '\uD83C\uDFA7', href: '/products?category=headphones' },
  { name: 'Cameras', icon: '\uD83D\uDCF9', href: '/products?category=cameras' },
  { name: 'Gaming', icon: '\uD83C\uDFAE', href: '/products?category=gaming' },
  { name: 'Fashion', icon: '\uD83D\uDC54', href: '/products?category=fashion' },
  { name: 'Home & Living', icon: '\uD83C\uDFE0', href: '/products?category=home' },
  { name: 'Sports', icon: '\u26BD', href: '/products?category=sports' },
];

const heroPromos: HeroBannerPromo[] = [
  {
    label: 'New Arrival',
    labelColor: 'text-brand-600',
    name: 'Smart Watch Series 8',
    description: 'Water Resistant, GPS',
    price: '\u20B924,999',
    priceColor: 'text-brand-600',
    href: '/products?category=watches',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-orange-100',
    borderColor: 'border-orange-200',
  },
  {
    label: 'Best Seller',
    labelColor: 'text-blue-600',
    name: 'Wireless Noise Cancelling',
    description: 'Headphones Pro Max',
    price: '\u20B912,499',
    priceColor: 'text-blue-600',
    href: '/products?category=headphones',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-blue-100',
    borderColor: 'border-blue-200',
  },
];

const mockCategories: CategoryItem[] = [
  { name: 'Laptops', icon: '\uD83D\uDCBB', itemCount: 74, href: '/products?category=laptops' },
  { name: 'Smartphones', icon: '\uD83D\uDCF1', itemCount: 156, href: '/products?category=smartphones' },
  { name: 'Headphones', icon: '\uD83C\uDFA7', itemCount: 42, href: '/products?category=headphones' },
  { name: 'Fashion', icon: '\uD83D\uDC54', itemCount: 320, href: '/products?category=fashion' },
  { name: 'Home', icon: '\uD83C\uDFE0', itemCount: 89, href: '/products?category=home' },
  { name: 'Sports', icon: '\u26BD', itemCount: 65, href: '/products?category=sports' },
  { name: 'Cameras', icon: '\uD83D\uDCF9', itemCount: 28, href: '/products?category=cameras' },
  { name: 'Gaming', icon: '\uD83C\uDFAE', itemCount: 52, href: '/products?category=gaming' },
];

const dealProducts: DealProduct[] = [
  {
    id: 'deal-1',
    name: 'Pro Max Wireless Headphone',
    icon: '\uD83C\uDFA7',
    price: '\u20B94,999',
    originalPrice: '\u20B98,999',
    discount: 40,
    rating: 5,
    reviewCount: 152,
  },
  {
    id: 'deal-2',
    name: 'Smart Phone 128GB OLED',
    icon: '\uD83D\uDCF1',
    price: '\u20B918,999',
    originalPrice: '\u20B928,999',
    discount: 35,
    rating: 4,
    reviewCount: 89,
  },
  {
    id: 'deal-3',
    name: 'Sport Water Resistance Watch',
    icon: '\u231A',
    price: '\u20B96,499',
    originalPrice: '\u20B912,999',
    discount: 50,
    rating: 5,
    reviewCount: 203,
  },
];

const bestSellers: Omit<ProductCardProps, 'onAddToCart' | 'onWishlist'>[] = [
  {
    id: 'bs-1',
    name: 'MacBook Pro M3 14" 512GB Space Gray',
    image: '/images/placeholder-product.svg',
    price: '\u20B91,49,990',
    rating: 5,
    reviewCount: 312,
    badges: [{ label: 'Free Shipping' }],
    seller: 'Rajesh Store',
  },
  {
    id: 'bs-2',
    name: 'iPhone 16 Pro Max 256GB Natural Titanium',
    image: '/images/placeholder-product.svg',
    price: '\u20B91,44,900',
    rating: 4,
    reviewCount: 89,
    isNew: true,
    badges: [{ label: 'Free Shipping' }, { label: 'Free Gift' }],
    seller: 'Priya Electronics',
  },
  {
    id: 'bs-3',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling',
    image: '/images/placeholder-product.svg',
    price: '\u20B922,490',
    originalPrice: '\u20B929,990',
    rating: 5,
    reviewCount: 456,
    discount: 25,
    badges: [{ label: 'In Stock' }],
    seller: 'Kumar Fashions',
  },
  {
    id: 'bs-4',
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm',
    image: '/images/placeholder-product.svg',
    price: '\u20B989,900',
    rating: 4,
    reviewCount: 178,
    badges: [{ label: 'Free Shipping' }],
    seller: 'Anita Home Decor',
  },
  {
    id: 'bs-5',
    name: 'Nike Air Max 270 React Running Shoes',
    image: '/images/placeholder-product.svg',
    price: '\u20B98,995',
    originalPrice: '\u20B912,995',
    rating: 5,
    reviewCount: 67,
    discount: 30,
    badges: [
      {
        label: '\u20B949 Shipping',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
    ],
    seller: 'Vikram Sports',
  },
];

const FILTER_TABS = ['All', 'Electronics', 'Fashion', 'Home'] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function HomePage() {
  // Fetch data with resilient error handling
  let categories = mockCategories;

  try {
    const [catResult, featuredResult] = await Promise.allSettled([
      catalogApi.categoryMenu(),
      catalogApi.featuredProducts(),
    ]);

    if (catResult.status === 'fulfilled' && catResult.value.list?.length) {
      categories = catResult.value.list.map((r) => ({
        name: r.row.name ?? '',
        icon: ((r.row as unknown as Record<string, unknown>).icon as string) ?? '\uD83D\uDCE6',
        itemCount: r.row.productCount ?? 0,
        href: `/products?category=${r.row.slug ?? r.row.id}`,
      }));
    }

    // featuredResult can be used in the future to replace bestSellers mock
    void featuredResult;
  } catch {
    // Fall back to mock data on any unexpected error
  }

  // Deal end date: 7 days from now
  const dealEndDate = new Date();
  dealEndDate.setDate(dealEndDate.getDate() + 7);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      {/* ===== Hero Banner ===== */}
      <HeroBanner
        title={
          <>
            Discover the
            <br />
            Best Deals on
            <br />
            <span className="text-brand-400">Top Products</span>
          </>
        }
        subtitle="Shop from thousands of sellers. Free shipping on orders over \u20B9999. 30-day easy returns."
        ctaText="Shop Now"
        ctaLink="/products"
        saleBadge="SALE 40% OFF"
        categories={heroCategories}
        promos={heroPromos}
      />

      {/* ===== Trust Bar ===== */}
      <TrustBar />

      {/* ===== Shop by Category ===== */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy-900">Shop by Category</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-brand-500 hover:underline"
            >
              View All &rarr;
            </Link>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* ===== Deal of the Day ===== */}
      <DealSection
        title="Flash Sale!"
        subtitle="Grab the best deals before they're gone. Limited stock available."
        endDate={dealEndDate}
        products={dealProducts}
        ctaLink="/products?deals=true"
      />

      {/* ===== Best Sellers ===== */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy-900">Best Sellers</h2>
            <div className="flex items-center gap-2">
              {FILTER_TABS.map((tab, idx) => (
                <button
                  key={tab}
                  className={
                    idx === 0
                      ? 'rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-600'
                      : 'rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-brand-50 hover:text-brand-600'
                  }
                >
                  {tab}
                </button>
              ))}
              <Link
                href="/products"
                className="ml-4 text-sm font-medium text-brand-500 hover:underline"
              >
                View All &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Promo Banners ===== */}
      <section className="py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 md:grid-cols-2">
          {/* Navy gradient banner */}
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-navy-900 to-navy-700 p-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Summer Sale
              </span>
              <h3 className="mt-2 text-2xl font-extrabold text-white">Up to 50% OFF</h3>
              <p className="mt-1 text-sm text-gray-400">
                On gaming accessories &amp; chairs
              </p>
              <Link
                href="/products?sale=summer"
                className="mt-4 inline-block rounded-lg bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Shop Now
              </Link>
            </div>
            <span className="text-7xl">{'\uD83C\uDFAE'}</span>
          </div>

          {/* Orange gradient banner */}
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-200">
                New Collection
              </span>
              <h3 className="mt-2 text-2xl font-extrabold text-white">Smart Home</h3>
              <p className="mt-1 text-sm text-orange-100">
                IoT devices starting {'\u20B9'}1,999
              </p>
              <Link
                href="/products?category=smart-home"
                className="mt-4 inline-block rounded-lg bg-white px-5 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-orange-50"
              >
                Discover
              </Link>
            </div>
            <span className="text-7xl">{'\uD83C\uDFE0'}</span>
          </div>
        </div>
      </section>

      {/* ===== Newsletter ===== */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <NewsletterBar />
        </div>
      </section>
    </>
  );
}
