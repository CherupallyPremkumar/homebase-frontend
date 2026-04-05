# Search Results — API Contract

## Page: search-results.html

**Note:** Search results use Chenile's `SearchRequest/SearchResponse` pattern via POST for paginated, filterable search data with facets. Autocomplete uses standard REST GET.

---

## Section 1: Search Header (Result Count + Suggestions)

**Data needed:** Search query, result count, spelling suggestions, related searches
**API:** `POST /api/query/catalog-search`
**Fetch/XHR name:** `catalog-search`

**Request (SearchRequest):**
```json
{
  "queryName": "Catalog.search",
  "pageNum": 1,
  "numRowsInPage": 24,
  "sortCriteria": [
    { "name": "relevance", "ascendingOrder": false }
  ],
  "filters": {
    "q": "wireless headphones",
    "sellerId": "",
    "category": "",
    "brand": "",
    "priceMin": "",
    "priceMax": "",
    "rating": "",
    "availability": "in_stock"
  }
}
```

**Response (GenericResponse<SearchResponse>):**
```json
{
  "query": "wireless headphones",
  "totalCount": 48,
  "didYouMean": ["wireless earbuds", "bluetooth headphones"],
  "relatedSearches": [
    "noise cancelling",
    "over-ear headphones",
    "earbuds with mic",
    "sony headphones",
    "gaming headset",
    "ANC headphones"
  ],
  "list": [
    {
      "row": {
        "id": "prod-201",
        "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        "slug": "sony-wh-1000xm5",
        "image": "/images/products/sony-xm5.jpg",
        "price": 22490,
        "originalPrice": 29990,
        "discountPercent": 25,
        "rating": 4.8,
        "reviewCount": 456,
        "freeShipping": true,
        "inStock": true,
        "sellerId": "seller-002",
        "sellerName": "Priya Electronics",
        "badges": ["Best Seller"]
      }
    }
  ],
  "numRowsInPage": 24,
  "currentPage": 1,
  "totalPages": 2,
  "facets": {
    "categories": [
      { "name": "Over-Ear Headphones", "slug": "over-ear", "count": 18, "selected": true },
      { "name": "In-Ear / Earbuds", "slug": "in-ear", "count": 14, "selected": false },
      { "name": "On-Ear Headphones", "slug": "on-ear", "count": 9, "selected": false },
      { "name": "Gaming Headsets", "slug": "gaming-headsets", "count": 7, "selected": false }
    ],
    "brands": [
      { "name": "Sony", "slug": "sony", "count": 11, "selected": true },
      { "name": "boAt", "slug": "boat", "count": 9, "selected": false },
      { "name": "JBL", "slug": "jbl", "count": 8, "selected": false },
      { "name": "Sennheiser", "slug": "sennheiser", "count": 6, "selected": false },
      { "name": "Apple", "slug": "apple", "count": 5, "selected": false },
      { "name": "Bose", "slug": "bose", "count": 4, "selected": false }
    ],
    "priceRange": { "min": 499, "max": 49990 },
    "ratings": [
      { "value": 5, "count": 12 },
      { "value": 4, "count": 28 },
      { "value": 3, "count": 38 }
    ],
    "availability": [
      { "name": "In Stock", "value": "in_stock", "count": 42, "selected": true },
      { "name": "Out of Stock", "value": "out_of_stock", "count": 6, "selected": false }
    ]
  }
}
```

---

## Section 2: Search Suggestions (Autocomplete — on typing)

**Data needed:** Autocomplete suggestions as user types
**API:** `GET /api/catalog/search/suggest?q={query}`

**Query Params:**
- `q` — partial query string, e.g. `wireless head`
- `limit` — max suggestions (default 8)

**Response:**
```json
{
  "suggestions": [
    { "text": "wireless headphones", "type": "product", "count": 48 },
    { "text": "wireless headphones sony", "type": "product", "count": 11 },
    { "text": "wireless headset gaming", "type": "product", "count": 7 },
    { "text": "Headphones", "type": "category", "url": "/categories/headphones" },
    { "text": "Sony WH-1000XM5", "type": "product_match", "url": "/products/sony-wh-1000xm5" }
  ]
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Search Results + Filters | `/api/query/catalog-search` | POST (Chenile Query) | 30s |
| 2 | Autocomplete | `/api/catalog/search/suggest?q={query}` | GET | 10s |

**Total API calls on page load: 1 (search query)**
**On typing: 1 debounced autocomplete call per keystroke group**

---

## User Actions

### Action: Execute Search
**Trigger:** User types query and clicks search or presses Enter
**API:** `GET /api/catalog/search?q=wireless+headphones`

### Action: Apply Filter
**Trigger:** User checks filter in sidebar
**API:** `GET /api/catalog/search?q=wireless+headphones&brand=sony&rating=4`

### Action: Click "Did you mean" suggestion
**Trigger:** User clicks spelling correction
**API:** `GET /api/catalog/search?q=wireless+earbuds`

### Action: Click Related Search pill
**Trigger:** User clicks a related search tag
**API:** `GET /api/catalog/search?q=noise+cancelling`

### Action: Change Sort
**API:** `GET /api/catalog/search?q=wireless+headphones&sortBy=price&sortOrder=asc`

### Action: Paginate
**API:** `GET /api/catalog/search?q=wireless+headphones&page=2`

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component with searchParams)
export default async function SearchResults({ searchParams }) {
  const results = await catalogApi.search({
    q: searchParams.q,
    category: searchParams.category,
    brand: searchParams.brand,
    priceMin: searchParams.priceMin,
    priceMax: searchParams.priceMax,
    rating: searchParams.rating,
    sortBy: searchParams.sortBy || 'relevance',
    sortOrder: searchParams.sortOrder || 'desc',
    page: searchParams.page || 1,
    pageSize: 24,
    sellerId: searchParams.sellerId,
  });

  return (
    <>
      <SearchHeader query={results.query} totalCount={results.totalCount}
        didYouMean={results.didYouMean} relatedSearches={results.relatedSearches} />
      <div className="flex">
        <FilterSidebar facets={results.facets} />
        <ProductGrid products={results.list} pagination={results} />
      </div>
    </>
  );
}

// Client component for autocomplete
function SearchBar() {
  const fetchSuggestions = useDebouncedCallback(async (q) => {
    const data = await catalogApi.searchSuggest({ q, limit: 8 });
    setSuggestions(data.suggestions);
  }, 300);
}
```
