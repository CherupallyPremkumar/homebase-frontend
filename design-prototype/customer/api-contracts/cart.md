# Shopping Cart — API Contract

## Page: cart.html

**Note:** Cart operations use standard REST GET/POST/PUT/DELETE with `GenericResponse` wrapper. Cart is not a Chenile query entity or STM entity.

---

## Section 1: Cart Items List

**Data needed:** All items in user's cart with product details, quantities, subtotals
**API:** `GET /api/cart`

**Response:**
```json
{
  "id": "cart-001",
  "items": [
    {
      "id": "ci-001",
      "product": {
        "id": "prod-201",
        "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        "slug": "sony-wh-1000xm5",
        "image": "/images/products/sony-xm5.jpg",
        "sku": "WH1000XM5-BLK",
        "brand": "Sony",
        "sellerId": "seller-002",
        "sellerName": "Priya Electronics"
      },
      "color": "Black",
      "variant": "Standard",
      "quantity": 1,
      "unitPrice": 22490,
      "originalPrice": 29990,
      "discountPercent": 25,
      "subtotal": 22490,
      "inStock": true,
      "maxQuantity": 12
    },
    {
      "id": "ci-002",
      "product": {
        "id": "prod-305",
        "name": "boAt Rockerz 450 Bluetooth On-Ear Headphones",
        "slug": "boat-rockerz-450",
        "image": "/images/products/boat-rockerz.jpg",
        "sku": "BOAT-RZ450-RED",
        "brand": "boAt",
        "sellerId": "seller-003",
        "sellerName": "Kumar Fashions"
      },
      "color": "Lush Red",
      "variant": null,
      "quantity": 1,
      "unitPrice": 1299,
      "originalPrice": 2990,
      "discountPercent": 57,
      "subtotal": 1299,
      "inStock": true,
      "maxQuantity": 50
    },
    {
      "id": "ci-003",
      "product": {
        "id": "prod-118",
        "name": "Apple AirPods Pro (2nd Gen) with USB-C",
        "slug": "apple-airpods-pro-2",
        "image": "/images/products/airpods-pro.jpg",
        "sku": "APL-APP2-USC",
        "brand": "Apple",
        "sellerId": "seller-001",
        "sellerName": "Rajesh Store"
      },
      "color": "White",
      "variant": null,
      "quantity": 1,
      "unitPrice": 20990,
      "originalPrice": 24900,
      "discountPercent": 16,
      "subtotal": 20990,
      "inStock": true,
      "maxQuantity": 8
    }
  ],
  "summary": {
    "itemCount": 3,
    "subtotal": 44779,
    "savings": 12121,
    "shippingCost": 0,
    "shippingNote": "Free Shipping",
    "taxAmount": 2150,
    "total": 46929,
    "currency": "INR"
  },
  "appliedCoupon": null
}
```

---

## Section 2: Coupon / Promo Code

**Data needed:** Validate and apply coupon code
**API:** `POST /api/cart/coupon`

**Request:**
```json
{
  "code": "SAVE10"
}
```

**Response (success):**
```json
{
  "valid": true,
  "code": "SAVE10",
  "description": "10% off on orders above INR 2,000",
  "discountType": "percentage",
  "discountValue": 10,
  "discountAmount": 4478,
  "minimumOrder": 2000,
  "expiresAt": "2026-04-15T23:59:59Z"
}
```

**Response (invalid):**
```json
{
  "valid": false,
  "code": "EXPIRED10",
  "message": "This coupon has expired"
}
```

### Remove Coupon
**API:** `DELETE /api/cart/coupon`
**Response:** `200 OK` with updated cart summary

---

## Section 3: Recommended Products (You May Also Like)

**Data needed:** Product recommendations based on cart contents
**API:** `GET /api/catalog/recommendations?context=cart&pageSize=4`

