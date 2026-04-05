# Storefront (Home Page) — API Contract

## Page: storefront.html

**Note:** Catalog browsing endpoints use standard REST GET with `GenericResponse` wrapper (lightweight, cacheable). The best sellers section uses Chenile's `SearchRequest/SearchResponse` pattern via POST for paginated product data.

---

## Section 1: Header — Seller Filter Dropdown

**Data needed:** List of sellers for the seller-scoped dropdown
**API:** `GET /api/catalog/sellers`

**Response:**
```json
{
  "sellers": [
    {
      "id": "seller-001",
      "slug": "rajesh",
      "name": "Rajesh Store",
      "avatar": "RS",
      "rating": 4.6,
      "productCount": 1234,
      "memberSince": 2024
    }
  ]
}
```

---

## Section 2: Hero Banners (Carousel)

**Data needed:** Active promotional banners with images, titles, CTA links
**API:** `GET /api/catalog/banners?placement=hero`

**Query Params:**
- `placement` — `hero`, `side`, `deal`

**Response:**
```json
{
  "banners": [
    {
      "id": "banner-001",
      "title": "Discover the Best Deals on Top Products",
      "subtitle": "Shop from thousands of sellers. Free shipping on orders over INR 999.",
      "badge": "SALE 40% OFF",
      "ctaText": "Shop Now",
      "ctaUrl": "/products?deal=flash-sale",
      "image": "/images/banners/hero-main.jpg",
      "position": "main",
      "priority": 1
    },
    {
      "id": "banner-002",
      "title": "Smart Watch Series 8",
      "subtitle": "Water Resistant, GPS",
      "badge": "New Arrival",
      "price": 24999,
      "ctaUrl": "/products/smart-watch-series-8",
      "position": "side-top",
      "priority": 1
    },
    {
      "id": "banner-003",
      "title": "Wireless Noise Cancelling Headphones Pro Max",
      "badge": "Best Seller",
      "price": 12499,
      "ctaUrl": "/products/headphones-pro-max",
      "position": "side-bottom",
      "priority": 1
    }
  ]
}
```

---

## Section 3: Hero Sidebar — Category Navigation

**Data needed:** Top-level categories with icons
**API:** `GET /api/catalog/categories?level=1`

**Query Params:**
- `level` — `1` (top-level only), omit for full tree

**Response:**
```json
{
  "categories": [
    {
      "id": "cat-001",
      "name": "Laptops",
      "slug": "laptops",
      "icon": "laptop",
      "productCount": 74
    },
    {
      "id": "cat-002",
      "name": "Smartphones",
      "slug": "smartphones",
      "icon": "smartphone",
      "productCount": 156
    },
    {
      "id": "cat-003",
      "name": "Headphones",
      "slug": "headphones",
      "icon": "headphones",
      "productCount": 42
    },
    {
      "id": "cat-004",
      "name": "Fashion",
      "slug": "fashion",
      "icon": "shirt",
      "productCount": 320
    },
    {
      "id": "cat-005",
      "name": "Home & Living",
      "slug": "home-living",
      "icon": "home",
      "productCount": 89
    },
    {
      "id": "cat-006",
      "name": "Sports",
      "slug": "sports",
      "icon": "sports",
      "productCount": 65
    },
    {
      "id": "cat-007",
      "name": "Cameras",
      "slug": "cameras",
      "icon": "camera",
      "productCount": 28
    },
    {
      "id": "cat-008",
      "name": "Gaming",
      "slug": "gaming",
      "icon": "gaming",
      "productCount": 52
    }
  ]
}
```

---

## Section 4: Deal of the Day (Flash Sale)

**Data needed:** Active flash sale with countdown timer and deal products
**API:** `GET /api/catalog/deals/active`

