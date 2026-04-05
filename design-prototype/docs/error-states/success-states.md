# Success States - Confirmation Definitions

> Success states confirm completed actions and guide the user to the next logical step.
> They range from full-page celebrations (major actions) to subtle inline banners (minor updates).
> Each defines exact text, icon/animation, buttons, and auto-dismiss behavior.

---

## Global Success State Rules

| Rule | Value |
|---|---|
| Full-page success container | Centered card, `max-w-md`, `py-12 px-8`, white background |
| Icon/animation size | `w-16 h-16` (64px) for full-page, `w-5 h-5` (20px) for inline |
| Success color | `text-green-500` (icon), `bg-green-50` (background tint) |
| Celebration color | `text-indigo-600` (icon), `bg-indigo-50` (background tint) |
| Title font | `text-xl font-semibold text-gray-900` |
| Description font | `text-sm text-gray-500` |
| Primary button | `bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium` |
| Secondary action | `text-indigo-600 text-sm` or ghost button |
| Inline banner | `bg-green-50 border border-green-200 rounded-lg p-4` |
| Toast notification | Bottom-right, `bg-green-50 border-green-200`, auto-dismiss 5s |

---

## Full-Page Success States

### 1. Order Placed Successfully

**Displayed after:** Checkout completion (`POST /orders` returns 201)
**Route:** `/orders/confirmation/{orderId}`

```
+-----------------------------------------------+
|                                               |
|          [animated checkmark circle]          |
|          (green-500, drawing animation)       |
|                                               |
|        Order placed successfully!             |
|                                               |
|    Thank you for your purchase! Your order    |
|    has been confirmed and is being            |
|    processed.                                 |
|                                               |
|    +-----------------------------------+     |
|    | Order #HB-20260328-7A4F            |     |
|    | Items: 3 items                     |     |
|    | Total: $127.49                     |     |
|    | Est. Delivery: Apr 2-4, 2026       |     |
|    +-----------------------------------+     |
|                                               |
|           [ Track Order ]                     |
|                                               |
|         Continue Shopping                     |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Animation | Animated circle-draw + checkmark-draw, 800ms, plays once |
| Animation library | CSS keyframes (stroke-dashoffset animation) or Lottie |
| Icon fallback (no animation) | `CircleCheck` (Lucide), `text-green-500` |
| Title | "Order placed successfully!" |
| Description | "Thank you for your purchase! Your order has been confirmed and is being processed." |
| Order summary card | Bordered card showing order number, item count, total, estimated delivery |
| Order number format | "Order #HB-{YYYYMMDD}-{4-char hex}" |
| Primary button | "Track Order" -- navigates to `/orders/{orderId}` |
| Secondary link | "Continue Shopping" -- navigates to `/products` |
| Additional action | "Download Receipt" link -- downloads PDF receipt |
| Confetti | Optional subtle confetti animation (3-second burst, 30 particles, brand colors) |
| Email note | Below card: "A confirmation email has been sent to {email}" in `text-xs text-gray-400` |

---

### 2. Product Published (Seller)

**Displayed after:** Product creation (`POST /seller/products` returns 201) or product status changed to "published"
**Route:** `/seller/products/{productId}/published`

```
+-----------------------------------------------+
|                                               |
|             [PartyPopper icon]                |
|           (indigo-600, 64px)                  |
|         [subtle confetti animation]           |
|                                               |
|      Your product is now live!                |
|                                               |
|    "{Product Name}" has been published        |
|    and is now visible to buyers on            |
|    HomeBase.                                  |
|                                               |
|    +-----------------------------------+     |
|    | [Product thumbnail]                |     |
|    | Product Name                       |     |
|    | Price: $49.99                      |     |
|    | Category: Electronics              |     |
|    +-----------------------------------+     |
|                                               |
|         [ View on Store ]                     |
|                                               |
|     Add another product    Share product      |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `PartyPopper` (Lucide) |
| Icon color | `text-indigo-600` |
| Background tint | `bg-indigo-50` on the icon container |
| Confetti | Subtle confetti burst, 2 seconds, brand colors (indigo, amber, green) |
| Title | "Your product is now live!" |
| Description | "\"{productName}\" has been published and is now visible to buyers on HomeBase." |
| Product preview card | Thumbnail image + product name + price + category |
| Primary button | "View on Store" -- navigates to `/products/{productId}` (public view) |
| Secondary link 1 | "Add another product" -- navigates to `/seller/products/new` |
| Secondary link 2 | "Share product" -- opens share modal (copy link, social media icons) |

