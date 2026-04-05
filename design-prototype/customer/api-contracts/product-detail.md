# Product Detail — API Contract

## Page: product-detail.html

**Note:** Product retrieve uses Chenile Command GET pattern with `GenericResponse<StateEntityServiceResponse<Product>>` wrapper. Reviews use Chenile Query. Related products use standard REST GET.

---

## Section 1: Product Info (Main)

**Data needed:** Full product details, variants, images, pricing, seller info, availability
**API:** `GET /api/product/{id}`
**Fetch/XHR name:** `product/{id}`

**Path Params:**
- `id` — product ID or slug, e.g. `sony-wh-1000xm5`

**Response:**
```json
{
  "id": "prod-201",
  "name": "Sony WH-1000XM5 Wireless Industry Leading Noise Cancelling Headphones",
  "slug": "sony-wh-1000xm5",
  "sku": "WH1000XM5-BLK",
  "brand": "Sony",
  "category": { "id": "cat-003", "name": "Headphones", "slug": "headphones" },
  "price": 22490,
  "originalPrice": 29990,
  "discountPercent": 25,
  "currency": "INR",
  "emiStartsAt": 1874,
  "rating": 4.8,
  "reviewCount": 456,
  "unitsSold": 2341,
  "inStock": true,
  "stockQuantity": 12,
  "images": [
    { "id": "img-1", "url": "/images/products/sony-xm5-1.jpg", "alt": "Front view", "isPrimary": true },
    { "id": "img-2", "url": "/images/products/sony-xm5-2.jpg", "alt": "Side view" },
    { "id": "img-3", "url": "/images/products/sony-xm5-3.jpg", "alt": "Detail view" },
    { "id": "img-4", "url": "/images/products/sony-xm5-4.jpg", "alt": "In use" },
    { "id": "img-5", "url": "/images/products/sony-xm5-5.jpg", "alt": "Box contents" }
  ],
  "colors": [
    { "name": "Midnight Black", "hex": "#111827", "sku": "WH1000XM5-BLK", "inStock": true },
    { "name": "Platinum Silver", "hex": "#9CA3AF", "sku": "WH1000XM5-SLV", "inStock": true },
    { "name": "Deep Blue", "hex": "#1E40AF", "sku": "WH1000XM5-BLU", "inStock": true },
    { "name": "Burgundy Red", "hex": "#991B1B", "sku": "WH1000XM5-RED", "inStock": false }
  ],
  "variants": [
    { "name": "Standard", "priceAdjustment": 0, "inStock": true },
    { "name": "With Case", "priceAdjustment": 1500, "inStock": true },
    { "name": "Bundle Pack", "priceAdjustment": 3500, "inStock": true }
  ],
  "seller": {
    "id": "seller-hb",
    "name": "HomeBase Marketplace",
    "avatar": "HB",
    "rating": 4.7
  },
  "delivery": {
    "freeShipping": true,
    "estimatedDelivery": { "from": "2026-04-01", "to": "2026-04-03" },
    "returnPolicy": "30-day return & exchange policy",
    "warranty": "1 Year Warranty — Official Sony manufacturer warranty"
  },
  "description": "<p>The Sony WH-1000XM5 delivers unprecedented noise cancellation...</p>",
  "features": [
    "Industry-leading noise cancellation with Auto NC Optimizer",
    "Exceptional call quality with AI-powered noise reduction",
    "Multipoint connection - connect to 2 devices simultaneously",
    "Touch controls and Speak-to-Chat auto-pause feature",
    "Lightweight design at 250g with premium soft-fit leather"
  ],
  "specifications": {
    "General": [
      { "label": "Brand", "value": "Sony" },
      { "label": "Model", "value": "WH-1000XM5" },
      { "label": "Type", "value": "Over-Ear, Wireless" },
      { "label": "Weight", "value": "250g" }
    ],
    "Audio": [
      { "label": "Driver Size", "value": "30mm" },
      { "label": "Frequency Response", "value": "4Hz - 40,000Hz" },
      { "label": "Noise Cancellation", "value": "Yes, Active (ANC)" },
      { "label": "Microphones", "value": "8 microphones + 2 processors" }
    ],
    "Connectivity": [
      { "label": "Bluetooth", "value": "5.2" },
      { "label": "Multipoint", "value": "Yes (2 devices)" },
      { "label": "Codecs", "value": "LDAC, AAC, SBC" }
    ],
    "Battery": [
      { "label": "Battery Life", "value": "Up to 30 hours" },
      { "label": "Quick Charge", "value": "3 min charge = 3 hours playback" },
      { "label": "Charging Port", "value": "USB-C" }
    ]
  },
  "breadcrumbs": [
    { "name": "Home", "url": "/" },
    { "name": "Electronics", "url": "/products?category=electronics" },
    { "name": "Headphones", "url": "/products?category=headphones" },
    { "name": "Sony WH-1000XM5", "url": null }
  ]
}
```

