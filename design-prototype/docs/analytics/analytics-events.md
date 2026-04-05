# Analytics Event Tracking Definitions

Complete event catalog for HomeBase multi-tenant marketplace. All events follow GA4 / Mixpanel naming conventions (snake_case). Implementation targets a unified `track(eventName, properties)` call in the Next.js frontend.

---

## Table of Contents

1. [Global Configuration](#1-global-configuration)
2. [E-commerce Events (GA4 Standard)](#2-e-commerce-events-ga4-standard)
3. [Search and Discovery Events](#3-search-and-discovery-events)
4. [User and Authentication Events](#4-user-and-authentication-events)
5. [Customer Interaction Events](#5-customer-interaction-events)
6. [Seller Portal Events](#6-seller-portal-events)
7. [Admin Portal Events](#7-admin-portal-events)
8. [Warehouse Portal Events](#8-warehouse-portal-events)
9. [Error and Performance Events](#9-error-and-performance-events)
10. [Funnel Definitions](#10-funnel-definitions)
11. [Session Properties](#11-session-properties)
12. [User Properties](#12-user-properties)
13. [Implementation Reference](#13-implementation-reference)

---

## 1. Global Configuration

### Event Envelope

Every event sent to the analytics backend includes these fields automatically, injected by the `track()` wrapper. Individual event definitions below list only event-specific properties.

```
{
  event_name: string,          // snake_case event name
  timestamp: ISO-8601,         // client-side UTC timestamp
  session_id: string,          // browser session ID
  user_id: string | null,      // authenticated user ID or null
  tenant_id: string,           // multi-tenant org identifier
  device_type: "desktop" | "mobile" | "tablet",
  os: string,                  // e.g. "iOS 18", "Windows 11"
  browser: string,             // e.g. "Chrome 128"
  app_version: string,         // frontend build version
  page_path: string,           // current URL path
  page_title: string,          // document.title
  referrer: string,            // document.referrer
  utm_source: string | null,
  utm_medium: string | null,
  utm_campaign: string | null
}
```

### Currency

All monetary values are in the tenant's base currency (INR for the primary tenant). The `currency` property is always included alongside `value` so downstream systems can handle multi-currency correctly.

---

## 2. E-commerce Events (GA4 Standard)

These events map directly to Google Analytics 4 recommended e-commerce events. They power the built-in GA4 e-commerce reports and funnel visualizations.

### 2.1 `view_item`

| Field | Value |
|---|---|
| **Event name** | `view_item` |
| **Trigger** | Customer lands on a product detail page and the product data API call resolves |
| **Page** | `product-detail.html` |
| **Component** | `ProductDetailPage` (fires in `useEffect` after `GET /api/product/{id}` resolves) |

**Properties:**

```
{
  item_id: string,             // "prod-201"
  item_name: string,           // "Sony WH-1000XM5 Wireless..."
  item_category: string,       // "Headphones"
  item_category2: string,      // "Electronics" (parent category)
  item_brand: string,          // "Sony"
  item_variant: string,        // "Midnight Black"
  price: number,               // 22490
  original_price: number,      // 29990
  discount_percent: number,    // 25
  currency: "INR",
  seller_id: string,           // "seller-002"
  seller_name: string,         // "Priya Electronics"
  in_stock: boolean,
  rating: number,              // 4.8
  review_count: number         // 456
}
```

---

### 2.2 `add_to_cart`

| Field | Value |
|---|---|
| **Event name** | `add_to_cart` |
| **Trigger** | Customer clicks "Add to Cart" and the `POST /api/cart/items` call succeeds |
| **Page** | `product-detail.html`, `search-results.html`, `product-listing.html`, `wishlist.html` |
| **Component** | `AddToCartButton` (fires in the `onSuccess` callback of the cart mutation) |

**Properties:**

```
{
  item_id: string,             // "prod-201"
  item_name: string,           // "Sony WH-1000XM5 Wireless..."
  item_category: string,       // "Headphones"
  item_brand: string,          // "Sony"
  item_variant: string,        // "Midnight Black"
  quantity: number,            // 1
  price: number,               // 22490
  currency: "INR",
  seller_id: string,
  source_page: string          // "product_detail" | "search_results" | "wishlist" | "product_listing"
}
```

---

### 2.3 `remove_from_cart`

| Field | Value |
|---|---|
| **Event name** | `remove_from_cart` |
| **Trigger** | Customer clicks the remove icon on a cart item and `DELETE /api/cart/items/{itemId}` succeeds |
| **Page** | `cart.html` |
| **Component** | `CartItemRow` (fires in the `onSuccess` callback of the remove mutation) |

**Properties:**

```
{
  item_id: string,             // "prod-201"
  item_name: string,
  quantity: number,            // quantity at time of removal
  price: number,
  currency: "INR"
}
```

---

### 2.4 `view_cart`

| Field | Value |
|---|---|
| **Event name** | `view_cart` |
| **Trigger** | Customer navigates to the cart page and `GET /api/cart` resolves |
| **Page** | `cart.html` |
| **Component** | `CartPage` (fires in `useEffect` after cart data loads) |

**Properties:**

```
{
  currency: "INR",
  value: number,               // cart subtotal e.g. 25470
  items_count: number,         // number of distinct items
  items: [
    {
      item_id: string,
      item_name: string,
      item_category: string,
      item_brand: string,
      quantity: number,
      price: number
    }
  ]
}
```

---

### 2.5 `begin_checkout`

| Field | Value |
|---|---|
| **Event name** | `begin_checkout` |
| **Trigger** | Customer clicks "Proceed to Checkout" from the cart page and the checkout page loads |
| **Page** | `checkout.html` |
| **Component** | `CheckoutPage` (fires in `useEffect` on mount) |

**Properties:**

```
{
  currency: "INR",
  value: number,               // cart total
  items_count: number,
  coupon: string | null,       // applied coupon code or null
  items: [
    {
      item_id: string,
      item_name: string,
      quantity: number,
      price: number
    }
  ]
}
```

---

### 2.6 `add_shipping_info`

| Field | Value |
|---|---|
| **Event name** | `add_shipping_info` |
| **Trigger** | Customer selects a shipping method during checkout and the selection is confirmed |
| **Page** | `checkout.html` |
| **Component** | `ShippingMethodSelector` (fires when user selects a shipping option from `GET /api/checkout/shipping-methods`) |

**Properties:**

```
{
  shipping_tier: string,       // "standard" | "express" | "same_day"
  shipping_cost: number,       // 49 or 0 (free)
  currency: "INR",
  value: number,               // order total at this step
  address_type: string         // "Home" | "Office"
}
```

---

### 2.7 `add_payment_info`

| Field | Value |
|---|---|
| **Event name** | `add_payment_info` |
| **Trigger** | Customer selects a payment method during checkout |
| **Page** | `checkout.html` |
| **Component** | `PaymentMethodSelector` (fires when user picks a payment option) |

**Properties:**

```
{
  payment_type: string,        // "upi" | "credit_card" | "debit_card" | "net_banking" | "wallet" | "cod"
  currency: "INR",
  value: number                // order total at this step
}
```

---

### 2.8 `purchase`

| Field | Value |
|---|---|
| **Event name** | `purchase` |
| **Trigger** | Order placement succeeds -- `POST /api/checkout/place-order` returns a success response with the order ID |
| **Page** | `checkout.html` (fires on the confirmation state, before redirect to order-tracking) |
| **Component** | `CheckoutPage` (fires in the `onSuccess` callback of the place-order mutation) |

**Properties:**

```
{
  transaction_id: string,      // "ORD-20260328-7291"
  value: number,               // 25519 (final total)
  currency: "INR",
  tax: number,                 // GST amount
  shipping: number,            // shipping cost
  coupon: string | null,
  discount_amount: number,     // total discount applied
  payment_type: string,        // "upi" | "credit_card" | etc.
  items_count: number,
  items: [
    {
      item_id: string,
      item_name: string,
      item_category: string,
      item_brand: string,
      quantity: number,
      price: number,
      seller_id: string
    }
  ]
}
```

---

### 2.9 `refund`

| Field | Value |
|---|---|
| **Event name** | `refund` |
| **Trigger** | Customer submits a return/refund request and `POST /api/orders/{orderId}/return` succeeds |
| **Page** | `returns.html` |
| **Component** | `ReturnRequestForm` (fires in the `onSuccess` callback of the return mutation) |

**Properties:**

```
{
  transaction_id: string,      // original order ID
  refund_id: string,           // return request ID
  value: number,               // refund amount
  currency: "INR",
  reason: string,              // "defective" | "wrong_item" | "not_as_described" | "changed_mind"
  items: [
    {
      item_id: string,
      item_name: string,
      quantity: number,
      price: number
    }
  ]
}
```

---

### 2.10 `update_cart_quantity`

| Field | Value |
|---|---|
| **Event name** | `update_cart_quantity` |
| **Trigger** | Customer changes the quantity dropdown on a cart item and `PUT /api/cart/items/{itemId}` succeeds |
| **Page** | `cart.html` |
| **Component** | `CartItemRow` (fires in the `onSuccess` callback of the quantity update mutation) |

**Properties:**

```
{
  item_id: string,
  item_name: string,
  previous_quantity: number,
  new_quantity: number,
  price: number,
  currency: "INR"
}
```

---

### 2.11 `apply_coupon`

| Field | Value |
|---|---|
| **Event name** | `apply_coupon` |
| **Trigger** | Customer enters a coupon code and clicks "Apply" -- fires regardless of success or failure |
| **Page** | `cart.html`, `checkout.html` |
| **Component** | `CouponInput` (fires after `POST /api/cart/coupon` returns) |

**Properties:**

```
{
  coupon_code: string,         // "SAVE20"
  success: boolean,            // whether the coupon was valid
  discount_amount: number,     // 0 if invalid
  currency: "INR",
  error_reason: string | null  // "expired" | "min_not_met" | "invalid" | null
}
```

---

## 3. Search and Discovery Events

### 3.1 `search`

| Field | Value |
|---|---|
| **Event name** | `search` |
| **Trigger** | Customer submits a search query (presses Enter or clicks the search icon) |
| **Page** | Any page with the global header search bar |
| **Component** | `SearchBar` (fires on form submit, before navigation to search results) |

**Properties:**

```
{
  search_term: string,         // "wireless headphones"
  source: string               // "header" | "home_hero" | "category_page"
}
```

---

### 3.2 `view_search_results`

| Field | Value |
|---|---|
| **Event name** | `view_search_results` |
| **Trigger** | Search results page loads and `POST /api/query/catalog-search` resolves with data |
| **Page** | `search-results.html` |
| **Component** | `SearchResultsPage` (fires in `useEffect` after search data loads) |

**Properties:**

```
{
  search_term: string,         // "wireless headphones"
  results_count: number,       // 1247
  page_num: number,            // 1
  sort_by: string,             // "relevance" | "price_asc" | "price_desc" | "newest" | "rating"
  filters_applied: {
    category: string | null,
    brand: string | null,
    price_min: number | null,
    price_max: number | null,
    rating: number | null,
    seller_id: string | null,
    availability: string       // "in_stock" | "all"
  },
  has_spelling_suggestion: boolean
}
```

---

### 3.3 `search_autocomplete_selected`

| Field | Value |
|---|---|
| **Event name** | `search_autocomplete_selected` |
| **Trigger** | Customer selects a suggestion from the autocomplete dropdown |
| **Page** | Any page with the global header search bar |
| **Component** | `SearchAutocomplete` (fires on dropdown item click) |

**Properties:**

```
{
  search_term: string,         // what the user typed so far
  selected_suggestion: string, // the autocomplete item they picked
  suggestion_type: string,     // "product" | "category" | "brand" | "query"
  suggestion_position: number  // 0-indexed position in the dropdown
}
```

---

### 3.4 `select_content`

| Field | Value |
|---|---|
| **Event name** | `select_content` |
| **Trigger** | Customer clicks on any content element (banner, category card, deal card) |
| **Page** | `storefront.html` |
| **Component** | `HeroBanner`, `CategoryGrid`, `DealCard` (fires on click) |

**Properties:**

```
{
  content_type: string,        // "banner" | "category" | "deal" | "featured_seller"
  item_id: string,             // "banner-001" or "cat-electronics"
  content_name: string,        // "Discover the Best Deals..." or "Electronics"
  position: number             // carousel/grid position (0-indexed)
}
```

---

### 3.5 `view_item_list`

| Field | Value |
|---|---|
| **Event name** | `view_item_list` |
| **Trigger** | A product list or grid becomes visible in the viewport (intersection observer) |
| **Page** | `storefront.html`, `product-listing.html`, `search-results.html` |
| **Component** | `ProductGrid` (fires via intersection observer when the list enters the viewport) |

**Properties:**

```
{
  item_list_name: string,      // "best_sellers" | "deals_of_the_day" | "search_results" | "category_electronics"
  item_list_id: string,        // internal list identifier
  items_count: number,
  items: [
    {
      item_id: string,
      item_name: string,
      item_category: string,
      price: number,
      position: number         // index in the list
    }
  ]
}
```

---

### 3.6 `select_item`

| Field | Value |
|---|---|
| **Event name** | `select_item` |
| **Trigger** | Customer clicks on a product card in any list or grid |
| **Page** | `storefront.html`, `product-listing.html`, `search-results.html`, `wishlist.html` |
| **Component** | `ProductCard` (fires on click) |

**Properties:**

```
{
  item_list_name: string,      // "best_sellers" | "search_results" | "category_electronics"
  item_id: string,             // "prod-201"
  item_name: string,
  item_category: string,
  price: number,
  position: number,            // index within the list
  seller_id: string
}
```

---

### 3.7 `view_promotion`

| Field | Value |
|---|---|
| **Event name** | `view_promotion` |
| **Trigger** | A promotional banner or deal section enters the viewport (intersection observer) |
| **Page** | `storefront.html`, `product-listing.html` |
| **Component** | `PromoBanner`, `DealSection` (fires via intersection observer) |

**Properties:**

```
{
  promotion_id: string,        // "banner-001"
  promotion_name: string,      // "Flash Sale 40% Off"
  creative_name: string,       // "hero-main" | "side-banner" | "deal-strip"
  creative_slot: string,       // "hero_carousel" | "sidebar" | "deals_row"
  position: number             // position in carousel or grid
}
```

---

### 3.8 `select_promotion`

| Field | Value |
|---|---|
| **Event name** | `select_promotion` |
| **Trigger** | Customer clicks on a promotional banner CTA |
| **Page** | `storefront.html`, `product-listing.html` |
| **Component** | `PromoBanner` (fires on CTA button click) |

**Properties:**

```
{
  promotion_id: string,
  promotion_name: string,
  creative_name: string,
  creative_slot: string,
  cta_url: string              // where the click leads
}
```

---

### 3.9 `filter_applied`

| Field | Value |
|---|---|
| **Event name** | `filter_applied` |
| **Trigger** | Customer applies or changes any filter on the search or listing page |
| **Page** | `search-results.html`, `product-listing.html` |
| **Component** | `FilterSidebar` (fires on each filter change that triggers a re-fetch) |

**Properties:**

```
{
  filter_type: string,         // "category" | "brand" | "price_range" | "rating" | "availability" | "seller"
  filter_value: string,        // "Electronics" | "Sony" | "1000-5000" | "4+" | "in_stock" | "seller-002"
  search_term: string | null,  // current search query if on search page
  results_count: number        // new results count after filter
}
```

---

### 3.10 `sort_changed`

| Field | Value |
|---|---|
| **Event name** | `sort_changed` |
| **Trigger** | Customer changes the sort dropdown on search or listing page |
| **Page** | `search-results.html`, `product-listing.html` |
| **Component** | `SortDropdown` (fires on selection change) |

**Properties:**

```
{
  sort_by: string,             // "relevance" | "price_asc" | "price_desc" | "newest" | "rating" | "popularity"
  previous_sort: string,
  search_term: string | null,
  results_count: number
}
```

---

## 4. User and Authentication Events

### 4.1 `login`

| Field | Value |
|---|---|
| **Event name** | `login` |
| **Trigger** | User successfully authenticates via `POST /api/auth/login`, Google OAuth callback, or OTP verification |
| **Page** | `login.html` |
| **Component** | `LoginForm`, `GoogleSignInButton`, `OtpVerificationForm` (fires in the `onSuccess` callback after token is received) |

**Properties:**

```
{
  method: "email" | "google" | "otp",
  user_role: string            // "customer" | "seller" | "admin" | "warehouse"
}
```

---

### 4.2 `sign_up`

| Field | Value |
|---|---|
| **Event name** | `sign_up` |
| **Trigger** | New account creation succeeds via `POST /api/auth/register` |
| **Page** | `login.html` (register tab) |
| **Component** | `RegisterForm` (fires in the `onSuccess` callback after account creation) |

**Properties:**

```
{
  method: "email" | "google" | "otp",
  user_role: string            // "customer" (default for new registrations)
}
```

---

### 4.3 `login_failed`

| Field | Value |
|---|---|
| **Event name** | `login_failed` |
| **Trigger** | Authentication attempt fails (invalid credentials, account locked, etc.) |
| **Page** | `login.html` |
| **Component** | `LoginForm` (fires in the `onError` callback) |

**Properties:**

```
{
  method: "email" | "google" | "otp",
  error_code: string,         // "INVALID_CREDENTIALS" | "ACCOUNT_LOCKED" | "OTP_EXPIRED"
  attempt_number: number       // sequential attempt count in this session
}
```

---

### 4.4 `logout`

| Field | Value |
|---|---|
| **Event name** | `logout` |
| **Trigger** | User clicks logout and `POST /api/auth/logout` is called |
| **Page** | Any page (via header dropdown) |
| **Component** | `UserMenu` (fires before clearing session) |

**Properties:**

```
{
  session_duration_seconds: number  // time since login
}
```

---

### 4.5 `page_view`

| Field | Value |
|---|---|
| **Event name** | `page_view` |
| **Trigger** | Every client-side route change (Next.js router event) |
| **Page** | All pages |
| **Component** | `AnalyticsProvider` (fires on Next.js `routeChangeComplete` event) |

**Properties:**

```
{
  page_title: string,          // "HomeBase - Wireless Headphones"
  page_location: string,       // full URL
  page_path: string,           // "/products/sony-wh-1000xm5"
  page_referrer: string,       // previous page path
  app_section: string          // "customer" | "seller" | "admin" | "warehouse"
}
```

---

### 4.6 `seller_filter_applied`

| Field | Value |
|---|---|
| **Event name** | `seller_filter_applied` |
| **Trigger** | Customer selects a seller from the global seller-scope dropdown in the header |
| **Page** | Any customer page (global header) |
| **Component** | `SellerFilterDropdown` (fires on selection change after `GET /api/catalog/sellers` provides the options) |

**Properties:**

```
{
  seller_id: string,           // "seller-001" or "all"
  seller_name: string,         // "Rajesh Store" or "All Sellers"
  previous_seller_id: string   // what was selected before
}
```

---

## 5. Customer Interaction Events

### 5.1 `add_to_wishlist`

| Field | Value |
|---|---|
| **Event name** | `add_to_wishlist` |
| **Trigger** | Customer clicks the heart/wishlist icon and `POST /api/wishlist` succeeds |
| **Page** | `product-detail.html`, `product-listing.html`, `search-results.html` |
| **Component** | `WishlistButton` (fires in `onSuccess` callback) |

**Properties:**

```
{
  item_id: string,
  item_name: string,
  item_category: string,
  price: number,
  currency: "INR",
  source_page: string          // "product_detail" | "product_listing" | "search_results"
}
```

---

### 5.2 `remove_from_wishlist`

| Field | Value |
|---|---|
| **Event name** | `remove_from_wishlist` |
| **Trigger** | Customer removes an item from their wishlist via `DELETE /api/wishlist/{itemId}` |
| **Page** | `wishlist.html`, `product-detail.html` |
| **Component** | `WishlistButton`, `WishlistItemCard` (fires in `onSuccess` callback) |

**Properties:**

```
{
  item_id: string,
  item_name: string,
  source_page: string          // "wishlist" | "product_detail"
}
```

---

### 5.3 `share_product`

| Field | Value |
|---|---|
| **Event name** | `share_product` |
| **Trigger** | Customer clicks the share button on a product detail page |
| **Page** | `product-detail.html` |
| **Component** | `ShareButton` (fires on click) |

**Properties:**

```
{
  item_id: string,
  item_name: string,
  share_method: string         // "copy_link" | "whatsapp" | "facebook" | "twitter" | "native_share"
}
```

---

### 5.4 `review_submitted`

| Field | Value |
|---|---|
| **Event name** | `review_submitted` |
| **Trigger** | Customer submits a product review and the `POST /api/reviews` call succeeds |
| **Page** | `product-detail.html`, `order-detail.html` |
| **Component** | `ReviewForm` (fires in `onSuccess` callback) |

**Properties:**

```
{
  item_id: string,
  order_id: string,
  rating: number,              // 1-5
  has_text: boolean,           // whether review body was provided
  has_images: boolean          // whether images were attached
}
```

---

### 5.5 `address_added`

| Field | Value |
|---|---|
| **Event name** | `address_added` |
| **Trigger** | Customer saves a new address via `POST /api/account/addresses` |
| **Page** | `checkout.html`, `my-account.html` |
| **Component** | `AddressForm` (fires in `onSuccess` callback) |

**Properties:**

```
{
  address_type: string,        // "Home" | "Office"
  city: string,
  state: string,
  source_page: string          // "checkout" | "my_account"
}
```

---

### 5.6 `order_tracked`

| Field | Value |
|---|---|
| **Event name** | `order_tracked` |
| **Trigger** | Customer views the order tracking page and timeline data loads |
| **Page** | `order-tracking.html` |
| **Component** | `OrderTrackingPage` (fires in `useEffect` after tracking data loads) |

**Properties:**

```
{
  order_id: string,
  current_status: string,      // "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered"
  carrier: string,
  days_since_order: number
}
```

---

### 5.7 `return_requested`

| Field | Value |
|---|---|
| **Event name** | `return_requested` |
| **Trigger** | Customer opens the return/exchange flow from order detail |
| **Page** | `order-detail.html`, `returns.html` |
| **Component** | `ReturnButton` (fires when the return modal opens) |

**Properties:**

```
{
  order_id: string,
  item_id: string,
  reason_category: string,     // "defective" | "wrong_item" | "not_as_described" | "changed_mind"
  days_since_delivery: number
}
```

---

## 6. Seller Portal Events

### 6.1 `seller_dashboard_viewed`

| Field | Value |
|---|---|
| **Event name** | `seller_dashboard_viewed` |
| **Trigger** | Seller lands on the dashboard and `GET /api/seller/dashboard/stats` resolves |
| **Page** | `seller-dashboard.html` |
| **Component** | `SellerDashboardPage` (fires in `useEffect` after stats load) |

**Properties:**

```
{
  revenue_total: number,
  orders_total: number,
  products_active: number,
  rating: number
}
```

---

### 6.2 `seller_product_created`

| Field | Value |
|---|---|
| **Event name** | `seller_product_created` |
| **Trigger** | Seller submits the add-product form and `POST /api/product` succeeds (Chenile Command POST) |
| **Page** | `seller-add-product.html` |
| **Component** | `AddProductForm` (fires in the `onSuccess` callback of the create product mutation) |

**Properties:**

```
{
  product_id: string,          // newly created product ID
  product_name: string,
  category: string,            // "Headphones"
  parent_category: string,     // "Electronics"
  price: number,
  has_variants: boolean,
  images_count: number,
  initial_stock: number
}
```

---

### 6.3 `seller_product_updated`

| Field | Value |
|---|---|
| **Event name** | `seller_product_updated` |
| **Trigger** | Seller saves edits to an existing product via `PATCH /api/product/{id}` STM event |
| **Page** | `seller-add-product.html` (edit mode) |
| **Component** | `AddProductForm` (fires in `onSuccess` callback when in edit mode) |

**Properties:**

```
{
  product_id: string,
  fields_changed: string[],    // ["price", "description", "images"]
  new_state: string            // product state after update
}
```

---

### 6.4 `seller_order_confirmed`

| Field | Value |
|---|---|
| **Event name** | `seller_order_confirmed` |
| **Trigger** | Seller clicks "Confirm" on a pending order and `PATCH /api/seller/orders/{id}` STM event (confirm) succeeds |
| **Page** | `seller-orders.html` |
| **Component** | `OrderActionsDropdown` (fires in `onSuccess` callback of the confirm mutation) |

**Properties:**

```
{
  order_id: string,
  amount: number,              // order value
  currency: "INR",
  items_count: number,
  time_to_confirm_hours: number  // hours between order placement and confirmation
}
```

---

### 6.5 `seller_order_shipped`

| Field | Value |
|---|---|
| **Event name** | `seller_order_shipped` |
| **Trigger** | Seller marks an order as shipped with carrier and tracking details via STM PATCH event |
| **Page** | `seller-orders.html` |
| **Component** | `ShipOrderModal` (fires in `onSuccess` callback after shipping details are submitted) |

**Properties:**

```
{
  order_id: string,
  carrier: string,             // "BlueDart" | "Delhivery" | "DTDC" | etc.
  tracking_number: string,
  amount: number,
  time_to_ship_hours: number   // hours between confirmation and shipment
}
```

---

### 6.6 `seller_review_replied`

| Field | Value |
|---|---|
| **Event name** | `seller_review_replied` |
| **Trigger** | Seller submits a reply to a customer review and the `POST /api/seller/reviews/{reviewId}/reply` call succeeds |
| **Page** | `seller-reviews.html` |
| **Component** | `ReviewReplyForm` (fires in `onSuccess` callback) |

**Properties:**

```
{
  review_id: string,
  review_rating: number,       // original review rating 1-5
  reply_length: number,        // character count
  time_to_reply_hours: number  // hours between review and reply
}
```

---

### 6.7 `seller_payout_requested`

| Field | Value |
|---|---|
| **Event name** | `seller_payout_requested` |
| **Trigger** | Seller requests a manual payout via the payments/settlements page |
| **Page** | `seller-payments.html`, `seller-settlements.html` |
| **Component** | `RequestPayoutButton` (fires in `onSuccess` callback) |

**Properties:**

```
{
  amount: number,
  currency: "INR",
  payout_method: string,       // "bank_transfer" | "upi"
  pending_balance: number      // balance before payout request
}
```

---

### 6.8 `seller_inventory_updated`

| Field | Value |
|---|---|
| **Event name** | `seller_inventory_updated` |
| **Trigger** | Seller updates stock quantity for a product on the inventory page |
| **Page** | `seller-inventory.html` |
| **Component** | `InventoryTable` (fires in `onSuccess` callback of the stock update) |

**Properties:**

```
{
  product_id: string,
  previous_quantity: number,
  new_quantity: number,
  sku: string
}
```

---

### 6.9 `seller_message_sent`

| Field | Value |
|---|---|
| **Event name** | `seller_message_sent` |
| **Trigger** | Seller sends a message to a customer or support from the messages page |
| **Page** | `seller-messages.html` |
| **Component** | `MessageComposer` (fires on message send) |

**Properties:**

```
{
  recipient_type: string,      // "customer" | "support"
  message_type: string,        // "text" | "image" | "attachment"
  thread_id: string
}
```

---

### 6.10 `seller_support_ticket_created`

| Field | Value |
|---|---|
| **Event name** | `seller_support_ticket_created` |
| **Trigger** | Seller creates a new support ticket via the support page |
| **Page** | `seller-support.html` |
| **Component** | `CreateTicketForm` (fires in `onSuccess` callback) |

**Properties:**

```
{
  ticket_category: string,     // "order_issue" | "payment_issue" | "account" | "technical" | "other"
  priority: string             // "low" | "medium" | "high"
}
```

---

### 6.11 `seller_document_uploaded`

| Field | Value |
|---|---|
| **Event name** | `seller_document_uploaded` |
| **Trigger** | Seller uploads a verification document via the documents page |
| **Page** | `seller-documents.html` |
| **Component** | `DocumentUploadForm` (fires after upload succeeds) |

**Properties:**

```
{
  document_type: string,       // "gst_certificate" | "pan_card" | "bank_proof" | "address_proof"
  file_type: string,           // "pdf" | "jpg" | "png"
  file_size_kb: number
}
```

---

### 6.12 `seller_analytics_viewed`

| Field | Value |
|---|---|
| **Event name** | `seller_analytics_viewed` |
| **Trigger** | Seller views the performance/analytics page |
| **Page** | `seller-performance.html` |
| **Component** | `SellerPerformancePage` (fires in `useEffect` on mount) |

**Properties:**

```
{
  period_selected: string,     // "7d" | "30d" | "90d" | "12m"
  metrics_viewed: string[]     // ["revenue", "orders", "conversion"]
}
```

---

### 6.13 `seller_settings_updated`

| Field | Value |
|---|---|
| **Event name** | `seller_settings_updated` |
| **Trigger** | Seller saves changes on the settings or store settings page |
| **Page** | `seller-settings.html`, `seller-store-settings.html` |
| **Component** | `SellerSettingsForm`, `StoreSettingsForm` (fires in `onSuccess` callback) |

**Properties:**

```
{
  settings_section: string,    // "profile" | "store" | "notifications" | "shipping_policy" | "return_policy"
  fields_changed: string[]
}
```

---

## 7. Admin Portal Events

### 7.1 `admin_dashboard_viewed`

| Field | Value |
|---|---|
| **Event name** | `admin_dashboard_viewed` |
| **Trigger** | Admin lands on the dashboard page and stats load |
| **Page** | `admin-dashboard.html` |
| **Component** | `AdminDashboardPage` (fires in `useEffect` after stats load) |

**Properties:**

```
{
  total_revenue: number,
  total_orders: number,
  total_sellers: number,
  total_users: number,
  period: string               // dashboard default period
}
```

---

### 7.2 `admin_product_approved`

| Field | Value |
|---|---|
| **Event name** | `admin_product_approved` |
| **Trigger** | Admin clicks "Approve" on a pending product and the PATCH STM event (approve) succeeds |
| **Page** | `admin-products.html` |
| **Component** | `ProductModerationActions` (fires in `onSuccess` callback of the approve mutation) |

**Properties:**

```
{
  product_id: string,
  seller_id: string,
  category: string,
  time_to_approve_hours: number  // hours between submission and approval
}
```

---

### 7.3 `admin_product_flagged`

| Field | Value |
|---|---|
| **Event name** | `admin_product_flagged` |
| **Trigger** | Admin flags a product for review via the PATCH STM event (flag) |
| **Page** | `admin-products.html` |
| **Component** | `ProductModerationActions` (fires in `onSuccess` callback of the flag mutation) |

**Properties:**

```
{
  product_id: string,
  seller_id: string,
  reason: string,              // "prohibited_content" | "counterfeit" | "misleading" | "policy_violation" | "other"
  notes: string | null
}
```

---

### 7.4 `admin_product_removed`

| Field | Value |
|---|---|
| **Event name** | `admin_product_removed` |
| **Trigger** | Admin removes a product from the catalog via STM event (remove) |
| **Page** | `admin-products.html` |
| **Component** | `ProductModerationActions` (fires in `onSuccess` callback of the remove mutation) |

**Properties:**

```
{
  product_id: string,
  seller_id: string,
  reason: string,
  was_flagged: boolean         // whether it was previously flagged
}
```

---

### 7.5 `admin_seller_approved`

| Field | Value |
|---|---|
| **Event name** | `admin_seller_approved` |
| **Trigger** | Admin approves a pending seller application via PATCH STM event (approve) |
| **Page** | `admin-sellers.html` |
| **Component** | `SellerModerationActions` (fires in `onSuccess` callback) |

**Properties:**

```
{
  seller_id: string,
  seller_name: string,
  time_to_approve_hours: number,
  documents_verified: boolean
}
```

---

### 7.6 `admin_seller_suspended`

| Field | Value |
|---|---|
| **Event name** | `admin_seller_suspended` |
| **Trigger** | Admin suspends an active seller via PATCH STM event (suspend) |
| **Page** | `admin-sellers.html` |
| **Component** | `SellerModerationActions` (fires in `onSuccess` callback) |

**Properties:**

```
{
  seller_id: string,
  seller_name: string,
  reason: string,              // "policy_violation" | "fraud" | "poor_performance" | "inactive" | "other"
  active_orders_count: number, // orders in progress that are affected
  active_products_count: number
}
```

---

### 7.7 `admin_promotion_created`

| Field | Value |
|---|---|
| **Event name** | `admin_promotion_created` |
| **Trigger** | Admin creates a new campaign/coupon via `POST /api/admin/promotions` (Chenile Command POST) |
| **Page** | `admin-promotions.html` |
| **Component** | `CreateCampaignModal` (fires in `onSuccess` callback) |

**Properties:**

```
{
  promotion_id: string,
  promotion_name: string,
  type: string,                // "percentage" | "fixed_amount" | "bogo" | "free_shipping"
  discount: number,            // 20 (for 20% off) or 500 (for INR 500 off)
  discount_unit: string,       // "percent" | "amount"
  start_date: string,
  end_date: string,
  target_audience: string      // "all" | "new_users" | "returning" | "specific_segment"
}
```

---

### 7.8 `admin_promotion_state_changed`

| Field | Value |
|---|---|
| **Event name** | `admin_promotion_state_changed` |
| **Trigger** | Admin activates, pauses, or ends a promotion via PATCH STM event |
| **Page** | `admin-promotions.html` |
| **Component** | `CampaignActionsDropdown` (fires in `onSuccess` callback) |

**Properties:**

```
{
  promotion_id: string,
  previous_state: string,      // "draft" | "active" | "paused"
  new_state: string,           // "active" | "paused" | "ended"
  redemption_count: number     // uses so far
}
```

---

### 7.9 `admin_order_action`

| Field | Value |
|---|---|
| **Event name** | `admin_order_action` |
| **Trigger** | Admin performs any action on an order (cancel, refund, escalate) |
| **Page** | `admin-orders.html` |
| **Component** | `OrderActionsDropdown` (fires in `onSuccess` callback) |

**Properties:**

```
{
  order_id: string,
  action: string,              // "cancel" | "refund" | "escalate" | "reassign_seller"
  reason: string | null,
  amount: number | null        // for refund actions
}
```

---

### 7.10 `admin_user_action`

| Field | Value |
|---|---|
| **Event name** | `admin_user_action` |
| **Trigger** | Admin performs an action on a user account (activate, deactivate, reset password) |
| **Page** | `admin-users.html` |
| **Component** | `UserActionsDropdown` (fires in `onSuccess` callback) |

**Properties:**

```
{
  target_user_id: string,
  action: string,              // "activate" | "deactivate" | "reset_password" | "change_role"
  user_role: string            // target user's role
}
```

---

### 7.11 `admin_review_moderated`

| Field | Value |
|---|---|
| **Event name** | `admin_review_moderated` |
| **Trigger** | Admin approves or removes a flagged review |
| **Page** | `admin-reviews.html` |
| **Component** | `ReviewModerationActions` (fires in `onSuccess` callback) |

**Properties:**

```
{
  review_id: string,
  action: string,              // "approve" | "remove"
  reason: string | null,       // removal reason
  product_id: string,
  reviewer_id: string
}
```

---

### 7.12 `admin_return_processed`

| Field | Value |
|---|---|
| **Event name** | `admin_return_processed` |
| **Trigger** | Admin approves or rejects a return request |
| **Page** | `admin-returns.html` |
| **Component** | `ReturnActionsDropdown` (fires in `onSuccess` callback) |

**Properties:**

```
{
  return_id: string,
  order_id: string,
  action: string,              // "approve" | "reject"
  refund_amount: number,
  reason: string | null
}
```

---

### 7.13 `admin_compliance_action`

| Field | Value |
|---|---|
| **Event name** | `admin_compliance_action` |
| **Trigger** | Admin takes a compliance action (issue warning, restrict account) |
| **Page** | `admin-compliance.html` |
| **Component** | `ComplianceActionsDropdown` (fires in `onSuccess` callback) |

**Properties:**

```
{
  target_type: string,         // "seller" | "product" | "user"
  target_id: string,
  action: string,              // "warning" | "restrict" | "unrestrict" | "ban"
  violation_type: string       // "ip_infringement" | "counterfeit" | "prohibited_item" | "fraud"
}
```

---

### 7.14 `admin_cms_published`

| Field | Value |
|---|---|
| **Event name** | `admin_cms_published` |
| **Trigger** | Admin publishes or updates CMS content (banners, pages, announcements) |
| **Page** | `admin-cms.html` |
| **Component** | `CmsEditor` (fires in `onSuccess` callback) |

**Properties:**

```
{
  content_type: string,        // "banner" | "page" | "announcement" | "faq"
  content_id: string,
  action: string,              // "publish" | "update" | "unpublish"
  placement: string | null     // "hero" | "side" | "deal" (for banners)
}
```

---

### 7.15 `admin_analytics_report_viewed`

| Field | Value |
|---|---|
| **Event name** | `admin_analytics_report_viewed` |
| **Trigger** | Admin views the analytics page and selects a report type or date range |
| **Page** | `admin-analytics.html` |
| **Component** | `AdminAnalyticsPage` (fires on page load and on filter change) |

**Properties:**

```
{
  report_type: string,         // "revenue" | "orders" | "users" | "sellers" | "products"
  period: string,              // "7d" | "30d" | "90d" | "custom"
  date_from: string | null,
  date_to: string | null
}
```

---

### 7.16 `admin_export_requested`

| Field | Value |
|---|---|
| **Event name** | `admin_export_requested` |
| **Trigger** | Admin clicks the Export button on any admin table |
| **Page** | `admin-products.html`, `admin-sellers.html`, `admin-orders.html`, `admin-users.html` |
| **Component** | `ExportButton` (fires on click) |

**Properties:**

```
{
  export_type: string,         // "products" | "sellers" | "orders" | "users" | "returns"
  format: string,              // "csv" | "xlsx"
  filters_applied: boolean,
  record_count: number         // estimated rows to export
}
```

---

## 8. Warehouse Portal Events

### 8.1 `warehouse_dashboard_viewed`

| Field | Value |
|---|---|
| **Event name** | `warehouse_dashboard_viewed` |
| **Trigger** | Warehouse operator lands on the dashboard and stats load |
| **Page** | `warehouse-dashboard.html` |
| **Component** | `WarehouseDashboardPage` (fires in `useEffect` after stats load) |

**Properties:**

```
{
  pending_pick: number,
  picking_active: number,
  packing_in_progress: number,
  ready_to_ship: number,
  dispatched_today: number
}
```

---

### 8.2 `warehouse_shipment_received`

| Field | Value |
|---|---|
| **Event name** | `warehouse_shipment_received` |
| **Trigger** | Warehouse operator marks an inbound shipment as received via PATCH STM event (receive) |
| **Page** | `warehouse-inbound.html` |
| **Component** | `InboundShipmentActions` (fires in `onSuccess` callback of the receive action) |

**Properties:**

```
{
  shipment_id: string,
  seller_id: string,
  items_count: number,         // number of distinct SKUs
  total_units: number,         // total unit count across all SKUs
  expected_items: number,
  discrepancy: boolean,        // true if received count differs from expected
  receiving_time_minutes: number
}
```

---

### 8.3 `warehouse_order_picked`

| Field | Value |
|---|---|
| **Event name** | `warehouse_order_picked` |
| **Trigger** | Warehouse operator completes picking for an order via PATCH STM event (pick_complete) |
| **Page** | `warehouse-orders.html` |
| **Component** | `PickQueueTable` (fires in `onSuccess` callback after marking pick complete) |

**Properties:**

```
{
  order_id: string,
  items_count: number,
  time_taken_minutes: number,  // time from pick_start to pick_complete
  picker_id: string,
  zone: string | null          // warehouse zone
}
```

---

### 8.4 `warehouse_order_packed`

| Field | Value |
|---|---|
| **Event name** | `warehouse_order_packed` |
| **Trigger** | Warehouse operator completes packing and enters weight/dimensions via PATCH STM event (pack_complete) |
| **Page** | `warehouse-orders.html` |
| **Component** | `PackOrderModal` (fires in `onSuccess` callback) |

**Properties:**

```
{
  order_id: string,
  weight_grams: number,
  box_size: string,            // "small" | "medium" | "large" | "custom"
  items_count: number,
  packing_time_minutes: number
}
```

---

### 8.5 `warehouse_order_dispatched`

| Field | Value |
|---|---|
| **Event name** | `warehouse_order_dispatched` |
| **Trigger** | Warehouse operator dispatches a packed order to the carrier via PATCH STM event (dispatch) |
| **Page** | `warehouse-shipments.html` |
| **Component** | `DispatchAction` (fires in `onSuccess` callback after AWB/tracking is confirmed) |

**Properties:**

```
{
  order_id: string,
  carrier: string,             // "BlueDart" | "Delhivery" | "DTDC" | "Ekart"
  tracking_number: string,
  weight_grams: number,
  dispatch_method: string      // "pickup" | "drop_off"
}
```

---

### 8.6 `warehouse_order_assigned`

| Field | Value |
|---|---|
| **Event name** | `warehouse_order_assigned` |
| **Trigger** | Warehouse supervisor assigns an order to a picker via PATCH STM event (assign) |
| **Page** | `warehouse-orders.html` |
| **Component** | `AssignPickerDropdown` (fires in `onSuccess` callback) |

**Properties:**

```
{
  order_id: string,
  picker_id: string,
  picker_name: string,
  priority: string,            // "normal" | "urgent" | "same_day"
  items_count: number
}
```

---

### 8.7 `warehouse_inventory_adjusted`

| Field | Value |
|---|---|
| **Event name** | `warehouse_inventory_adjusted` |
| **Trigger** | Warehouse operator adjusts inventory (cycle count, damage write-off, etc.) |
| **Page** | `warehouse-inventory.html` |
| **Component** | `InventoryAdjustmentForm` (fires in `onSuccess` callback) |

**Properties:**

```
{
  product_id: string,
  sku: string,
  adjustment_type: string,     // "cycle_count" | "damage" | "return_restock" | "manual"
  previous_quantity: number,
  new_quantity: number,
  reason: string
}
```

---

### 8.8 `warehouse_pickup_scheduled`

| Field | Value |
|---|---|
| **Event name** | `warehouse_pickup_scheduled` |
| **Trigger** | Warehouse operator schedules a carrier pickup |
| **Page** | `warehouse-shipments.html` |
| **Component** | `SchedulePickupModal` (fires in `onSuccess` callback) |

**Properties:**

```
{
  carrier: string,
  pickup_date: string,         // ISO date
  pickup_slot: string,         // "morning" | "afternoon" | "evening"
  shipments_count: number,     // number of packages for this pickup
  total_weight_kg: number
}
```

---

### 8.9 `warehouse_print_pick_list`

| Field | Value |
|---|---|
| **Event name** | `warehouse_print_pick_list` |
| **Trigger** | Warehouse operator clicks "Print Pick List" button |
| **Page** | `warehouse-orders.html` |
| **Component** | `PrintPickListButton` (fires on click) |

**Properties:**

```
{
  orders_count: number,        // number of orders on the pick list
  items_count: number          // total items across all orders
}
```

---

## 9. Error and Performance Events

### 9.1 `api_error`

| Field | Value |
|---|---|
| **Event name** | `api_error` |
| **Trigger** | Any API call returns an error (4xx or 5xx) or times out |
| **Page** | All pages |
| **Component** | `ApiClient` (global axios/fetch interceptor) |

**Properties:**

```
{
  endpoint: string,            // "/api/cart"
  method: string,              // "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  status_code: number,         // 400, 401, 403, 404, 500
  error_code: string | null,   // application error code e.g. "INVALID_CREDENTIALS"
  response_time_ms: number
}
```

---

### 9.2 `page_load_time`

| Field | Value |
|---|---|
| **Event name** | `page_load_time` |
| **Trigger** | Page finishes loading (measured via Performance API) |
| **Page** | All pages |
| **Component** | `PerformanceMonitor` (fires after `window.onload`) |

**Properties:**

```
{
  page_path: string,
  ttfb_ms: number,             // time to first byte
  fcp_ms: number,              // first contentful paint
  lcp_ms: number,              // largest contentful paint
  tti_ms: number,              // time to interactive
  total_load_ms: number
}
```

---

### 9.3 `client_error`

| Field | Value |
|---|---|
| **Event name** | `client_error` |
| **Trigger** | Unhandled JavaScript error or React error boundary catch |
| **Page** | All pages |
| **Component** | `ErrorBoundary`, `window.onerror` handler |

**Properties:**

```
{
  error_message: string,
  error_stack: string,         // first 500 chars of stack trace
  component_name: string | null,
  page_path: string
}
```

---

## 10. Funnel Definitions

### 10.1 Purchase Funnel

Tracks the customer journey from product discovery to completed purchase. Drop-off between each step is the primary metric.

| Step | Event | Required |
|---|---|---|
| 1 | `view_item` | Yes |
| 2 | `add_to_cart` | Yes |
| 3 | `view_cart` | Yes |
| 4 | `begin_checkout` | Yes |
| 5 | `add_shipping_info` | Yes |
| 6 | `add_payment_info` | Yes |
| 7 | `purchase` | Yes |

**Key metrics:**
- Overall conversion rate: `purchase / view_item`
- Cart abandonment rate: `1 - (begin_checkout / view_cart)`
- Checkout abandonment rate: `1 - (purchase / begin_checkout)`
- Average steps to purchase
- Average time from `view_item` to `purchase`

---

### 10.2 Search-to-Purchase Funnel

Tracks how effectively search drives purchases.

| Step | Event | Required |
|---|---|---|
| 1 | `search` | Yes |
| 2 | `view_search_results` | Yes |
| 3 | `select_item` (from search results) | Yes |
| 4 | `view_item` | Yes |
| 5 | `add_to_cart` | Yes |
| 6 | `purchase` | Yes |

**Key metrics:**
- Search-to-click rate: `select_item / view_search_results`
- Search-to-cart rate: `add_to_cart / search`
- Search-to-purchase rate: `purchase / search`
- Zero-results rate: searches with `results_count = 0`

---

### 10.3 Seller Onboarding Funnel

Tracks new seller registration through first sale.

| Step | Event | Required |
|---|---|---|
| 1 | `sign_up` (method, role=seller) | Yes |
| 2 | `seller_document_uploaded` (first document) | Yes |
| 3 | `seller_settings_updated` (store profile) | Yes |
| 4 | `seller_product_created` (first product) | Yes |
| 5 | `admin_seller_approved` | Yes |
| 6 | `seller_order_confirmed` (first order) | Yes |

**Key metrics:**
- Registration-to-product rate: `seller_product_created / sign_up`
- Registration-to-first-sale rate: `seller_order_confirmed / sign_up`
- Average days from sign-up to first product
- Average days from sign-up to approval
- Average days from approval to first sale
- Drop-off stage (which step loses the most sellers)

---

### 10.4 Warehouse Fulfillment Funnel

Tracks the order lifecycle inside the warehouse.

| Step | Event | Required |
|---|---|---|
| 1 | `warehouse_order_assigned` | Yes |
| 2 | `warehouse_order_picked` | Yes |
| 3 | `warehouse_order_packed` | Yes |
| 4 | `warehouse_order_dispatched` | Yes |

**Key metrics:**
- Average pick time: mean of `time_taken_minutes` from `warehouse_order_picked`
- Average pack time: mean of `packing_time_minutes` from `warehouse_order_packed`
- Average total fulfillment time: assigned to dispatched
- Orders exceeding SLA threshold
- Pick accuracy rate (orders without discrepancy)

---

### 10.5 Return/Refund Funnel

Tracks the return process from initiation to resolution.

| Step | Event | Required |
|---|---|---|
| 1 | `return_requested` | Yes |
| 2 | `refund` (submission) | Yes |
| 3 | `admin_return_processed` (approve/reject) | Yes |

**Key metrics:**
- Return rate: `return_requested / purchase`
- Approval rate: approved `admin_return_processed` / `refund`
- Average days to resolution
- Return reasons distribution

---

## 11. Session Properties

These properties are set once per session and attached to every event automatically by the `track()` wrapper. They do not need to be passed by individual components.

| Property | Type | Description | Source |
|---|---|---|---|
| `session_id` | `string` | Unique browser session ID | Generated on first page load, stored in sessionStorage |
| `user_role` | `string` | `"customer"`, `"seller"`, `"admin"`, `"warehouse"`, `"anonymous"` | Decoded from Keycloak JWT after login |
| `tenant_id` | `string` | Multi-tenant organization identifier | From auth token or URL subdomain |
| `device_type` | `string` | `"desktop"`, `"mobile"`, `"tablet"` | User-agent parsing |
| `screen_resolution` | `string` | e.g. `"1920x1080"` | `window.screen.width` x `window.screen.height` |
| `viewport_size` | `string` | e.g. `"1440x900"` | `window.innerWidth` x `window.innerHeight` |
| `language` | `string` | Browser language, e.g. `"en-IN"` | `navigator.language` |
| `timezone` | `string` | e.g. `"Asia/Kolkata"` | `Intl.DateTimeFormat().resolvedOptions().timeZone` |
| `is_returning_user` | `boolean` | Whether the user has visited before | Check for existing localStorage flag |
| `entry_page` | `string` | First page path in this session | Captured on first `page_view` |
| `utm_source` | `string` | UTM source param | URL query param |
| `utm_medium` | `string` | UTM medium param | URL query param |
| `utm_campaign` | `string` | UTM campaign param | URL query param |
| `utm_content` | `string` | UTM content param | URL query param |
| `utm_term` | `string` | UTM term param | URL query param |

---

## 12. User Properties

These properties are set once per identified user and persist across sessions. They are updated when the user profile changes.

| Property | Type | Description | When Set |
|---|---|---|---|
| `user_id` | `string` | Authenticated user ID from Keycloak | On `login` or `sign_up` |
| `user_email` | `string` | User email (hashed for privacy) | On `login` or `sign_up` |
| `user_role` | `string` | `"customer"`, `"seller"`, `"admin"`, `"warehouse"` | On `login` |
| `seller_id` | `string \| null` | Seller account ID (for seller users) | On `login` when role is seller |
| `seller_name` | `string \| null` | Seller store name | On `login` when role is seller |
| `seller_tier` | `string \| null` | `"basic"`, `"premium"`, `"enterprise"` | On seller dashboard load |
| `seller_rating` | `number \| null` | Current seller rating | On seller dashboard load |
| `subscription_tier` | `string \| null` | Subscription plan tier | On `login` |
| `account_created_date` | `string` | ISO date of account creation | On `sign_up` or first `login` |
| `total_orders` | `number` | Lifetime order count | Updated on each `purchase` |
| `total_spend` | `number` | Lifetime spend amount | Updated on each `purchase` |
| `last_purchase_date` | `string \| null` | ISO date of last purchase | Updated on each `purchase` |
| `preferred_payment_method` | `string \| null` | Most-used payment method | Updated on each `purchase` |
| `city` | `string \| null` | User city from default address | On address save |
| `state` | `string \| null` | User state from default address | On address save |

---

## 13. Implementation Reference

### 13.1 Track Function Signature

All events are fired through a single `track()` function exported from the analytics module. Individual components import and call this function.

```typescript
// lib/analytics.ts

type EventName =
  // E-commerce
  | 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'view_cart'
  | 'begin_checkout' | 'add_shipping_info' | 'add_payment_info'
  | 'purchase' | 'refund' | 'update_cart_quantity' | 'apply_coupon'
  // Search & Discovery
  | 'search' | 'view_search_results' | 'search_autocomplete_selected'
  | 'select_content' | 'view_item_list' | 'select_item'
  | 'view_promotion' | 'select_promotion'
  | 'filter_applied' | 'sort_changed'
  // User
  | 'login' | 'sign_up' | 'login_failed' | 'logout' | 'page_view'
  | 'seller_filter_applied'
  // Customer
  | 'add_to_wishlist' | 'remove_from_wishlist' | 'share_product'
  | 'review_submitted' | 'address_added'
  | 'order_tracked' | 'return_requested'
  // Seller
  | 'seller_dashboard_viewed' | 'seller_product_created'
  | 'seller_product_updated' | 'seller_order_confirmed'
  | 'seller_order_shipped' | 'seller_review_replied'
  | 'seller_payout_requested' | 'seller_inventory_updated'
  | 'seller_message_sent' | 'seller_support_ticket_created'
  | 'seller_document_uploaded' | 'seller_analytics_viewed'
  | 'seller_settings_updated'
  // Admin
  | 'admin_dashboard_viewed' | 'admin_product_approved'
  | 'admin_product_flagged' | 'admin_product_removed'
  | 'admin_seller_approved' | 'admin_seller_suspended'
  | 'admin_promotion_created' | 'admin_promotion_state_changed'
  | 'admin_order_action' | 'admin_user_action'
  | 'admin_review_moderated' | 'admin_return_processed'
  | 'admin_compliance_action' | 'admin_cms_published'
  | 'admin_analytics_report_viewed' | 'admin_export_requested'
  // Warehouse
  | 'warehouse_dashboard_viewed' | 'warehouse_shipment_received'
  | 'warehouse_order_picked' | 'warehouse_order_packed'
  | 'warehouse_order_dispatched' | 'warehouse_order_assigned'
  | 'warehouse_inventory_adjusted' | 'warehouse_pickup_scheduled'
  | 'warehouse_print_pick_list'
  // Error & Performance
  | 'api_error' | 'page_load_time' | 'client_error';

function track(event: EventName, properties: Record<string, unknown>): void;
function identify(userId: string, traits: Record<string, unknown>): void;
function setSessionProperties(properties: Record<string, unknown>): void;
```

### 13.2 Provider Setup

The analytics provider wraps the application root and handles automatic `page_view` tracking, session initialization, and UTM capture.

```typescript
// components/AnalyticsProvider.tsx
//
// Responsibilities:
//   - Initialize session properties on mount
//   - Parse and store UTM params from URL
//   - Listen to Next.js router events for automatic page_view
//   - Set user properties on login/logout
//   - Provide track() context to child components
```

### 13.3 Page-to-Event Matrix

Summary of which events fire on each page.

| Page | Events |
|---|---|
| `storefront.html` | `page_view`, `view_item_list`, `select_item`, `select_content`, `view_promotion`, `select_promotion`, `seller_filter_applied` |
| `product-listing.html` | `page_view`, `view_item_list`, `select_item`, `filter_applied`, `sort_changed`, `add_to_cart`, `add_to_wishlist`, `view_promotion`, `select_promotion` |
| `search-results.html` | `page_view`, `view_search_results`, `select_item`, `filter_applied`, `sort_changed`, `add_to_cart`, `add_to_wishlist` |
| `product-detail.html` | `page_view`, `view_item`, `add_to_cart`, `add_to_wishlist`, `remove_from_wishlist`, `share_product`, `review_submitted` |
| `cart.html` | `page_view`, `view_cart`, `remove_from_cart`, `update_cart_quantity`, `apply_coupon` |
| `checkout.html` | `page_view`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`, `apply_coupon`, `address_added` |
| `wishlist.html` | `page_view`, `add_to_cart`, `remove_from_wishlist` |
| `login.html` | `page_view`, `login`, `sign_up`, `login_failed` |
| `my-account.html` | `page_view`, `address_added`, `logout` |
| `my-orders.html` | `page_view` |
| `order-detail.html` | `page_view`, `return_requested`, `review_submitted` |
| `order-tracking.html` | `page_view`, `order_tracked` |
| `returns.html` | `page_view`, `refund` |
| `seller-dashboard.html` | `page_view`, `seller_dashboard_viewed` |
| `seller-add-product.html` | `page_view`, `seller_product_created`, `seller_product_updated` |
| `seller-products.html` | `page_view` |
| `seller-orders.html` | `page_view`, `seller_order_confirmed`, `seller_order_shipped` |
| `seller-reviews.html` | `page_view`, `seller_review_replied` |
| `seller-inventory.html` | `page_view`, `seller_inventory_updated` |
| `seller-payments.html` | `page_view`, `seller_payout_requested` |
| `seller-settlements.html` | `page_view`, `seller_payout_requested` |
| `seller-messages.html` | `page_view`, `seller_message_sent` |
| `seller-support.html` | `page_view`, `seller_support_ticket_created` |
| `seller-documents.html` | `page_view`, `seller_document_uploaded` |
| `seller-performance.html` | `page_view`, `seller_analytics_viewed` |
| `seller-profile.html` | `page_view`, `seller_settings_updated` |
| `seller-settings.html` | `page_view`, `seller_settings_updated` |
| `seller-store-settings.html` | `page_view`, `seller_settings_updated` |
| `seller-returns.html` | `page_view` |
| `admin-dashboard.html` | `page_view`, `admin_dashboard_viewed` |
| `admin-products.html` | `page_view`, `admin_product_approved`, `admin_product_flagged`, `admin_product_removed`, `admin_export_requested` |
| `admin-sellers.html` | `page_view`, `admin_seller_approved`, `admin_seller_suspended`, `admin_export_requested` |
| `admin-orders.html` | `page_view`, `admin_order_action`, `admin_export_requested` |
| `admin-users.html` | `page_view`, `admin_user_action`, `admin_export_requested` |
| `admin-promotions.html` | `page_view`, `admin_promotion_created`, `admin_promotion_state_changed` |
| `admin-reviews.html` | `page_view`, `admin_review_moderated` |
| `admin-returns.html` | `page_view`, `admin_return_processed` |
| `admin-compliance.html` | `page_view`, `admin_compliance_action` |
| `admin-cms.html` | `page_view`, `admin_cms_published` |
| `admin-analytics.html` | `page_view`, `admin_analytics_report_viewed` |
| `warehouse-dashboard.html` | `page_view`, `warehouse_dashboard_viewed` |
| `warehouse-orders.html` | `page_view`, `warehouse_order_assigned`, `warehouse_order_picked`, `warehouse_order_packed`, `warehouse_print_pick_list` |
| `warehouse-inbound.html` | `page_view`, `warehouse_shipment_received` |
| `warehouse-shipments.html` | `page_view`, `warehouse_order_dispatched`, `warehouse_pickup_scheduled` |
| `warehouse-inventory.html` | `page_view`, `warehouse_inventory_adjusted` |

### 13.4 Event Volume Estimates

Approximate daily event volume for capacity planning (assuming 10,000 DAU customers, 200 active sellers, 5 admin users, 20 warehouse operators).

| Event Category | Estimated Daily Events |
|---|---|
| `page_view` | 150,000 |
| E-commerce events (view_item through purchase) | 80,000 |
| Search and discovery events | 40,000 |
| User auth events (login, signup, logout) | 12,000 |
| Customer interaction events (wishlist, review, share) | 8,000 |
| Seller portal events | 3,000 |
| Admin portal events | 500 |
| Warehouse portal events | 2,000 |
| Error and performance events | 5,000 |
| **Total** | **~300,000 events/day** |
