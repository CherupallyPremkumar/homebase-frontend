# Performance Budget & Optimization Strategy

This document defines the performance budgets, optimization strategies, and monitoring
requirements for the HomeBase frontend application.

---

## 1. Core Web Vitals Targets

All public-facing pages must meet the following thresholds measured at the 75th percentile
on mobile (Moto G Power on 4G):

| Metric | Target | Poor Threshold | Notes |
|--------|--------|----------------|-------|
| **LCP** (Largest Contentful Paint) | < 2.5s | > 4.0s | Measures perceived load speed |
| **FID** (First Input Delay) | < 100ms | > 300ms | Measures interactivity |
| **CLS** (Cumulative Layout Shift) | < 0.1 | > 0.25 | Measures visual stability |
| **INP** (Interaction to Next Paint) | < 200ms | > 500ms | Replaces FID as primary responsiveness metric |
| **TTFB** (Time to First Byte) | < 800ms | > 1800ms | Measures server response time |

### Targets by Page Type

| Page | LCP | INP | CLS |
|------|-----|-----|-----|
| Storefront Home | < 2.0s | < 150ms | < 0.05 |
| Product Listing | < 2.5s | < 200ms | < 0.1 |
| Product Detail | < 2.5s | < 200ms | < 0.05 |
| Search Results | < 2.5s | < 200ms | < 0.1 |
| Cart / Checkout | < 2.0s | < 100ms | < 0.05 |
| Seller Dashboard | < 3.0s | < 200ms | < 0.1 |
| Admin Pages | < 3.0s | < 200ms | < 0.1 |

---

## 2. Bundle Size Budgets

All sizes are **gzipped transfer size** as measured by `next build` output and webpack
bundle analyzer.

### Per-Page JavaScript Budgets

| Page Type | Max JS (gzipped) | Rationale |
|-----------|-------------------|-----------|
| Storefront Home | 150 KB | Hero, featured products, carousels |
| Product Listing | 120 KB | Grid, filters, pagination |
| Product Detail | 130 KB | Image gallery, reviews, add-to-cart |
| Search Results | 120 KB | Search bar, filters, results grid |
| Cart | 100 KB | Cart items, quantity controls |
| Checkout | 110 KB | Form validation, payment integration |
| Seller Dashboard | 180 KB | Charts, data tables, analytics |
| Warehouse Dashboard | 160 KB | Inventory tables, bulk actions |
| Admin Pages | 200 KB | Full management UI, data grids |

### Per-Page CSS Budgets

| Page Type | Max CSS (gzipped) |
|-----------|-------------------|
| Storefront Home | 100 KB |
| Product Listing | 60 KB |
| Product Detail | 70 KB |
| Seller Dashboard | 80 KB |
| Admin Pages | 90 KB |

### Shared Bundle Budget

| Bundle | Max Size (gzipped) |
|--------|-------------------|
| Total shared/common chunk | 100 KB |
| React + React DOM | 45 KB |
| Next.js runtime | 30 KB |
| UI component library (shared) | 25 KB |

### Enforcement

- `next build` output is checked in CI against these budgets.
- Any PR that exceeds a page budget by more than 5% must include a justification or
  an optimization to offset the increase.
- Use `@next/bundle-analyzer` to inspect bundle composition before merge.

---

## 3. Image Optimization

### Format and Size Limits

| Image Type | Format | Max File Size | Dimensions | Notes |
|------------|--------|---------------|------------|-------|
| Product images | WebP | 200 KB | 800x800 max | Lazy load below fold |
| Hero banners | WebP | 300 KB | 1920x600 max | Priority load, above fold |
| Category thumbnails | WebP | 30 KB | 200x200 | Lazy load |
| Product thumbnails | WebP | 10 KB | 64x64 | Inline in listings |
| User avatars | WebP | 5 KB | 40x40 | Small, cached aggressively |
| Seller logos | WebP | 20 KB | 120x120 | Lazy load |

### Next.js Image Configuration

All images must use the `next/image` component with the following conventions:

