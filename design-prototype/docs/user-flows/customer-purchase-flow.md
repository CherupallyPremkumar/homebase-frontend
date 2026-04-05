# Customer Purchase Flow

Complete purchase journey from browsing to order confirmation.

---

## Flow Overview

```
+------------------+     +------------------+     +-------------------+
|   Entry Point    |---->|   Browse/Search   |---->|  Product Detail   |
| (Login or Guest) |     | storefront.html   |     | product-detail.   |
|  login.html      |     | search-results.   |     | html              |
+------------------+     | product-listing.  |     +-------------------+
                          | html              |             |
                          +------------------+             |
                                                           v
+------------------+     +------------------+     +-------------------+
| Order Confirmed  |<----| Payment & Place  |<----| Shopping Cart     |
| order-detail.    |     | Order             |     | cart.html         |
| html             |     | checkout.html     |     +-------------------+
+------------------+     +------------------+
```

---

## Detailed Flow Diagram

```
    [START]
       |
       v
  +----------+        +-----------+
  | Existing |--YES-->| Login     |----+
  | Account? |        | login.html|    |
  +----------+        +-----------+    |
       |                   |           |
       NO              +---+---+       |
       |               |       |       |
       v               v       v       |
  +---------+   +-------+ +------+    |
  | Continue |   |Email/ | |Google|    |
  | as Guest |   |Pass   | |OAuth |    |
  +---------+   +-------+ +------+    |
       |           |         |         |
       |           v         v         |
       |     +----------+              |
       |     | OTP      |              |
       |     | Verify   |              |
       |     +----------+              |
       |           |                   |
       +-----+----+-------------------+
             |
             v
    +------------------+
    | STOREFRONT       |
    | storefront.html  |
    |                  |
    | - Hero banners   |
    | - Categories     |
    | - Flash deals    |
    | - Best sellers   |
    +------------------+
         |         |
    +----+         +-------+
    |                      |
    v                      v
+----------------+   +-------------------+
| CATEGORY       |   | SEARCH RESULTS    |
| BROWSE         |   | search-results.   |
| product-       |   | html              |
| listing.html   |   |                   |
| - Filter/sort  |   | - Text search     |
| - Grid view    |   | - Auto-suggest    |
| - Pagination   |   | - Filter/sort     |
+----------------+   +-------------------+
         |                    |
         +--------+-----------+
                  |
                  v
        +-------------------+
        | PRODUCT DETAIL    |
        | product-detail.   |
        | html              |
        |                   |
        | - Images gallery  |
        | - Price/variants  |
        | - Color select    |
        | - Reviews         |
        | - Related items   |
        +-------------------+
           |           |
      +----+           +----+
      |                     |
      v                     v
+------------+      +--------------+
| ADD TO     |      | BUY NOW      |
| CART       |      | (add + go to |
|            |      | checkout)    |
+------------+      +--------------+
      |                     |
      v                     |
+-------------------+       |
| SHOPPING CART     |       |
| cart.html         |       |
|                   |       |
| - Item list       |       |
| - Qty adjust      |       |
| - Coupon code     |       |
| - Price summary   |       |
| - Recommendations |       |
+-------------------+       |
      |                     |
      v                     |
+----------+                |
| Logged   |--NO--+         |
| In?      |      |         |
+----------+      v         |
      |     +-----------+   |
     YES    | Redirect  |   |
      |     | to Login  |   |
      |     | ?redirect |   |
      |     | =checkout |   |
      |     +-----------+   |
      |           |         |
      +-----------+---------+
                  |
                  v
    +============================+
    |  CHECKOUT (Multi-Step)     |
    |  checkout.html             |
    +============================+
                  |
                  v
    +----------------------------+
    | STEP 1: SHIPPING ADDRESS   |
    |                            |
    | +---+  +---+  +--------+  |
    | |Adr|  |Adr|  |+ New   |  |
    | |001|  |002|  |Address |  |
    | +---+  +---+  +--------+  |
    +----------------------------+
                  |
                  v
    +----------------------------+
    | STEP 2: SHIPPING METHOD    |
    |                            |
    | ( ) Standard (Free, 5-7d) |
    | ( ) Express  (149, 2-3d)  |
    | ( ) Same Day (299, today) |
    +----------------------------+
                  |
                  v
    +----------------------------+
    | STEP 3: PAYMENT METHOD     |
    |                            |
    | +------+ +-----+ +-----+  |
    | | Saved| | UPI | | New |  |
    | | Card | |     | | Card|  |
    | +------+ +-----+ +-----+  |
    |                            |
    | +------+ +-----+          |
    | | Net  | | COD |          |
    | | Bank | |     |          |
    | +------+ +-----+          |
    +----------------------------+
            |         |
     +------+         +--------+
     |                         |
     v                         v
+------------+          +------------+
| ONLINE     |          | COD        |
| PAYMENT    |          |            |
|            |          | - Limit    |
| - 3DS/OTP  |          |   check   |
| - UPI pin  |          |   (50000) |
| - Net bank |          +------------+
| redirect   |                |
+------------+                |
     |                        |
     +------+---------+       |
            |         |       |
            v         v       |
     +---------+ +--------+   |
     | Payment | | Payment|   |
     | SUCCESS | | FAILED |   |
     +---------+ +--------+   |
          |           |       |
          |           v       |
          |    +----------+   |
          |    | Retry?   |   |
          |    +----------+   |
          |     |       |     |
          |    YES     NO     |
          |     |       |     |
          |     +--+    v     |
          |        | [Cancel] |
          |        |          |
          +--------+----------+
                   |
                   v
    +----------------------------+
    | ORDER CONFIRMATION         |
    | order-detail.html          |
    |                            |
    | - Order number             |
    | - Estimated delivery       |
    | - Order summary            |
    | - Continue shopping CTA    |
    +----------------------------+
                   |
                   v
                [END]
```

