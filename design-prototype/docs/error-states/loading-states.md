# Loading States - Skeleton Definitions

> Every page in HomeBase renders a skeleton placeholder while data is being fetched.
> Skeletons use a **pulse** animation (opacity cycling 0.4 - 1.0 over 1.5s ease-in-out, infinite).
> If loading exceeds **8 seconds**, the skeleton is replaced with a timeout error (see `error-states.md`).

---

## Global Rules

| Rule | Value |
|---|---|
| Animation type | Pulse (opacity fade) |
| Animation duration | 1.5s ease-in-out, infinite loop |
| Skeleton color (light mode) | `#E5E7EB` (gray-200) |
| Skeleton color (dark mode) | `#374151` (gray-700) |
| Border radius on skeleton blocks | `rounded-md` (6px) |
| Timeout threshold | 8 seconds |
| Behavior after timeout | Show timeout error with retry button |
| Minimum display time | 300ms (prevents flash of skeleton) |

---

## 1. Dashboard Skeleton

Displayed on: **Buyer Dashboard**, **Seller Dashboard**, **Admin Dashboard**

```
+-------------------------------------------------------+
| [====  NAV BAR (loaded from cache, not skeleton)  ====] |
+-------------------------------------------------------+
|                                                       |
|  [ Stat Card ]  [ Stat Card ]  [ Stat Card ]  [ Stat ] |
|  |  -------- |  |  -------- |  |  -------- |  | ---- | |
|  |  ======== |  |  ======== |  |  ======== |  | ==== | |
|  +-----------+  +-----------+  +-----------+  +------+ |
|                                                       |
|  +---------------------------+  +-------------------+ |
|  |  Chart Area               |  |  Activity Feed    | |
|  |                           |  |  ---- --------    | |
|  |   [  skeleton block  ]    |  |  ---- --------    | |
|  |   [  200px height    ]    |  |  ---- --------    | |
|  |                           |  |  ---- --------    | |
|  +---------------------------+  +-------------------+ |
|                                                       |
|  +-----------------------------------------------+   |
|  |  Recent Orders Table                           |   |
|  |  ---- | -------- | ------ | ------  | ------  |   |
|  |  ---- | -------- | ------ | ------  | ------  |   |
|  |  ---- | -------- | ------ | ------  | ------  |   |
|  |  ---- | -------- | ------ | ------  | ------  |   |
|  +-----------------------------------------------+   |
+-------------------------------------------------------+
```

### Components

| Component | Skeleton Shape | Size |
|---|---|---|
| Stat card title | Rounded rectangle | `w-24 h-4` |
| Stat card value | Rounded rectangle | `w-16 h-8` |
| Stat card trend indicator | Circle + short rectangle | `w-4 h-4` circle + `w-12 h-3` |
| Chart area | Large rounded rectangle | `w-full h-[200px]` |
| Activity feed row | Circle + two rectangles | `w-8 h-8` circle + `w-3/4 h-4` + `w-1/2 h-3` |
| Activity feed rows shown | 5 rows | Spaced `gap-3` |
| Table header | 5 rectangles in a row | `w-full h-4` per column |
| Table row | 5 rectangles in a row | `w-full h-4` per column |
| Table rows shown | 5 rows | Spaced `gap-2` |

---

## 2. List / Table Skeleton

Displayed on: **Order List**, **Product List**, **User Management**, **Inventory**, **Returns**, **Reviews**

```
+-------------------------------------------------------+
| [Search bar skeleton: ========================= ] [btn]|
| [Filter chips: [----] [------] [----]           ]      |
+-------------------------------------------------------+
|  # | Column A   | Column B     | Column C  | Actions  |
|  - | ---------- | ------------ | --------- | -------  |
|  - | ---------- | ------------ | --------- | -------  |
|  - | ---------- | ------------ | --------- | -------  |
|  - | ---------- | ------------ | --------- | -------  |
|  - | ---------- | ------------ | --------- | -------  |
|  - | ---------- | ------------ | --------- | -------  |
|  - | ---------- | ------------ | --------- | -------  |
|  - | ---------- | ------------ | --------- | -------  |
|  - | ---------- | ------------ | --------- | -------  |
|  - | ---------- | ------------ | --------- | -------  |
+-------------------------------------------------------+
| [Pagination skeleton: <  1  2  3  ... 10  >     ]     |
+-------------------------------------------------------+
```

### Components

| Component | Skeleton Shape | Size |
|---|---|---|
| Search bar | Rounded rectangle | `w-full h-10` |
| Filter chip | Small rounded rectangle | `w-16 h-8` each, 3-4 shown |
| Table header cell | Rectangle | Varies by column, `h-4` |
| Table body cell | Rectangle | Varies by column, `h-4` |
| Table rows shown | 10 rows | Spaced `gap-2` |
| Pagination | Row of small circles/rects | `w-8 h-8` per element |
| Checkbox column (if present) | Small square | `w-4 h-4` |

---

## 3. Detail Page Skeleton

Displayed on: **Order Detail**, **Product Detail**, **User Profile**, **Return Detail**

