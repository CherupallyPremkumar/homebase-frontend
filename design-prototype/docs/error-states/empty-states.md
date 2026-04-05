# Empty States - Every List and Collection

> Empty states appear when a list, table, or collection has zero items.
> Each empty state includes an icon, title, description, primary action, and optional secondary action.
> Empty states should feel helpful, not like dead ends -- always guide the user toward a next step.

---

## Global Empty State Rules

| Rule | Value |
|---|---|
| Container | Centered, `max-w-sm`, `py-16 px-8` |
| Icon size | `w-16 h-16` (64px) |
| Icon color | `text-gray-300` |
| Icon style | Outlined stroke icons (not filled) |
| Title font | `text-lg font-semibold text-gray-900` |
| Description font | `text-sm text-gray-500 text-center max-w-xs` |
| Primary button | `bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium` |
| Secondary action | `text-indigo-600 text-sm underline` or ghost button |
| Spacing | Icon -> Title: `mt-4`, Title -> Description: `mt-2`, Description -> Button: `mt-6` |
| Animation | Icon has a subtle float animation (translateY -4px, 3s ease-in-out, infinite) |

---

## Buyer Empty States

### 1. Empty Cart

**Displayed on:** `/cart`

```
+-----------------------------------------------+
|                                               |
|            [ShoppingBag icon]                 |
|             (gray-300, 64px)                  |
|                                               |
|          Your cart is empty                   |
|                                               |
|    Looks like you haven't added anything      |
|    to your cart yet. Browse our collection    |
|    to find something you'll love.             |
|                                               |
|         [ Continue Shopping ]                 |
|                                               |
|          View your wishlist                   |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `ShoppingBag` (Lucide) |
| Title | "Your cart is empty" |
| Description | "Looks like you haven't added anything to your cart yet. Browse our collection to find something you'll love." |
| Primary button | "Continue Shopping" -- navigates to `/products` |
| Secondary link | "View your wishlist" -- navigates to `/wishlist` |

---

### 2. Empty Orders (Buyer)

**Displayed on:** `/orders`

```
+-----------------------------------------------+
|                                               |
|              [Package icon]                   |
|             (gray-300, 64px)                  |
|                                               |
|           No orders yet                       |
|                                               |
|    You haven't placed any orders yet.         |
|    When you do, they'll appear here for       |
|    you to track.                              |
|                                               |
|          [ Start Shopping ]                   |
|                                               |
|         Browse deals and offers               |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Package` (Lucide) |
| Title | "No orders yet" |
| Description | "You haven't placed any orders yet. When you do, they'll appear here for you to track." |
| Primary button | "Start Shopping" -- navigates to `/products` |
| Secondary link | "Browse deals and offers" -- navigates to `/products?sort=deals` |

---

### 3. Empty Wishlist

**Displayed on:** `/wishlist`

```
+-----------------------------------------------+
|                                               |
|               [Heart icon]                    |
|             (gray-300, 64px)                  |
|                                               |
|          Nothing saved yet                    |
|                                               |
|    Save items you love by tapping the         |
|    heart icon on any product. They'll show    |
|    up here so you can find them easily.       |
|                                               |
|         [ Browse Products ]                   |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Heart` (Lucide) |
| Title | "Nothing saved yet" |
| Description | "Save items you love by tapping the heart icon on any product. They'll show up here so you can find them easily." |
| Primary button | "Browse Products" -- navigates to `/products` |
| Secondary link | None |

---

### 4. Empty Search Results

**Displayed on:** `/products?search={query}`, `/orders?search={query}`, any page with search

```
+-----------------------------------------------+
|                                               |
|              [Search icon]                    |
|             (gray-300, 64px)                  |
|                                               |
|     No results for "{query}"                  |
|                                               |
|    We couldn't find anything matching your    |
|    search. Try different keywords or          |
|    check for typos.                           |
|                                               |
|          [ Clear Search ]                     |
|                                               |
|    Suggestions:                               |
|    - Check spelling                           |
|    - Use more general terms                   |
|    - Try fewer filters                        |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Search` (Lucide) |
| Title | "No results for \"{query}\"" (display the actual search term) |
| Description | "We couldn't find anything matching your search. Try different keywords or check for typos." |
| Primary button | "Clear Search" -- clears search input and resets filters |
| Suggestions list | Bulleted list: "Check spelling", "Use more general terms", "Try fewer filters" |
| Suggestions style | `text-sm text-gray-400`, left-aligned within centered container |

---

### 5. Empty Returns (Buyer)

**Displayed on:** `/returns`

```
+-----------------------------------------------+
|                                               |
|            [RotateCcw icon]                   |
|             (gray-300, 64px)                  |
|                                               |
|            No returns                         |
|                                               |
|    You don't have any return requests.        |
|    If you need to return an item, you can     |
|    start from your order details page.        |
|                                               |
|          [ View Orders ]                      |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `RotateCcw` (Lucide) |
| Title | "No returns" |
| Description | "You don't have any return requests. If you need to return an item, you can start from your order details page." |
| Primary button | "View Orders" -- navigates to `/orders` |
| Secondary link | None |