---

## Alternate Paths

### Guest Checkout
```
Browse -> Add to Cart -> Proceed to Checkout
    |
    v
+-------------------+
| Login Required    |
| Redirect to       |
| login.html        |
| ?redirect=        |
| /checkout         |
+-------------------+
    |
    v
Login/Register -> Return to Checkout
```

### Coupon Application (at Cart)
```
Cart Page
    |
    v
+-------------------+
| Enter Coupon Code |
| e.g., "SAVE10"   |
+-------------------+
    |
    +-------+--------+
    |                |
    v                v
+--------+    +-----------+
| Valid  |    | Invalid   |
| -10%   |    | "Expired" |
| applied|    | or "Min   |
+--------+    | order not |
    |         | met"      |
    |         +-----------+
    v
Updated Order Summary
```

### Address Selection / New Address at Checkout
```
Step 1: Shipping
    |
    +-------+--------+
    |                |
    v                v
+----------+  +-------------+
| Select   |  | Add New     |
| Existing |  | Address     |
| Address  |  |             |
+----------+  | - Name      |
    |         | - Phone     |
    |         | - Line1/2   |
    |         | - City      |
    |         | - State     |
    |         | - Pincode   |
    |         +-------------+
    |                |
    +--------+-------+
             |
             v
  Fetch Shipping Methods
  for selected address
```

