# SEO Specification

This document defines the SEO requirements for all public-facing pages of the HomeBase
frontend application, including meta tags, structured data, sitemap generation, URL
structure, and technical SEO considerations.

---

## 1. Meta Tags Per Page

Every customer-facing page must include the following meta tags in the `<head>` section,
managed via Next.js `metadata` exports or `generateMetadata` functions.

### Required Tags

| Tag | Purpose | Constraints |
|-----|---------|-------------|
| `<title>` | Browser tab and search result title | 50-60 characters |
| `<meta name="description">` | Search result snippet | 120-160 characters |
| `<link rel="canonical">` | Canonical URL to prevent duplicates | Absolute URL |
| `<meta property="og:title">` | Social share title | Same as title or shorter |
| `<meta property="og:description">` | Social share description | Same as meta description |
| `<meta property="og:image">` | Social share image | 1200x630 recommended |
| `<meta property="og:type">` | Content type for Open Graph | website, product, etc. |
| `<meta property="og:url">` | Canonical URL for Open Graph | Absolute URL |
| `<meta name="twitter:card">` | Twitter card type | summary_large_image |
| `<meta name="twitter:title">` | Twitter share title | Same as og:title |
| `<meta name="twitter:description">` | Twitter share description | Same as og:description |

### Page-Specific Meta Tag Templates

#### Home Page

```
title: "HomeBase -- Shop Online | Best Deals on Electronics, Fashion & More"
description: "Discover amazing deals on electronics, fashion, home & kitchen, and more at HomeBase. Fast delivery, secure payments, and trusted sellers."
og:type: "website"
og:image: "/images/og/homebase-home.jpg"
```

#### Product Detail Page

```
title: "{product.name} -- Buy Online at HomeBase | Rs.{price}"
description: "Buy {product.name} online at HomeBase for Rs.{price}. {product.shortDescription}. Free delivery available. Sold by {seller.name}."
og:type: "product"
og:image: "{product.primaryImage}"
```

#### Category Page

```
title: "Shop {category} Online at HomeBase | Best Prices & Fast Delivery"
description: "Browse {count}+ {category} products at HomeBase. Compare prices, read reviews, and buy online with fast delivery and easy returns."
og:type: "website"
og:image: "/images/og/category-{slug}.jpg"
```

#### Search Results Page

```
title: "Search Results for '{query}' -- HomeBase"
description: "Found {count} results for '{query}' at HomeBase. Compare products, prices, and reviews to find exactly what you need."
og:type: "website"
og:image: "/images/og/homebase-search.jpg"
```

#### Seller Storefront Page

```
title: "{seller.name} -- Official Store on HomeBase"
description: "Shop {seller.name}'s products on HomeBase. Browse {count}+ products with verified reviews, competitive prices, and fast delivery."
og:type: "profile"
og:image: "{seller.logo}"
```

#### Static Pages (About, Terms, Contact)

```
title: "{pageName} -- HomeBase"
description: "{page-specific description, 120-160 characters}"
og:type: "website"
og:image: "/images/og/homebase-default.jpg"
```

### Implementation Pattern

```tsx
// app/products/[slug]/page.tsx
import { Metadata } from 'next';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProduct(params.slug);
  const price = formatCurrency(product.price);

  return {
    title: `${product.name} -- Buy Online at HomeBase | ${price}`,
    description: `Buy ${product.name} online at HomeBase for ${price}. ${product.shortDescription}`,
    alternates: {
      canonical: `https://homebase.com/products/${params.slug}`,
    },
    openGraph: {
      title: `${product.name} -- Buy Online at HomeBase`,
      description: product.shortDescription,
      url: `https://homebase.com/products/${params.slug}`,
      type: 'article',       // 'product' is not a standard og:type
      images: [
        {
          url: product.primaryImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} -- HomeBase`,
      description: product.shortDescription,
      images: [product.primaryImage],
    },
  };
}
```

### Pages That Must NOT Be Indexed

The following pages must include `<meta name="robots" content="noindex, nofollow">`:

- Cart (`/cart`)
- Checkout (`/checkout/*`)
- User profile (`/profile/*`)
- Order history (`/orders/*`)
- Seller dashboard (`/seller/*`)
- Warehouse dashboard (`/warehouse/*`)
- Admin pages (`/admin/*`)
- Login / Register (`/auth/*`)

---

## 2. Structured Data (JSON-LD)

Structured data is rendered as `<script type="application/ld+json">` in the page head.
All schemas must validate against Google's Rich Results Test.

### Home Page

```json
[
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HomeBase",
    "url": "https://homebase.com",
    "logo": "https://homebase.com/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://twitter.com/homebase",
      "https://facebook.com/homebase",
      "https://instagram.com/homebase"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HomeBase",
    "url": "https://homebase.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://homebase.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }
]
```

### Product Detail Page

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{product.name}",
  "image": ["{product.image1}", "{product.image2}"],
  "description": "{product.description}",
  "sku": "{product.sku}",
  "brand": {
    "@type": "Brand",
    "name": "{product.brand}"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://homebase.com/products/{slug}",
    "priceCurrency": "INR",
    "price": "{product.price}",
    "priceValidUntil": "{validUntilDate}",
    "availability": "https://schema.org/{InStock|OutOfStock}",
    "seller": {
      "@type": "Organization",
      "name": "{seller.name}"
    },
    "itemCondition": "https://schema.org/NewCondition"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{product.averageRating}",
    "reviewCount": "{product.reviewCount}",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "{review.rating}",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "{review.author}"
      },
      "reviewBody": "{review.body}",
      "datePublished": "{review.date}"
    }
  ]
}
```

### Category / Product Listing Page

```json
[
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "{category.name}",
    "numberOfItems": "{totalProducts}",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://homebase.com/products/{product1.slug}"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "url": "https://homebase.com/products/{product2.slug}"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://homebase.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "{parentCategory.name}",
        "item": "https://homebase.com/categories/{parentCategory.slug}"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "{category.name}",
        "item": "https://homebase.com/categories/{category.slug}"
      }
    ]
  }
]
```

### Cart Page

No structured data. Cart is a private, user-specific page.

### Seller Storefront Page

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{seller.name}",
  "url": "https://homebase.com/sellers/{seller.slug}",
  "logo": "{seller.logo}",
  "description": "{seller.description}"
}
```