```tsx
// Above-fold hero image -- priority load, blur placeholder
<Image
  src={heroUrl}
  alt="Descriptive alt text"
  width={1920}
  height={600}
  priority
  placeholder="blur"
  blurDataURL={heroBlurHash}
/>

// Below-fold product image -- lazy load, blur placeholder
<Image
  src={productImageUrl}
  alt={product.name}
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL={productBlurHash}
  sizes="(max-width: 768px) 50vw, 25vw"
/>

// Thumbnail -- small, inline
<Image
  src={thumbnailUrl}
  alt={product.name}
  width={64}
  height={64}
  loading="lazy"
/>
```

### Responsive Sizes

Use the `sizes` attribute to serve appropriately sized images:

```
Hero:       sizes="100vw"
Product:    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
Thumbnail:  sizes="64px"
Avatar:     sizes="40px"
```

### Blur Placeholders

- Generate base64 blur hashes at upload time (server-side).
- Store blur hashes alongside image URLs in the product data.
- Pass as `blurDataURL` to `next/image`.

---

## 4. Loading Strategy

### Above the Fold

Content visible on initial page load without scrolling must be rendered on the server.
No loading skeletons should appear for above-fold content.

| Page | Above-Fold Content | Rendering |
|------|--------------------|-----------|
| Home | Hero banner, featured categories | SSR or ISR |
| Product Listing | Search bar, first row of products, filters | SSR or ISR |
| Product Detail | Product image, title, price, add-to-cart | SSR or ISR |
| Search Results | Search bar, first row of results | SSR |
| Cart | Cart items summary | SSR |

### Below the Fold

Content below the initial viewport is lazy loaded using Intersection Observer.

```tsx
// Lazy load a section when it enters the viewport
const ProductReviews = lazy(() => import('./ProductReviews'));

function ProductPage() {
  return (
    <>
      {/* Above fold -- server rendered */}
      <ProductHero />
      <ProductInfo />
      <AddToCart />

      {/* Below fold -- lazy loaded */}
      <LazySection>
        <Suspense fallback={<ReviewsSkeleton />}>
          <ProductReviews />
        </Suspense>
      </LazySection>

      <LazySection>
        <Suspense fallback={<RecommendationsSkeleton />}>
          <RelatedProducts />
        </Suspense>
      </LazySection>
    </>
  );
}
```

### Dynamic Imports

Heavy components that are not needed on initial render must use `next/dynamic`:

| Component | Trigger | Loading Fallback |
|-----------|---------|------------------|
| Charts (recharts) | Seller dashboard page load | Chart skeleton |
| Rich text editor | "Edit description" click | Spinner |
| Image zoom/gallery | Product detail below fold | Image skeleton |
| Data export (CSV) | "Export" button click | None (background) |
| Date range picker | Filter interaction | Inline spinner |

```tsx
import dynamic from 'next/dynamic';

const SalesChart = dynamic(() => import('@/components/charts/SalesChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const RichTextEditor = dynamic(
  () => import('@/components/editor/RichTextEditor'),
  { ssr: false }
);
```

### Modals and Dialogs

All modals and dialogs are lazy loaded on trigger (button click, route change):

```tsx
const ConfirmDialog = dynamic(() => import('@/components/dialogs/ConfirmDialog'));
const ProductQuickView = dynamic(() => import('@/components/products/QuickView'));
```

### Images Below Fold

All images below the initial viewport must use `loading="lazy"`:

```tsx
<Image src={url} alt={alt} width={w} height={h} loading="lazy" />
```

The browser's native lazy loading handles viewport detection. For components that
contain multiple images (e.g., product grids), the grid container itself should be
lazy loaded via Intersection Observer.

---

## 5. Caching Strategy

### Page-Level Caching (ISR / SSR)