### Payment Failure and Retry
```
Place Order
    |
    v
+-------------------+
| Payment Gateway   |
+-------------------+
    |
    v
+----------+
| FAILED   |
| timeout/ |
| declined |
+----------+
    |
    v
+-------------------+
| Error Message:    |
| "Payment failed.  |
| Please try again" |
+-------------------+
    |
    +------+--------+
    |               |
    v               v
+----------+  +-----------+
| Retry    |  | Change    |
| Same     |  | Payment   |
| Method   |  | Method    |
+----------+  +-----------+
    |               |
    +-------+-------+
            |
            v
     Re-attempt Payment
```

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Login/Register | `customer/login.html` | `/login` |
| Storefront (Home) | `customer/storefront.html` | `/` |
| Category Listing | `customer/product-listing.html` | `/products?category={slug}` |
| Search Results | `customer/search-results.html` | `/search?q={query}` |
| Product Detail | `customer/product-detail.html` | `/products/{slug}` |
| Shopping Cart | `customer/cart.html` | `/cart` |
| Checkout | `customer/checkout.html` | `/checkout` |
| Order Confirmation | `customer/order-detail.html` | `/orders/{orderId}` |
| Wishlist | `customer/wishlist.html` | `/wishlist` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Storefront** | | | |
| Load banners | `GET /api/catalog/banners?placement=hero` | GET | Page load |
| Load categories | `GET /api/catalog/categories?level=1` | GET | Page load |
| Load deals | `GET /api/catalog/deals/active` | GET | Page load |
| Load best sellers | `POST /api/query/catalog-products` | POST | Page load |
| Load cart count | `GET /api/cart/count` | GET | Page load |
| **Search** | | | |
| Search products | `POST /api/query/catalog-products` | POST | Search submit |
| **Product Detail** | | | |
| Load product | `GET /api/product/{id}` | GET | Page load |
| Load reviews | `GET /api/catalog/products/{id}/reviews` | GET | Page load |
| Load related | `GET /api/catalog/products/{id}/related` | GET | Page load |
| Add to cart | `POST /api/cart/items` | POST | Button click |
| **Cart** | | | |
| Load cart | `GET /api/cart` | GET | Page load |
| Update quantity | `PUT /api/cart/items/{itemId}` | PUT | +/- click |
| Remove item | `DELETE /api/cart/items/{itemId}` | DELETE | Remove click |
| Apply coupon | `POST /api/cart/coupon` | POST | Apply click |
| Load recommendations | `GET /api/catalog/recommendations?context=cart` | GET | Page load |
| **Checkout** | | | |
| Load addresses | `GET /api/account/addresses` | GET | Page load |
| Add new address | `POST /api/account/addresses` | POST | Form submit |
| Load shipping methods | `GET /api/checkout/shipping-methods?addressId={id}` | GET | Address select |
| Load payment methods | `GET /api/checkout/payment-methods` | GET | Page load |
| Load cart summary | `GET /api/cart` | GET | Page load |
| Place order | `POST /api/order` | POST | Place Order click |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| Logged in? | JWT token present | Continue to checkout | Redirect to login |
| Guest or Account? | User preference | Browse without account | Login/Register |
| Coupon valid? | `POST /api/cart/coupon` response | Apply discount | Show error |
| Address exists? | Saved addresses > 0 | Select existing | Add new address |
| COD eligible? | `codAvailable && total <= codLimit` | Show COD option | Hide COD |
| Payment success? | Payment gateway response | Order confirmation | Retry/change |
| In stock? | `product.inStock === true` | Enable Add to Cart | Show "Out of Stock" |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Invalid credentials | Login attempt | "Invalid email or password" toast | Re-enter credentials |
| Email exists | Register attempt | "Account already exists" toast | Switch to login tab |
| Out of stock | Add to cart | "This item is currently out of stock" | Browse alternatives |
| Cart item unavailable | Checkout load | "1 item in cart is no longer available" | Remove item, continue |
| Coupon expired | Apply coupon | "This coupon has expired" message | Remove coupon code |
| Coupon min not met | Apply coupon | "Min order INR 2,000 required" | Add more items |
| Payment declined | Place order | "Payment failed. Card declined." | Retry or change method |
| Payment timeout | Place order | "Payment timed out. Please try again." | Retry payment |
| 3DS verification fail | Card payment | "3D Secure verification failed" | Retry or use different card |
| Address validation | Add address | "Invalid pincode" inline error | Correct the field |
| Session expired | Any authenticated action | Redirect to login with return URL | Re-login |

---

## Time Estimates

| Step | User Action | Estimated Time |
|------|------------|---------------|
| Login (returning user) | Enter email + password | 15-30 seconds |
| Register (new user) | Fill form + verify | 1-2 minutes |
| Browse storefront | Scroll, explore | 1-5 minutes |
| Search for product | Type query, scan results | 30-60 seconds |
| Browse category listing | Filter, sort, paginate | 1-3 minutes |
| Review product detail | Read specs, reviews, compare | 1-5 minutes |
| Add to cart | Select options, click button | 5-10 seconds |
| Review cart | Check items, apply coupon | 30-60 seconds |
| Checkout Step 1 (Address) | Select or add address | 15-60 seconds |
| Checkout Step 2 (Shipping) | Select shipping method | 5-10 seconds |
| Checkout Step 3 (Payment) | Select and verify payment | 30-90 seconds |
| Payment processing | Wait for gateway | 5-15 seconds |
| **Total (returning user)** | | **3-10 minutes** |
| **Total (new user)** | | **5-15 minutes** |
