# Wishlist — API Contract

## Page: wishlist.html

**Note:** Wishlist uses standard REST GET/POST/DELETE with `GenericResponse` wrapper. Wishlist is not a Chenile query entity or STM entity.

---

## Section 1: Wishlist Items Grid

**Data needed:** All items in user's wishlist with product details, stock status, pricing
**API:** `GET /api/wishlist`

**Query Params:**
- `page` — page number (default 1)
- `pageSize` — items per page (default 20)

**Response:**
```json
{
  "items": [
    {
      "id": "wish-001",
      "addedAt": "2026-03-10T08:30:00Z",
      "product": {
        "id": "prod-201",
        "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        "slug": "sony-wh-1000xm5",
        "image": "/images/products/sony-xm5.jpg",
        "price": 22490,
        "originalPrice": 32129,
        "discountPercent": 30,
        "rating": 4.0,
        "reviewCount": 128,
        "inStock": true,
        "sellerId": "seller-002",
        "sellerName": "Priya Electronics"
      }
    },
    {
      "id": "wish-002",
      "addedAt": "2026-03-12T14:20:00Z",
      "product": {
        "id": "prod-501",
        "name": "iPhone 16 Pro Max 256GB Natural Titanium",
        "slug": "iphone-16-pro-max",
        "image": "/images/products/iphone16.jpg",
        "price": 144900,
        "originalPrice": 169900,
        "discountPercent": 15,
        "rating": 4.5,
        "reviewCount": 842,
        "inStock": true,
        "sellerId": "seller-001",
        "sellerName": "Rajesh Store"
      }
    },
    {
      "id": "wish-003",
      "addedAt": "2026-03-14T09:15:00Z",
      "product": {
        "id": "prod-601",
        "name": "Nike Air Max 270 React",
        "slug": "nike-air-max-270-react",
        "image": "/images/products/nike-airmax.jpg",
        "price": 8997,
        "originalPrice": 14995,
        "discountPercent": 40,
        "rating": 4.5,
        "reviewCount": 567,
        "inStock": true,
        "sellerId": "seller-005",
        "sellerName": "Vikram Sports"
      }
    },
    {
      "id": "wish-004",
      "addedAt": "2026-03-18T16:45:00Z",
      "product": {
        "id": "prod-701",
        "name": "Samsung Galaxy Tab S9 Ultra",
        "slug": "samsung-galaxy-tab-s9-ultra",
        "image": "/images/products/tab-s9.jpg",
        "price": 89999,
        "originalPrice": 108999,
        "discountPercent": 17,
        "rating": 4.0,
        "reviewCount": 234,
        "inStock": false,
        "sellerId": "seller-002",
        "sellerName": "Priya Electronics"
      }
    },
    {
      "id": "wish-005",
      "addedAt": "2026-03-20T11:30:00Z",
      "product": {
        "id": "prod-305",
        "name": "boAt Airdopes 141 TWS Earbuds",
        "slug": "boat-airdopes-141",
        "image": "/images/products/boat-airdopes.jpg",
        "price": 999,
        "originalPrice": 4490,
        "discountPercent": 78,
        "rating": 4.0,
        "reviewCount": 12453,
        "inStock": true,
        "sellerId": "seller-003",
        "sellerName": "Kumar Fashions"
      }
    },
    {
      "id": "wish-006",
      "addedAt": "2026-03-22T13:00:00Z",
      "product": {
        "id": "prod-801",
        "name": "Apple Watch Ultra 2",
        "slug": "apple-watch-ultra-2",
        "image": "/images/products/apple-watch-ultra.jpg",
        "price": 79900,
        "originalPrice": 89900,
        "discountPercent": 11,
        "rating": 5.0,
        "reviewCount": 178,
        "inStock": true,
        "sellerId": "seller-001",
        "sellerName": "Rajesh Store"
      }
    }
  ],
  "totalCount": 6,
  "numRowsInPage": 20,
  "currentPage": 1,
  "totalPages": 1
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Wishlist Items | `/api/wishlist` | GET | No |

**Total API calls on page load: 1**

---

## User Actions

### Action: Remove from Wishlist
**Trigger:** User clicks X button on a wishlist item
**API:** `DELETE /api/wishlist/items/{wishlistItemId}`
**Response:** `204 No Content`

### Action: Add Single Item to Cart
**Trigger:** User clicks "Add to Cart" on a wishlist product
**API:** `POST /api/cart/items`
```json
{ "productId": "prod-201", "quantity": 1 }
```
**Response:** `201 Created`
```json
{ "cartItemId": "ci-010", "cartItemCount": 4 }
```

### Action: Add All to Cart
**Trigger:** User clicks "Add All to Cart" button
**API:** `POST /api/cart/items/bulk`
```json
{
  "items": [
    { "productId": "prod-201", "quantity": 1 },
    { "productId": "prod-501", "quantity": 1 },
    { "productId": "prod-601", "quantity": 1 },
    { "productId": "prod-305", "quantity": 1 },
    { "productId": "prod-801", "quantity": 1 }
  ]
}
```
**Response:** `201 Created`
```json
{
  "added": 5,
  "skipped": 1,
  "skippedItems": [
    { "productId": "prod-701", "reason": "Out of stock" }
  ],
  "cartItemCount": 8
}
```

**Note:** Out-of-stock items are skipped with a reason.

### Action: Notify When Available
**Trigger:** User clicks "Notify Me" on an out-of-stock item
**API:** `POST /api/catalog/products/{productId}/notify`
```json
{ "email": "premkumar@email.com" }
```
**Response:**
```json
{ "subscribed": true, "productId": "prod-701" }
```

---

## Frontend Integration Pattern

```typescript
// In Next.js page (client component for interactivity)
'use client';
export default function WishlistPage() {
  const { data: wishlist, mutate } = useSWR('/api/wishlist', wishlistApi.get);

  const removeItem = async (wishlistItemId: string) => {
    await wishlistApi.removeItem(wishlistItemId);
    mutate();
  };

  const addToCart = async (productId: string) => {
    await cartApi.addItem({ productId, quantity: 1 });
    toast.success('Added to cart');
  };

  const addAllToCart = async () => {
    const inStockItems = wishlist.items
      .filter(item => item.product.inStock)
      .map(item => ({ productId: item.product.id, quantity: 1 }));
    const result = await cartApi.addItemsBulk({ items: inStockItems });
    toast.success(`${result.added} items added to cart`);
    if (result.skipped > 0) {
      toast.warning(`${result.skipped} items skipped (out of stock)`);
    }
  };

  return (
    <AccountLayout>
      <WishlistHeader count={wishlist?.totalCount} onAddAll={addAllToCart} />
      <WishlistGrid items={wishlist?.items} onRemove={removeItem} onAddToCart={addToCart} />
    </AccountLayout>
  );
}
```