```
+-------------------------------------------------------+
| [Back link skeleton: <-- --------]                     |
|                                                       |
| +------------------+  +-----------------------------+ |
| |                  |  |  Title: ==================  | |
| |   Image Block    |  |  Subtitle: ============    | |
| |   [skeleton]     |  |                             | |
| |   250x250        |  |  Field: ---- ============  | |
| |                  |  |  Field: ---- ============  | |
| +------------------+  |  Field: ---- ============  | |
|                       |  Field: ---- ============  | |
|                       +-----------------------------+ |
|                                                       |
| +-----------------------------------------------+   |
| |  Tab bar: [------] [--------] [------]         |   |
| +-----------------------------------------------+   |
| |  Content area skeleton                          |   |
| |  ============================================  |   |
| |  ============================================  |   |
| |  ==============================                |   |
| +-----------------------------------------------+   |
|                                                       |
| +-----------------------------------------------+   |
| |  Related items: [Card] [Card] [Card]            |   |
| +-----------------------------------------------+   |
+-------------------------------------------------------+
```

### Components

| Component | Skeleton Shape | Size |
|---|---|---|
| Back link | Arrow icon + rectangle | `w-4 h-4` + `w-20 h-4` |
| Main image | Large square/rectangle | `w-[250px] h-[250px]` |
| Image thumbnails (if present) | Row of small squares | `w-16 h-16` each, 4 shown |
| Title | Wide rectangle | `w-3/4 h-7` |
| Subtitle | Medium rectangle | `w-1/2 h-5` |
| Field label | Short rectangle | `w-20 h-4` |
| Field value | Medium rectangle | `w-48 h-4` |
| Fields shown | 4-6 fields | Spaced `gap-3` |
| Tab bar | Row of rectangles | `w-20 h-8` each, 3 tabs |
| Content paragraph lines | Full-width rectangles | `w-full h-4`, 3 lines, last line `w-3/4` |
| Related item card | Rectangle with inner blocks | `w-48 h-64` each, 3-4 shown |

---

## 4. Form Skeleton

Displayed on: **Add/Edit Product**, **Profile Edit**, **Create Return**, **Checkout**

```
+-------------------------------------------------------+
| [Page title skeleton: ====================]            |
|                                                       |
| +-----------------------------------------------+   |
| |  Section heading: ==============               |   |
| |                                                 |   |
| |  Label: --------                                |   |
| |  Input: [================================]     |   |
| |                                                 |   |
| |  Label: --------                                |   |
| |  Input: [================================]     |   |
| |                                                 |   |
| |  Label: --------          Label: --------       |   |
| |  Input: [==============]  Input: [==========]  |   |
| |                                                 |   |
| |  Label: --------                                |   |
| |  Textarea: [============================]      |   |
| |            [============================]      |   |
| |            [============================]      |   |
| |                                                 |   |
| |  Label: --------                                |   |
| |  Select: [==========================  v ]      |   |
| +-----------------------------------------------+   |
|                                                       |
|  [Cancel btn skeleton]    [Submit btn skeleton]       |
+-------------------------------------------------------+
```

### Components

| Component | Skeleton Shape | Size |
|---|---|---|
| Page title | Wide rectangle | `w-48 h-8` |
| Section heading | Medium rectangle | `w-36 h-6` |
| Field label | Short rectangle | `w-24 h-4` |
| Text input | Full-width rounded rectangle | `w-full h-10` |
| Textarea | Full-width tall rectangle | `w-full h-24` |
| Select dropdown | Full-width rectangle with chevron | `w-full h-10` |
| File upload zone | Dashed border rectangle | `w-full h-32` |
| Two-column row inputs | Half-width rectangles | `w-1/2 h-10` each |
| Cancel button | Small rectangle | `w-24 h-10` |
| Submit button | Small rectangle | `w-32 h-10` |

---

## 5. Chat / Messaging Skeleton

Displayed on: **Buyer-Seller Chat**, **Support Chat**

```
+-------------------------------------------------------+
| +------------------+  +-----------------------------+ |
| | Conversation     |  | Chat Window                  | |
| | List             |  |                              | |
| | [O] ---- ------- |  |  [O] ---- -------- ------   | |
| | [O] ---- ------- |  |       ==================     | |
| | [O] ---- ------- |  |       ============           | |
| | [O] ---- ------- |  |                              | |
| | [O] ---- ------- |  |          ---- -------- [O]   | |
| | [O] ---- ------- |  |    ==================        | |
| |                  |  |                              | |
| |                  |  |  [O] ---- -------- ------   | |
| |                  |  |       ==================     | |
| |                  |  |                              | |
| +------------------+  +-----------------------------+ |
|                       | [Message input skeleton    ] | |
|                       +-----------------------------+ |
+-------------------------------------------------------+
```

### Components

| Component | Skeleton Shape | Size |
|---|---|---|
| Conversation list avatar | Circle | `w-10 h-10` |
| Conversation list name | Short rectangle | `w-24 h-4` |
| Conversation list preview | Medium rectangle | `w-36 h-3` |
| Conversation list timestamp | Tiny rectangle | `w-10 h-3` |
| Conversations shown | 6-8 rows | Spaced `gap-2` |
| Chat message avatar | Circle | `w-8 h-8` |
| Chat message name | Short rectangle | `w-20 h-3` |
| Chat message bubble | Rounded rectangle | `w-2/3 h-12` (varies) |
| Chat messages shown | 4-5 messages | Alternating left/right |
| Message input | Full-width rectangle | `w-full h-12` |