---

## Section 2: Product Reviews

**Data needed:** Reviews with rating breakdown, pagination
**API:** `GET /api/catalog/products/{id}/reviews`

**Query Params:**
- `page` — page number (default 1)
- `pageSize` — reviews per page (default 5)
- `sortBy` — `newest`, `helpful`, `rating_high`, `rating_low`
- `rating` — filter by star rating (1-5)

**Response:**
```json
{
  "summary": {
    "averageRating": 4.8,
    "totalReviews": 456,
    "breakdown": [
      { "stars": 5, "count": 312, "percentage": 68 },
      { "stars": 4, "count": 98, "percentage": 22 },
      { "stars": 3, "count": 28, "percentage": 6 },
      { "stars": 2, "count": 12, "percentage": 3 },
      { "stars": 1, "count": 6, "percentage": 1 }
    ]
  },
  "list": [
    {
      "row": {
        "id": "rev-001",
        "author": "Priya M.",
        "avatar": "PM",
        "rating": 5,
        "title": "Best headphones I've ever owned!",
        "body": "The noise cancellation is absolutely phenomenal...",
        "verifiedPurchase": true,
        "createdTime": "2026-03-15T10:30:00Z",
        "helpfulCount": 24,
        "images": ["/images/reviews/rev-001-1.jpg"]
      }
    }
  ],
  "totalCount": 456,
  "numRowsInPage": 5,
  "currentPage": 1,
  "totalPages": 92
}
```

---

## Section 3: Related Products

**Data needed:** Similar or frequently bought together products
**API:** `GET /api/catalog/products/{id}/related?pageSize=5`

**Response:**
```json
{
  "products": [
    {
      "id": "prod-301",
      "name": "Bose QuietComfort Ultra Headphones",
      "image": "/images/products/bose-qc.jpg",
      "price": 24990,
      "originalPrice": 32990,
      "discountPercent": 24,
      "rating": 4.7,
      "reviewCount": 289,
      "inStock": true
    }
  ]
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Product Info | `/api/product/{id}` | GET (Command Retrieve) | 60s |
| 2 | Reviews | `/api/catalog/products/{id}/reviews` | GET | 30s |
| 3 | Related Products | `/api/catalog/products/{id}/related` | GET | 60s |

**Total API calls on page load: 3 (parallel)**

---

## User Actions

### Action: Add to Cart
**Trigger:** User clicks "Add to Cart" button
**API:** `POST /api/cart/items`
```json
{
  "productId": "prod-201",
  "quantity": 1,
  "color": "Midnight Black",
  "variant": "Standard"
}
```
**Response:** `201 Created`
```json
{
  "cartItemId": "ci-001",
  "productId": "prod-201",
  "quantity": 1,
  "price": 22490,
  "cartTotal": 25989,
  "cartItemCount": 4
}
```

### Action: Buy Now
**Trigger:** User clicks "Buy Now" button
**API:** `POST /api/cart/items` (same as add to cart) then redirect to `/checkout`

### Action: Add to Wishlist
**API:** `POST /api/wishlist/items`
```json
{ "productId": "prod-201" }
```

### Action: Change Color Variant
**Trigger:** User clicks a color swatch
**API:** No API call — variant data already in product response; update selected SKU client-side

### Action: Change Quantity
**Trigger:** User clicks +/- buttons
**API:** No API call — client-side state change before add to cart

### Action: Submit Review
**API:** `POST /api/catalog/products/{id}/reviews`
```json
{
  "rating": 5,
  "title": "Amazing product!",
  "body": "Exceeded my expectations in every way...",
  "images": ["/uploads/review-img-1.jpg"]
}
```
**Response:** `201 Created`

### Action: Mark Review Helpful
**API:** `POST /api/catalog/reviews/{reviewId}/helpful`
**Response:** `200 OK`
```json
{ "helpfulCount": 25 }
```

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function ProductDetail({ params }) {
  const [product, reviews, related] = await Promise.allSettled([
    catalogApi.product(params.id),
    catalogApi.productReviews(params.id, { page: 1, pageSize: 5 }),
    catalogApi.productRelated(params.id, { pageSize: 5 }),
  ]);

  return (
    <>
      <Breadcrumb items={product.breadcrumbs} />
      <ProductGallery images={product.images} />
      <ProductInfo product={product} />
      <ProductTabs description={product.description}
        specifications={product.specifications}
        reviews={reviews} />
      <RelatedProducts products={related} />
    </>
  );
}
```