### Implementation Pattern

```tsx
// components/seo/JsonLd.tsx
type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage in a page
export default function ProductPage({ product }) {
  const jsonLd = buildProductJsonLd(product);

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductContent product={product} />
    </>
  );
}
```

---

## 3. Sitemap

### Dynamic Generation

The sitemap is generated dynamically using Next.js App Router's `sitemap.ts` convention.

```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProductSlugs();
  const categories = await fetchAllCategorySlugs();

  const productUrls = products.map((product) => ({
    url: `https://homebase.com/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((category) => ({
    url: `https://homebase.com/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticPages = [
    { url: 'https://homebase.com', changeFrequency: 'daily' as const, priority: 1.0 },
    { url: 'https://homebase.com/about', changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: 'https://homebase.com/contact', changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: 'https://homebase.com/terms', changeFrequency: 'yearly' as const, priority: 0.1 },
    { url: 'https://homebase.com/privacy', changeFrequency: 'yearly' as const, priority: 0.1 },
  ];

  return [...staticPages, ...categoryUrls, ...productUrls];
}
```

### Included Pages

| Page Type | URL Pattern | Change Frequency | Priority |
|-----------|-------------|------------------|----------|
| Home | `/` | daily | 1.0 |
| Product pages | `/products/{slug}-{id}` | daily | 0.8 |
| Category pages | `/categories/{slug}` | weekly | 0.7 |
| Static pages (about, contact) | `/{page}` | monthly | 0.3 |
| Legal pages (terms, privacy) | `/{page}` | yearly | 0.1 |

### Excluded Pages

The following pages must NOT appear in the sitemap:

- `/cart`
- `/checkout/*`
- `/profile/*`
- `/orders/*`
- `/seller/*` (seller dashboard)
- `/warehouse/*`
- `/admin/*`
- `/auth/*`
- `/api/*`

### Sitemap Index

For large catalogs (10,000+ products), use a sitemap index with multiple sitemap files:

```
/sitemap.xml          --> Sitemap index
/sitemap-static.xml   --> Static pages
/sitemap-categories.xml --> Category pages
/sitemap-products-0.xml --> Products 0-10000
/sitemap-products-1.xml --> Products 10001-20000
```

### Update Frequency

- Product pages: Regenerated daily (prices, availability change)
- Category pages: Regenerated weekly
- Static pages: Regenerated at build time

---

## 4. Robots.txt

```tsx
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products/',
          '/categories/',
          '/search',
          '/about',
          '/contact',
        ],
        disallow: [
          '/cart',
          '/checkout',
          '/profile',
          '/orders',
          '/seller',
          '/warehouse',
          '/admin',
          '/auth',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://homebase.com/sitemap.xml',
  };
}
```

This generates the following `robots.txt`:

```
User-agent: *
Allow: /
Allow: /products/
Allow: /categories/
Allow: /search
Allow: /about
Allow: /contact
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /orders
Disallow: /seller
Disallow: /warehouse
Disallow: /admin
Disallow: /auth
Disallow: /api/
Sitemap: https://homebase.com/sitemap.xml
```

---

## 5. URL Structure

### Public Page URLs

| Page | URL Pattern | Example |
|------|-------------|---------|
| Home | `/` | `https://homebase.com/` |
| Product Detail | `/products/{slug}-{id}` | `/products/samsung-galaxy-s24-ultra-12345` |
| Category | `/categories/{slug}` | `/categories/electronics` |
| Subcategory | `/categories/{parent}/{slug}` | `/categories/electronics/smartphones` |
| Search | `/search?q={query}` | `/search?q=wireless+headphones` |
| Search + Filters | `/search?q={query}&category={slug}&minPrice={n}` | `/search?q=headphones&category=electronics&minPrice=500` |
| Seller Products | `/products?seller={slug}` | `/products?seller=samsung-official` |
| About | `/about` | `https://homebase.com/about` |
| Contact | `/contact` | `https://homebase.com/contact` |

