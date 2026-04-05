# Accessibility (a11y) Specification -- HomeBase

> WCAG 2.1 Level AA compliance specification for all four HomeBase applications:
> **Storefront** (Customer), **Seller Hub**, **Platform Admin** (Backoffice), and **Warehouse**.
>
> This document is the authoritative reference for every accessibility requirement
> in the HomeBase frontend. Every component, page, and interaction described here
> must be implemented exactly as specified.

---

## Table of Contents

1. [Color Contrast](#1-color-contrast)
2. [Keyboard Navigation](#2-keyboard-navigation)
3. [Screen Reader Announcements](#3-screen-reader-announcements)
4. [ARIA Labels](#4-aria-labels)
5. [Focus Management](#5-focus-management)
6. [Motion and Animation](#6-motion-and-animation)
7. [Forms](#7-forms)
8. [Images and Media](#8-images-and-media)
9. [Implementation Checklist](#9-implementation-checklist)

---

## 1. Color Contrast

### 1.1 Design Token Palette

All colors referenced below come from the shared Tailwind config used across every
prototype HTML page.

| Token            | Hex       | Usage                                          |
|------------------|-----------|-------------------------------------------------|
| brand-50         | `#FFF7ED` | Selected card tint, hover backgrounds            |
| brand-100        | `#FFEDD5` | Light accent backgrounds                         |
| brand-200        | `#FED7AA` | Focus ring fill                                  |
| brand-300        | `#FDBA74` | Hover border accents                             |
| brand-400        | `#FB923C` | Icon accent (top-bar phone icon, sidebar active) |
| brand-500        | `#F97316` | Primary brand orange -- buttons, badges, links   |
| brand-600        | `#EA580C` | Button hover state, price text                   |
| brand-700        | `#C2410C` | Deep accent (rarely used standalone)             |
| navy-700         | `#1E3A5F` | Hero gradient end                                |
| navy-800         | `#1A2E4A` | Banner background midtone                        |
| navy-900         | `#0F1B2D` | Top bar, sidebar, hero gradient start            |
| gray-300         | `#D1D5DB` | Top-bar body text on navy                        |
| gray-400         | `#9CA3AF` | Placeholder text, helper text, timestamps        |
| gray-500         | `#6B7280` | Secondary body text                              |
| gray-600         | `#4B5563` | Navigation links body text                       |
| gray-700         | `#374151` | Form labels, dropdown text                       |
| gray-900         | `#111827` | Primary body text (`text-gray-900`)              |
| success          | `#16A34A` | In Stock, success badges, secure-checkout icon   |
| warning          | `#EAB308` | Low-stock alerts, pending badges                 |
| danger           | `#DC2626` | Error messages, delete actions, OOS badges       |
| white            | `#FFFFFF` | Page background, card background, button text    |

### 1.2 Contrast Ratio Audit

WCAG AA requires **4.5:1** for normal text (< 18pt / < 14pt bold) and **3:1** for
large text (>= 18pt / >= 14pt bold).

#### Passing Combinations

| Foreground          | Background       | Ratio    | Size Context           | Result     |
|---------------------|------------------|----------|------------------------|------------|
| White `#FFFFFF`     | navy-900 `#0F1B2D` | **15.4:1** | Top-bar hotline number, sidebar text | PASS AA/AAA |
| White `#FFFFFF`     | brand-500 `#F97316` | **3.2:1** | Button text ("Shop Now", "Add to Cart") | PASS large text only (see 1.3) |
| White `#FFFFFF`     | brand-600 `#EA580C` | **3.9:1** | Button hover state text | PASS large text (14pt bold) |
| navy-900 `#0F1B2D` | White `#FFFFFF`    | **15.4:1** | Headings, product titles, section labels | PASS AA/AAA |
| gray-900 `#111827` | White `#FFFFFF`    | **17.4:1** | Primary body text      | PASS AA/AAA |
| gray-600 `#4B5563` | White `#FFFFFF`    | **7.0:1**  | Navigation link text   | PASS AA/AAA |
| gray-700 `#374151` | White `#FFFFFF`    | **9.7:1**  | Form label text        | PASS AA/AAA |
| gray-500 `#6B7280` | White `#FFFFFF`    | **4.6:1**  | Secondary text         | PASS AA    |
| gray-300 `#D1D5DB` | navy-900 `#0F1B2D` | **10.8:1** | Top-bar links          | PASS AA/AAA |
| brand-600 `#EA580C` | White `#FFFFFF`   | **3.9:1**  | Price text (large bold)| PASS large text |
| brand-600 `#EA580C` | brand-50 `#FFF7ED` | **3.7:1** | Price inside highlight box | PASS large text |
| White `#FFFFFF`     | danger `#DC2626`   | **4.6:1** | Error badge text       | PASS AA    |
| White `#FFFFFF`     | success `#16A34A`  | **4.5:1** | Success badge text     | PASS AA    |
| navy-900 `#0F1B2D` | warning `#EAB308`  | **8.0:1** | Warning badge text     | PASS AA/AAA |
| danger `#DC2626`    | White `#FFFFFF`    | **4.6:1** | Inline error text      | PASS AA    |
| success `#16A34A`   | White `#FFFFFF`    | **4.5:1** | "In Stock" text        | PASS AA    |

#### FAILING Combinations

| Foreground         | Background        | Ratio    | Where Used                      | Verdict  |
|--------------------|-------------------|----------|---------------------------------|----------|
| gray-400 `#9CA3AF` | White `#FFFFFF`   | **2.9:1** | Placeholder text, timestamps, helper text ("Estimated delivery: 5-7 days"), item-count captions | **FAIL AA** |
| White `#FFFFFF`    | brand-500 `#F97316` | **3.2:1** | Primary CTA buttons at normal (14px) text size | **FAIL AA normal text** |
| brand-400 `#FB923C` | navy-900 `#0F1B2D` | **3.8:1** | Sidebar active link text, top-bar icon accent | **FAIL AA normal text** |
| brand-500 `#F97316` | White `#FFFFFF`   | **3.0:1** | Inline text links ("View All"), category active link | **FAIL AA** |
| gray-400 `#9CA3AF` | gray-50 `#F9FAFB` | **2.5:1** | Placeholder text on gray backgrounds | **FAIL AA** |
| White `#FFFFFF`    | warning `#EAB308` | **1.9:1** | If ever used for text on yellow badges | **FAIL AA** |

### 1.3 Required Fixes

Each failing combination must be corrected before shipping. The following table
provides exact replacement values.

| Problem | Current | Fix | New Ratio |
|---------|---------|-----|-----------|
| **gray-400 on white** (placeholder, helper, timestamp text) | `text-gray-400` / `#9CA3AF` | Use `text-gray-500` / `#6B7280` | **4.6:1** PASS |
| **White on brand-500 buttons** (normal-size CTA text) | `bg-brand-500 text-white` at 14px | Option A: Darken button to `bg-brand-600` (`#EA580C` -- 3.9:1, passes at 14pt bold). Option B: Ensure all CTA button text is `>= 14pt bold` (font-semibold text-sm = 14px 600wt, qualifies as large text at 3:1 threshold). **Recommended: Option A for safety.** | **3.9:1** at brand-600 / PASS large text |
| **brand-500 inline links on white** | `text-brand-500` / `#F97316` on white | Use `text-brand-700` / `#C2410C` for inline links | **5.2:1** PASS |
| **brand-400 on navy-900** (sidebar active text) | `text-brand-400` / `#FB923C` on `#0F1B2D` | Use `text-brand-300` / `#FDBA74` for sidebar active state | **7.3:1** PASS |
| **gray-400 on gray-50** (placeholder on tinted inputs) | `#9CA3AF` on `#F9FAFB` | Use `text-gray-500` / `#6B7280` on gray-50 | **4.0:1** PASS (large text) or use `text-gray-600` for guaranteed AA |
| **White on warning yellow** | `#FFFFFF` on `#EAB308` | Use `text-navy-900` / `#0F1B2D` on warning (already done for most badges -- enforce everywhere) | **8.0:1** PASS |

### 1.4 Non-Text Contrast (WCAG 1.4.11)

UI components and graphical objects must meet **3:1** against adjacent colors.

| Element | Current | Status |
|---------|---------|--------|
| Input field border `border-gray-200` on white | `#E5E7EB` on `#FFFFFF` -- 1.5:1 | **FAIL** -- use `border-gray-300` (`#D1D5DB` -- 2.0:1) or add inner shadow. Per WCAG, text inputs are exempt if they have a visible label AND placeholder, but best practice is `border-gray-300`. |
| Focus ring (brand-400 on white) | `#FB923C` on `#FFFFFF` -- 2.9:1 | **FAIL** -- use brand-500 or brand-600 for focus outline |
| Checkbox borders | `border-gray-300` on white -- 2.0:1 | Borderline -- supplement with fill color on check |
| Chart bars | brand-500 on white card -- 3.0:1 | PASS 3:1 minimum |
| Sidebar active indicator (brand-500 bar) | `#F97316` on `#0F1B2D` -- 4.0:1 | PASS |

---

## 2. Keyboard Navigation

### 2.1 Global Rules

- Every interactive element must be reachable via **Tab** (or **Shift+Tab** for reverse).
- Non-interactive elements (`<div>`, `<span>`) must **never** receive `tabindex="0"` unless
  they have a `role` and keyboard handler attached.
- Custom widgets (dropdowns, tabs, carousels) use **arrow keys** for internal navigation.
- **Escape** closes any overlay (modal, dropdown, popover, drawer).
- **Enter** or **Space** activates buttons and links.
- The visible focus indicator is always present (see Section 5).

### 2.2 Tab Order by Page Type

#### Storefront (Customer Home)

```
1.  Skip to main content (hidden link, first focusable)
2.  Top bar: Hotline (informational, not focusable) -> "Sell on HomeBase" link -> "Order Tracking" link -> Currency select -> Language select
3.  Header: Logo link -> Seller filter <select> -> Search input -> Search button -> Wishlist link -> Cart link -> Account link
4.  Category nav: "All Sellers" dropdown -> Home -> Electronics -> Fashion -> Home & Living -> Sports -> Groceries -> Beauty -> Track Order
5.  Hero section: "Shop Now" CTA button
6.  Category cards: Each <a> card in grid order (left-to-right, top-to-bottom)
7.  Product cards: Each product card (interactive surface) in grid order
8.  "Flash Deals" section: Deal timer (informational) -> Deal product cards
9.  Footer: Column links in DOM order -> Social icons -> Copyright
```

#### Dashboard Pages (Seller Hub, Admin, Warehouse)

```
1.  Skip to main content (hidden link, first focusable)
2.  Header bar: Logo link -> Search input -> Quick-action button(s) -> Notifications button -> Help button -> Profile dropdown trigger
3.  Sidebar navigation (top-to-bottom):
    - Each nav link in order (Dashboard, Products, Orders, Returns, ...)
    - Grouped under section headings (Main Menu, Finance, Support)
    - Collapsible groups: Enter/Space toggles, arrow keys move within
4.  Main content area:
    - Welcome banner action buttons ("Download Report", "View Analytics")
    - Stat cards (each card as a group, internal links if any)
    - Chart region (skip via landmark or heading)
    - Table: Column headers (sortable ones are buttons) -> Row cells -> Row action buttons -> Pagination controls
5.  Footer links (if present)
```

#### Product Detail Page (Customer)

```
1.  Skip to main content
2.  [Standard header -- same as Storefront items 2-4]
3.  Breadcrumb: Home -> Electronics -> Headphones -> (current, not linked)
4.  Image gallery: Main image (not focusable) -> Thumbnail buttons (1-5, arrow keys within group)
5.  Product info:
    - Brand badge (informational, not focusable)
    - Title (heading, not focusable)
    - Rating link ("456 Reviews" anchor to #reviews)
    - Sold-by badge (informational)
    - Color variant buttons (arrow keys within group)
    - Variant buttons (arrow keys within group)
    - Quantity: Decrement button -> Quantity input -> Increment button
    - "Add to Cart" button -> "Buy Now" button
    - Wishlist button -> Share button
6.  Tabs: "Description" tab -> "Specifications" tab -> "Reviews" tab -> Tab panel content
7.  Related products: Product card grid
8.  Footer
```

#### Checkout Page (Form-Heavy)

```
1.  Skip to main content
2.  Header: Logo link -> Step indicator (informational, not focusable) -> Secure badge (informational)
3.  Shipping address section:
    - Saved address radio cards (arrow keys within group)
    - "Add new address" toggle/link
    - Form fields: Full Name -> Phone Number -> Address Line 1 -> Address Line 2 -> City -> State -> PIN Code -> "Save address" checkbox
4.  Shipping method section:
    - Radio cards: Standard -> Express -> Same Day (arrow keys within group)
5.  Payment section:
    - Payment method radio group
    - Card fields: Card Number -> Expiry -> CVV -> Name on Card
    - Or UPI/Wallet/COD sub-forms
6.  Order summary sidebar:
    - Coupon code input -> "Apply" button
    - "Place Order" button
7.  Footer
```

#### Modal / Dialog

```
1.  Focus moves to the first focusable element inside the modal (typically the close button or the first form field)
2.  Tab cycles through all focusable elements inside the modal ONLY (focus trap)
3.  Escape closes the modal
4.  On close, focus returns to the element that triggered the modal
```

#### Dropdown / Select Menu

```
1.  Trigger button receives focus via Tab
2.  Enter/Space opens the dropdown
3.  Arrow Down / Arrow Up moves highlight through options
4.  Enter selects the highlighted option and closes
5.  Escape closes without selecting
6.  Home jumps to first option, End jumps to last option
7.  Type-ahead: typing a letter jumps to the first matching option
```

---

## 3. Screen Reader Announcements

### 3.1 Live Regions for Dynamic Content

Every dynamic content change must be announced to assistive technology
without requiring the user to navigate to the changed element.

| Event | Live Region | ARIA Role | Attribute | Announcement Text |
|-------|-------------|-----------|-----------|-------------------|
| **Toast notification (success)** | Toast container | `role="alert"` | `aria-live="assertive"` | "Success: {message}" e.g. "Success: Item added to your cart." |
| **Toast notification (error)** | Toast container | `role="alert"` | `aria-live="assertive"` | "Error: {message}" e.g. "Error: Payment failed. Please check your payment details." |
| **Toast notification (warning)** | Toast container | `role="alert"` | `aria-live="assertive"` | "Warning: {message}" |
| **Toast notification (info)** | Toast container | `role="status"` | `aria-live="polite"` | "{message}" |
| **Cart count update** | Cart badge `<span>` | `role="status"` | `aria-live="polite"` | "Cart: {n} items" |
| **Wishlist count update** | Wishlist badge | `role="status"` | `aria-live="polite"` | "Wishlist: {n} items" |
| **Filter results update** | Results count region | `role="status"` | `aria-live="polite"` | "Showing {n} results for {query}" or "Showing {n} of {total} products" |
| **Sort change** | Results count region | `role="status"` | `aria-live="polite"` | "Results sorted by {criterion}" |
| **Tab content change** | Tab panel | -- | `aria-selected="true"` on new tab + focus mgmt | Announced via tab role semantics |
| **Modal open** | Dialog | `role="dialog"` | `aria-modal="true"`, `aria-labelledby="{title-id}"` | Screen reader announces dialog title |
| **Modal close** | -- | -- | -- | Focus returns; no explicit announcement needed |
| **Loading state start** | Loading region | `role="status"` | `aria-busy="true"`, `aria-live="polite"` | "Loading..." (visually hidden text inside the region) |
| **Loading state complete** | Loading region | `role="status"` | `aria-busy="false"` | "Content loaded" (brief, then region returns to normal) |
| **Loading timeout / error** | Error region | `role="alert"` | `aria-live="assertive"` | "Error: Failed to load {section}. Retry available." |
| **Form validation error** | Error summary | `role="alert"` | `aria-live="assertive"` | "There are {n} errors in the form. {first error description}" |
| **Inline field error** | Error message `<span>` | `role="alert"` | `aria-describedby` link | Screen reader announces error when field is focused |
| **Notification badge update** | Badge `<span>` | `role="status"` | `aria-live="polite"` | "{n} new notifications" |
| **Order status change** | Status badge | `role="status"` | `aria-live="polite"` | "Order status updated to {status}" |
| **Pagination** | Results region | `role="status"` | `aria-live="polite"` | "Page {n} of {total}, showing {count} results" |
| **Skeleton to content** | Content region | -- | `aria-busy` toggle | Remove `aria-busy="true"` when content loads |
| **Quantity change** | Quantity display | `role="status"` | `aria-live="polite"` | "Quantity: {n}" |
| **Coupon applied/removed** | Coupon feedback region | `role="status"` | `aria-live="polite"` | "Coupon {code} applied. You saved {amount}." |

### 3.2 Toast Implementation

```html
<!-- Toast container -- always present in DOM, top-right positioned -->
<div
  id="toast-container"
  aria-live="assertive"
  aria-atomic="true"
  class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
>
  <!-- Individual toast (injected dynamically) -->
  <div role="alert" class="pointer-events-auto ...">
    <span class="sr-only">Success:</span>
    <p>Item added to your cart.</p>
    <button aria-label="Dismiss notification" class="...">
      <svg aria-hidden="true">...</svg>
    </button>
  </div>
</div>
```

### 3.3 Cart Badge Implementation

```html
<a href="/cart" class="relative" aria-label="Shopping cart, 3 items">
  <svg aria-hidden="true" class="w-5 h-5">...</svg>
  <span class="text-[10px]" aria-hidden="true">Cart</span>
  <span
    role="status"
    aria-live="polite"
    class="absolute -top-1.5 -right-2 bg-brand-500 text-white text-[9px] font-bold
           rounded-full w-4 h-4 flex items-center justify-center"
    aria-label="3 items in cart"
  >3</span>
</a>
```

---

## 4. ARIA Labels

### 4.1 Icon-Only Buttons

Every button that displays only an icon (no visible text) must have an
`aria-label` describing its action.

| Element | Location | `aria-label` Value |
|---------|----------|--------------------|
| Search button (magnifying glass) | Storefront header | `"Search"` |
| Wishlist heart icon | Product card overlay | `"Add {product name} to wishlist"` |
| Wishlist heart icon (filled) | Product card when wishlisted | `"Remove {product name} from wishlist"` |
| Cart icon (header) | Global header | `"Shopping cart, {n} items"` |
| Notification bell | Seller/Admin/Warehouse header | `"Notifications, {n} unread"` |
| Help icon | Seller/Admin/Warehouse header | `"Help and support"` |
| Close button (modal) | All modal dialogs | `"Close dialog"` |
| Close button (toast) | Toast notifications | `"Dismiss notification"` |
| Quantity decrement | Product detail, cart | `"Decrease quantity"` |
| Quantity increment | Product detail, cart | `"Increase quantity"` |
| Share icon | Product detail | `"Share this product"` |
| Thumbnail image button | Product detail gallery | `"View image {n} of {total}"` |
| Zoom icon | Product detail main image | `"Zoom image"` |
| Delete item (trash icon) | Cart line item | `"Remove {product name} from cart"` |
| Edit icon | Address card, profile | `"Edit {item name}"` |
| Download icon | Seller settlements, admin exports | `"Download {document name}"` |
| Sidebar collapse/expand | Dashboard sidebar (mobile) | `"Toggle sidebar navigation"` |
| Dropdown chevron | Profile dropdown | `"Open user menu"` |
| Print button | Order detail, packing slip | `"Print {document type}"` |
| Filter icon | Product listing mobile | `"Open filters"` |

### 4.2 Status Badges and Semantic Labels

| Element | Example Visible Text | ARIA Markup |
|---------|---------------------|-------------|
| Order status badge | "Delivered" (green) | `aria-label="Order status: Delivered"` |
| Order status badge | "Processing" (orange) | `aria-label="Order status: Processing"` |
| Order status badge | "Cancelled" (red) | `aria-label="Order status: Cancelled"` |
| Seller status badge | "Active" (green dot + text) | `aria-label="Seller status: Active"` |
| Product status | "In Stock" | `aria-label="Availability: In Stock"` |
| Product status | "Out of Stock" | `aria-label="Availability: Out of Stock"` |
| Address type tag | "Home" | `aria-label="Address type: Home"` |
| Address type tag | "Office" | `aria-label="Address type: Office"` |
| Seller tier badge | "Premium Seller" | `aria-label="Seller tier: Premium"` |
| Notification count badge | "5" | `aria-label="5 unread notifications"` |
| Checkout step indicator | Step 1 active, Steps 2-3 inactive | `aria-label="Checkout step 1 of 3: Shipping (current)"`, `aria-label="Checkout step 2 of 3: Payment (upcoming)"` |

### 4.3 Star Ratings

```html
<!-- Read-only rating display (product card, product detail) -->
<div role="img" aria-label="4.8 out of 5 stars">
  <span aria-hidden="true" class="text-yellow-400 text-lg">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
</div>
<span class="text-sm font-medium">4.8</span>
<a href="#reviews" aria-label="456 customer reviews for Sony WH-1000XM5">(456 Reviews)</a>

<!-- Interactive star rating (submit review form) -->
<fieldset>
  <legend>Rate this product</legend>
  <div role="radiogroup" aria-label="Star rating">
    <button role="radio" aria-checked="false" aria-label="1 star">&#9734;</button>
    <button role="radio" aria-checked="false" aria-label="2 stars">&#9734;</button>
    <button role="radio" aria-checked="false" aria-label="3 stars">&#9734;</button>
    <button role="radio" aria-checked="false" aria-label="4 stars">&#9734;</button>
    <button role="radio" aria-checked="true" aria-label="5 stars">&#9733;</button>
  </div>
</fieldset>
```

### 4.4 Progress Bars and Meters

```html
<!-- Rating distribution bar (product detail, Reviews tab) -->
<div
  role="meter"
  aria-label="5-star ratings"
  aria-valuenow="72"
  aria-valuemin="0"
  aria-valuemax="100"
>
  <div class="rating-bar-fill" style="width: 72%"></div>
</div>

<!-- Order progress tracker -->
<ol role="list" aria-label="Order progress">
  <li aria-current="step">
    <span>Order Placed</span>
    <span class="sr-only">(completed)</span>
  </li>
  <li>
    <span>Shipped</span>
    <span class="sr-only">(current step)</span>
  </li>
  <li>
    <span>Delivered</span>
    <span class="sr-only">(upcoming)</span>
  </li>
</ol>

<!-- Seller score / performance meter -->
<div
  role="meter"
  aria-label="Seller score"
  aria-valuenow="4.6"
  aria-valuemin="0"
  aria-valuemax="5"
>
  <span class="text-sm font-bold text-brand-400">4.6</span>
</div>

<!-- Warehouse capacity bar -->
<div
  role="progressbar"
  aria-label="Zone A capacity"
  aria-valuenow="78"
  aria-valuemin="0"
  aria-valuemax="100"
>
  <div style="width: 78%"></div>
  <span class="sr-only">78% full</span>
</div>
```

### 4.5 Sortable Table Headers

```html
<!-- Seller orders table, admin users table, warehouse inventory table -->
<table>
  <thead>
    <tr>
      <th scope="col">
        <button aria-sort="ascending" aria-label="Sort by Order ID, currently ascending">
          Order ID
          <svg aria-hidden="true"><!-- sort icon --></svg>
        </button>
      </th>
      <th scope="col">
        <button aria-sort="none" aria-label="Sort by Date">
          Date
          <svg aria-hidden="true"><!-- sort icon --></svg>
        </button>
      </th>
      <th scope="col">
        <button aria-sort="none" aria-label="Sort by Amount">
          Amount
        </button>
      </th>
      <th scope="col">Status</th> <!-- Not sortable, no button -->
      <th scope="col">
        <span class="sr-only">Actions</span> <!-- Visually empty header for actions column -->
      </th>
    </tr>
  </thead>
</table>
```

When sorting changes: update `aria-sort` to `"ascending"`, `"descending"`, or `"none"`.
Only one column should have `aria-sort="ascending"` or `"descending"` at a time.

### 4.6 Expandable Sections and Accordion

```html
<!-- FAQ, product description accordion, sidebar collapsible groups -->
<h3>
  <button
    aria-expanded="false"
    aria-controls="section-shipping-info"
    id="heading-shipping-info"
  >
    Shipping Information
    <svg aria-hidden="true"><!-- chevron --></svg>
  </button>
</h3>
<div
  id="section-shipping-info"
  role="region"
  aria-labelledby="heading-shipping-info"
  hidden
>
  <p>Free standard shipping on orders over Rs. 999...</p>
</div>
```

### 4.7 Sidebar Navigation

```html
<!-- Seller Hub, Admin, Warehouse sidebars -->
<nav aria-label="Seller Hub navigation">
  <div>
    <p id="nav-group-main" class="text-[10px] font-semibold text-gray-500 uppercase">Main Menu</p>
    <ul role="list" aria-labelledby="nav-group-main">
      <li>
        <a href="/seller/dashboard" aria-current="page" class="sidebar-link active">
          <svg aria-hidden="true">...</svg>
          Dashboard
        </a>
      </li>
      <li>
        <a href="/seller/products" class="sidebar-link">
          <svg aria-hidden="true">...</svg>
          Products
        </a>
      </li>
      <li>
        <a href="/seller/orders" class="sidebar-link">
          <svg aria-hidden="true">...</svg>
          Orders
          <span aria-label="12 pending orders" class="ml-auto bg-brand-500 text-white ...">12</span>
        </a>
      </li>
      <li>
        <a href="/seller/returns" class="sidebar-link">
          <svg aria-hidden="true">...</svg>
          Returns
          <span aria-label="8 pending returns" class="ml-auto bg-warning ...">8</span>
        </a>
      </li>
      <!-- ... -->
    </ul>
  </div>
</nav>
```

Key rules:
- `aria-current="page"` on the active page link.
- Navigation badge counts include full context: `aria-label="12 pending orders"` (not just "12").
- All decorative SVG icons use `aria-hidden="true"`.
- The `<nav>` element has a unique `aria-label` per app section:
  - `"Storefront navigation"` for the customer nav bar
  - `"Seller Hub navigation"` for the seller sidebar
  - `"Platform administration navigation"` for the admin sidebar
  - `"Warehouse navigation"` for the warehouse sidebar
  - `"Breadcrumb"` for breadcrumb trails
  - `"Footer navigation"` for the footer

### 4.8 Tabs

```html
<!-- Product detail page: Description / Specifications / Reviews -->
<div role="tablist" aria-label="Product information">
  <button
    role="tab"
    id="tab-description"
    aria-selected="true"
    aria-controls="panel-description"
    tabindex="0"
  >Description</button>
  <button
    role="tab"
    id="tab-specifications"
    aria-selected="false"
    aria-controls="panel-specifications"
    tabindex="-1"
  >Specifications</button>
  <button
    role="tab"
    id="tab-reviews"
    aria-selected="false"
    aria-controls="panel-reviews"
    tabindex="-1"
  >Reviews (456)</button>
</div>

<div
  role="tabpanel"
  id="panel-description"
  aria-labelledby="tab-description"
  tabindex="0"
>
  <!-- Description content -->
</div>

<div
  role="tabpanel"
  id="panel-specifications"
  aria-labelledby="tab-specifications"
  tabindex="0"
  hidden
>
  <!-- Specifications content -->
</div>

<div
  role="tabpanel"
  id="panel-reviews"
  aria-labelledby="tab-reviews"
  tabindex="0"
  hidden
>
  <!-- Reviews content -->
</div>
```

Keyboard behavior:
- **Left/Right Arrow**: Move between tabs.
- **Home**: Move to first tab.
- **End**: Move to last tab.
- **Enter/Space**: Activate tab (if using manual activation mode).
- Only the active tab has `tabindex="0"`; inactive tabs have `tabindex="-1"`.
- The active tab panel is revealed; inactive panels use `hidden`.

---

## 5. Focus Management

### 5.1 Visible Focus Indicator

**No interactive element may suppress the browser focus ring without providing
a custom visible alternative.** Using `outline: none` or `outline-none` without
a replacement is strictly prohibited.

#### Standard Focus Style (all apps)

```css
/* Applied globally to all interactive elements */
:focus-visible {
  outline: 2px solid #F97316;       /* brand-500 orange */
  outline-offset: 2px;
  border-radius: 4px;               /* slight rounding for aesthetics */
}

/* Tailwind utility class equivalent */
.focus-ring {
  @apply focus-visible:outline-none
         focus-visible:ring-2
         focus-visible:ring-brand-500
         focus-visible:ring-offset-2;
}
```

#### Exceptions and Overrides

| Context | Focus Style | Reason |
|---------|-------------|--------|
| Dark backgrounds (sidebar, navy top-bar, hero) | `ring-white` or `ring-brand-300` (`#FDBA74`) | Orange on dark navy is sufficient (4.0:1), but white provides even more contrast (15.4:1) |
| Text inputs | `border-brand-400` + `ring-2 ring-brand-200` (already in prototype CSS) | Inner focus ring style per input design |
| Cards with interactive surface | `ring-2 ring-brand-500 ring-offset-2` on the wrapping `<a>` or `<button>` | Entire card is clickable |
| Thumbnail gallery buttons | `border-brand-400` (2px solid) | Matches active-thumbnail style |
| Color swatch buttons | `box-shadow: 0 0 0 2px white, 0 0 0 4px #F97316` | Double-ring for visibility on colored backgrounds |

### 5.2 Skip to Content Link

The first focusable element on every page. Visually hidden until focused.

```html
<body>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2
           focus:z-[9999] focus:bg-brand-500 focus:text-white focus:px-4
           focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold
           focus:shadow-lg"
  >
    Skip to main content
  </a>

  <!-- ... header, nav ... -->

  <main id="main-content" tabindex="-1">
    <!-- page content -->
  </main>
</body>
```

Behavior:
- Hidden by default (`sr-only`).
- Appears when user presses **Tab** on page load.
- Clicking/activating moves focus to `<main>` element.
- `tabindex="-1"` on `<main>` allows it to receive programmatic focus without
  entering the tab order.

### 5.3 Focus Trap in Modals and Dialogs

When a `role="dialog"` element is open:

1. Focus moves to the first focusable element inside (close button or first input).
2. **Tab** cycles only through elements inside the dialog.
3. **Shift+Tab** at the first element wraps to the last element.
4. **Tab** at the last element wraps to the first element.
5. **Escape** closes the dialog.
6. Background content receives `aria-hidden="true"` and `inert` attribute.
7. Background scroll is locked (`overflow: hidden` on `<body>`).

After close:
- Remove `aria-hidden` and `inert` from background.
- Restore `overflow` on `<body>`.
- Return focus to the element that triggered the dialog open.

```html
<!-- Modal example (Add Address modal on checkout page) -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title-add-address"
  aria-describedby="modal-desc-add-address"
  class="fixed inset-0 z-50 ..."
>
  <div class="..." role="document">
    <h2 id="modal-title-add-address">Add New Address</h2>
    <p id="modal-desc-add-address" class="sr-only">
      Fill in the form below to add a new shipping address.
    </p>
    <button aria-label="Close dialog" class="...">
      <svg aria-hidden="true">...</svg>
    </button>
    <!-- form fields -->
    <button type="submit">Save Address</button>
    <button type="button">Cancel</button>
  </div>
</div>
```

### 5.4 Focus After Modal Close

| Trigger | Return Focus To |
|---------|-----------------|
| "Add Address" button clicked | The "Add Address" button |
| "Edit" icon on address card | The same address card's edit button |
| "Delete" confirmation modal | The row or card that contained the deleted item (if still present), or the nearest sibling |
| Quick-view product modal | The product card that triggered it |
| Filter drawer (mobile) | The "Filters" button |

### 5.5 Focus on Form Validation Error

When a form is submitted with validation errors:

1. An error summary appears at the top of the form with `role="alert"`.
2. Focus moves to the **first error message** or the **error summary heading**.
3. Each invalid field receives `aria-invalid="true"`.
4. Each invalid field is linked to its error message via `aria-describedby`.

```html
<!-- Error summary -->
<div role="alert" tabindex="-1" id="error-summary">
  <h3>Please fix the following errors:</h3>
  <ul>
    <li><a href="#field-fullname">Full Name is required</a></li>
    <li><a href="#field-phone">Enter a valid 10-digit phone number</a></li>
  </ul>
</div>

<!-- Field with error -->
<div>
  <label for="field-fullname">Full Name <span aria-hidden="true" class="text-danger">*</span></label>
  <input
    id="field-fullname"
    type="text"
    aria-required="true"
    aria-invalid="true"
    aria-describedby="error-fullname"
    class="border-danger ..."
  >
  <span id="error-fullname" role="alert" class="text-sm text-danger">
    Full Name is required.
  </span>
</div>
```

---

## 6. Motion and Animation

### 6.1 Prototype Animations Inventory

The following animations exist in the current prototype CSS:

| Animation | CSS | Where Used |
|-----------|-----|------------|
| Product card hover lift | `transform: translateY(-4px)` | Storefront product cards, seller product list |
| Stat card hover lift | `transform: translateY(-2px)` | Dashboard stat cards |
| Category card border transition | `border-color` transition 0.2s | Storefront categories |
| Button hover transform | `translateY(-1px)` + shadow | Login "Sign In" CTA |
| Skeleton pulse | `opacity 0.4-1.0, 1.5s ease-in-out infinite` | All loading skeletons |
| Toast slide-in | Slide from right, fade out | Toast notifications |
| Health pulse | `opacity pulse 2s infinite` | Admin dashboard system health dot |
| Rating bar fill | `width 0.6s ease` | Product detail review distribution |
| Fade-in | `opacity 0->1, translateY 8->0, 0.25s` | Login form tab switch |
| Color swatch scale | `transform: scale(1.15)` on hover | Product detail color picker |
| Nav link color | `color transition 0.15s` | All nav links |
| Availability dot pulse | `animate-pulse` (Tailwind) | "In Stock" green dot |

### 6.2 `prefers-reduced-motion` Rules

All animations listed above must be suppressed or simplified when the user has
requested reduced motion at the OS level.

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all decorative transitions */
  .product-card,
  .stat-card,
  .category-card,
  .action-card,
  .review-card,
  .zone-card,
  .btn-brand,
  .color-swatch,
  .variant-btn,
  .qty-btn,
  .gallery-thumb,
  .sidebar-link,
  .table-row,
  .nav-link,
  .timeline-item,
  .activity-item {
    transition: none !important;
    transform: none !important;
    animation: none !important;
  }

  /* Disable skeleton pulse */
  .animate-pulse,
  .health-pulse {
    animation: none !important;
  }

  /* Disable hover lifts */
  .product-card:hover,
  .stat-card:hover,
  .action-card:hover,
  .zone-card:hover {
    transform: none !important;
    box-shadow: none !important;
  }

  /* Keep functional indicators but remove animation */
  /* Loading spinner: replace animated spinner with static "Loading..." text */
  /* Progress bar fills: instant width change, no transition */
  .rating-bar-fill,
  .chart-bar,
  .step-connector > div,
  .strength-bar {
    transition: none !important;
  }

  /* Toast: appear instantly, no slide */
  /* Fade-in: appear instantly */
  .fade-in {
    animation: none !important;
  }
}
```

### 6.3 What to Keep vs. Remove

| Animation | Reduced-Motion Behavior | Rationale |
|-----------|------------------------|-----------|
| Skeleton pulse | Remove. Show static gray blocks. | Purely decorative. |
| Toast slide-in | Show instantly (no transition). | Content must still appear, just without motion. |
| Hover lifts (cards, buttons) | Remove entirely. Keep hover color change only. | Decorative motion. |
| Color swatch scale | Remove. Keep border/outline change. | Decorative motion. |
| Loading spinner (if added) | Replace with static "Loading..." text. | Functional but animation is dispensable. |
| Health pulse dot | Replace with static filled dot. | Status is conveyed by color + text, not pulsing. |
| Rating bar width fill | Set width instantly. | Data is still communicated. |
| Fade-in on tab switch | Show instantly. | Content is what matters. |
| Focus ring transition | Keep instant focus ring. | Focus indication is critical for accessibility. |
| Scroll (smooth scrolling) | Use `scroll-behavior: auto`. | Motion-sensitive users prefer instant jumps. |

---

## 7. Forms

### 7.1 Labels

Every form input must have an associated `<label>` element with a `for` attribute
matching the input's `id`, or the input must have an `aria-label` / `aria-labelledby`.

#### Labeled Inputs (visible label required)

| Field | Label Text | Input Type | Page(s) |
|-------|------------|------------|---------|
| Full Name | "Full Name" | text | Checkout, My Account, Registration |
| Phone Number | "Phone Number" | tel | Checkout, My Account, Registration |
| Address Line 1 | "Address Line 1" | text | Checkout, My Account |
| Address Line 2 | "Address Line 2" | text | Checkout, My Account |
| City | "City" | text | Checkout, My Account |
| State | "State" | select | Checkout, My Account |
| PIN Code | "PIN Code" | text | Checkout, My Account |
| Email Address | "Email Address" | email | Login, Registration |
| Password | "Password" | password | Login, Registration |
| Confirm Password | "Confirm Password" | password | Registration |
| Card Number | "Card Number" | text | Checkout (payment) |
| Expiry Date | "Expiry Date" | text | Checkout (payment) |
| CVV | "CVV" | text | Checkout (payment) |
| Name on Card | "Name on Card" | text | Checkout (payment) |
| UPI ID | "UPI ID" | text | Checkout (payment) |
| Coupon Code | "Coupon Code" | text | Checkout, Cart |
| Product Name | "Product Name" | text | Seller Add Product |
| Product Description | "Description" | textarea | Seller Add Product |
| Price | "Price" | number | Seller Add Product |
| SKU | "SKU" | text | Seller Add Product |
| Stock Quantity | "Stock Quantity" | number | Seller Add Product, Seller Inventory |

#### `aria-label` Inputs (no visible label)

| Field | `aria-label` Value | Input Type | Page(s) |
|-------|-------------------|------------|---------|
| Header search | `"Search products, brands, and more"` | text | Storefront header |
| Dashboard search | `"Search orders, products, customers"` | text | Seller/Admin/Warehouse headers |
| Quantity input | `"Product quantity"` | number | Product detail, cart |
| Seller filter select (header) | `"Filter by seller"` | select | Storefront header |
| Seller filter select (nav) | `"Filter by seller"` | select | Storefront nav |
| Currency select | `"Select currency"` | select | Storefront top bar |
| Language select | `"Select language"` | select | Storefront top bar |

### 7.2 Required Fields

```html
<!-- Pattern for all required fields -->
<label for="field-fullname">
  Full Name
  <span aria-hidden="true" class="text-danger">*</span>
</label>
<input
  id="field-fullname"
  type="text"
  aria-required="true"
  placeholder="Enter full name"
>
```

Rules:
- The asterisk `*` is marked `aria-hidden="true"` because `aria-required="true"`
  already conveys the requirement to screen readers.
- An explanatory note appears at the top of the form: `"Fields marked with * are required."`
  This note is visible to all users.
- Never rely solely on placeholder text to indicate required status.

### 7.3 Error Messages

```html
<!-- Input with validation error -->
<div class="form-field">
  <label for="field-phone">
    Phone Number
    <span aria-hidden="true" class="text-danger">*</span>
  </label>
  <div class="flex">
    <span class="..." aria-hidden="true">+91</span>
    <input
      id="field-phone"
      type="tel"
      aria-required="true"
      aria-invalid="true"
      aria-describedby="error-phone help-phone"
      class="border-danger ..."
    >
  </div>
  <span id="help-phone" class="text-xs text-gray-500">
    Enter a 10-digit mobile number
  </span>
  <span id="error-phone" role="alert" class="text-sm text-danger mt-1">
    Please enter a valid 10-digit phone number.
  </span>
</div>
```

When the field is valid:
- Remove `aria-invalid="true"` (or set to `"false"`).
- Remove the error `<span>` from the DOM or hide it.
- Keep `aria-describedby` pointing to the help text only.

### 7.4 Fieldsets and Legends

Group related form controls with `<fieldset>` and `<legend>`.

| Form Group | `<legend>` Text | Fields Inside | Page(s) |
|------------|----------------|---------------|---------|
| Shipping Address | "Shipping Address" | Name, Phone, Address 1 & 2, City, State, PIN | Checkout |
| Billing Address | "Billing Address" | Same as shipping address fields | Checkout |
| Payment Method | "Payment Method" | Credit/Debit Card, UPI, Wallet, COD radio buttons | Checkout |
| Card Details | "Card Details" | Card Number, Expiry, CVV, Name on Card | Checkout |
| Saved Addresses | "Select a saved address" | Radio cards for each address | Checkout |
| Shipping Method | "Shipping Method" | Standard, Express, Same Day radio cards | Checkout |
| Login Credentials | "Sign in to your account" | Email, Password | Login |
| Registration | "Create your account" | Name, Email, Phone, Password, Confirm Password | Registration |
| Product Details | "Product Details" | Name, Description, Category, Brand | Seller Add Product |
| Pricing | "Pricing" | MRP, Selling Price, Tax Category | Seller Add Product |
| Return Request | "Return Details" | Reason select, Description textarea, Images upload | Customer Returns |
| Review Form | "Write a Review" | Star rating, Title, Review text | Product Detail |
| Profile Information | "Personal Information" | Name, Email, Phone, Date of Birth | My Account |
| Password Change | "Change Password" | Current Password, New Password, Confirm New Password | My Account, Seller Settings |

### 7.5 Radio Card Groups

The checkout page uses custom-styled radio cards (shipping address, shipping method,
payment method). These must be implemented as proper radio groups.

```html
<fieldset>
  <legend class="text-sm font-semibold text-gray-700">Shipping Method</legend>
  <div role="radiogroup" aria-label="Shipping method options" class="space-y-3">
    <label class="radio-card selected ...">
      <input
        type="radio"
        name="shipping_method"
        value="standard"
        checked
        class="sr-only"
      >
      <span class="..." role="presentation"><!-- custom radio visual --></span>
      <div>
        <p class="font-semibold">Standard Delivery</p>
        <p class="text-xs text-gray-500">5-7 business days</p>
      </div>
      <span class="font-bold text-success">FREE</span>
    </label>
    <!-- ... more radio card options ... -->
  </div>
</fieldset>
```

Keyboard behavior:
- **Arrow Down / Arrow Right**: Move to next radio option.
- **Arrow Up / Arrow Left**: Move to previous radio option.
- **Space**: Select the focused option.
- Only the selected radio has `tabindex="0"`; unselected radios have `tabindex="-1"`.

---

## 8. Images and Media

### 8.1 Informative Images

| Image Type | Alt Text Pattern | Example |
|------------|-----------------|---------|
| Product thumbnail | Product name + variant | `alt="Sony WH-1000XM5 Wireless Headphones, Midnight Black"` |
| Product main image | Same as thumbnail, more detail if visible | `alt="Sony WH-1000XM5 Wireless Headphones, Midnight Black, front view"` |
| Category icon (emoji in prototype) | Category name | `alt="Laptops"` (when converted to actual images) |
| Seller avatar/logo | Seller name | `alt="Rajesh Store logo"` |
| User avatar | User name | `alt="Profile photo for Rahul Sharma"` |
| Banner promotional | Promo description | `alt="Summer Sale: 40% off top electronics. Shop now."` |
| Brand logo in product detail | Brand name | `alt="Sony"` |
| Payment method icons | Method name | `alt="Visa"`, `alt="Mastercard"`, `alt="UPI"` |

### 8.2 Decorative Images

These must be hidden from assistive technology:

| Element | Implementation |
|---------|---------------|
| Background gradient circles | CSS-only (no `<img>`) -- inherently hidden |
| Divider decorations | `aria-hidden="true"` or CSS-only |
| All SVG icons next to visible text | `aria-hidden="true"` on the `<svg>` |
| Hero section decorative shapes | `aria-hidden="true"` or CSS backgrounds |
| Empty state illustrations | `role="presentation"` or `alt=""` with accompanying text |

### 8.3 SVG Icon Rules

All SVG icons used throughout HomeBase follow this pattern:

```html
<!-- Icon next to text label (decorative) -->
<svg aria-hidden="true" class="w-5 h-5" ...>...</svg>
<span>Dashboard</span>

<!-- Icon-only button (functional) -->
<button aria-label="Search">
  <svg aria-hidden="true" class="w-4 h-4" ...>...</svg>
</button>
```

Never put `aria-label` on the `<svg>` itself. The label goes on the parent
interactive element.

---

## 9. Implementation Checklist

Use this checklist during code review for every component and page.

### Per-Component

- [ ] Every `<img>` has meaningful `alt` text or `alt=""` if decorative
- [ ] Every `<svg>` icon has `aria-hidden="true"`
- [ ] Every icon-only `<button>` has `aria-label`
- [ ] Every form `<input>` has a `<label>` or `aria-label`
- [ ] Every required field has `aria-required="true"`
- [ ] Every invalid field has `aria-invalid="true"` and `aria-describedby` linking to error
- [ ] No `outline: none` / `outline-none` without `focus-visible:ring-*` replacement
- [ ] Custom controls (dropdown, tabs, accordion) have correct ARIA roles
- [ ] Color contrast meets 4.5:1 for normal text, 3:1 for large text
- [ ] Interactive elements are reachable via Tab key

### Per-Page

- [ ] `<html lang="en">` is set
- [ ] Page has a unique, descriptive `<title>`
- [ ] Skip-to-content link is the first focusable element
- [ ] `<main>` landmark wraps primary content
- [ ] `<nav>` landmarks have unique `aria-label` values
- [ ] Heading hierarchy is logical (`h1` -> `h2` -> `h3`, no skips)
- [ ] All dynamic content updates use appropriate `aria-live` regions
- [ ] Modals have focus trap, `aria-modal="true"`, and return-focus logic
- [ ] Page is fully operable with keyboard only (no mouse traps)
- [ ] `prefers-reduced-motion` media query disables decorative animations

### Per-App Specifics

#### Storefront (Customer)

- [ ] Cart badge has `aria-live="polite"` and `aria-label` with count
- [ ] Product cards: each interactive card wraps content in `<a>` with descriptive text
- [ ] Product rating is `role="img"` with `aria-label="{n} out of 5 stars"`
- [ ] Filter sidebar: checkbox filters have labels; result count updates announce via live region
- [ ] Breadcrumb uses `<nav aria-label="Breadcrumb">` with `<ol>` and `aria-current="page"` on last item
- [ ] Checkout stepper: each step has accessible label with position and status

#### Seller Hub

- [ ] Sidebar uses `aria-current="page"` on active link
- [ ] Badge counts have contextual `aria-label` (e.g., "12 pending orders")
- [ ] Data tables: sortable headers use `aria-sort` attribute
- [ ] Chart regions: provide text alternative or `aria-label` with data summary
- [ ] Bulk actions: checkboxes have `aria-label="Select order {id}"`

#### Platform Admin

- [ ] Admin modals (approve/reject/suspend): confirmation dialogs follow focus-trap rules
- [ ] System health indicators: status text accompanies color indicators (not color alone)
- [ ] User/seller action buttons have descriptive labels including entity name
- [ ] Dashboard charts: `aria-label` describes trend (e.g., "Revenue chart, March 2026, trending up 12%")

#### Warehouse

- [ ] Scan/barcode input has `aria-label="Scan barcode or enter SKU"`
- [ ] Zone capacity meters use `role="progressbar"` with `aria-valuenow/min/max`
- [ ] Timeline/activity feed items are structured as a list
- [ ] Urgency indicators (danger badges) are announced, not just color-coded

---

## Appendix A: Landmark Structure

Every page must use HTML5 landmarks so screen reader users can navigate by
region.

### Storefront Page Landmarks

```
<body>
  <a href="#main-content">Skip to main content</a>
  <header>                          <!-- role="banner" implicit -->
    <nav aria-label="Top bar">      <!-- Utility links -->
    <nav aria-label="Main">         <!-- Primary navigation + search -->
    <nav aria-label="Categories">   <!-- Category nav bar -->
  </header>
  <main id="main-content">         <!-- role="main" implicit -->
    <section aria-label="Hero banner">
    <section aria-label="Shop by category">
    <section aria-label="Featured products">
    <section aria-label="Flash deals">
  </main>
  <footer>                          <!-- role="contentinfo" implicit -->
    <nav aria-label="Footer">
  </footer>
</body>
```

### Dashboard Page Landmarks

```
<body>
  <a href="#main-content">Skip to main content</a>
  <header>                                <!-- Top bar with search, profile -->
  <nav aria-label="Seller Hub navigation"> <!-- Sidebar -->
  <main id="main-content">
    <section aria-label="Dashboard overview">
    <section aria-label="Recent orders">
    <section aria-label="Performance metrics">
  </main>
</body>
```

---

## Appendix B: Testing Requirements

### Automated Testing

| Tool | Purpose | Run When |
|------|---------|----------|
| axe-core (via @axe-core/react or axe-playwright) | Automated WCAG checks | Every CI build |
| eslint-plugin-jsx-a11y | Static analysis of JSX | Pre-commit hook |
| Lighthouse Accessibility audit | Score and violation report | Weekly scheduled + PR checks |
| Pa11y | CLI-based WCAG checking | CI pipeline |

### Manual Testing

| Test | Method | Frequency |
|------|--------|-----------|
| Keyboard-only navigation | Unplug mouse, navigate every page | Every sprint |
| Screen reader (VoiceOver on macOS) | Full page read-through, interactive flows | Every sprint |
| Screen reader (NVDA on Windows) | Same as above | Monthly |
| High-contrast mode | Windows High Contrast, macOS Increase Contrast | Every sprint |
| Zoom 200% | Browser zoom to 200%, verify no content is lost | Every sprint |
| Zoom 400% | Browser zoom to 400%, single-column reflow | Monthly |
| `prefers-reduced-motion` | Enable in OS settings, verify all animations stop | Every sprint |
| Color-blindness simulation | Use browser DevTools or Sim Daltonism | Monthly |

### Acceptance Criteria

- **Zero** axe-core violations at the "critical" and "serious" levels.
- **Zero** eslint-plugin-jsx-a11y errors (warnings may be triaged).
- Lighthouse Accessibility score >= **95**.
- Every user flow is completable using keyboard only.
- Every user flow is completable using VoiceOver with no confusing or missing announcements.

---

## Appendix C: Reference Standards

| Standard | Version | Level | Link |
|----------|---------|-------|------|
| WCAG | 2.1 | AA | https://www.w3.org/TR/WCAG21/ |
| WAI-ARIA | 1.2 | -- | https://www.w3.org/TR/wai-aria-1.2/ |
| ARIA Authoring Practices Guide | -- | -- | https://www.w3.org/WAI/ARIA/apg/ |
| HTML Living Standard (semantics) | -- | -- | https://html.spec.whatwg.org/ |

---

*This specification was authored for the HomeBase design prototype phase.
All requirements carry forward into the Next.js implementation.
During implementation, use the shared `@homebase/ui` component library to
enforce these rules once at the component level rather than per-page.*