**Response:**
```json
{
  "deal": {
    "id": "deal-001",
    "title": "Flash Sale!",
    "subtitle": "Grab the best deals before they're gone. Limited stock available.",
    "endsAt": "2026-04-03T23:59:59Z",
    "products": [
      {
        "id": "prod-101",
        "name": "Pro Max Wireless Headphone",
        "image": "/images/products/headphone.jpg",
        "price": 4999,
        "originalPrice": 8999,
        "discountPercent": 40,
        "rating": 5.0,
        "reviewCount": 152,
        "sellerId": "seller-001"
      },
      {
        "id": "prod-102",
        "name": "Smart Phone 128GB OLED",
        "image": "/images/products/phone.jpg",
        "price": 18999,
        "originalPrice": 28999,
        "discountPercent": 35,
        "rating": 4.0,
        "reviewCount": 89,
        "sellerId": "seller-002"
      },
      {
        "id": "prod-103",
        "name": "Sport Water Resistance Watch",
        "image": "/images/products/watch.jpg",
        "price": 6499,
        "originalPrice": 12999,
        "discountPercent": 50,
        "rating": 5.0,
        "reviewCount": 203,
        "sellerId": "seller-005"
      }
    ]
  }
}
```

---

## Section 5: Best Sellers (Product Grid with Category Tabs — Chenile Query)

**Data needed:** Top-selling products, filterable by category tab
**API:** `POST /api/query/catalog-products`
**Fetch/XHR name:** `catalog-products`

**Request (SearchRequest):**
```json
{
  "queryName": "Catalog.bestSellers",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "unitsSold", "ascendingOrder": false }
  ],
  "filters": {
    "category": "",
    "sellerId": ""
  }
}
```

**Response (GenericResponse<SearchResponse>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "list": [
      {
        "row": {
          "id": "prod-001",
          "name": "MacBook Pro M3 14\" 512GB Space Gray",
          "image": "/images/products/macbook.jpg",
          "price": 149990,
          "originalPrice": null,
          "discountPercent": null,
          "rating": 5.0,
          "reviewCount": 312,
          "freeShipping": true,
          "inStock": true,
          "sellerId": "seller-001",
          "sellerName": "Rajesh Store"
        },
        "allowedActions": [
          { "allowedAction": "addToCart", "acls": "CUSTOMER" },
          { "allowedAction": "addToWishlist", "acls": "CUSTOMER" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 9,
    "maxRows": 89,
    "numRowsInPage": 10,
    "numRowsReturned": 10,
    "startRow": 1,
    "endRow": 10
  }
```

---

## Section 6: Cart Count Badge (Header)

**Data needed:** Current cart item count
**API:** `GET /api/cart/count`

**Response:**
```json
{
  "count": 3
}
```

**Note:** This is typically fetched on every page load or stored in client state after login.

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Seller Filter | `/api/catalog/sellers` | GET | 5m |
| 2 | Hero Banners | `/api/catalog/banners?placement=hero` | GET | 60s |
| 3 | Categories | `/api/catalog/categories?level=1` | GET | 5m |
| 4 | Deal of the Day | `/api/catalog/deals/active` | GET | 30s |
| 5 | Best Sellers | `/api/query/catalog-products` | POST (Chenile Query) | 60s |
| 6 | Cart Count | `/api/cart/count` | GET | No |

**Total API calls on page load: 6 (parallel)**

---

## User Actions

### Action: Filter by Seller
**Trigger:** User selects a seller from the dropdown
**API:** No additional API call — re-fetches deals and best sellers with `sellerId` param
- `GET /api/catalog/deals/active?sellerId={sellerId}`
- `GET /api/catalog/products?sortBy=unitsSold&sortOrder=desc&pageSize=10&sellerId={sellerId}`

### Action: Add to Wishlist (from product card)
**API:** `POST /api/wishlist/items`
```json
{ "productId": "prod-001" }
```
**Response:** `201 Created`
```json
{ "id": "wish-001", "productId": "prod-001", "createdTime": "2026-03-28T10:00:00Z" }
```

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function Storefront() {
  const [sellers, banners, categories, deals, bestSellers, cartCount] = await Promise.allSettled([
    catalogApi.sellers(),
    catalogApi.banners({ placement: 'hero' }),
    catalogApi.categories({ level: 1 }),
    catalogApi.dealsActive(),
    catalogApi.products({ sortBy: 'unitsSold', sortOrder: 'desc', pageSize: 10 }),
    cartApi.count(),
  ]);

  return (
    <>
      <Header sellers={sellers} cartCount={cartCount} />
      <HeroBanner banners={banners} categories={categories} />
      <TrustBar />
      <CategoryGrid categories={categories} />
      <DealOfTheDay deal={deals} />
      <BestSellers products={bestSellers} />
      <Footer />
    </>
  );
}
```