### URL Conventions

- **Slugs**: Lowercase, hyphen-separated, no special characters. Generated from the
  product or category name at creation time.
  - Example: "Samsung Galaxy S24 Ultra" becomes `samsung-galaxy-s24-ultra`
- **Product IDs in URLs**: Appended to slug for uniqueness (`{slug}-{id}`). The ID is
  extracted from the URL for data fetching; the slug is for readability and SEO.
- **Query parameters**: Used for search, filters, sorting, and pagination. Not used for
  identifying primary content.
- **Trailing slashes**: Not used. Redirect trailing slashes to non-trailing.
- **Case**: All lowercase. Redirect uppercase URLs to lowercase.

### Canonical URL Rules

- Every page has exactly one canonical URL.
- Paginated pages: `?page=1` canonicalizes to the base URL (no page parameter).
  `?page=2` and above are self-canonical.
- Filtered/sorted pages: Canonical URL excludes sort and filter parameters.
  Filters are for user convenience, not for indexing.
- Search pages: Self-canonical with the `q` parameter only.

```tsx
// Canonical URL generation
function getCanonicalUrl(path: string, params: URLSearchParams): string {
  const base = `https://homebase.com${path}`;

  // For search pages, include only 'q' parameter
  if (path === '/search') {
    const query = params.get('q');
    return query ? `${base}?q=${encodeURIComponent(query)}` : base;
  }

  // For paginated pages, exclude page=1
  const page = params.get('page');
  if (page && page !== '1') {
    return `${base}?page=${page}`;
  }

  return base;
}
```

### Redirects

| From | To | Status |
|------|----|--------|
| URLs with trailing slash | Same URL without trailing slash | 301 |
| Uppercase URLs | Lowercase equivalent | 301 |
| Old product URL format | New `/products/{slug}-{id}` format | 301 |
| `/product/{id}` (legacy) | `/products/{slug}-{id}` | 301 |

---

## 6. Performance for SEO

### Server-Side Rendering

All public-facing pages must be rendered on the server (SSR or ISR) so that search engine
crawlers receive fully rendered HTML:

| Page | Rendering Method | Reason |
|------|-----------------|--------|
| Home | ISR (revalidate 60s) | Frequently updated content |
| Product Detail | ISR (revalidate 120s) | Product data changes periodically |
| Category | ISR (revalidate 60s) | Product listings change frequently |
| Search | SSR | Query-dependent, not cacheable |
| Static (about, terms) | SSG | Content changes rarely |

### Critical Resource Loading

#### Font Preloading

Preload the primary font (Inter) to avoid FOIT (Flash of Invisible Text):

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',         // Show fallback font immediately
  preload: true,
});
```

#### API Domain Preconnect

Establish early connections to the API domain:

```html
<link rel="preconnect" href="https://api.homebase.com" />
<link rel="dns-prefetch" href="https://api.homebase.com" />
<link rel="preconnect" href="https://images.homebase.com" />
<link rel="dns-prefetch" href="https://images.homebase.com" />
```

#### No Render-Blocking Resources

- All CSS is loaded via Next.js built-in CSS handling (code-split per page).
- No external CSS files loaded via `<link>` in the head that could block rendering.
- JavaScript is deferred by default in Next.js (`<script defer>`).
- Third-party scripts (analytics, chat widgets) are loaded with `next/script`
  using the `afterInteractive` or `lazyOnload` strategy.

```tsx
import Script from 'next/script';

// Analytics -- loads after the page is interactive
<Script src="https://analytics.example.com/script.js" strategy="afterInteractive" />

// Chat widget -- loads when browser is idle
<Script src="https://chat.example.com/widget.js" strategy="lazyOnload" />
```

### Mobile-Friendly

- All pages are responsive and pass Google's Mobile-Friendly Test.
- Viewport meta tag is set: `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Touch targets are at least 48x48 CSS pixels.
- Text is readable without zooming (16px minimum body text).

### International SEO (Future)

When multi-language support is added:

- Use `hreflang` tags for language/region variants.
- Use locale-prefixed URLs: `/en/products/...`, `/hi/products/...`.
- Set `<html lang="en">` (or appropriate locale) on every page.

---

## 7. SEO Checklist for PRs

Before merging any PR that adds or modifies a public-facing page:

- [ ] Page has a unique, descriptive `<title>` tag (50-60 characters)
- [ ] Page has a `<meta name="description">` tag (120-160 characters)
- [ ] Page has a canonical URL set
- [ ] Open Graph tags are present (title, description, image, type)
- [ ] Twitter card tags are present
- [ ] Appropriate structured data (JSON-LD) is included and validates
- [ ] Page is server-rendered (SSR or ISR)
- [ ] Non-public pages have `noindex, nofollow` meta tag
- [ ] URLs follow the defined URL structure conventions
- [ ] Images have descriptive `alt` attributes
- [ ] Heading hierarchy is correct (single `h1`, logical `h2`-`h6` nesting)
- [ ] Internal links use descriptive anchor text (not "click here")