---

### 3. Return Approved

**Displayed after:** Return request approved by seller (`PUT /returns/{returnId}/approve` returns 200)
**Route:** `/returns/{returnId}` (updated state)

```
+-----------------------------------------------+
|                                               |
|            [CircleCheck icon]                 |
|            (green-500, 64px)                  |
|         [checkmark draw animation]            |
|                                               |
|        Return request approved                |
|                                               |
|    Your return for Order #{orderId} has       |
|    been approved. A pickup will be            |
|    scheduled shortly.                         |
|                                               |
|    +-----------------------------------+     |
|    | Return #RTN-20260328-3B2E          |     |
|    | Items: 1 item                      |     |
|    | Refund amount: $49.99              |     |
|    | Refund method: Original payment    |     |
|    +-----------------------------------+     |
|                                               |
|    Next steps:                                |
|    1. Pack the item in its original           |
|       packaging                               |
|    2. Pickup will be scheduled within         |
|       24 hours                                |
|    3. Refund will be processed within         |
|       5-7 business days after pickup          |
|                                               |
|       [ View Return Details ]                 |
|                                               |
|          Back to Orders                       |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Animation | Checkmark circle draw animation, 600ms, plays once |
| Icon fallback | `CircleCheck` (Lucide), `text-green-500` |
| Title | "Return request approved" |
| Description | "Your return for Order #{orderId} has been approved. A pickup will be scheduled shortly." |
| Return summary card | Return number, item count, refund amount, refund method |
| Next steps | Numbered list with 3 steps |
| Next steps style | `text-sm text-gray-600`, numbered with `text-indigo-600 font-semibold` numbers |
| Primary button | "View Return Details" -- navigates to `/returns/{returnId}` |
| Secondary link | "Back to Orders" -- navigates to `/orders` |

---

### 4. Payment Received (Seller)

**Displayed on:** Seller dashboard notification or `/seller/payments/{paymentId}`

This is typically shown as an **inline banner** on the seller dashboard, not a full page.

```
+-----------------------------------------------+
|  [CircleCheck] Payment received: $349.00      |
|  Order #HB-20260328-7A4F | Deposited to       |
|  your bank account ending in ****4821          |
|                               [ View Details ] |
+-----------------------------------------------+
```

#### Full-page variant (from payment details page):

```
+-----------------------------------------------+
|                                               |
|            [CircleCheck icon]                 |
|            (green-500, 64px)                  |
|                                               |
|         Payment received                      |
|                                               |
|    A payment of $349.00 has been deposited    |
|    to your bank account.                      |
|                                               |
|    +-----------------------------------+     |
|    | Amount: $349.00                    |     |
|    | Order: #HB-20260328-7A4F           |     |
|    | Date: March 28, 2026               |     |
|    | Account: ****4821                   |     |
|    | Transaction ID: TXN-9F3A7B2E       |     |
|    +-----------------------------------+     |
|                                               |
|          [ View All Payments ]                |
|                                               |
|           Back to Dashboard                   |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `CircleCheck` (Lucide), `text-green-500` |
| Title | "Payment received" |
| Description | "A payment of {amount} has been deposited to your bank account." |
| Amount display | Large text: `text-2xl font-bold text-green-600` |
| Payment summary card | Amount, order number, date, bank account (masked), transaction ID |
| Primary button | "View All Payments" -- navigates to `/seller/payments` |
| Secondary link | "Back to Dashboard" -- navigates to `/seller/dashboard` |
| Inline banner variant | `bg-green-50 border-green-200` banner at top of dashboard |

---

### 5. Registration Complete

