# Mobile Responsive Design Specifications

> Complete breakpoint behavior, layout rules, touch targets, and ASCII wireframes
> for every HomeBase page across desktop, tablet, and mobile viewports.

---

## Table of Contents

1. [Global Responsive System](#1-global-responsive-system)
2. [Customer: Storefront](#2-customer-storefront)
3. [Customer: Product Detail](#3-customer-product-detail)
4. [Customer: Cart](#4-customer-cart)
5. [Customer: Checkout](#5-customer-checkout)
6. [Seller: Dashboard](#6-seller-dashboard)
7. [Seller: Products & Orders](#7-seller-products--orders)
8. [Admin: All Pages](#8-admin-all-pages)
9. [Warehouse: All Pages](#9-warehouse-all-pages)
10. [Mobile-Specific Components](#10-mobile-specific-components)
11. [Safe Area & Keyboard Behavior](#11-safe-area--keyboard-behavior)

---

## 1. Global Responsive System

### 1.1 Breakpoints

| Token       | Range           | Target Device         | Columns | Gutter | Margin |
|-------------|-----------------|----------------------|---------|--------|--------|
| `desktop`   | >= 1280px       | Desktop (1440px ref) | 12      | 24px   | 80px   |
| `laptop`    | 1024px - 1279px | Small laptop         | 12      | 20px   | 40px   |
| `tablet`    | 768px - 1023px  | Tablet (768px ref)   | 8       | 16px   | 24px   |
| `mobile-lg` | 428px - 767px   | Large phone          | 4       | 12px   | 16px   |
| `mobile`    | <= 427px        | Phone (375px ref)    | 4       | 12px   | 16px   |

### 1.2 Typography Scale

| Element          | Desktop    | Tablet     | Mobile     |
|------------------|-----------|-----------|-----------|
| H1 (page title)  | 32px/40px | 28px/36px | 24px/32px |
| H2 (section)     | 24px/32px | 22px/28px | 20px/26px |
| H3 (card title)  | 18px/24px | 18px/24px | 16px/22px |
| Body              | 16px/24px | 16px/24px | 14px/20px |
| Body small        | 14px/20px | 14px/20px | 13px/18px |
| Caption           | 12px/16px | 12px/16px | 12px/16px |
| Price (large)     | 28px/36px | 24px/32px | 22px/28px |
| Price (small)     | 16px/24px | 16px/24px | 14px/20px |
| Badge             | 11px/14px | 11px/14px | 11px/14px |

### 1.3 Touch Target Rules

| Rule                           | Value   |
|--------------------------------|---------|
| Minimum tap target size        | 44x44px |
| Minimum spacing between targets| 8px     |
| Button minimum height          | 48px    |
| Icon button minimum area       | 44x44px |
| Link minimum tap area          | 44px tall, full text width |
| Checkbox / radio hit area      | 44x44px (extend beyond visual) |

### 1.4 Global Image Sizing

| Context               | Desktop        | Tablet         | Mobile         |
|-----------------------|---------------|---------------|---------------|
| Hero banner            | 1440x480      | 768x320       | 375x200       |
| Product card thumb     | 240x240       | 200x200       | 160x160       |
| Product detail image   | 560x560       | 480x480       | 375x375 (full-width) |
| Category icon          | 80x80         | 64x64         | 56x56         |
| Avatar (small)         | 32x32         | 32x32         | 32x32         |
| Avatar (large)         | 64x64         | 56x56         | 48x48         |

### 1.5 Global Sticky / Fixed Elements

| Element             | Desktop            | Tablet             | Mobile                   |
|---------------------|--------------------|--------------------|--------------------------|
| Top nav             | Fixed top          | Fixed top          | Fixed top (compact)      |
| Bottom nav          | Hidden             | Hidden             | Fixed bottom, 56px tall  |
| CTA bar             | Inline             | Inline             | Fixed bottom, 64px tall  |
| Sidebar             | Fixed left, 256px  | Collapsible, 240px | Hidden (hamburger menu)  |
| Search bar          | In header          | In header          | Below header, expandable |

---

## 2. Customer: Storefront

### 2.1 Desktop Layout (>= 1280px)

```
+------------------------------------------------------------------+
| [TopBar: Sell on HomeBase | Track Order | Help | Language | INR ] |
+------------------------------------------------------------------+
| [Logo]  [Seller ▼]  [====== Search Bar ======]  [Auth] [Cart 3] |
+------------------------------------------------------------------+
| [Home] [Electronics] [Fashion] [Home&Living] [Groceries] [More▼] |
+------------------------------------------------------------------+
|                                                                  |
| +------------------------------+  +----------+                   |
| | HERO BANNER (carousel)       |  | Side     |                   |
| | Discover the Best Deals...   |  | Promo 1  |                   |
| | [Shop Now]                   |  +----------+                   |
| |          o  o  *  o  o       |  | Side     |                   |
| +------------------------------+  | Promo 2  |                   |
|                                   +----------+                   |
|                                                                  |
| Shop by Category                                                 |
| [Cat1] [Cat2] [Cat3] [Cat4] [Cat5] [Cat6] [Cat7] [Cat8]        |
|                                                                  |
| Flash Deals              Ends in: 05:23:41                       |
| [Deal1] [Deal2] [Deal3] [Deal4]  [See All ->]                   |
|                                                                  |
| Best Sellers                                                     |
| [Prod1] [Prod2] [Prod3] [Prod4] [Prod5]                        |
|                                                                  |
| +--Footer: 4 columns: Company | Sell | Help | Connect-----------+
+------------------------------------------------------------------+
```

### 2.2 Tablet Layout (768px - 1023px)

**What changes:**
- Top bar: condensed, fewer links (Track Order and Help only)
- Header: search bar narrows, seller filter becomes icon-only
- Hero: side promos move below the hero as a horizontal pair
- Categories: 4 columns (2 rows)
- Deals: 3 per row with horizontal scroll
- Products: 3 columns
- Footer: 2 columns

```
+----------------------------------------------+
| [Track Order]  [Help]                        |
+----------------------------------------------+
| [Logo] [Seller▼] [== Search ==] [User][Cart]|
+----------------------------------------------+
| [Home] [Electronics] [Fashion] [More ▼]     |
+----------------------------------------------+
|                                              |
| +------------------------------------------+ |
| |        HERO BANNER (full-width)          | |
| |     Discover the Best Deals...           | |
| |        [Shop Now]    o * o o             | |
| +------------------------------------------+ |
| +-------------------+ +-------------------+  |
| | Side Promo 1      | | Side Promo 2      |  |
| +-------------------+ +-------------------+  |
|                                              |
| Shop by Category                             |
| [Cat1] [Cat2] [Cat3] [Cat4]                 |
| [Cat5] [Cat6] [Cat7] [Cat8]                 |
|                                              |
| Flash Deals           05:23:41               |
| [Deal 1] [Deal 2] [Deal 3] ->               |
|                                              |
| Best Sellers                                 |
| [Prod1] [Prod2] [Prod3]                     |
| [Prod4] [Prod5] [Prod6]                     |
|                                              |
| +---Footer: 2 columns-----------------------+
+----------------------------------------------+
```

### 2.3 Mobile Layout (<= 427px)

**What changes from desktop:**

| Element            | Desktop                    | Mobile                                |
|--------------------|---------------------------|---------------------------------------|
| Top bar            | Full utility bar           | HIDDEN entirely, links in hamburger   |
| Header             | Logo + seller + search + auth + cart | Logo + hamburger + cart icon |
| Search             | Inline in header           | Below header, full-width, tap to expand |
| Seller filter      | Dropdown in header         | Full-width dropdown below search      |
| Nav bar            | Horizontal category links  | HIDDEN, categories in hamburger       |
| Hero               | Carousel + 2 side promos   | Full-width single carousel, reduced h |
| Side promos        | Right of hero              | HIDDEN on mobile                      |
| Categories         | 8 columns                  | 2 columns (4 rows)                    |
| Flash deals        | 4 horizontal               | Vertical stack, 1 per row             |
| Products           | 5 columns                  | 2 columns                             |
| Footer             | 4 columns                  | Single column accordion               |
| Bottom nav         | None                       | Fixed: Home, Search, Cart, Orders, Profile |

**Swipe gestures:**
- Hero carousel: horizontal swipe
- Deals section: none (stacked vertical)
- Product rows: none (grid layout, vertical scroll)

**Sticky elements:**
- Header (logo + hamburger + cart): fixed top, 56px
- Bottom nav: fixed bottom, 56px + safe area

**Font adjustments:**
- Hero title: 20px/26px (from 32px)
- Hero subtitle: 13px/18px
- Section headings: 18px/24px
- Product card title: 13px/18px, max 2 lines, ellipsis
- Product card price: 14px/20px bold

**Image adjustments:**
- Hero: 375x200, object-fit cover
- Category icons: 56x56
- Product card thumbs: calc((100vw - 48px) / 2) square (~164px on 375px)

```
+-----------------------------------+
| [=] HomeBase            [Cart: 3] |  <- 56px fixed header
+-----------------------------------+
| [Q Search products...]            |  <- full-width search
+-----------------------------------+
| [All Sellers            ▼]        |  <- full-width dropdown
+-----------------------------------+
|                                   |
| +-------------------------------+ |
| |      HERO CAROUSEL            | |  <- 200px height
| |   Best Deals on Top Products  | |
| |        [Shop Now]             | |
| |       o  o  *  o             | |
| +-------------------------------+ |
|                                   |
|  Shop by Category                 |
|  +-----------+ +-----------+      |
|  | [icon]    | | [icon]    |      |
|  | Electron. | | Fashion   |      |
|  +-----------+ +-----------+      |
|  +-----------+ +-----------+      |
|  | [icon]    | | [icon]    |      |
|  | Home      | | Grocery   |      |
|  +-----------+ +-----------+      |
|  +-----------+ +-----------+      |
|  | [icon]    | | [icon]    |      |
|  | Sports    | | Beauty    |      |
|  +-----------+ +-----------+      |
|  +-----------+ +-----------+      |
|  | [icon]    | | [icon]    |      |
|  | Books     | | Toys      |      |
|  +-----------+ +-----------+      |
|                                   |
|  Flash Deals     Ends: 05:23:41   |
|  +-------------------------------+|
|  | [img]  Deal Title             ||
|  |        Rs 999  ~~1999~~  50%  ||
|  |        [*****] 234 sold       ||
|  +-------------------------------+|
|  +-------------------------------+|
|  | [img]  Deal Title             ||
|  |        Rs 499  ~~999~~   50%  ||
|  |        [*****] 567 sold       ||
|  +-------------------------------+|
|                                   |
|  Best Sellers                     |
|  +----------+ +----------+       |
|  | [  img  ]| | [  img  ]|       |
|  | Product  | | Product  |       |
|  | Name...  | | Name...  |       |
|  | Rs 22490 | | Rs 1299  |       |
|  | [*****]  | | [****-]  |       |
|  +----------+ +----------+       |
|  +----------+ +----------+       |
|  | [  img  ]| | [  img  ]|       |
|  | Product  | | Product  |       |
|  | Name...  | | Name...  |       |
|  | Rs 14999 | | Rs 3499  |       |
|  | [*****]  | | [****-]  |       |
|  +----------+ +----------+       |
|                                   |
|  +-------------------------------+|
|  |v Company                      ||  <- accordion
|  +-------------------------------+|
|  |v Sell on HomeBase             ||
|  +-------------------------------+|
|  |v Help & Support               ||
|  +-------------------------------+|
|  |v Connect With Us              ||
|  +-------------------------------+|
|  (c) 2026 HomeBase               |
|                                   |
+-----------------------------------+
| [Home] [Search] [Cart] [Orders] [Me] |  <- 56px fixed bottom nav
+-----------------------------------+
    ^safe area padding below^
```

### 2.4 Hamburger Menu (Mobile)

Opens as a full-screen overlay sliding from the left.

```
+-----------------------------------+
| [X Close]            HomeBase     |
+-----------------------------------+
| [Avatar]                          |
| Rahul Sharma                      |
| rahul@email.com                   |
+-----------------------------------+
| Home                              |
| Categories                     >  |
| My Orders                         |
| My Wishlist                       |
| My Account                        |
+-----------------------------------+
| Track Order                       |
| Sell on HomeBase                  |
| Help Center                       |
+-----------------------------------+
| Language: English              >  |
| Currency: INR                  >  |
+-----------------------------------+
| [Logout]                          |
+-----------------------------------+
```

---

## 3. Customer: Product Detail

### 3.1 Desktop Layout (>= 1280px)

```
+------------------------------------------------------------------+
| [Header]                                                         |
+------------------------------------------------------------------+
| Breadcrumb: Home > Headphones > Sony WH-1000XM5                  |
+------------------------------------------------------------------+
|                                  |                                |
| +---+  +---------------------+  | Sony WH-1000XM5 Wireless...   |
| |   |  |                     |  | [*****] 456 reviews            |
| |thu|  |   MAIN IMAGE        |  |                                |
| |mb |  |   560x560           |  | Rs 22,490  ~~29,990~~  25%off |
| |   |  |                     |  | EMI from Rs 1,874/mo          |
| |   |  +---------------------+  |                                |
| |thu|                            | Color: [BLK] [SLV] [BLU] [x] |
| |mb |                            | Variant: [Std] [Case] [Bndl]  |
| +---+                            |                                |
|                                  | Qty: [- 1 +]                  |
|                                  |                                |
|                                  | [Add to Cart] [Buy Now]       |
|                                  |                                |
|                                  | Sold by: HomeBase Marketplace  |
|                                  | Delivery: Apr 1-3, FREE       |
|                                  | Returns: 30-day policy         |
|                                  | Warranty: 1 Year Sony          |
+------------------------------------------------------------------+
| [Description] [Specifications] [Reviews (456)]                   |
+------------------------------------------------------------------+
| Tab content...                                                   |
+------------------------------------------------------------------+
| Related Products: [P1] [P2] [P3] [P4] [P5]                      |
+------------------------------------------------------------------+
```

### 3.2 Tablet Layout (768px - 1023px)

**What changes:**
- Image gallery and product info remain side-by-side but narrower
- Image: 400x400, thumbnails: 4 visible
- Related products: 3 per row
- Tabs remain horizontal

### 3.3 Mobile Layout (<= 427px)

**What changes from desktop:**

| Element            | Desktop                     | Mobile                                |
|--------------------|----------------------------|---------------------------------------|
| Breadcrumb         | Full path                   | Collapsed: "< Back"                   |
| Image gallery      | Thumbnails left + main      | Full-width swipe carousel with dots   |
| Product info       | Right of images             | Below images, full-width              |
| Color/variant      | Inline selectors            | Same but larger touch targets (44px)  |
| Add to Cart / Buy  | Inline buttons              | HIDDEN inline, shown in sticky bar    |
| Seller/delivery    | Right column                | Full-width below info                 |
| Tabs               | Horizontal click            | Horizontal scroll (overflow-x)       |
| Related products   | 5 columns                   | Horizontal scroll, 2.5 visible        |
| Sticky bar         | None                        | Fixed bottom: price + [Add to Cart]   |

**Swipe gestures:**
- Image carousel: horizontal swipe to navigate images
- Related products: horizontal swipe
- Tab content: none (vertical scroll)

**Sticky elements:**
- Header: fixed top, 56px
- "Add to Cart" bar: fixed bottom, 64px + safe area

**Font adjustments:**
- Product title: 18px/24px (from 24px)
- Price large: 22px/28px
- Price strikethrough: 14px
- Review text: 13px/18px

**Image adjustments:**
- Gallery images: 375x375 (full viewport width, 1:1 ratio)
- Thumbnails: replaced by carousel dots
- Related product thumbs: 140x140

```
+-----------------------------------+
| [<]  Sony WH-1000XM5    [Share]  |  <- 56px header
+-----------------------------------+
|                                   |
| +-------------------------------+ |
| |                               | |
| |     PRODUCT IMAGE             | |  <- 375x375 swipe carousel
| |     (swipe left/right)        | |
| |                               | |
| |                               | |
| +-------------------------------+ |
|          o  o  *  o  o            |  <- carousel dots
|                                   |
| Sony WH-1000XM5 Wireless         |
| Industry Leading Noise            |
| Cancelling Headphones             |
|                                   |
| [*****] 456 reviews  |  2341 sold|
|                                   |
| Rs 22,490   ~~Rs 29,990~~  -25%  |
| EMI from Rs 1,874/mo             |
|                                   |
| Color                             |
| ( * ) Black  ( ) Silver  ( ) Blue|
| ( ) Burgundy [Out of stock]      |
|                                   |
| Variant                           |
| [Standard] [+Case +1500]         |
| [Bundle +3500]                    |
|                                   |
| Quantity  [  -  ]  1  [  +  ]    |
|                                   |
| +-------------------------------+|
| | Sold by  HomeBase Marketplace ||
| | Delivery Apr 1-3, FREE       ||
| | Returns  30-day return policy ||
| | Warranty 1 Year Sony          ||
| +-------------------------------+|
|                                   |
| [Descript..] [Specs] [Reviews]  ->|  <- horizontal scroll tabs
| +-------------------------------+|
| | Industry-leading noise cancel.||
| | - Auto NC Optimizer           ||
| | - AI-powered noise reduction  ||
| | - Multipoint connection       ||
| | - Touch controls              ||
| | - 250g lightweight            ||
| +-------------------------------+|
|                                   |
| You Might Also Like               |
| +--------+ +--------+ +---       |
| | [img]  | | [img]  | | [i  <-scroll
| | Name   | | Name   | | Na      |
| | Rs 999 | | Rs 499 | | Rs      |
| +--------+ +--------+ +---       |
|                                   |
|  (spacer 64px for sticky bar)    |
+-----------------------------------+
| Rs 22,490     [  Add to Cart  ]  |  <- 64px sticky bottom bar
+-----------------------------------+
    ^safe area padding^
```

---

## 4. Customer: Cart

### 4.1 Desktop Layout (>= 1280px)

```
+------------------------------------------------------------------+
| [Header]                                                         |
+------------------------------------------------------------------+
| Shopping Cart (3 items)                                          |
+------------------------------------------------------------------+
|                                          |                        |
| +--------------------------------------+ | Order Summary          |
| | [img] Sony WH-1000XM5               | | Items (3):  Rs 44,779  |
| |       Black | Standard               | | Shipping:   FREE       |
| |       Rs 22,490   [- 1 +]  [Remove] | | Tax:        Rs 4,030   |
| +--------------------------------------+ | Discount:  -Rs 2,000   |
| | [img] boAt Rockerz 450              | |                        |
| |       Red                            | | Total:     Rs 46,809   |
| |       Rs 1,299    [- 1 +]  [Remove] | |                        |
| +--------------------------------------+ | Coupon: [____] [Apply] |
| | [img] AirPods Pro 2                 | |                        |
| |       White                          | | [Proceed to Checkout]  |
| |       Rs 20,990   [- 1 +]  [Remove] | |                        |
| +--------------------------------------+ +------------------------+
+------------------------------------------------------------------+
```

### 4.2 Tablet Layout (768px - 1023px)

**What changes:**
- Cart items and summary still side-by-side
- Cart items: narrower, image smaller (80x80)
- Summary sidebar: narrower (240px)

### 4.3 Mobile Layout (<= 427px)

**What changes from desktop:**

| Element           | Desktop                    | Mobile                                |
|-------------------|---------------------------|---------------------------------------|
| Layout            | 2 columns (items + summary)| Single column, items then summary     |
| Item image        | 120x120                    | 80x80                                 |
| Item details      | Inline with image          | Name/price right of image, qty below  |
| Remove button     | Inline text                | Swipe-left to reveal OR icon button   |
| Order summary     | Right sidebar              | Below items, full-width               |
| Checkout button   | In summary sidebar         | HIDDEN inline, shown in sticky bar    |
| Coupon input      | In summary sidebar         | In summary section, full-width        |

**Swipe gestures:**
- Cart item: swipe left to reveal delete action (red background)

**Sticky elements:**
- Header: fixed top, 56px
- Bottom nav: HIDDEN on cart page
- Checkout bar: fixed bottom, 64px + safe area (shows total + button)

**Font adjustments:**
- Page title: 20px/26px
- Product name in cart: 14px/20px, max 2 lines
- Price: 16px bold
- Summary labels: 14px
- Summary total: 18px bold

```
+-----------------------------------+
| [<]  Shopping Cart (3)            |  <- 56px header
+-----------------------------------+
|                                   |
| +-------------------------------+ |
| | +------+ Sony WH-1000XM5     | |
| | | img  | Black, Standard      | |
| | | 80x80| Rs 22,490 ~~29,990~~| |
| | +------+                      | |
| |   [  -  ]  1  [  +  ]  [bin] | |
| +-------------------------------+ |
|                                   |
| +-------------------------------+ |
| | +------+ boAt Rockerz 450    | |
| | | img  | Lush Red             | |
| | | 80x80| Rs 1,299  ~~2,990~~ | |
| | +------+                      | |
| |   [  -  ]  1  [  +  ]  [bin] | |
| +-------------------------------+ |
|                                   |
| +-------------------------------+ |
| | +------+ AirPods Pro 2       | |
| | | img  | White                | |
| | | 80x80| Rs 20,990 ~~24,900~~| |
| | +------+                      | |
| |   [  -  ]  1  [  +  ]  [bin] | |
| +-------------------------------+ |
|                                   |
| +-------------------------------+ |
| | Coupon Code                   | |
| | [__________________] [Apply]  | |
| +-------------------------------+ |
|                                   |
| +-------------------------------+ |
| | Order Summary                 | |
| |-------------------------------|
| | Items (3)          Rs 44,779  | |
| | Shipping               FREE  | |
| | Tax                Rs  4,030  | |
| | Discount          -Rs  2,000  | |
| |-------------------------------| |
| | Total              Rs 46,809  | |
| +-------------------------------+ |
|                                   |
|  (spacer 64px for sticky bar)    |
+-----------------------------------+
| Rs 46,809  [Proceed to Checkout] |  <- 64px sticky bar
+-----------------------------------+
```

### 4.4 Swipe-to-Delete

```
   Normal state:
   +-------------------------------+
   | [img] Product Name            |
   |       Rs 22,490     [- 1 +]  |
   +-------------------------------+

   Swiped left (80px reveal):
   +-------------------------+-----+
   | [img] Product Name      | DEL |  <- red bg, white trash icon
   |       Rs 22,490   [- 1 +| ETE |     44x full-height
   +-------------------------+-----+
```

---

## 5. Customer: Checkout

### 5.1 Desktop Layout (>= 1280px)

```
+------------------------------------------------------------------+
| [Logo]                              Secure Checkout               |
+------------------------------------------------------------------+
|  Step: (1 Address)---(2 Shipping)---(3 Payment)---(4 Review)     |
+------------------------------------------------------------------+
|                                          |                        |
| Delivery Address                         | Order Summary          |
| +--------------------------------------+ | Sony WH...  Rs 22,490 |
| | (*) Home - Flat 402, Sunshine...     | | boAt Ro...  Rs  1,299 |
| | ( ) Office - 3rd Floor, WeWork...   | | AirPods...  Rs 20,990 |
| +--------------------------------------+ |                        |
| [+ Add New Address]                      | Items:      Rs 44,779 |
|                                          | Shipping:       FREE   |
| [Continue to Shipping ->]                | Tax:        Rs  4,030 |
|                                          | Total:      Rs 46,809 |
+------------------------------------------------------------------+
```

### 5.2 Tablet Layout (768px - 1023px)

**What changes:**
- Steps remain horizontal but condensed
- Address cards and summary: side-by-side but narrower
- Summary sidebar: 220px

### 5.3 Mobile Layout (<= 427px)

**What changes from desktop:**

| Element           | Desktop                      | Mobile                                 |
|-------------------|------------------------------|----------------------------------------|
| Header            | Full with logo               | Logo + "Secure Checkout" only          |
| Steps indicator   | Horizontal line with circles | Horizontal pills, scrollable           |
| Layout            | 2 columns                    | Single column                          |
| Order summary     | Right sidebar, always visible| Collapsible card at top                |
| Address cards     | Radio + full address         | Same, full-width                       |
| Payment methods   | Side-by-side cards           | Stacked full-width cards               |
| Continue button   | Inline                       | Full-width at section bottom           |
| Place Order       | In summary                   | Sticky bottom bar                      |

**Swipe gestures:** None (form-based page, no swiping)

**Sticky elements:**
- Header: fixed top, 56px
- On final step: "Place Order" sticky bottom bar, 64px

**Font adjustments:**
- Step labels: 12px
- Address text: 14px/20px
- Section titles: 18px/24px

```
+-----------------------------------+
| [<] HomeBase   Secure Checkout    |  <- 56px header
+-----------------------------------+
|                                   |
| [1 Address] [2 Ship] [3 Pay] [4] |  <- horizontal pills
|   ^active^                        |     scroll if overflow
|                                   |
| +-------------------------------+ |
| | v Order Summary (3 items)     | |  <- collapsible
| |   Rs 46,809                   | |
| +-------------------------------+ |
|                                   |
|  Delivery Address                 |
|                                   |
| +-------------------------------+ |
| | (*) Home                      | |
| | Rahul Sharma                  | |
| | Flat 402, Sunshine Towers     | |
| | MG Road, Koramangala          | |
| | Bengaluru 560034              | |
| | +91 98765 43210               | |
| +-------------------------------+ |
|                                   |
| +-------------------------------+ |
| | ( ) Office                    | |
| | Rahul Sharma                  | |
| | 3rd Floor, WeWork Galaxy      | |
| | Residency Road                | |
| | Bengaluru 560025              | |
| +-------------------------------+ |
|                                   |
| [+ Add New Address]              |
|                                   |
| [  Continue to Shipping  ->  ]   |  <- full-width button
|                                   |
+-----------------------------------+
| [Bottom Nav - hidden on checkout] |
+-----------------------------------+
```

### 5.4 Expanded Order Summary (Mobile)

```
| +-------------------------------+ |
| | ^ Order Summary (3 items)     | |  <- tap to collapse
| |-------------------------------| |
| | Sony WH-1000XM5    Rs 22,490 | |
| | boAt Rockerz 450    Rs 1,299 | |
| | AirPods Pro 2      Rs 20,990 | |
| |-------------------------------| |
| | Subtotal            Rs 44,779 | |
| | Shipping                FREE  | |
| | Tax                 Rs  4,030 | |
| | Discount           -Rs  2,000 | |
| |-------------------------------| |
| | Total               Rs 46,809 | |
| +-------------------------------+ |
```

### 5.5 Final Step (Review & Place Order) - Mobile

```
+-----------------------------------+
| [<] HomeBase   Secure Checkout    |
+-----------------------------------+
|                                   |
| [1 Addr] [2 Ship] [3 Pay] [4 Rev]|
|                            ^act^  |
|                                   |
|  Review Your Order                |
|                                   |
| +-------------------------------+ |
| | Deliver to:                   | |
| | Flat 402, Sunshine...  [Edit] | |
| +-------------------------------+ |
| | Shipping:                     | |
| | Standard (Apr 1-3)    [Edit] | |
| +-------------------------------+ |
| | Payment:                      | |
| | Visa ****4242          [Edit] | |
| +-------------------------------+ |
|                                   |
| +-------------------------------+ |
| | Items (3)                     | |
| | Sony WH-1000XM5   Rs 22,490  | |
| | boAt Rockerz 450   Rs 1,299  | |
| | AirPods Pro 2     Rs 20,990  | |
| +-------------------------------+ |
|                                   |
|  (spacer 64px for sticky bar)    |
+-----------------------------------+
| Rs 46,809   [  Place Order  ]    |  <- 64px sticky bar
+-----------------------------------+
```

---

## 6. Seller: Dashboard

### 6.1 Desktop Layout (>= 1280px)

```
+------------------------------------------------------------------+
|          |                                                        |
| SIDEBAR  | Welcome back, Rajesh!                                 |
| 256px    |                                                        |
|          | [Revenue]  [Orders]  [Products]  [Rating]              |
| Dashboard| [Rs 4.5L ] [1,234 ] [89 items ] [4.6/5 ]             |
| Products | [+12.5%  ] [+8.2% ] [72 active] [1238 r]             |
| Orders   |                                                        |
| Inventory| +---Revenue Chart (12mo)---+ +---Activity---+          |
| Messages | |                          | | 10:30 Order  |          |
| Reviews  | |     /\    /\             | | 10:15 Review |          |
| Payments | |    /  \  /  \  /\        | | 09:45 Return |          |
| Settings | |   /    \/    \/  \       | | 09:30 Order  |          |
|          | +-------------------------+ +---------------+          |
|          |                                                        |
|          | Recent Orders Table                                    |
|          | ID | Customer | Items | Total | Status | Date          |
|          | ---|----------|-------|-------|--------|------          |
+------------------------------------------------------------------+
```

### 6.2 Tablet Layout (768px - 1023px)

**What changes:**
- Sidebar: collapses to icon-only rail (64px), expands on hover/click
- Stats: 2 rows of 2 cards
- Chart and activity: stacked vertically
- Table: visible but horizontally scrollable

### 6.3 Mobile Layout (<= 427px)

**What changes from desktop:**

| Element           | Desktop                    | Mobile                                |
|-------------------|---------------------------|---------------------------------------|
| Sidebar           | Fixed left, 256px          | Hidden, hamburger menu overlay        |
| Stats cards       | 4 columns in one row       | 2 columns, 2 rows                     |
| Revenue chart     | 60% width beside activity  | Full-width, reduced height (200px)    |
| Activity feed     | 40% width beside chart     | Full-width below chart                |
| Orders table      | Full table with columns    | Horizontal scroll OR card view        |

**Swipe gestures:**
- Pull-to-refresh on dashboard data

**Sticky elements:**
- Header with hamburger: fixed top, 56px

**Font adjustments:**
- Welcome message: 18px/24px
- Stat value: 22px/28px bold
- Stat label: 12px/16px
- Stat trend: 12px

**Chart adjustments:**
- Height: 200px (from 300px)
- X-axis labels: rotated 45 degrees or show every other month
- Touch: tap on data point shows tooltip

```
+-----------------------------------+
| [=] Seller Dashboard     [bell]   |  <- 56px header
+-----------------------------------+
|                                   |
| Welcome back, Rajesh!             |
|                                   |
| +--------------+ +--------------+ |
| | Revenue      | | Orders       | |
| | Rs 4,52,890  | | 1,234        | |
| | ^ +12.5%     | | ^ +8.2%     | |
| +--------------+ +--------------+ |
| +--------------+ +--------------+ |
| | Products     | | Rating       | |
| | 89 items     | | 4.6 / 5     | |
| | 72 active    | | 1238 reviews | |
| +--------------+ +--------------+ |
|                                   |
| Revenue (12 months)               |
| +-------------------------------+ |
| |     /\    /\                  | |  <- 200px height
| |    /  \  /  \  /\             | |
| |   /    \/    \/  \            | |
| | J F M A M J J A S O N D      | |
| +-------------------------------+ |
|                                   |
| Recent Activity                   |
| +-------------------------------+ |
| | 10:30  New order #ORD-1237   | |
| | 10:15  New review (5 stars)  | |
| | 09:45  Return request #R-089 | |
| | 09:30  New order #ORD-1236   | |
| +-------------------------------+ |
|                                   |
| Recent Orders                     |
| +-------------------------------+ |
| | #ORD-1237          Processing | |
| | Rahul S.  |  2 items          | |
| | Rs 23,789       30 min ago    | |
| +-------------------------------+ |
| | #ORD-1236            Shipped  | |
| | Priya M.  |  1 item           | |
| | Rs 1,299         1 hour ago   | |
| +-------------------------------+ |
| | #ORD-1235           Delivered | |
| | Amit K.   |  3 items          | |
| | Rs 45,670        2 hours ago  | |
| +-------------------------------+ |
|                                   |
+-----------------------------------+
```

### 6.4 Seller Hamburger Menu (Mobile)

```
+-----------------------------------+
| [X Close]                         |
+-----------------------------------+
| [RS]  Rajesh Store                |
|       seller-001                  |
+-----------------------------------+
| Dashboard                         |
| Products                          |
| Orders                            |
| Inventory                         |
| Messages                     (3)  |
| Reviews                           |
| Payments                          |
| Returns                           |
| Settlements                       |
+-----------------------------------+
| Store Settings                    |
| My Profile                        |
| Documents                         |
| Performance                       |
| Support                           |
+-----------------------------------+
| [Switch to Buyer View]            |
| [Logout]                          |
+-----------------------------------+
```

---

## 7. Seller: Products & Orders

### 7.1 Desktop Layout (Products) (>= 1280px)

```
+------------------------------------------------------------------+
| SIDEBAR | Stats: [Total 89] [Active 72] [Inactive 12] [OOS 5]   |
|         |                                                        |
|         | [Search...] [Category ▼] [Status ▼] [+ Add Product]   |
|         |                                                        |
|         | | Image | Name | SKU | Category | Price | Stock | Stat |
|         | |-------|------|-----|----------|-------|-------|------|
|         | | [img] | Sony | WH1 | Headph   | 22490 |  12   | Act  |
|         | | [img] | boAt | RZ4 | Headph   |  1299 |  50   | Act  |
+------------------------------------------------------------------+
```

### 7.2 Mobile Layout (Products) (<= 427px)

**What changes from desktop:**

| Element           | Desktop                    | Mobile                                |
|-------------------|---------------------------|---------------------------------------|
| Sidebar           | Fixed left, 256px          | Hidden, hamburger menu                |
| Stats cards       | 4 inline                   | 2x2 grid                              |
| Search + filters  | Inline row                 | Search full-width, filters in bottom sheet |
| Add Product       | Button in filter row       | FAB (floating action button) bottom-right |
| Table             | Full column table          | Card view (stacked)                   |
| Table actions     | Inline buttons             | Overflow menu (three dots)            |
| Pagination        | Full: Prev 1 2 3 ... Next  | Compact: Prev [3/12] Next             |

**Swipe gestures:**
- Card: swipe left for quick actions (edit, deactivate)
- Pull-to-refresh on product list

**Sticky elements:**
- Header with hamburger: fixed top, 56px
- Filter pills (active filters): sticky below header
- FAB: fixed, 56px diameter, bottom-right, 16px margin + safe area offset

```
+-----------------------------------+
| [=] Products              [bell]  |  <- 56px header
+-----------------------------------+
|                                   |
| +--------------+ +--------------+ |
| | Total   89   | | Active  72   | |
| +--------------+ +--------------+ |
| +--------------+ +--------------+ |
| | Inactive 12  | | OOS     5    | |
| +--------------+ +--------------+ |
|                                   |
| [Q Search products...] [Filter]  |  <- filter opens bottom sheet
|                                   |
| Active filters:                   |
| [x Electronics] [x Active]       |  <- sticky below header on scroll
|                                   |
| +-------------------------------+ |
| | [img] Sony WH-1000XM5        | |
| |       SKU: WH1000XM5-BLK     | |
| |       Headphones              | |
| |       Rs 22,490    Stock: 12  | |
| |       Status: Active     ...  | |  <- ... = overflow menu
| +-------------------------------+ |
| +-------------------------------+ |
| | [img] boAt Rockerz 450       | |
| |       SKU: BOAT-RZ450-RED    | |
| |       Headphones              | |
| |       Rs 1,299     Stock: 50  | |
| |       Status: Active     ...  | |
| +-------------------------------+ |
| +-------------------------------+ |
| | [img] AirPods Pro 2          | |
| |       SKU: APL-APP2-USC      | |
| |       Headphones              | |
| |       Rs 20,990    Stock: 8   | |
| |       Status: Active     ...  | |
| +-------------------------------+ |
|                                   |
|        [< Prev] 1 / 9 [Next >]  |
|                                   |
|                             [+]  |  <- FAB, 56px
+-----------------------------------+
```

### 7.3 Filter Bottom Sheet (Mobile)

Opens from bottom, covers 60% of screen height.

```
+-----------------------------------+
|                                   |  <- dimmed backdrop
|                                   |
|                                   |
+-----------------------------------+
| ----  (drag handle)              |  <- swipe down to dismiss
|                                   |
| Filters                  [Reset] |
|                                   |
| Category                          |
| [All ▼________________________]  |
|                                   |
| Status                            |
| ( ) All  (*) Active  ( ) Inactive|
| ( ) Out of Stock                  |
|                                   |
| Price Range                       |
| [Min Rs___] - [Max Rs___]       |
|                                   |
| Sort By                           |
| (*) Newest First                  |
| ( ) Price: Low to High            |
| ( ) Price: High to Low            |
| ( ) Name: A-Z                     |
|                                   |
| [     Apply Filters     ]        |  <- full-width button
+-----------------------------------+
```

### 7.4 Orders (Mobile)

Same pattern as Products. Table converts to card view.

```
+-----------------------------------+
| [=] Orders                [bell]  |
+-----------------------------------+
|                                   |
| +--------------+ +--------------+ |
| | Total  1234  | | Pending  23  | |
| +--------------+ +--------------+ |
| +--------------+ +--------------+ |
| | Processing 45| | Shipped  89  | |
| +--------------+ +--------------+ |
|                                   |
| [Q Search orders...]  [Filter]   |
|                                   |
| +-------------------------------+ |
| | #ORD-1237          Processing | |  <- status badge, colored
| | Rahul Sharma                  | |
| | 2 items  |  Rs 23,789        | |
| | 30 minutes ago         [...]  | |
| +-------------------------------+ |
| +-------------------------------+ |
| | #ORD-1236             Shipped | |
| | Priya Mehta                   | |
| | 1 item   |  Rs 1,299         | |
| | 1 hour ago             [...]  | |
| +-------------------------------+ |
|                                   |
|        [< Prev] 1 / 12 [Next >] |
|                                   |
+-----------------------------------+
```

---

## 8. Admin: All Pages

### 8.1 Desktop Layout (>= 1280px)

Admin pages follow the same sidebar + content pattern as seller.

```
+------------------------------------------------------------------+
|          |                                                        |
| SIDEBAR  | Admin Dashboard / Sellers / Users / Products / etc.   |
| 256px    |                                                        |
|          | [Stat1] [Stat2] [Stat3] [Stat4] [Stat5] [Stat6]      |
| Dashboard|                                                        |
| Orders   | +---Chart---+ +---Donut---+ +---Alerts---+            |
| Products | |            | |           | |            |            |
| Sellers  | +------------+ +-----------+ +------------+            |
| Users    |                                                        |
| Returns  | Data Table (full width, all columns visible)           |
| Reviews  | | ID | Name | Email | Role | Status | Date | Actions |
| Promotions| |---|------|-------|------|--------|------|---------|  |
| Compliance|                                                       |
| CMS      |                                                        |
| Analytics|                                                        |
+------------------------------------------------------------------+
```

### 8.2 Tablet Layout (768px - 1023px)

**What changes:**
- Sidebar: icon-only rail (64px)
- Stats: 3 columns (2 rows for 6 cards)
- Charts: stacked vertically
- Tables: horizontally scrollable

### 8.3 Mobile Layout (<= 427px)

**What changes from desktop:**

| Element           | Desktop                    | Mobile                                |
|-------------------|---------------------------|---------------------------------------|
| Sidebar           | Fixed left, 256px          | Hidden, hamburger menu overlay        |
| Stats cards       | 6 in a row (admin dash)    | 2 columns, 3 rows                     |
| Charts            | Side-by-side               | Full-width, stacked, 180px height     |
| Data tables       | Full columns               | Card view (responsive)                |
| Table actions     | Inline buttons             | Overflow menu (...) or swipe          |
| Search + filters  | Inline                     | Search full-width, filters bottom sheet|
| Bulk actions      | Toolbar above table        | Bottom sheet or top action bar        |
| Pagination        | Full                       | Compact: [< Prev] 3/24 [Next >]      |

**Admin-specific mobile considerations:**
- Admin pages are less likely to be used on mobile, but must remain functional
- Complex forms (CMS editor, promotion setup) should use full-width stacked fields
- Approval actions should have large, clearly labeled buttons (approve/reject)

```
+-----------------------------------+
| [=] Admin Dashboard       [bell]  |  <- 56px header
+-----------------------------------+
|                                   |
| Platform Overview                 |
|                                   |
| +--------------+ +--------------+ |
| | Revenue      | | Orders       | |
| | Rs 2.4 Cr    | | 12,450       | |
| | ^ +18.2%     | | ^ +12.5%    | |
| +--------------+ +--------------+ |
| +--------------+ +--------------+ |
| | Sellers      | | Users        | |
| | 234 active   | | 45,890       | |
| | ^ +8.3%      | | ^ +22.1%    | |
| +--------------+ +--------------+ |
| +--------------+ +--------------+ |
| | Products     | | Approvals    | |
| | 8,920 listed | | 18 pending ! | |
| | ^ +6.7%      | | [Review ->] | |
| +--------------+ +--------------+ |
|                                   |
| Revenue Trend                     |
| +-------------------------------+ |
| |    /\    /\                   | |  <- 180px height
| |   /  \  /  \  /\              | |
| +-------------------------------+ |
|                                   |
| Top Sellers                       |
| +-------------------------------+ |
| | #1  Rajesh Store              | |
| |     Rs 4.5L  |  1234 orders  | |
| +-------------------------------+ |
| | #2  Priya Electronics         | |
| |     Rs 3.8L  |  987 orders   | |
| +-------------------------------+ |
| | #3  Kumar Fashions            | |
| |     Rs 2.1L  |  654 orders   | |
| +-------------------------------+ |
|                                   |
| Recent Alerts                     |
| +-------------------------------+ |
| | ! New seller pending approval | |
| | ! Product reported (3 times)  | |
| | i System update scheduled     | |
| +-------------------------------+ |
|                                   |
+-----------------------------------+
```

### 8.4 Admin Tables as Cards (Mobile)

All admin tables (sellers, users, products, orders, returns, reviews) convert to card view.

```
  Desktop table row:
  | ID | Name | Email | Role | Status | Date | Actions |

  Mobile card:
  +-------------------------------+
  | Rahul Sharma           Active |  <- name + status badge
  | rahul@email.com               |
  | Role: Buyer                   |
  | Joined: Mar 15, 2026          |
  |                          ...  |  <- overflow menu
  +-------------------------------+
```

### 8.5 Admin Hamburger Menu (Mobile)

```
+-----------------------------------+
| [X Close]                         |
+-----------------------------------+
| [A]  Admin Panel                  |
|      Platform Admin               |
+-----------------------------------+
| Dashboard                         |
| Orders                            |
| Products                          |
| Sellers                           |
| Users                             |
| Returns                           |
| Reviews                           |
+-----------------------------------+
| Promotions                        |
| Compliance                        |
| CMS                               |
| Analytics                         |
+-----------------------------------+
| Settings                          |
| [Logout]                          |
+-----------------------------------+
```

---

## 9. Warehouse: All Pages

### 9.1 Design Philosophy

Warehouse pages are **mobile-first** because warehouse staff primarily use handheld devices
and tablets while working on the warehouse floor. The mobile experience is the primary
design target; desktop is the adaptation.

### 9.2 Desktop Layout (>= 1280px)

```
+------------------------------------------------------------------+
| [Logo] Warehouse Management    HSR Layout   Shift: Morning [user]|
+------------------------------------------------------------------+
| SIDEBAR  |                                                        |
| 256px    | [Items 24560] [Inbound 8] [Pick 45] [Pack 12]         |
|          | [Shipped 89] [Capacity 72%]                            |
| Dashboard|                                                        |
| Inbound  | +---Activity---+ +---Capacity---+                     |
| Orders   | |               | |              |                     |
| Shipments| +---------------+ +--------------+                     |
| Inventory|                                                        |
|          | Orders to Process                                      |
|          | | ID | Items | Zone | Priority | Status | Assigned |   |
+------------------------------------------------------------------+
```

### 9.3 Tablet Layout (768px - 1023px)

**What changes:**
- Sidebar: icon-only rail (64px)
- Stats: 3 columns (2 rows)
- Activity and capacity: stacked
- Table: full width, horizontally scrollable

### 9.4 Mobile Layout (<= 427px)

**What changes from desktop:**

| Element            | Desktop                     | Mobile                                |
|--------------------|----------------------------|---------------------------------------|
| Sidebar            | Fixed left, 256px           | Hidden, hamburger menu                |
| Header             | Full info bar               | Compact: logo + hamburger + user icon |
| Stats cards        | 6 in a row                  | 2 columns, 3 rows                     |
| Activity timeline  | Beside capacity chart       | Full-width, stacked                   |
| Capacity chart     | Beside activity             | Full-width below activity             |
| Tables             | Full columns                | Card view                             |
| Bottom nav         | Hidden                      | Fixed bottom: Dashboard, Scan, Orders, Ship, More |
| Barcode scanning   | Inline scanner widget       | Full-screen camera mode               |

**Warehouse-specific mobile features:**
- Large touch targets (workers may wear gloves): minimum 48px instead of 44px
- High-contrast status badges for readability under warehouse lighting
- Vibration feedback on successful scans
- Offline-capable: cached data for pick lists

**Swipe gestures:**
- Order cards: swipe right to mark as "picked"
- Pull-to-refresh on all lists

**Sticky elements:**
- Header: fixed top, 56px
- Bottom nav: fixed bottom, 56px + safe area
- Active pick banner: sticky below header when pick is in progress

```
+-----------------------------------+
| [=] Warehouse         [shift][me] |  <- 56px header
+-----------------------------------+
| HSR Layout  |  Morning Shift      |
+-----------------------------------+
|                                   |
| +--------------+ +--------------+ |
| | Total Items  | | Inbound      | |
| | 24,560       | | 8 pending    | |
| | ^ +2.4%      | |              | |
| +--------------+ +--------------+ |
| +--------------+ +--------------+ |
| | Orders Pick  | | Packing      | |
| | 45 active    | | 12 in prog.  | |
| +--------------+ +--------------+ |
| +--------------+ +--------------+ |
| | Shipped Today| | Capacity     | |
| | 89 (+15)     | | 72% used     | |
| |              | | [=========- ]| |  <- mini progress bar
| +--------------+ +--------------+ |
|                                   |
| Today's Activity                  |
| +-------------------------------+ |
| | 10:30  Inbound #IB-456 rcvd  | |
| | 10:15  Order #W-789 picked   | |
| | 09:45  Shipment #SH-012 out  | |
| | 09:30  Order #W-788 assigned | |
| +-------------------------------+ |
|                                   |
| Orders to Process                 |
| +-------------------------------+ |
| | #W-789              PICKING   | |  <- large status badge
| | Zone A3  |  5 items           | |
| | Priority: HIGH           ...  | |
| | Assigned: Suresh              | |
| +-------------------------------+ |
| +-------------------------------+ |
| | #W-790              PENDING   | |
| | Zone B1  |  2 items           | |
| | Priority: NORMAL         ...  | |
| | Unassigned                    | |
| +-------------------------------+ |
|                                   |
+-----------------------------------+
| [Dash] [Scan] [Orders] [Ship] [+]|  <- 56px bottom nav
+-----------------------------------+
```

### 9.5 Barcode Scanning: Full-Screen Camera Mode

Activated from bottom nav "Scan" button or from any scan-enabled context.

```
+-----------------------------------+
| [X Close]           [Flash: Off]  |  <- transparent overlay
+-----------------------------------+
|                                   |
|                                   |
|                                   |
|       +-------------------+       |
|       |                   |       |  <- camera viewfinder
|       |    [  scan box  ] |       |     full-screen camera feed
|       |    [  centered  ] |       |
|       |                   |       |
|       +-------------------+       |
|                                   |
|  Scan barcode or QR code          |
|                                   |
|  Last scanned:                    |
|  SKU: WH1000XM5-BLK              |
|  Sony WH-1000XM5  |  Qty: 12     |
|                                   |
| +-------------------------------+ |
| |  [Enter Manually]             | |  <- 48px button, fallback
| +-------------------------------+ |
+-----------------------------------+
```

### 9.6 Active Pick Banner (Sticky, Mobile)

When a warehouse worker is actively picking an order, a sticky banner appears below the header.

```
+-----------------------------------+
| [=] Warehouse         [shift][me] |  <- header
+-----------------------------------+
| Picking #W-789  Zone A3   3/5    |  <- sticky pick banner
| [  Next Item: Shelf A3-04  ->]   |     teal background
+-----------------------------------+
| (rest of page content below)      |
```

---

## 10. Mobile-Specific Components

### 10.1 Bottom Navigation Bar

Used on: Customer storefront, Warehouse pages.
NOT used on: Cart, Checkout, Product Detail (replaced by sticky CTA bars).

```
Customer Bottom Nav:
+-----------------------------------+
| [Home]  [Search] [Cart] [Ord] [Me]|
|  (o)      (Q)    (bag)  (box) (u)|
+-----------------------------------+
  56px height + safe area bottom padding
  Active item: filled icon + brand color text
  Inactive: outline icon + gray-500 text
  Badge on Cart: red dot with count
  Badge on Orders: red dot if pending action

Warehouse Bottom Nav:
+-----------------------------------+
| [Dash] [Scan]  [Orders] [Ship][+]|
|  (grid) (cam)   (box)   (truck)()|
+-----------------------------------+
  Scan button: centered, elevated (FAB-style)
  56px circular, extends 12px above nav bar
```

### 10.2 Bottom Sheet Modal

Used for: Filters, sort options, quick actions, overflow menus.

**Sizes:**
- Small (30% height): quick actions, sort options
- Medium (50% height): filters, simple forms
- Large (80% height): complex content, address picker

**Behavior:**
- Appears from bottom with spring animation (300ms)
- Dimmed backdrop, tap to dismiss
- Drag handle at top, swipe down to dismiss
- Content scrollable within sheet

```
Small Bottom Sheet (sort):
+-----------------------------------+
|                                   |  <- dimmed
|                                   |
|                                   |
|                                   |
|                                   |
+-----------------------------------+
| ----  (drag handle, 40x4px)      |
|                                   |
| Sort By                           |
| (*) Newest First                  |  <- 48px row height
| ( ) Price: Low to High            |
| ( ) Price: High to Low            |
| ( ) Popularity                    |
|                                   |
+-----------------------------------+

Medium Bottom Sheet (filters):
+-----------------------------------+
|                                   |  <- dimmed
|                                   |
+-----------------------------------+
| ----                              |
|                                   |
| Filters                  [Reset]  |
|                                   |
| Category                          |
| [All ▼_______________________]   |
|                                   |
| Price Range                       |
| [Min ______] - [Max ______]      |
|                                   |
| Rating                            |
| [****-] 4+ stars                  |
|                                   |
| [       Apply Filters       ]    |
+-----------------------------------+
```

### 10.3 Swipe Actions

Used on: Cart items, order cards, product cards (seller), pick list items.

```
Default state:
+-------------------------------+
| [Content of the card]         |
+-------------------------------+

Swipe left (destructive action):
+-----------------------+-------+
| [Content shifts left] | [Del] |  <- red bg, white icon
+-----------------------+-------+

Swipe right (positive action):
+-------+-----------------------+
| [Done]| [Content shifts right]|  <- green bg, white icon
+-------+-----------------------+

Thresholds:
- Peek: 0-60px drag reveals icons
- Action trigger: >120px auto-completes the action
- Snap-back: release below 60px returns to default
- Haptic feedback: light impact at 60px, medium at 120px
```

### 10.4 Pull-to-Refresh

Used on: All list/dashboard pages.

```
Pull state (pulling down from top):
+-----------------------------------+
|         (spinner icon)            |  <- appears as user pulls
|         Refreshing...             |
+-----------------------------------+
| [Normal page content]             |

Thresholds:
- Start: 0px
- Trigger: 80px pull distance
- Max overscroll: 120px
- Animation: spinner rotates once per 1 second
- Release: snaps back to top, spinner stays until data loads
```

### 10.5 Toast Notifications (Mobile)

Position: bottom of screen, above bottom nav (if present), below sticky CTA (if present).

```
With bottom nav:
+-----------------------------------+
| +-------------------------------+ |
| | [check] Item added to cart    | |  <- 48px height, rounded-lg
| +-------------------------------+ |
|                 16px gap          |
| [Home] [Search] [Cart] [Ord] [Me]|
+-----------------------------------+

With sticky CTA:
+-----------------------------------+
| +-------------------------------+ |
| | [check] Item added to cart    | |
| +-------------------------------+ |
|                 8px gap           |
| Rs 22,490     [  Add to Cart  ]  |
+-----------------------------------+

Duration: 3 seconds, then fade out (300ms)
Gesture: swipe right to dismiss early
```

### 10.6 Empty States (Mobile)

```
+-----------------------------------+
|                                   |
|                                   |
|          [illustration]           |  <- 120x120 vector
|                                   |
|       Your cart is empty          |  <- 18px semibold
|                                   |
|     Browse products and add       |  <- 14px gray-500
|     items to your cart            |
|                                   |
|     [  Start Shopping  ]          |  <- primary button
|                                   |
+-----------------------------------+
```

---

## 11. Safe Area & Keyboard Behavior

### 11.1 Safe Area Handling

**iOS (notch devices):**

```
Top safe area (status bar + notch):
+-----------------------------------+
|  |||||||  (notch area)  |||||||   |  <- env(safe-area-inset-top)
+-----------------------------------+
| [=] HomeBase            [Cart: 3] |  <- content starts here
+-----------------------------------+

Bottom safe area (home indicator):
+-----------------------------------+
| [Home] [Search] [Cart] [Ord] [Me]|  <- nav content
+-----------------------------------+
|      _____ (home indicator)       |  <- env(safe-area-inset-bottom)
+-----------------------------------+
```

**CSS implementation:**

```
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

**Applied to:**
- Fixed top header: `padding-top: env(safe-area-inset-top)`
- Fixed bottom nav: `padding-bottom: env(safe-area-inset-bottom)`
- Sticky CTA bars: `padding-bottom: env(safe-area-inset-bottom)`
- Bottom sheets: `padding-bottom: env(safe-area-inset-bottom)`
- Full-screen overlays (scanner, hamburger): all four insets

### 11.2 Keyboard Behavior

**General rules:**
- When keyboard appears, the focused input scrolls into view (above keyboard)
- Fixed bottom elements (nav, CTA bars) HIDE when keyboard is open
- Bottom sheets resize to account for keyboard height
- Search bar: keyboard opens with "search" return key type
- Forms: keyboard shows "next" to tab between fields, "done" on last field

**Search input:**

```
Before focus (collapsed):
+-----------------------------------+
| [=] HomeBase            [Cart: 3] |
+-----------------------------------+
| [Q Search products...]            |
+-----------------------------------+
| (page content)                    |

After focus (keyboard open):
+-----------------------------------+
| [Cancel]  [Q Search products_  ] |  <- cancel button appears
+-----------------------------------+
| Recent Searches:                  |  <- instant results overlay
| - sony headphones                 |
| - wireless earbuds                |
| - laptop bag                      |
|                                   |
| Trending:                         |
| - summer sale                     |
| - new arrivals                    |
+-----------------------------------+
|                                   |
| [  q  w  e  r  t  y  u  i  o  p ]|  <- keyboard
| [  a  s  d  f  g  h  j  k  l    ]|
| [shift z  x  c  v  b  n  m  del ]|
| [123  space             Search   ]|  <- "Search" return key
+-----------------------------------+
```

**Checkout form input:**

```
+-----------------------------------+
| [<] Secure Checkout               |
+-----------------------------------+
|  Full Name                        |
|  [Rahul Sharma_______________]   |  <- focused field visible
|                                   |
|  Phone Number                     |
|  [+91 ______________________]    |  <- next field visible
|                                   |
+-----------------------------------+  <- keyboard pushes content up
|                                   |
| [  1  2  3  4  5  6  7  8  9  0 ]|  <- number pad for phone
| [  +  (  )  /  -               . ]|
| [ABC              Next           ]|  <- "Next" to advance
+-----------------------------------+
```

**Form field behavior by type:**

| Field Type       | Keyboard Type    | Return Key  | Autocomplete    |
|-----------------|-----------------|-------------|-----------------|
| Name             | default          | Next        | name            |
| Email            | email            | Next        | email           |
| Phone            | tel              | Next        | tel             |
| Address          | default          | Next        | street-address  |
| PIN code         | number           | Next        | postal-code     |
| Search           | default          | Search      | off             |
| Card number      | number           | Next        | cc-number       |
| Quantity         | number           | Done        | off             |
| Coupon code      | default          | Apply (custom) | off          |
| Password         | default          | Done/Next   | current-password|

### 11.3 Orientation Handling

| Page              | Portrait          | Landscape                        |
|-------------------|-------------------|----------------------------------|
| Storefront        | Primary layout    | Wider grid, 3 product columns    |
| Product Detail    | Primary layout    | Image left, info right (tablet-like) |
| Cart              | Primary layout    | Same, wider cards                |
| Checkout          | Primary layout    | Same, wider form fields          |
| Seller Dashboard  | Primary layout    | Stats in 4 cols, chart wider     |
| Warehouse Scanner | Primary layout    | Wider viewfinder, info beside    |

Landscape on mobile phones is supported but not optimized. A subtle
"Rotate for best experience" hint may appear on complex pages (dashboard charts).

---

## Appendix A: Breakpoint Quick Reference by Page

| Page              | >= 1280px        | 768-1023px       | <= 427px             |
|-------------------|------------------|------------------|----------------------|
| **Storefront**    | 12-col, sidebar hero, 5-col products | 8-col, full hero, 3-col products | 4-col, stacked, 2-col products |
| **Product Detail**| Side-by-side img+info | Side-by-side narrower | Stacked, carousel, sticky CTA |
| **Cart**          | 2-col: items+summary | 2-col narrower   | 1-col stacked, sticky checkout |
| **Checkout**      | 2-col: form+summary | 2-col narrower   | 1-col, collapsible summary |
| **Seller Dash**   | Sidebar+4 stats+chart | Rail+2x2 stats  | Hamburger+2x2 stats+stacked |
| **Seller Tables** | Sidebar+table    | Rail+table scroll | Hamburger+card view  |
| **Admin Dash**    | Sidebar+6 stats+charts | Rail+3x2 stats | Hamburger+2x3 stats+stacked |
| **Admin Tables**  | Sidebar+table    | Rail+table scroll | Hamburger+card view  |
| **Warehouse**     | Sidebar+6 stats+table | Rail+3x2 stats | Bottom nav+2x3 stats+cards |
| **Warehouse Scan**| Inline widget    | Inline widget    | Full-screen camera   |

## Appendix B: CSS Breakpoint Tokens (Tailwind)

```
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'mobile':    '375px',   // min-width: 375px
      'mobile-lg': '428px',   // min-width: 428px
      'tablet':    '768px',   // min-width: 768px
      'laptop':    '1024px',  // min-width: 1024px
      'desktop':   '1280px',  // min-width: 1280px
      'wide':      '1440px',  // min-width: 1440px
    },
  },
}
```

**Usage pattern (mobile-first):**
```
<!-- 2 cols mobile, 3 cols tablet, 5 cols desktop -->
<div class="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-5 gap-3 tablet:gap-4 desktop:gap-6">

<!-- Hidden on mobile, visible on tablet+ -->
<div class="hidden tablet:block">

<!-- Visible on mobile only -->
<div class="block tablet:hidden">

<!-- Sticky bottom bar, mobile only -->
<div class="fixed bottom-0 inset-x-0 tablet:hidden pb-[env(safe-area-inset-bottom)]">
```

## Appendix C: Component Visibility Matrix

| Component              | Desktop | Tablet | Mobile |
|------------------------|---------|--------|--------|
| Top utility bar        | Show    | Condensed | Hidden |
| Desktop nav bar        | Show    | Condensed | Hidden |
| Hamburger menu         | Hidden  | Hidden | Show   |
| Bottom nav (customer)  | Hidden  | Hidden | Show   |
| Bottom nav (warehouse) | Hidden  | Hidden | Show   |
| Sidebar (seller/admin) | Full    | Rail   | Hidden (hamburger) |
| Search (storefront)    | In header | In header | Below header |
| Side promos (hero)     | Show    | Below hero | Hidden |
| Sticky CTA bar         | Hidden  | Hidden | Show   |
| FAB (add product)      | Hidden  | Hidden | Show   |
| Filter bottom sheet    | Hidden  | Hidden | Show   |
| Pull-to-refresh        | Hidden  | Hidden | Show   |
| Breadcrumbs            | Full    | Condensed | "< Back" only |

## Appendix D: Performance Guidelines for Mobile

| Guideline                          | Target                               |
|------------------------------------|--------------------------------------|
| Initial page load (3G)             | < 3 seconds to first meaningful paint|
| Image lazy loading                 | Below-fold images load on scroll     |
| Product image format               | WebP with JPEG fallback              |
| Hero image (mobile)                | Max 80KB, 750px wide (2x for retina)|
| Product thumbnail (mobile)         | Max 30KB, 320px wide (2x for retina)|
| Category icon (mobile)             | Max 5KB, SVG preferred               |
| JavaScript bundle (mobile)         | < 150KB gzipped initial bundle       |
| Skeleton display time              | Show within 100ms of navigation      |
| Touch response delay               | < 100ms visual feedback              |
| Scroll performance                 | 60fps, no jank on product grids      |
| Offline support (warehouse)        | Cache pick lists and scan history    |