| Page Type | Strategy | Revalidation | Notes |
|-----------|----------|--------------|-------|
| Storefront Home | ISR | 60 seconds | Balances freshness with performance |
| Category Pages | ISR | 60 seconds | Product listings update frequently |
| Product Detail | ISR | 120 seconds | Less volatile than listings |
| Search Results | SSR | No cache | Query-dependent, always fresh |
| Static Pages (about, terms) | SSG | Build time | Rarely changes |
| Cart | SSR | No cache | User-specific, always fresh |
| Checkout | SSR | No cache | User-specific, always fresh |
| Seller Dashboard | CSR | N/A | Authenticated, client-rendered |
| Admin Pages | CSR | N/A | Authenticated, client-rendered |

### Client-Side Data Caching (React Query / SWR)

| Data Type | staleTime | cacheTime | Refetch Strategy |
|-----------|-----------|-----------|------------------|
| Product listings | 30s | 5 min | Refetch on window focus |
| Product detail | 60s | 10 min | Refetch on window focus |
| Cart contents | 0 (always fresh) | 5 min | Refetch on mutation |
| Orders list | 0 (always fresh) | 5 min | Refetch on window focus |
| Inventory data | 0 (always fresh) | 5 min | Refetch on window focus |
| Seller analytics | 30s | 10 min | Refetch on window focus |
| Category tree | 5 min | 30 min | Refetch on mount |
| User profile | 60s | 10 min | Refetch on mutation |
| Notifications | 10s | 5 min | Polling every 30s |

### API Response Caching

React Query is configured with per-endpoint staleTime values:

```tsx
// queryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,       // 30s default
      gcTime: 5 * 60 * 1000,      // 5 min garbage collection
      refetchOnWindowFocus: true,
      retry: 2,
    },
  },
});

// Per-endpoint override
useQuery({
  queryKey: ['orders'],
  queryFn: fetchOrders,
  staleTime: 0,                    // Always fresh for orders
});

useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
  staleTime: 5 * 60 * 1000,       // 5 min for stable data
});
```

### Browser Caching Headers

Static assets served with appropriate Cache-Control headers:

| Asset Type | Cache-Control |
|------------|---------------|
| JS/CSS bundles (hashed) | `public, max-age=31536000, immutable` |
| Images (hashed) | `public, max-age=31536000, immutable` |
| HTML pages | `public, max-age=0, must-revalidate` |
| Fonts | `public, max-age=31536000, immutable` |
| API responses | `private, no-cache` |

---

## 6. API Performance

### Parallel Requests

When a page requires multiple independent API calls, use `Promise.allSettled` to
fetch them in parallel rather than sequentially:

```tsx
// Page data loader -- parallel fetches
async function getProductPageData(productId: string) {
  const [productResult, reviewsResult, relatedResult] = await Promise.allSettled([
    fetchProduct(productId),
    fetchReviews(productId),
    fetchRelatedProducts(productId),
  ]);

  return {
    product: productResult.status === 'fulfilled' ? productResult.value : null,
    reviews: reviewsResult.status === 'fulfilled' ? reviewsResult.value : [],
    related: relatedResult.status === 'fulfilled' ? relatedResult.value : [],
  };
}
```

### Request Deduplication

The shared `HttpClient` service already deduplicates identical in-flight requests.
If two components request the same endpoint simultaneously, only one network call is
made. No additional configuration is required -- this is built into the client.

### Abort on Navigation

Use `AbortController` to cancel in-flight requests when the user navigates away:

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetchData({ signal: controller.signal })
    .then(setData)
    .catch((err) => {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    });

  return () => controller.abort();
}, [dependency]);
```

React Query handles this automatically when queries are unmounted.

### Timeouts

| Request Type | Timeout |
|--------------|---------|
| Standard API calls | 5 seconds |
| File uploads | 10 seconds |
| Image uploads | 10 seconds |
| Report generation | 15 seconds |
| Search (autocomplete) | 2 seconds |

```tsx
// HttpClient timeout configuration
const httpClient = new HttpClient({
  timeout: 5000, // 5s default
});