---

## 6. Card Grid Skeleton

Displayed on: **Product Catalog (Buyer)**, **Wishlist**, **Marketplace Browse**

```
+-------------------------------------------------------+
| [Search bar: ============================== ] [Filter] |
| [Sort: ------v]  [Category chips: [--] [----] [---]]  |
+-------------------------------------------------------+
| +----------+  +----------+  +----------+  +----------+ |
| |          |  |          |  |          |  |          | |
| | [Image]  |  | [Image]  |  | [Image]  |  | [Image]  | |
| | 180x180  |  | 180x180  |  | 180x180  |  | 180x180  | |
| |          |  |          |  |          |  |          | |
| | -------- |  | -------- |  | -------- |  | -------- | |
| | ======   |  | ======   |  | ======   |  | ======   | |
| | ----     |  | ----     |  | ----     |  | ----     | |
| +----------+  +----------+  +----------+  +----------+ |
|                                                       |
| +----------+  +----------+  +----------+  +----------+ |
| |          |  |          |  |          |  |          | |
| | [Image]  |  | [Image]  |  | [Image]  |  | [Image]  | |
| | 180x180  |  | 180x180  |  | 180x180  |  | 180x180  | |
| |          |  |          |  |          |  |          | |
| | -------- |  | -------- |  | -------- |  | -------- | |
| | ======   |  | ======   |  | ======   |  | ======   | |
| | ----     |  | ----     |  | ----     |  | ----     | |
| +----------+  +----------+  +----------+  +----------+ |
+-------------------------------------------------------+
```

### Components

| Component | Skeleton Shape | Size |
|---|---|---|
| Search bar | Rounded rectangle | `w-full h-10` |
| Filter button | Small rectangle | `w-20 h-10` |
| Sort dropdown | Small rectangle | `w-28 h-8` |
| Category chip | Small rounded rectangle | `w-16 h-7` each, 4-5 shown |
| Card image | Square/rectangle | `w-full h-[180px]` |
| Card title | Medium rectangle | `w-3/4 h-4` |
| Card price | Short rectangle | `w-16 h-5` |
| Card rating | Short rectangle | `w-20 h-3` |
| Cards per row | 4 cards | `grid-cols-4`, responsive to 2 on mobile |
| Rows shown | 2 rows (8 cards total) | Spaced `gap-4` |

---

## 7. Checkout Skeleton

Displayed on: **Checkout flow**

```
+-------------------------------------------------------+
| [Step indicator: (1)-----(2)-----(3)-----(4)  ]        |
+-------------------------------------------------------+
| +-----------------------------+  +-----------------+  |
| | Address Section             |  | Order Summary   |  |
| | ---- ==================    |  | ---- --------   |  |
| | ---- ==================    |  | ---- --------   |  |
| | ---- ==================    |  | ---- --------   |  |
| |                             |  |                 |  |
| | Payment Section             |  | -------------- |  |
| | ---- ==================    |  | Total: ======  |  |
| | ---- ==================    |  |                 |  |
| |                             |  | [Place Order]  |  |
| +-----------------------------+  +-----------------+  |
+-------------------------------------------------------+
```

### Components

| Component | Skeleton Shape | Size |
|---|---|---|
| Step indicator circles | 4 circles connected by lines | `w-8 h-8` circles, `w-full` line |
| Address field label | Short rectangle | `w-24 h-4` |
| Address field input | Full rectangle | `w-full h-10` |
| Order summary item row | Two rectangles (name + price) | `w-3/4 h-4` + `w-16 h-4` |
| Summary rows shown | 3-4 rows | Spaced `gap-2` |
| Total line | Divider + bold rectangle | `w-full border-t` + `w-24 h-5` |
| Place order button | Full-width rectangle | `w-full h-12` |

---

## Implementation Notes

### Staggered Animation
Skeleton rows should have a slight animation delay offset to create a wave effect:
- Row 1: `animation-delay: 0ms`
- Row 2: `animation-delay: 75ms`
- Row 3: `animation-delay: 150ms`
- (and so on, +75ms per row)

### Responsive Behavior
- Card grids: 4 columns desktop, 2 columns tablet, 1 column mobile
- Chat layout: Side-by-side desktop, stacked mobile (conversation list becomes a separate view)
- Tables: Horizontal scroll on mobile, skeleton adjusts column count

### Transition to Content
- When data loads, skeleton fades out (`opacity 1 -> 0`, 200ms) while content fades in (`opacity 0 -> 1`, 200ms)
- No layout shift: skeleton dimensions must match actual content dimensions

### Accessibility
- All skeleton containers carry `aria-busy="true"` and `aria-label="Loading content"`
- Screen readers announce "Loading" when skeleton appears and "Content loaded" when it resolves
- `role="status"` on the skeleton wrapper for live region updates
