'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeftRight,
  Truck,
  RotateCcw,
  Shield,
  Check,
  Loader2,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  RatingStars,
  PriceBadge,
  StatusBadge,
  ProductCard,
} from '@homebase/ui';
import { useCartStore } from '@homebase/shared';
import { useAuth } from '@homebase/auth';
import type { CatalogItem } from '@homebase/types';
import { toast } from 'sonner';
import { useAddToCart, useActiveCart } from '../../cart/api/queries';
import {
  useIsInWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/features/wishlist/api/queries';

import { ProductImageGallery } from './product-image-gallery';
import { ColorSwatches } from './color-swatches';
import { VariantSelector } from './variant-selector';
import { ProductQuantitySelector } from './product-quantity-selector';
import { ProductTabs } from './product-tabs';

/* ---------- Mock data matching the HTML prototype ---------- */

const GALLERY_IMAGES = [
  { emoji: '\uD83C\uDFA7', label: 'Headphones front' },
  { emoji: '\uD83C\uDFA8', label: 'Headphones side' },
  { emoji: '\uD83D\uDD0A', label: 'Headphones with sound' },
  { emoji: '\uD83C\uDFB5', label: 'Headphones music' },
  { emoji: '\uD83D\uDCE1', label: 'Headphones wireless' },
];

const COLOR_OPTIONS = [
  { name: 'Midnight Black', bgClass: 'bg-gray-900' },
  { name: 'Platinum Silver', bgClass: 'bg-gray-300' },
  { name: 'Deep Blue', bgClass: 'bg-blue-800' },
  { name: 'Burgundy Red', bgClass: 'bg-red-800' },
];

const VARIANT_OPTIONS = ['Standard', 'With Case', 'Bundle Pack'];

const FEATURE_HIGHLIGHTS = [
  {
    emoji: '\uD83C\uDFA7',
    title: '30-Hour Battery',
    description: 'Up to 30 hours of playback with quick charge support. 3-min charge for 3 hours of play.',
  },
  {
    emoji: '\uD83D\uDD0A',
    title: 'Hi-Res Audio',
    description: '30mm driver unit with high-compliance diaphragm for crystal clear audio reproduction.',
  },
  {
    emoji: '\uD83C\uDF99\uFE0F',
    title: 'Crystal Clear Calls',
    description: 'Precise voice pickup with 4 beamforming microphones and AI-based noise reduction.',
  },
];

const KEY_FEATURES = [
  'Industry-leading noise cancellation with Auto NC Optimizer',
  'Exceptional call quality with AI-powered noise reduction',
  'Multipoint connection - connect to 2 devices simultaneously',
  'Touch controls and Speak-to-Chat auto-pause feature',
  'Lightweight design at 250g with premium soft-fit leather',
];

const SPECIFICATIONS = [
  { label: 'Brand', value: 'Sony' },
  { label: 'Model', value: 'WH-1000XM5' },
  { label: 'Driver Unit', value: '30mm, dome type (CCAW Voice coil)' },
  { label: 'Frequency Response', value: '4 Hz - 40,000 Hz (JEITA)' },
  { label: 'Impedance', value: '48 ohm (1 kHz) (when connected via headphone cable with the unit turned on)' },
  { label: 'Bluetooth Version', value: 'Bluetooth 5.2' },
  { label: 'Codec Support', value: 'SBC, AAC, LDAC' },
  { label: 'Battery Life', value: 'Up to 30 hours (NC ON), 40 hours (NC OFF)' },
  { label: 'Charging Time', value: 'Approx. 3.5 hours (USB-C)' },
  { label: 'Quick Charge', value: '3 minutes charge for 3 hours playback' },
  { label: 'Weight', value: 'Approx. 250g' },
  { label: 'Noise Cancellation', value: 'Active (Dual Processor, 8 microphones)' },
  { label: 'In the Box', value: 'Headphones, USB-C cable, 3.5mm audio cable, Carrying case, Airplane adapter' },
];

const RATING_BREAKDOWN = [
  { star: 5, percentage: 78 },
  { star: 4, percentage: 14 },
  { star: 3, percentage: 5 },
  { star: 2, percentage: 2 },
  { star: 1, percentage: 1 },
];

const MOCK_REVIEWS = [
  {
    initials: 'RK',
    initialsBg: 'bg-brand-100',
    initialsColor: 'text-brand-600',
    name: 'Rahul Kumar',
    date: 'Mar 15, 2026',
    rating: 5,
    title: 'Absolutely the best noise cancelling headphones!',
    body: 'The noise cancellation on these is phenomenal. I use them daily on my commute and in the office. The sound quality is exceptional - crisp highs and deep bass without being overpowering. Battery life easily lasts my entire work week. Highly recommended!',
    helpfulCount: 24,
    notHelpfulCount: 1,
  },
  {
    initials: 'PS',
    initialsBg: 'bg-blue-100',
    initialsColor: 'text-blue-600',
    name: 'Priya Sharma',
    date: 'Mar 8, 2026',
    rating: 4,
    title: 'Great upgrade from XM4',
    body: 'Upgraded from the XM4 and the difference is noticeable. The new design is lighter and more comfortable for long sessions. Noise cancellation is improved, especially for voices. My only minor gripe is that the touch controls can be a bit sensitive sometimes. Overall a fantastic product.',
    helpfulCount: 18,
    notHelpfulCount: 0,
  },
  {
    initials: 'AM',
    initialsBg: 'bg-green-100',
    initialsColor: 'text-green-600',
    name: 'Arjun Menon',
    date: 'Feb 28, 2026',
    rating: 5,
    title: 'Worth every rupee spent',
    body: "I was skeptical about spending this much on headphones, but these are worth every single rupee. The build quality is premium, the ANC is next level, and the sound signature is balanced with punchy bass. The multipoint connection is a game changer - seamlessly switching between my laptop and phone. Battery is outstanding too.",
    helpfulCount: 31,
    notHelpfulCount: 2,
  },
];

const RELATED_PRODUCTS = [
  {
    id: 'bose-qc-ultra',
    name: 'Bose QuietComfort Ultra Wireless',
    image: '/placeholder.svg',
    price: '\u20B925,990',
    originalPrice: '\u20B936,990',
    rating: 4,
    reviewCount: 234,
    discount: 30,
    badges: [{ label: 'Free Shipping' }],
    seller: 'Rajesh Store',
  },
  {
    id: 'apple-airpods-max-2',
    name: 'Apple AirPods Max 2nd Generation',
    image: '/placeholder.svg',
    price: '\u20B959,900',
    rating: 5,
    reviewCount: 89,
    isNew: true,
    badges: [{ label: 'Free Shipping' }, { label: 'Free Gift' }],
    seller: 'Priya Electronics',
  },
  {
    id: 'jbl-tour-one-m2',
    name: 'JBL Tour One M2 Adaptive ANC',
    image: '/placeholder.svg',
    price: '\u20B914,999',
    originalPrice: '\u20B924,999',
    rating: 4,
    reviewCount: 567,
    discount: 40,
    badges: [{ label: 'In Stock' }],
    seller: 'Kumar Fashions',
  },
  {
    id: 'sennheiser-momentum-4',
    name: 'Sennheiser Momentum 4 Wireless',
    image: '/placeholder.svg',
    price: '\u20B927,990',
    rating: 5,
    reviewCount: 178,
    badges: [{ label: 'Free Shipping' }],
    seller: 'Anita Home Decor',
  },
  {
    id: 'boat-nirvana-751',
    name: 'boAt Nirvana 751 ANC Hybrid Wireless',
    image: '/placeholder.svg',
    price: '\u20B93,999',
    originalPrice: '\u20B94,999',
    rating: 4,
    reviewCount: 342,
    discount: 20,
    badges: [{ label: '\u20B949 Shipping', color: 'text-blue-600', bgColor: 'bg-blue-50' }],
    seller: 'Vikram Sports',
  },
];

/* ---------- Component ---------- */

interface ProductDetailProps {
  product: CatalogItem;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated, login } = useAuth();
  const addToCartMutation = useAddToCart();
  const { data: backendCart } = useActiveCart();
  const guestStore = useCartStore();

  const inWishlist = useIsInWishlist(product.id);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isAddingToCart = addToCartMutation.isPending;

  // Derived
  const brand = product.brandName ?? 'Sony';
  const rating = product.averageRating ?? 4.8;
  const reviewCount = product.reviewCount ?? 456;
  const discount = product.discount ?? 25;
  const price = product.price ?? 22490;
  const mrp = product.mrp ?? 29990;

  /* ---- Handlers ---- */

  const handleAddToCart = () => {
    if (isAuthenticated && backendCart?.id) {
      addToCartMutation.mutate(
        {
          cartId: backendCart.id,
          payload: { productId: product.id, quantity },
        },
        {
          onSuccess: () => {
            toast.success(`${product.name} added to cart`);
            setQuantity(1);
          },
          onError: () => toast.error('Failed to add item to cart'),
        },
      );
    } else {
      guestStore.addItem({
        id: product.id,
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        sku: '',
        quantity,
        unitPrice: price,
        mrp,
        totalPrice: price * quantity,
        currency: 'INR',
        inStock: product.inStock,
        maxQuantity: 10,
      });
      toast.success(`${product.name} added to cart`);
      setQuantity(1);
    }
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (inWishlist) {
      removeFromWishlist.mutate(product.id, {
        onSuccess: () => toast('Removed from wishlist'),
      });
    } else {
      addToWishlist.mutate(product.id, {
        onSuccess: () => toast.success('Added to wishlist'),
      });
    }
  };

  return (
    <>
      {/* ===== BREADCRUMB ===== */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList className="text-sm text-gray-500">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="transition hover:text-brand-500">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/products" className="transition hover:text-brand-500">Electronics</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/products" className="transition hover:text-brand-500">Headphones</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-navy-900">{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* ===== PRODUCT DETAIL ===== */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* LEFT: Image Gallery */}
            <ProductImageGallery
              images={GALLERY_IMAGES}
              discount={discount}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={inWishlist}
            />

            {/* RIGHT: Product Info */}
            <div>
              {/* Brand + SKU */}
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-sm font-semibold text-brand-600">
                  {brand}
                </span>
                <span className="text-xs text-gray-400">SKU: WH1000XM5-BLK</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-extrabold leading-tight text-navy-900 lg:text-3xl">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="mt-3 flex items-center gap-3">
                <RatingStars rating={rating} size="lg" />
                <span className="text-sm font-medium text-navy-900">{rating}</span>
                <a href="#reviews" className="text-sm text-gray-500 transition hover:text-brand-500">
                  ({reviewCount.toLocaleString()} Reviews)
                </a>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <Check className="h-3.5 w-3.5" />
                  2,341 Sold
                </span>
              </div>

              {/* Sold By Badge */}
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                  HB
                </div>
                <div>
                  <span className="text-xs text-gray-500">Sold by</span>
                  <span className="ml-1 text-sm font-semibold text-navy-900">HomeBase Marketplace</span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50 p-4">
                <PriceBadge
                  price={price}
                  originalPrice={mrp}
                  className="[&>span:first-child]:text-3xl [&>span:first-child]:font-extrabold"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Inclusive of all taxes. EMI starts at {'\u20B9'}1,874/month
                </p>
              </div>

              {/* Availability */}
              <div className="mt-4 flex items-center gap-4">
                <StatusBadge status="In Stock" variant="success" />
                <span className="text-xs text-gray-500">Only 12 left - order soon!</span>
              </div>

              {/* Divider */}
              <hr className="my-5 border-gray-100" />

              {/* Color Swatches */}
              <ColorSwatches colors={COLOR_OPTIONS} />

              {/* Variant Selector */}
              <VariantSelector label="Variant" options={VARIANT_OPTIONS} />

              {/* Quantity */}
              <ProductQuantitySelector value={quantity} onChange={setQuantity} />

              {/* Action Buttons */}
              <div className="mb-5 flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-brand-600 disabled:opacity-60"
                >
                  {isAddingToCart ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button className="flex-1 rounded-xl bg-navy-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-navy-700">
                  Buy Now
                </button>
              </div>

              {/* Secondary Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleWishlistToggle}
                  className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-red-500"
                >
                  <Heart className="h-5 w-5" fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
                <span className="text-gray-200">|</span>
                <button className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-brand-500">
                  <Share2 className="h-5 w-5" strokeWidth={1.5} />
                  Share
                </button>
                <span className="text-gray-200">|</span>
                <button className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-brand-500">
                  <ArrowLeftRight className="h-5 w-5" strokeWidth={1.5} />
                  Compare
                </button>
              </div>

              {/* Divider */}
              <hr className="my-5 border-gray-100" />

              {/* Delivery Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Free Delivery</p>
                    <p className="text-xs text-gray-500">
                      Estimated delivery: <strong className="text-navy-900">Apr 1 - Apr 3</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <RotateCcw className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Easy Returns</p>
                    <p className="text-xs text-gray-500">30-day return & exchange policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                    <Shield className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">1 Year Warranty</p>
                    <p className="text-xs text-gray-500">Official Sony manufacturer warranty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT TABS ===== */}
      <ProductTabs
        description="The Sony WH-1000XM5 delivers an unprecedented noise cancellation experience with two processors controlling 8 microphones. Auto NC Optimizer automatically detects your surrounding environment and optimizes noise cancellation accordingly. With the integrated V1 processor, wind noise reduction has been dramatically improved compared to the previous model."
        featureHighlights={FEATURE_HIGHLIGHTS}
        keyFeatures={KEY_FEATURES}
        specifications={SPECIFICATIONS}
        averageRating={rating}
        totalReviews={reviewCount}
        ratingBreakdown={RATING_BREAKDOWN}
        reviews={MOCK_REVIEWS}
      />

      {/* ===== RELATED PRODUCTS ===== */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy-900">You May Also Like</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-brand-500 hover:underline"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {RELATED_PRODUCTS.map((rp) => (
              <ProductCard
                key={rp.id}
                id={rp.id}
                name={rp.name}
                image={rp.image}
                price={rp.price}
                originalPrice={rp.originalPrice}
                rating={rp.rating}
                reviewCount={rp.reviewCount}
                discount={rp.discount}
                isNew={rp.isNew}
                badges={rp.badges}
                seller={rp.seller}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== MOBILE STICKY BAR ===== */}
      <div className="fixed bottom-14 left-0 right-0 z-40 border-t bg-white p-3 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-brand-600">{'\u20B9'}{price.toLocaleString('en-IN')}</span>
            {mrp > price && (
              <span className="text-xs text-gray-400 line-through">{'\u20B9'}{mrp.toLocaleString('en-IN')}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {isAddingToCart ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-1 h-4 w-4" />
            )}
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </>
  );
}