// Per-request override for uploads
httpClient.post('/api/uploads', formData, {
  timeout: 10000, // 10s for uploads
});
```

### Prefetching

Prefetch data for likely next navigations:

| Current Page | Prefetch Target | Trigger |
|--------------|-----------------|---------|
| Product Listing | Product Detail | Hover on product card (200ms delay) |
| Cart | Checkout data | Cart page load |
| Category nav | Category products | Hover on category link |

```tsx
// Prefetch on hover
function ProductCard({ product }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['product', product.id],
      queryFn: () => fetchProduct(product.id),
      staleTime: 60 * 1000,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} onMouseEnter={handleMouseEnter}>
      {/* ... */}
    </Link>
  );
}
```

---

## 7. Monitoring

### Lighthouse CI

Run Lighthouse in the CI/CD pipeline on every PR that touches frontend code:

| Metric | Minimum Score |
|--------|---------------|
| Performance | 90 |
| Accessibility | 95 |
| Best Practices | 95 |
| SEO | 95 |

Configuration (`.lighthouserc.js`):

```js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/products',
        'http://localhost:3000/products/sample-product-123',
        'http://localhost:3000/categories/electronics',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Real User Monitoring (RUM)

Use the `web-vitals` library to capture Core Web Vitals from real users:

```tsx
// lib/analytics/web-vitals.ts
import { onLCP, onFID, onCLS, onINP, onTTFB } from 'web-vitals';

type MetricPayload = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  page: string;
};

function sendMetric(metric: MetricPayload) {
  // Send to analytics endpoint
  navigator.sendBeacon('/api/analytics/vitals', JSON.stringify(metric));
}

export function reportWebVitals() {
  onLCP((metric) => sendMetric({
    name: 'LCP',
    value: metric.value,
    rating: metric.rating,
    page: window.location.pathname,
  }));
  onFID((metric) => sendMetric({
    name: 'FID',
    value: metric.value,
    rating: metric.rating,
    page: window.location.pathname,
  }));
  onCLS((metric) => sendMetric({
    name: 'CLS',
    value: metric.value,
    rating: metric.rating,
    page: window.location.pathname,
  }));
  onINP((metric) => sendMetric({
    name: 'INP',
    value: metric.value,
    rating: metric.rating,
    page: window.location.pathname,
  }));
  onTTFB((metric) => sendMetric({
    name: 'TTFB',
    value: metric.value,
    rating: metric.rating,
    page: window.location.pathname,
  }));
}
```

### Error Tracking (Sentry)

Sentry is configured to capture:

- JavaScript runtime errors
- Unhandled promise rejections
- API call failures (non-4xx)
- Performance transactions for key user flows

```tsx
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENV,
  tracesSampleRate: 0.1,         // 10% of transactions
  replaysSessionSampleRate: 0.01, // 1% of sessions
  replaysOnErrorSampleRate: 1.0,  // 100% of error sessions
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
});
```

### Bundle Size Tracking

Track bundle sizes over time to detect regressions:

- Run `@next/bundle-analyzer` in CI on every build.
- Store build output sizes in a tracking spreadsheet or dashboard.
- Alert when any page budget is exceeded by more than 10%.
- Include bundle size diff in PR comments via CI bot.

### Performance Dashboard

Maintain a performance dashboard that tracks:

| Metric | Source | Frequency |
|--------|--------|-----------|
| Core Web Vitals (p75) | RUM / web-vitals | Real-time |
| Lighthouse scores | CI pipeline | Per PR |
| Bundle sizes | Build output | Per build |
| API response times (p95) | Server logs | Real-time |
| Error rate | Sentry | Real-time |
| Cache hit ratio | CDN logs | Hourly |

---

## 8. Performance Checklist for PRs

Before merging any frontend PR, verify:

- [ ] No new render-blocking resources introduced
- [ ] Images use `next/image` with appropriate `sizes` and `loading` attributes
- [ ] Heavy components use `next/dynamic` or `React.lazy`
- [ ] No unnecessary re-renders (check with React DevTools Profiler)
- [ ] Bundle size for affected pages stays within budget
- [ ] API calls use appropriate caching (staleTime configured)
- [ ] No layout shifts caused by dynamic content without reserved space
- [ ] Lighthouse scores meet minimum thresholds