**Displayed after:** Account creation (`POST /auth/register` returns 201)
**Route:** `/auth/welcome`

```
+-----------------------------------------------+
|                                               |
|            [PartyPopper icon]                 |
|           (indigo-600, 64px)                  |
|                                               |
|      Welcome to HomeBase!                     |
|                                               |
|    Your account has been created              |
|    successfully. Let's get you started.       |
|                                               |
|        [ Complete Your Profile ]              |
|                                               |
|         Skip for now, go to Dashboard         |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `PartyPopper` (Lucide), `text-indigo-600` |
| Title | "Welcome to HomeBase!" |
| Description | "Your account has been created successfully. Let's get you started." |
| Primary button | "Complete Your Profile" -- navigates to `/profile/edit` |
| Secondary link | "Skip for now, go to Dashboard" -- navigates to `/dashboard` |

---

## Inline Success Banners

These appear as temporary banners at the top of a page after a successful action.

### 6. Profile Updated

**Displayed after:** Profile save (`PUT /profile` returns 200)

```
+-----------------------------------------------+
| [Check] Your profile has been updated.   [x] |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Layout | Top of page, full-width banner |
| Background | `bg-green-50 border border-green-200` |
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "Your profile has been updated." |
| Dismiss | `X` button on right side |
| Auto-dismiss | Fades out after 5 seconds |
| Animation | Slides down from top (200ms ease-out) |

---

### 7. Product Updated (Seller)

**Displayed after:** Product edit save (`PUT /seller/products/{id}` returns 200)

```
+-----------------------------------------------+
| [Check] Product updated successfully.    [x] |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "Product updated successfully." |
| Auto-dismiss | 5 seconds |

---

### 8. Item Added to Cart

**Displayed after:** Add to cart (`POST /cart/items` returns 201)

```
+-----------------------------------------------+
| [Check] Added to cart.     [ View Cart ]  [x] |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "Added to cart." |
| Action button | "View Cart" -- navigates to `/cart` |
| Auto-dismiss | 5 seconds |
| Position | Toast notification, bottom-right corner |

---

### 9. Item Added to Wishlist

**Displayed after:** Add to wishlist (`POST /wishlist/items` returns 201)

```
+-----------------------------------------------+
| [Heart] Saved to your wishlist.          [x] |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Heart` (Lucide, filled), `w-5 h-5`, `text-red-500` |
| Message | "Saved to your wishlist." |
| Auto-dismiss | 3 seconds |
| Position | Toast notification, bottom-right corner |

---

### 10. Review Submitted

**Displayed after:** Review submission (`POST /reviews` returns 201)

```
+-----------------------------------------------+
| [Check] Thank you! Your review has been  [x] |
|         submitted.                            |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "Thank you! Your review has been submitted." |
| Auto-dismiss | 5 seconds |
| Position | Top of page banner |

---

### 11. Return Requested

**Displayed after:** Return request submission (`POST /returns` returns 201)

```
+-----------------------------------------------+
| [Check] Return request submitted. We'll  [x] |
|         review it within 24 hours.            |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "Return request submitted. We'll review it within 24 hours." |
| Action button | "View Return" -- navigates to `/returns/{returnId}` |
| Auto-dismiss | Does NOT auto-dismiss (important information) |
| Position | Top of page banner |

---

### 12. Password Changed

**Displayed after:** Password change (`PUT /auth/password` returns 200)

```
+-----------------------------------------------+
| [Check] Password changed successfully.   [x] |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "Password changed successfully." |
| Auto-dismiss | 5 seconds |
| Position | Top of settings page banner |

---

### 13. Address Saved

**Displayed after:** Address create/update (`POST/PUT /addresses` returns 200/201)

```
+-----------------------------------------------+
| [Check] Address saved.                   [x] |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "Address saved." |
| Auto-dismiss | 3 seconds |
| Position | Toast notification, bottom-right corner |

---

### 14. Order Status Updated (Seller/Admin)

**Displayed after:** Order status change (`PUT /orders/{id}/status` returns 200)