**Response:**
```json
{
  "products": [
    {
      "id": "prod-401",
      "name": "Sony WF-1000XM5 Wireless Earbuds",
      "image": "/images/products/sony-earbuds.jpg",
      "price": 17990,
      "originalPrice": 24990,
      "discountPercent": 28,
      "rating": 4.7,
      "reviewCount": 312,
      "inStock": true
    }
  ]
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Cart Items + Summary | `/api/cart` | GET | No |
| 2 | Apply Coupon | `/api/cart/coupon` | POST | No |
| 3 | Recommendations | `/api/catalog/recommendations?context=cart` | GET | 60s |

**Total API calls on page load: 2 (cart + recommendations, parallel)**

---

## User Actions

### Action: Update Quantity
**Trigger:** User clicks +/- buttons on a cart item
**API:** `PUT /api/cart/items/{itemId}`
```json
{ "quantity": 2 }
```
**Response:** `200 OK` with updated cart (full response same as GET /api/cart)

### Action: Remove Item
**Trigger:** User clicks remove/trash icon
**API:** `DELETE /api/cart/items/{itemId}`
**Response:** `200 OK` with updated cart

### Action: Move to Wishlist
**Trigger:** User clicks "Save for Later" or wishlist icon on cart item
**API:** Two calls:
1. `POST /api/wishlist/items` — `{ "productId": "prod-201" }`
2. `DELETE /api/cart/items/{itemId}`

### Action: Apply Coupon
**API:** `POST /api/cart/coupon`
```json
{ "code": "SAVE10" }
```

### Action: Proceed to Checkout
**Trigger:** User clicks "Proceed to Checkout" button
**API:** No API call — client-side navigation to `/checkout`
**Prerequisite:** User must be authenticated; redirect to `/login?redirect=checkout` if not

---

## Frontend Integration Pattern

```typescript
// In Next.js page (client component for interactivity)
'use client';
export default function CartPage() {
  const { data: cart, mutate } = useSWR('/api/cart', cartApi.get);
  const { data: recommendations } = useSWR(
    '/api/catalog/recommendations?context=cart',
    catalogApi.recommendations
  );

  const updateQuantity = async (itemId, quantity) => {
    await cartApi.updateItem(itemId, { quantity });
    mutate(); // refresh cart
  };

  const removeItem = async (itemId) => {
    await cartApi.removeItem(itemId);
    mutate();
  };

  const applyCoupon = async (code) => {
    const result = await cartApi.applyCoupon({ code });
    if (result.valid) mutate();
    return result;
  };

  return (
    <>
      <CartItemList items={cart.items} onUpdateQty={updateQuantity} onRemove={removeItem} />
      <CouponInput onApply={applyCoupon} applied={cart.appliedCoupon} />
      <OrderSummary summary={cart.summary} />
      <RecommendedProducts products={recommendations} />
    </>
  );
}
```

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` on the cart entity based on its current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `cart-states.xml` (cart-flow)
**Customer ACL filter:** Only events with `CUSTOMER` in `meta-acls` are shown.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (customer-visible) | UI Button | Icon | Color | Event ID |
|-------|----------------------------------|-----------|------|-------|----------|
| ACTIVE | addItem | Add to Cart | Plus | green | addItem |
| ACTIVE | removeItem | Remove | Trash2 | red | removeItem |
| ACTIVE | updateQuantity | Update Qty | PlusMinusCircle | blue | updateQuantity |
| ACTIVE | applyCoupon | Apply Coupon | Tag | green | applyCoupon |
| ACTIVE | removeCoupon | Remove Coupon | XCircle | gray | removeCoupon |
| ACTIVE | merge | Merge Cart | GitMerge | blue | merge |
| ACTIVE | initiateCheckout | Proceed to Checkout | ArrowRight | green | initiateCheckout |
| CHECKOUT_INITIATED | cancelCheckout | Back to Cart | ArrowLeft | gray | cancelCheckout |
| CHECKOUT_COMPLETED | -- | (read-only, terminal) | -- | -- | -- |
| ABANDONED | reactivate | Reactivate Cart | RotateCcw | blue | reactivate |
| EXPIRED | -- | (read-only, terminal) | -- | -- | -- |
| MERGED | -- | (read-only, terminal) | -- | -- | -- |

> **Note:** Cart actions like `addItem`, `removeItem`, `updateQuantity` are inline actions on individual items, not row-level action buttons. The `initiateCheckout` is the primary CTA button.

### Frontend Pattern

```typescript
const CART_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  initiateCheckout: { label: 'Proceed to Checkout', icon: 'ArrowRight', color: 'green' },
  cancelCheckout: { label: 'Back to Cart', icon: 'ArrowLeft', color: 'gray' },
  reactivate: { label: 'Reactivate Cart', icon: 'RotateCcw', color: 'blue' },
  applyCoupon: { label: 'Apply Coupon', icon: 'Tag', color: 'green' },
  removeCoupon: { label: 'Remove Coupon', icon: 'XCircle', color: 'gray' },
};

// Primary CTA driven by allowedActions
{allowedActions.includes('initiateCheckout') && (
  <ActionButton label="Proceed to Checkout" icon="ArrowRight" color="green"
    onClick={() => triggerEvent(cartId, 'initiateCheckout')} />
)}
```
