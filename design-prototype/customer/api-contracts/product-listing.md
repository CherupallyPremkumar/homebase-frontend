# Product Listing — API Contract

## Page: product-listing.html

**Note:** Product listing uses Chenile's `SearchRequest/SearchResponse` pattern via POST for paginated, filterable product data with facets. Seller info uses standard REST GET.

---

## Section 1: Breadcrumb

**Data needed:** Category hierarchy
**API:** No separate call — derived from category data in Section 2 response

---

## Section 2: Sidebar Filters + Product Grid (Chenile Query)

**Data needed:** Products with faceted filter counts, pagination, sort
**API:** `POST /api/query/catalog-products`
**Fetch/XHR name:** `catalog-products`

**Request (SearchRequest):**
```json
{
  "queryName": "Catalog.productListing",
  "pageNum": 1,
  "numRowsInPage": 24,
  "sortCriteria": [
    { "name": "relevance", "ascendingOrder": false }
  ],
  "filters": {
    "category": "electronics",
    "sellerId": "",
    "brand": "apple,samsung",
    "priceMin": 500,
    "priceMax": 100000,
    "rating": 4,
    "color": "black,silver",
    "availability": "in_stock",
    "discount": 10
  }
}
```

**Response (GenericResponse<SearchResponse>):**
```json
{
  "list": [
    {
      "row": {
        "id": "prod-001",
        "name": "MacBook Air M3 15\" 256GB",
        "slug": "macbook-air-m3-15-256gb",
        "image": "/images/products/macbook-air.jpg",
        "price": 112490,
        "originalPrice": 149990,
        "discountPercent": 25,
        "rating": 4.8,
        "reviewCount": 186,
        "freeShipping": true,
        "inStock": true,
        "sellerId": "seller-001",
        "sellerName": "Rajesh Store",
        "badges": ["Top Rated"]
      }
    }
  ],
  "totalCount": 156,
  "numRowsInPage": 24,
  "currentPage": 1,
  "totalPages": 7,
  "facets": {
    "categories": [
      { "name": "Laptops", "slug": "laptops", "count": 74, "selected": true },
      { "name": "Smartphones", "slug": "smartphones", "count": 156, "selected": false },
      { "name": "Headphones", "slug": "headphones", "count": 42, "selected": false },
      { "name": "Cameras", "slug": "cameras", "count": 28, "selected": false },
      { "name": "Gaming", "slug": "gaming", "count": 52, "selected": false }
    ],
    "brands": [
      { "name": "Apple", "slug": "apple", "count": 38, "selected": true },
      { "name": "Samsung", "slug": "samsung", "count": 45, "selected": false },
      { "name": "Sony", "slug": "sony", "count": 29, "selected": false },
      { "name": "Nike", "slug": "nike", "count": 18, "selected": false },
      { "name": "boAt", "slug": "boat", "count": 33, "selected": false },
      { "name": "OnePlus", "slug": "oneplus", "count": 21, "selected": false }
    ],
    "priceRange": { "min": 499, "max": 199990 },
    "ratings": [
      { "value": 5, "count": 24 },
      { "value": 4, "count": 68 },
      { "value": 3, "count": 42 },
      { "value": 2, "count": 15 }
    ],
    "availability": [
      { "name": "In Stock", "value": "in_stock", "count": 142, "selected": true },
      { "name": "Out of Stock", "value": "out_of_stock", "count": 14, "selected": false }
    ],
    "colors": [
      { "name": "Black", "hex": "#111827", "count": 52, "selected": true },
      { "name": "White", "hex": "#F9FAFB", "count": 34, "selected": false },
      { "name": "Silver", "hex": "#9CA3AF", "count": 28, "selected": false },
      { "name": "Blue", "hex": "#3B82F6", "count": 18, "selected": false },
      { "name": "Red", "hex": "#EF4444", "count": 12, "selected": false }
    ],
    "discounts": [
      { "label": "10% off or more", "value": 10, "count": 85 },
      { "label": "20% off or more", "value": 20, "count": 52 },
      { "label": "30% off or more", "value": 30, "count": 28 },
      { "label": "40% off or more", "value": 40, "count": 14 },
      { "label": "50% off or more", "value": 50, "count": 6 }
    ]
  }
}
```

**Note:** Uses Chenile SearchRequest format. The `queryName` maps to MyBatis mapper ID `Catalog.productListing`. Facets are returned alongside the product list to power sidebar filter counts. STM enriches each row with `allowedActions`.

---

## Section 3: Seller Banner (Conditional)

**Data needed:** Seller info when a seller filter is active
**API:** `GET /api/catalog/sellers/{sellerId}`

**Response:**
```json
{
  "id": "seller-001",
  "slug": "rajesh",
  "name": "Rajesh Store",
  "avatar": "RS",
  "rating": 4.6,
  "productCount": 234,
  "memberSince": 2024
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Breadcrumb | Derived from product response | — | — |
| 2 | Filters + Product Grid | `/api/query/catalog-products` | POST (Chenile Query) | 30s |
| 3 | Seller Banner | `/api/catalog/sellers/{sellerId}` | GET | 5m |

**Total API calls on page load: 1-2 (product search + optional seller info)**

---

## User Actions

### Action: Apply Filter
**Trigger:** User checks a filter checkbox or changes price range
**API:** `GET /api/catalog/products` with updated query params
**Fetch/XHR Name:** `fetchProducts`
**Note:** Client-side URL updates with query params; re-fetches product list

### Action: Change Sort
**Trigger:** User selects sort option from dropdown
**API:** `GET /api/catalog/products?sortBy=price&sortOrder=asc`

### Action: Change Page
**Trigger:** User clicks pagination control
**API:** `GET /api/catalog/products?page=2`

### Action: Toggle Grid/List View
**Trigger:** User clicks view toggle buttons
**API:** No API call — client-side layout change only

### Action: Add to Wishlist
**API:** `POST /api/wishlist/items`
```json
{ "productId": "prod-001" }
```

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component with searchParams)
export default async function ProductListing({ searchParams }) {
  const filters = {
    category: searchParams.category,
    brand: searchParams.brand,
    priceMin: searchParams.priceMin,
    priceMax: searchParams.priceMax,
    rating: searchParams.rating,
    color: searchParams.color,
    availability: searchParams.availability,
    discount: searchParams.discount,
    sortBy: searchParams.sortBy || 'relevance',
    sortOrder: searchParams.sortOrder || 'desc',
    page: searchParams.page || 1,
    pageSize: 24,
    sellerId: searchParams.sellerId,
  };

  const [products, seller] = await Promise.allSettled([
    catalogApi.products(filters),
    filters.sellerId ? catalogApi.seller(filters.sellerId) : null,
  ]);

  return (
    <>
      <Breadcrumb category={products.facets?.categories} />
      {seller && <SellerBanner seller={seller} />}
      <div className="flex">
        <FilterSidebar facets={products.facets} />
        <ProductGrid products={products.list} pagination={products} />
      </div>
    </>
  );
}
```