```
+-----------------------------------------------+
| [Check] Order #HB-xxxx status updated    [x] |
|         to "Shipped".                         |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "Order #{orderId} status updated to \"{newStatus}\"." |
| Auto-dismiss | 5 seconds |
| Position | Top of page banner |

---

### 15. User Role Updated (Admin)

**Displayed after:** User role change (`PUT /admin/users/{id}/role` returns 200)

```
+-----------------------------------------------+
| [Check] User role updated to "Seller".   [x] |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "User role updated to \"{newRole}\"." |
| Auto-dismiss | 5 seconds |
| Position | Top of page banner |

---

### 16. Inventory Updated (Seller)

**Displayed after:** Stock level update (`PUT /seller/inventory/{id}` returns 200)

```
+-----------------------------------------------+
| [Check] Stock updated for "{product}".   [x] |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "Stock updated for \"{productName}\"." |
| Auto-dismiss | 3 seconds |
| Position | Toast notification, bottom-right corner |

---

### 17. Bulk Action Completed

**Displayed after:** Bulk operations (delete, status change, etc.)

```
+-----------------------------------------------+
| [Check] 5 products updated successfully. [x] |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Check` (Lucide), `w-5 h-5`, `text-green-600` |
| Message | "{count} {items} updated successfully." |
| Partial success | "{succeeded} of {total} {items} updated. {failed} failed." with warning styling |
| Auto-dismiss | 5 seconds (full success), does NOT auto-dismiss (partial success) |
| Position | Top of page banner |

---

## Success Animation Specifications

### Checkmark Circle Draw

```
Animation sequence:
1. Circle outline draws clockwise (0 -> 360 degrees)  [0ms - 400ms]
2. Checkmark draws from bottom-left to top-right      [300ms - 600ms]
3. Slight scale bounce (1.0 -> 1.1 -> 1.0)            [500ms - 800ms]

CSS implementation:
- stroke-dasharray: 166 (circle circumference)
- stroke-dashoffset: 166 -> 0 (animation)
- stroke: #22C55E (green-500)
- stroke-width: 3
- fill: none -> #F0FDF4 (green-50) at end
```

### Confetti Burst

```
Configuration:
- Particle count: 30
- Spread: 70 degrees
- Origin: center of success icon
- Colors: ['#4F46E5', '#F59E0B', '#22C55E', '#EC4899'] (indigo, amber, green, pink)
- Duration: 3 seconds
- Gravity: 0.8
- Particle shapes: squares and circles
- Library: canvas-confetti (lightweight)
```

### Banner Slide-In

```
Animation:
- Transform: translateY(-100%) -> translateY(0)
- Duration: 200ms
- Easing: ease-out
- Opacity: 0 -> 1 (200ms)

Dismiss animation:
- Transform: translateY(0) -> translateY(-100%)
- Duration: 200ms
- Easing: ease-in
- Opacity: 1 -> 0 (200ms)
```

---

## Quick Reference Table

| Action | Type | Message | Auto-dismiss |
|---|---|---|---|
| Order placed | Full page | "Order placed successfully!" | No |
| Product published | Full page | "Your product is now live!" | No |
| Return approved | Full page | "Return request approved" | No |
| Payment received | Banner/page | "Payment received" | No |
| Registration | Full page | "Welcome to HomeBase!" | No |
| Profile updated | Banner | "Your profile has been updated." | 5s |
| Product updated | Banner | "Product updated successfully." | 5s |
| Added to cart | Toast | "Added to cart." | 5s |
| Added to wishlist | Toast | "Saved to your wishlist." | 3s |
| Review submitted | Banner | "Thank you! Your review has been submitted." | 5s |
| Return requested | Banner | "Return request submitted..." | No |
| Password changed | Banner | "Password changed successfully." | 5s |
| Address saved | Toast | "Address saved." | 3s |
| Order status updated | Banner | "Order #{id} status updated to \"{status}\"." | 5s |
| User role updated | Banner | "User role updated to \"{role}\"." | 5s |
| Inventory updated | Toast | "Stock updated for \"{product}\"." | 3s |
| Bulk action done | Banner | "{count} {items} updated successfully." | 5s |