---

### 6. Empty Reviews (Buyer)

**Displayed on:** `/reviews` (buyer's submitted reviews)

```
+-----------------------------------------------+
|                                               |
|               [Star icon]                     |
|             (gray-300, 64px)                  |
|                                               |
|          No reviews yet                       |
|                                               |
|    You haven't reviewed any products yet.     |
|    Share your experience to help other        |
|    shoppers make better decisions.            |
|                                               |
|       [ Review Past Purchases ]               |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Star` (Lucide) |
| Title | "No reviews yet" |
| Description | "You haven't reviewed any products yet. Share your experience to help other shoppers make better decisions." |
| Primary button | "Review Past Purchases" -- navigates to `/orders` (filtered to delivered orders) |
| Secondary link | None |

---

## Seller Empty States

### 7. Empty Products (Seller)

**Displayed on:** `/seller/products`

```
+-----------------------------------------------+
|                                               |
|            [PackageOpen icon]                 |
|             (gray-300, 64px)                  |
|                                               |
|          No products yet                      |
|                                               |
|    Your store is empty. Add your first        |
|    product to start selling on HomeBase.      |
|                                               |
|       [ Add Your First Product ]              |
|                                               |
|      Learn about listing best practices       |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `PackageOpen` (Lucide) |
| Title | "No products yet" |
| Description | "Your store is empty. Add your first product to start selling on HomeBase." |
| Primary button | "Add Your First Product" -- navigates to `/seller/products/new` |
| Secondary link | "Learn about listing best practices" -- navigates to `/help/listing-tips` |

---

### 8. Empty Orders (Seller)

**Displayed on:** `/seller/orders`

```
+-----------------------------------------------+
|                                               |
|            [ClipboardList icon]               |
|             (gray-300, 64px)                  |
|                                               |
|           No orders yet                       |
|                                               |
|    Once customers start buying your           |
|    products, their orders will appear here.   |
|    Share your store to get your first sale.   |
|                                               |
|         [ Share Your Store ]                  |
|                                               |
|          Add more products                    |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `ClipboardList` (Lucide) |
| Title | "No orders yet" |
| Description | "Once customers start buying your products, their orders will appear here. Share your store to get your first sale." |
| Primary button | "Share Your Store" -- opens share modal with store link |
| Secondary link | "Add more products" -- navigates to `/seller/products/new` |

---

### 9. Empty Inventory (Seller)

**Displayed on:** `/seller/inventory`

```
+-----------------------------------------------+
|                                               |
|            [Warehouse icon]                   |
|             (gray-300, 64px)                  |
|                                               |
|           No inventory                        |
|                                               |
|    Your inventory is empty. Add products      |
|    first, then manage their stock levels      |
|    here.                                      |
|                                               |
|         [ Add a Product ]                     |
|                                               |
|      How inventory management works           |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Warehouse` (Lucide) |
| Title | "No inventory" |
| Description | "Your inventory is empty. Add products first, then manage their stock levels here." |
| Primary button | "Add a Product" -- navigates to `/seller/products/new` |
| Secondary link | "How inventory management works" -- navigates to `/help/inventory` |

---

### 10. Empty Returns (Seller)

**Displayed on:** `/seller/returns`

```
+-----------------------------------------------+
|                                               |
|            [PackageCheck icon]                |
|             (gray-300, 64px)                  |
|                                               |
|          No return requests                   |
|                                               |
|    Good news -- no customers have requested   |
|    returns yet. When they do, you can         |
|    manage them here.                          |
|                                               |
|         [ View Orders ]                       |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `PackageCheck` (Lucide) |
| Title | "No return requests" |
| Description | "Good news -- no customers have requested returns yet. When they do, you can manage them here." |
| Primary button | "View Orders" -- navigates to `/seller/orders` |
| Secondary link | None |

---

### 11. Empty Reviews (Seller)

**Displayed on:** `/seller/reviews`

```
+-----------------------------------------------+
|                                               |
|             [MessageSquareStar icon]          |
|             (gray-300, 64px)                  |
|                                               |
|          No reviews yet                       |
|                                               |
|    Your products haven't received any         |
|    reviews yet. Encourage buyers to leave     |
|    reviews after their purchase.              |
|                                               |
|        [ View Your Products ]                 |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `MessageSquareStar` (Lucide) |
| Title | "No reviews yet" |
| Description | "Your products haven't received any reviews yet. Encourage buyers to leave reviews after their purchase." |
| Primary button | "View Your Products" -- navigates to `/seller/products` |
| Secondary link | None |

---

## Shared Empty States

### 12. Empty Messages / Conversations

**Displayed on:** `/messages`

```
+-----------------------------------------------+
|                                               |
|            [MessageCircle icon]               |
|             (gray-300, 64px)                  |
|                                               |
|          No conversations                     |
|                                               |
|    You don't have any messages yet.           |
|    Conversations with sellers will appear     |
|    here when you contact them about a         |
|    product or order.                          |
|                                               |
|         [ Browse Products ]                   |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `MessageCircle` (Lucide) |
| Title | "No conversations" |
| Description (buyer) | "You don't have any messages yet. Conversations with sellers will appear here when you contact them about a product or order." |
| Description (seller) | "You don't have any messages yet. Conversations with buyers will appear here when they contact you." |
| Primary button (buyer) | "Browse Products" -- navigates to `/products` |
| Primary button (seller) | "View Your Store" -- navigates to `/seller/store` |

---

### 13. Empty Notifications

**Displayed on:** `/notifications`

```
+-----------------------------------------------+
|                                               |
|              [BellOff icon]                   |
|             (gray-300, 64px)                  |
|                                               |
|         No notifications                      |
|                                               |
|    You're all caught up! New notifications    |
|    about orders, messages, and updates will   |
|    appear here.                               |
|                                               |
|       [ Notification Settings ]               |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `BellOff` (Lucide) |
| Title | "No notifications" |
| Description | "You're all caught up! New notifications about orders, messages, and updates will appear here." |
| Primary button | "Notification Settings" -- navigates to `/settings/notifications` |
| Secondary link | None |

---

## Admin Empty States

### 14. Empty Users (Admin)

**Displayed on:** `/admin/users` (with active filters that return zero results)

```
+-----------------------------------------------+
|                                               |
|              [Users icon]                     |
|             (gray-300, 64px)                  |
|                                               |
|        No users match your filters            |
|                                               |
|    Try adjusting your filters or search       |
|    terms to find users.                       |
|                                               |
|          [ Clear All Filters ]                |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Users` (Lucide) |
| Title | "No users match your filters" |
| Description | "Try adjusting your filters or search terms to find users." |
| Primary button | "Clear All Filters" -- resets all filters and search |
| Secondary link | None |

---

### 15. Empty Filtered Results (Generic)

**Displayed on:** Any table/list page when filters return zero results

```
+-----------------------------------------------+
|                                               |
|             [FilterX icon]                    |
|             (gray-300, 64px)                  |
|                                               |
|     No results match your filters             |
|                                               |
|    Try changing or removing some of your      |
|    filters to see more results.               |
|                                               |
|          [ Clear All Filters ]                |
|                                               |
|          Modify filters                       |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `FilterX` (Lucide) |
| Title | "No results match your filters" |
| Description | "Try changing or removing some of your filters to see more results." |
| Primary button | "Clear All Filters" -- resets all active filters |
| Secondary link | "Modify filters" -- opens filter panel/drawer |

---

## Quick Reference Table

| Page | Icon | Title | Primary Action |
|---|---|---|---|
| Cart | `ShoppingBag` | "Your cart is empty" | "Continue Shopping" |
| Orders (buyer) | `Package` | "No orders yet" | "Start Shopping" |
| Wishlist | `Heart` | "Nothing saved yet" | "Browse Products" |
| Search results | `Search` | "No results for '{query}'" | "Clear Search" |
| Returns (buyer) | `RotateCcw` | "No returns" | "View Orders" |
| Reviews (buyer) | `Star` | "No reviews yet" | "Review Past Purchases" |
| Products (seller) | `PackageOpen` | "No products yet" | "Add Your First Product" |
| Orders (seller) | `ClipboardList` | "No orders yet" | "Share Your Store" |
| Inventory (seller) | `Warehouse` | "No inventory" | "Add a Product" |
| Returns (seller) | `PackageCheck` | "No return requests" | "View Orders" |
| Reviews (seller) | `MessageSquareStar` | "No reviews yet" | "View Your Products" |
| Messages | `MessageCircle` | "No conversations" | "Browse Products" |
| Notifications | `BellOff` | "No notifications" | "Notification Settings" |
| Users (admin) | `Users` | "No users match your filters" | "Clear All Filters" |
| Filtered results | `FilterX` | "No results match your filters" | "Clear All Filters" |
