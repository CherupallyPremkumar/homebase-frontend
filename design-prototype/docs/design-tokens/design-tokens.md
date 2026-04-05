# HomeBase Design Tokens Reference

> **Source of truth:** `@homebase/design-system` package
> (`packages/design-system/src/tokens/`)
>
> All apps consume tokens through the shared Tailwind preset.
> NEVER use arbitrary values -- every color, size, and spacing must come from this file.

---

## Table of Contents

1. [Color Palette](#1-color-palette)
2. [Typography Scale](#2-typography-scale)
3. [Spacing System](#3-spacing-system)
4. [Border Radius](#4-border-radius)
5. [Shadows](#5-shadows)
6. [Breakpoints](#6-breakpoints)
7. [Component Token Map](#7-component-token-map)
8. [Dark Mode Tokens (Future)](#8-dark-mode-tokens-future)

---

## 1. Color Palette

**File:** `tokens/colors.ts`

All HomeBase apps share the same brand palette. Apps are distinguished by name and icon
in the header, NOT by color.

### 1.1 Primary (Orange)

The brand color. Used for CTAs, active states, links, and accents.

| Token            | Hex       | Tailwind Class    | Usage                                       |
|------------------|-----------|-------------------|---------------------------------------------|
| `primary-50`     | `#FFF7ED` | `bg-primary-50`   | Tinted backgrounds, hover fills, badge bg    |
| `primary-100`    | `#FFEDD5` | `bg-primary-100`  | Light tinted backgrounds, selected row bg    |
| `primary-200`    | `#FED7AA` | `bg-primary-200`  | Borders on active elements                   |
| `primary-300`    | `#FDBA74` | `bg-primary-300`  | Decorative, progress bars (partial)          |
| `primary-400`    | `#FB923C` | `bg-primary-400`  | Focus rings on inputs                        |
| `primary-500`    | `#F97316` | `bg-primary-500`  | **Primary CTA buttons**, toggles, checkboxes |
| `primary-600`    | `#EA580C` | `bg-primary-600`  | **Hover state** for primary buttons, links   |
| `primary-700`    | `#C2410C` | `text-primary-700` | Badge text on light bg, active link text    |
| `primary-800`    | `#9A3412` | `text-primary-800` | Dark accent text (rare)                     |
| `primary-900`    | `#7C2D12` | `text-primary-900` | Very dark accent text (rare)                |
| `primary-950`    | `#431407` | `text-primary-950` | Reserved                                    |
| `primary-DEFAULT`| `#F97316` | `bg-primary`       | Alias for 500                               |

> **Alias:** `brand-*` maps to the same palette as `primary-*` in Tailwind.
> Use `brand-` when referring to the brand color conceptually (e.g., `bg-brand-50/50`
> for subtle row highlights).

#### Quick reference -- when to use which shade

```
CTAs / primary buttons   -> primary-500 (bg), primary-600 (hover)
Links                    -> primary-600 (text), primary-700 (hover)
Badges on light bg       -> primary-50 (bg), primary-700 (text)
Focus ring               -> primary-400
Active sidebar indicator -> brand-500 (border), brand-500/15 (bg)
Table row hover          -> brand-50/50  (50% opacity tint)
```

### 1.2 Navy

Dark background palette for sidebars, headers, and hero sections.

| Token          | Hex       | Tailwind Class  | Usage                                  |
|----------------|-----------|-----------------|----------------------------------------|
| `navy-700`     | `#1E3A5F` | `bg-navy-700`   | Lighter navy for hover/active on dark  |
| `navy-800`     | `#1A2E4A` | `bg-navy-800`   | Sidebar section dividers               |
| `navy-900`     | `#0F1B2D` | `bg-navy-900`   | **Sidebar background**, dark hero      |
| `navy-DEFAULT` | `#0F1B2D` | `bg-navy`       | Alias for 900                          |

### 1.3 App-Specific Dark Backgrounds

These are used ONLY for the background of specific app shells, not for general UI.

| Token              | Hex       | Tailwind Class    | Usage                            |
|--------------------|-----------|-------------------|----------------------------------|
| `admin-DEFAULT`    | `#0A1628` | `bg-admin`        | Platform Admin sidebar/shell     |
| `warehouse-DEFAULT`| `#0F2027` | `bg-warehouse`    | Warehouse Management sidebar/shell|

### 1.4 Semantic Colors

Feedback and status indicators. Always use semantic tokens -- never use raw hex for success/warning/error.

#### Success (Green)

| Token          | Hex       | Usage                                       |
|----------------|-----------|---------------------------------------------|
| `success-50`   | `#f0fdf4` | Success message background                  |
| `success-100`  | `#dcfce7` | Success banner background                   |
| `success-500`  | `#22c55e` | Success icon, active indicators             |
| `success-600`  | `#16a34a` | **Default** success text, badges, checkmarks |
| `success-700`  | `#15803d` | Success text on light bg for higher contrast |

#### Warning (Yellow)

| Token          | Hex       | Usage                                       |
|----------------|-----------|---------------------------------------------|
| `warning-50`   | `#fefce8` | Warning message background                  |
| `warning-100`  | `#fef9c3` | Warning banner background                   |
| `warning-500`  | `#eab308` | Warning icon, indicator dots                |
| `warning-600`  | `#ca8a04` | Warning text on light backgrounds           |

#### Error (Red)

| Token          | Hex       | Usage                                       |
|----------------|-----------|---------------------------------------------|
| `error-50`     | `#fef2f2` | Error message background, invalid field bg  |
| `error-100`    | `#fee2e2` | Error banner background                     |
| `error-500`    | `#ef4444` | Error icon, destructive button bg           |
| `error-600`    | `#dc2626` | **Default** error text, validation messages |
| `error-700`    | `#b91c1c` | Error text on light bg for higher contrast  |

### 1.5 Gray Scale

The workhorse palette. Backgrounds, text, borders, and dividers.

| Token      | Hex       | Tailwind Class  | Usage                                       |
|------------|-----------|-----------------|---------------------------------------------|
| `gray-50`  | `#f9fafb` | `bg-gray-50`    | Page background, table header bg, card hover |
| `gray-100` | `#f3f4f6` | `bg-gray-100`   | Alternate row bg, section bg, skeleton       |
| `gray-200` | `#e5e7eb` | `border-gray-200`| **Default borders**, card borders, dividers |
| `gray-300` | `#d1d5db` | `border-gray-300`| Input borders (default state)               |
| `gray-400` | `#9ca3af` | `text-gray-400` | Placeholder text, timestamps, captions       |
| `gray-500` | `#6b7280` | `text-gray-500` | Muted body text, secondary labels            |
| `gray-600` | `#4b5563` | `text-gray-600` | Subtle headings, table column headers        |
| `gray-700` | `#374151` | `text-gray-700` | **Default body text**                        |
| `gray-800` | `#1f2937` | `text-gray-800` | Strong body text, emphasized content         |
| `gray-900` | `#111827` | `text-gray-900` | **Page titles, section titles, card titles**  |
| `gray-950` | `#030712` | `text-gray-950` | Near-black (rare)                            |

### 1.6 Fixed Colors

| Token   | Hex       | Usage                                  |
|---------|-----------|----------------------------------------|
| `white` | `#ffffff` | Card backgrounds, button text on dark  |
| `black` | `#000000` | Reserved -- prefer gray-900/950        |

---

## 2. Typography Scale

**File:** `tokens/typography.ts`

### 2.1 Font Family

| Token  | Stack                                                        | Usage              |
|--------|--------------------------------------------------------------|--------------------|
| `sans` | `var(--font-inter)`, `system-ui`, `-apple-system`, `sans-serif` | All UI text     |
| `mono` | `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace`       | Code, IDs, SKUs    |

> **Inter** is the primary typeface. Load it via `next/font/google` and assign to
> `--font-inter` CSS custom property.

### 2.2 Size Scale

ONLY these 5 sizes are allowed. Never use arbitrary values like 13px or 17px.

| Token  | Size   | Line Height | Tailwind Class | Rem Equivalent |
|--------|--------|-------------|----------------|----------------|
| `xs`   | 12px   | 16px        | `text-xs`      | 0.75rem        |
| `sm`   | 14px   | 20px        | `text-sm`      | 0.875rem       |
| `base` | 16px   | 24px        | `text-base`    | 1rem           |
| `lg`   | 18px   | 28px        | `text-lg`      | 1.125rem       |
| `xl`   | 24px   | 32px        | `text-xl`      | 1.5rem         |

### 2.3 Weight Scale

| Token      | Value | Tailwind Class   | Usage                              |
|------------|-------|------------------|------------------------------------|
| `normal`   | 400   | `font-normal`    | Body text, descriptions            |
| `medium`   | 500   | `font-medium`    | Badges, labels, links              |
| `semibold` | 600   | `font-semibold`  | Section titles, card titles, prices |
| `bold`     | 700   | `font-bold`      | Page titles, hero prices           |

### 2.4 Semantic Text Styles

Pre-composed Tailwind class strings. Use these directly in components for consistency.

| Style Name       | Classes                                              | Spec              | Context                        |
|------------------|------------------------------------------------------|--------------------|--------------------------------|
| `page-title`     | `text-xl font-bold text-gray-900`                    | 24px / bold / #111827 | H1 -- one per page           |
| `section-title`  | `text-lg font-semibold text-gray-900`                | 18px / semibold / #111827 | H2 -- section headers    |
| `card-title`     | `text-sm font-semibold text-gray-900`                | 14px / semibold / #111827 | H3 -- inside cards       |
| `body`           | `text-sm text-gray-700`                              | 14px / normal / #374151 | Default text              |
| `body-muted`     | `text-sm text-gray-500`                              | 14px / normal / #6b7280 | Secondary/description text|
| `caption`        | `text-xs text-gray-400`                              | 12px / normal / #9ca3af | Timestamps, helper text   |
| `badge`          | `text-xs font-medium`                                | 12px / medium        | Badges, status labels         |
| `price`          | `text-lg font-bold text-gray-900`                    | 18px / bold / #111827 | Hero/detail page prices    |
| `price-small`    | `text-sm font-semibold text-gray-900`                | 14px / semibold / #111827 | Card and table prices  |
| `price-original` | `text-xs text-gray-400 line-through`                 | 12px / normal / #9ca3af | Struck-through original price |
| `price-discount` | `text-xs font-medium text-success-600`               | 12px / medium / #16a34a | Discount percentage text |
| `link`           | `text-sm font-medium text-primary-600 hover:text-primary-700` | 14px / medium / #EA580C | Clickable text links |

### 2.5 Typography Decision Tree

```
What are you styling?
|
|-- Page heading?            -> page-title    (24px bold gray-900)
|-- Section heading?         -> section-title (18px semibold gray-900)
|-- Card heading?            -> card-title    (14px semibold gray-900)
|-- Regular text?            -> body          (14px normal gray-700)
|-- Less important text?     -> body-muted    (14px normal gray-500)
|-- Timestamp / helper?      -> caption       (12px normal gray-400)
|-- Badge / label?           -> badge         (12px medium)
|-- Product price (large)?   -> price         (18px bold gray-900)
|-- Product price (compact)? -> price-small   (14px semibold gray-900)
|-- Crossed-out old price?   -> price-original(12px normal gray-400 line-through)
|-- Discount percentage?     -> price-discount(12px medium success-600)
|-- Clickable text?          -> link          (14px medium primary-600)
```

---

## 3. Spacing System

**File:** `tokens/spacing.ts`

### 3.1 Base Grid

All spacing snaps to an **8px base grid**. Sub-grid values (2px, 4px, 6px) are available
for fine-tuning within components.

| Token | Value | Rem     | Tailwind Class | Usage Example                    |
|-------|-------|---------|----------------|----------------------------------|
| `0`   | 0px   | 0       | `p-0`, `m-0`  | Reset                            |
| `0.5` | 2px   | 0.125   | `p-0.5`        | Badge vertical padding           |
| `1`   | 4px   | 0.25    | `p-1`, `gap-1` | Tight internal spacing          |
| `1.5` | 6px   | 0.375   | `p-1.5`        | Badge horizontal padding         |
| `2`   | 8px   | 0.5     | `p-2`, `gap-2` | Input vertical padding, small gaps |
| `3`   | 12px  | 0.75    | `p-3`, `gap-3` | **Card padding**, card grid gap  |
| `4`   | 16px  | 1       | `p-4`, `gap-4` | Mobile page padding, form gaps   |
| `5`   | 20px  | 1.25    | `p-5`, `gap-5` | Button horizontal padding (lg)   |
| `6`   | 24px  | 1.5     | `p-6`, `gap-6` | **Section gap**, desktop page padding |
| `8`   | 32px  | 2       | `p-8`, `gap-8` | Large section spacing            |
| `10`  | 40px  | 2.5     | `p-10`         | Hero section padding             |
| `12`  | 48px  | 3       | `p-12`         | Page-level vertical spacing      |
| `16`  | 64px  | 4       | `p-16`         | Extra-large spacing (rare)       |

### 3.2 Semantic Spacing

Named spacing values for common patterns. Use these as a reference when choosing Tailwind classes.

| Semantic Name          | Value | Tailwind Equivalent | Where Used                             |
|------------------------|-------|---------------------|----------------------------------------|
| `card-padding`         | 12px  | `p-3`              | Inside all card components             |
| `card-gap`             | 12px  | `gap-3`            | Between cards in a grid                |
| `section-gap`          | 24px  | `gap-6`, `mt-6`    | Between major page sections            |
| `page-padding-mobile`  | 16px  | `px-4`             | Page content horizontal padding (mobile) |
| `page-padding-desktop` | 24px  | `px-6`             | Page content horizontal padding (desktop) |
| `input-padding-x`      | 12px  | `px-3`             | Horizontal padding inside input fields |
| `input-padding-y`      | 8px   | `py-2`             | Vertical padding inside input fields   |

### 3.3 Spacing Rules by Context

```
Page layout:
  - Horizontal padding:    px-4 (mobile) / px-6 (desktop)
  - Section vertical gap:  gap-6 or mt-6  (24px)
  - Content max-width:     determined per app (typically max-w-7xl)

Card grid:
  - Grid gap:              gap-3         (12px)
  - Card internal padding: p-3           (12px)
  - Between card sections: gap-2         (8px)

Form layout:
  - Between fields:        gap-4         (16px)
  - Label to input:        gap-1.5       (6px)
  - Input padding:         px-3 py-2     (12px / 8px)

Table layout:
  - Cell padding:          px-3 py-2     (12px / 8px)
  - Between table and next section: mt-6 (24px)

Sidebar:
  - Item padding:          px-3 py-2     (12px / 8px)
  - Section gap:           mt-4          (16px)
```

---

## 4. Border Radius

**File:** `tokens/radius.ts`

Only 4 radius values exist. Never use arbitrary radius values.

| Token  | Value    | Tailwind Class   | Usage                                     |
|--------|----------|------------------|-------------------------------------------|
| `sm`   | 4px      | `rounded-sm`     | Small UI chips, minor decorative rounding |
| `md`   | 8px      | `rounded-md` / `rounded` | **Buttons, inputs, cards, dropdowns** |
| `lg`   | 12px     | `rounded-lg`     | Modals, larger cards, image containers    |
| `full` | 9999px   | `rounded-full`   | Avatars, dots, pill badges, circular icons |

> **Note:** In the Tailwind preset, `rounded` (no suffix) defaults to `md` (8px).

### 4.1 Radius Decision Tree

```
What are you rounding?
|
|-- Button?          -> rounded-md  (8px)
|-- Input field?     -> rounded-md  (8px)
|-- Card?            -> rounded-md  (8px)
|-- Dropdown menu?   -> rounded-md  (8px)
|-- Modal?           -> rounded-lg  (12px)
|-- Large card panel?-> rounded-lg  (12px)
|-- Avatar?          -> rounded-full(9999px)
|-- Pill badge?      -> rounded-full(9999px)
|-- Status dot?      -> rounded-full(9999px)
|-- Toggle thumb?    -> rounded-full(9999px)
|-- Small chip?      -> rounded-sm  (4px)
```

---

## 5. Shadows

**File:** `tokens/shadows.ts`

Minimal shadow usage. Prefer borders over shadows for most elements.

| Token  | CSS Value                                                              | Tailwind Class | Usage                              |
|--------|------------------------------------------------------------------------|----------------|------------------------------------|
| `none` | `none`                                                                 | `shadow-none`  | Default state (use border instead) |
| `sm`   | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                                       | `shadow-sm` / `shadow` | Cards at rest, subtle lift  |
| `md`   | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`   | `shadow-md`    | Hover state elevation, dropdowns   |
| `lg`   | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | `shadow-lg`    | Modals, popovers, floating panels  |

> **Note:** `shadow` (no suffix) defaults to `sm` in the Tailwind preset.

### 5.1 Shadow Strategy

```
Static card, panel        -> border-gray-200 only (no shadow)
                             OR shadow-sm for slight lift
Card on hover             -> shadow-md (transition-shadow)
Dropdown / popover        -> shadow-md
Modal / dialog            -> shadow-lg
Toast notification        -> shadow-lg
Sticky header (scrolled)  -> shadow-sm
```

### 5.2 Shadow Transitions

Always animate shadow changes for smooth interaction:

```css
/* Tailwind: transition-shadow duration-200 */
.card-interactive {
  @apply shadow-sm hover:shadow-md transition-shadow duration-200;
}
```

---

## 6. Breakpoints

**File:** `tokens/breakpoints.ts`

Mobile-first breakpoints. All styles are mobile-default; use breakpoint prefixes to
override at larger widths.

| Token | Min Width | Tailwind Prefix | Target Devices                     |
|-------|-----------|-----------------|-------------------------------------|
| `sm`  | 640px     | `sm:`           | Large phones (landscape)            |
| `md`  | 768px     | `md:`           | Tablets (portrait)                  |
| `lg`  | 1024px    | `lg:`           | Tablets (landscape), small laptops  |
| `xl`  | 1280px    | `xl:`           | Desktops                            |
| `2xl` | 1536px    | `2xl:`          | Large desktops, ultra-wide          |

### 6.1 What Changes at Each Breakpoint

```
< 640px (default / mobile):
  - Single column layouts
  - Sidebar hidden (hamburger menu)
  - page padding: px-4 (16px)
  - Cards stack vertically
  - Bottom navigation visible

>= 640px (sm):
  - 2-column grids possible
  - Slightly wider cards

>= 768px (md):
  - Sidebar appears (collapsed or full)
  - 2-3 column card grids
  - Tables switch from card view to table view
  - page padding: px-6 (24px)

>= 1024px (lg):
  - Full sidebar visible (240px)
  - 3-4 column card grids
  - Dashboard widgets side-by-side
  - Header actions fully visible

>= 1280px (xl):
  - Max-width containers center content
  - 4+ column grids
  - Side panels (detail drawers) can coexist with main content

>= 1536px (2xl):
  - Extra breathing room
  - Optional: widen content max-width
  - Comfortable data-dense table views
```

### 6.2 Key Layout Patterns

```
Sidebar:        hidden (mobile) -> collapsed 64px (md) -> expanded 240px (lg)
Card grid:      1 col (mobile)  -> 2 col (sm)         -> 3 col (lg)  -> 4 col (xl)
Page padding:   px-4 (mobile)   -> px-6 (md)
Table:          card list (mobile) -> full table (md)
```

---

## 7. Component Token Map

**File:** `tokens/components.ts`

Every component maps to specific tokens. This is the single reference for component sizing.

### 7.1 Button

| Property       | Small (sm)  | Medium (md)   | Large (lg)  |
|----------------|-------------|---------------|-------------|
| Height         | 36px        | 40px          | 48px        |
| Padding X      | 12px        | 16px          | 24px        |
| Font Size      | 13px        | 14px          | 16px        |
| Border Radius  | 8px         | 8px           | 8px         |

**Token map (Primary Button):**

| State    | Property    | Token / Value                 | Tailwind                           |
|----------|-------------|-------------------------------|------------------------------------|
| Default  | Background  | primary-500 `#F97316`         | `bg-primary-500`                   |
| Default  | Text        | white `#ffffff`               | `text-white`                       |
| Default  | Radius      | md `8px`                      | `rounded-md`                       |
| Default  | Padding     | 10px / 16px (md)              | `py-2.5 px-4`                      |
| Hover    | Background  | primary-600 `#EA580C`         | `hover:bg-primary-600`             |
| Focus    | Ring        | primary-400 `#FB923C`         | `focus:ring-2 focus:ring-primary-400` |
| Disabled | Background  | gray-200 `#e5e7eb`            | `disabled:bg-gray-200`             |
| Disabled | Text        | gray-400 `#9ca3af`            | `disabled:text-gray-400`           |

**Token map (Secondary/Outline Button):**

| State    | Property    | Token / Value                 | Tailwind                           |
|----------|-------------|-------------------------------|------------------------------------|
| Default  | Background  | white `#ffffff`               | `bg-white`                         |
| Default  | Border      | gray-200 `#e5e7eb`            | `border border-gray-200`           |
| Default  | Text        | gray-700 `#374151`            | `text-gray-700`                    |
| Hover    | Background  | gray-50 `#f9fafb`             | `hover:bg-gray-50`                 |

**Token map (Destructive Button):**

| State    | Property    | Token / Value                 | Tailwind                           |
|----------|-------------|-------------------------------|------------------------------------|
| Default  | Background  | error-600 `#dc2626`           | `bg-error-600`                     |
| Hover    | Background  | error-700 `#b91c1c`           | `hover:bg-error-700`               |

### 7.2 Card

**File reference:** `components.card`

| Property       | Token / Value                | Tailwind                      |
|----------------|------------------------------|-------------------------------|
| Background     | white `#ffffff`              | `bg-white`                    |
| Border         | gray-200 `#e5e7eb`           | `border border-gray-200`      |
| Border Radius  | md `8px`                     | `rounded-md`                  |
| Padding        | 12px                         | `p-3`                         |
| Shadow         | none (default) / sm (opt.)   | `shadow-none` / `shadow-sm`   |
| Hover bg       | gray-50 `#f9fafb`            | `hover:bg-gray-50`            |
| Hover shadow   | md (interactive cards)       | `hover:shadow-md`             |

### 7.3 Badge

**File reference:** `components.badge`

| Property       | Token / Value                | Tailwind                      |
|----------------|------------------------------|-------------------------------|
| Padding X      | 8px                          | `px-2`                        |
| Padding Y      | 2px                          | `py-0.5`                      |
| Font Size      | 12px                         | `text-xs`                     |
| Font Weight    | medium (500)                 | `font-medium`                 |
| Border Radius  | full `9999px`                | `rounded-full`                |
| Dot Size       | 6px                          | `w-1.5 h-1.5`                |

**Badge color variants:**

| Variant   | Background       | Text              | Tailwind                                  |
|-----------|------------------|-------------------|--------------------------------------------|
| Default   | primary-50       | primary-700       | `bg-primary-50 text-primary-700`           |
| Success   | success-50       | success-700       | `bg-success-50 text-success-700`           |
| Warning   | warning-50       | warning-600       | `bg-warning-50 text-warning-600`           |
| Error     | error-50         | error-700         | `bg-error-50 text-error-700`               |
| Neutral   | gray-100         | gray-700          | `bg-gray-100 text-gray-700`               |

### 7.4 Input

**File reference:** `components.input`

| Property           | Token / Value                | Tailwind                           |
|--------------------|------------------------------|------------------------------------|
| Height             | 40px                         | `h-10`                             |
| Padding X          | 12px                         | `px-3`                             |
| Font Size          | 14px                         | `text-sm`                          |
| Border Radius      | md `8px`                     | `rounded-md`                       |
| Border (default)   | gray-300 `#d1d5db`           | `border border-gray-300`           |
| Border (focus)     | primary-400 `#FB923C`        | `focus:border-primary-400`         |
| Focus Ring         | primary-400                  | `focus:ring-2 focus:ring-primary-400` |
| Background         | white                        | `bg-white`                         |
| Placeholder        | gray-400 `#9ca3af`           | `placeholder:text-gray-400`        |
| Error Border       | error-500 `#ef4444`          | `border-error-500`                 |
| Error Text         | error-600 `#dc2626`          | `text-error-600`                   |
| Disabled bg        | gray-50 `#f9fafb`            | `disabled:bg-gray-50`              |

### 7.5 Table

**File reference:** `components.table`

| Property           | Token / Value                | Tailwind                           |
|--------------------|------------------------------|------------------------------------|
| Header Height      | 40px                         | `h-10`                             |
| Row Height         | 44px                         | `h-11`                             |
| Header bg          | gray-50 `#f9fafb`            | `bg-gray-50`                       |
| Cell Padding X     | 12px                         | `px-3`                             |
| Cell Padding Y     | 8px                          | `py-2`                             |
| Row Hover bg       | brand-50/50 (50% opacity)    | `hover:bg-brand-50/50`             |
| Border             | gray-200 `#e5e7eb`           | `border-b border-gray-200`         |
| Header text        | gray-600 `#4b5563`           | `text-gray-600 text-xs font-medium uppercase` |

### 7.6 Sidebar

**File reference:** `components.sidebar`

| Property              | Token / Value                | Tailwind / CSS                     |
|-----------------------|------------------------------|------------------------------------|
| Width (expanded)      | 240px                        | `w-60`                             |
| Width (collapsed)     | 64px                         | `w-16`                             |
| Background            | navy-900 `#0F1B2D`           | `bg-navy-900`                      |
| Item Height           | 40px                         | `h-10`                             |
| Item text (default)   | white/70 (70% opacity)       | `text-white/70`                    |
| Item text (hover)     | white                        | `hover:text-white`                 |
| Item text (active)    | white                        | `text-white`                       |
| Active bg             | brand-500/15 (15% opacity)   | `bg-brand-500/15`                  |
| Active left border    | brand-500 `#F97316`          | `border-l-2 border-brand-500`      |
| Active indicator width| 2px                          | (left border width)                |
| Section divider       | white/10                     | `border-white/10`                  |

### 7.7 Header

**File reference:** `components.header`

| Property           | Token / Value                | Tailwind                           |
|--------------------|------------------------------|------------------------------------|
| Height (admin)     | 56px                         | `h-14`                             |
| Height (storefront)| 64px                         | `h-16`                             |
| Background (admin) | navy-900 `#0F1B2D`           | `bg-navy-900`                      |
| Background (store) | white                        | `bg-white`                         |
| Border (store)     | gray-200                     | `border-b border-gray-200`         |
| Text (admin)       | white                        | `text-white`                       |
| Text (store)       | gray-900                     | `text-gray-900`                    |

### 7.8 Avatar

**File reference:** `components.avatar`

| Property       | Small (sm)  | Medium (md)   | Large (lg)  |
|----------------|-------------|---------------|-------------|
| Size           | 32px        | 40px          | 48px        |
| Tailwind       | `w-8 h-8`  | `w-10 h-10`  | `w-12 h-12` |
| Border Radius  | full        | full          | full         |
| Fallback bg    | primary-100 | primary-100   | primary-100  |
| Fallback text  | primary-700 | primary-700   | primary-700  |

### 7.9 Modal / Dialog

| Property           | Token / Value                | Tailwind                           |
|--------------------|------------------------------|------------------------------------|
| Background         | white                        | `bg-white`                         |
| Border Radius      | lg `12px`                    | `rounded-lg`                       |
| Shadow             | lg                           | `shadow-lg`                        |
| Padding            | 24px                         | `p-6`                              |
| Overlay bg         | black/50 (50% opacity)       | `bg-black/50`                      |
| Max Width           | varies (sm/md/lg)           | `max-w-md` / `max-w-lg`           |

### 7.10 Toast / Notification

| Property           | Token / Value                | Tailwind                           |
|--------------------|------------------------------|------------------------------------|
| Background         | white                        | `bg-white`                         |
| Border Radius      | md `8px`                     | `rounded-md`                       |
| Shadow             | lg                           | `shadow-lg`                        |
| Padding            | 16px                         | `p-4`                              |
| Border-left (info) | primary-500 `#F97316`        | `border-l-4 border-primary-500`    |
| Border-left (ok)   | success-500 `#22c55e`        | `border-l-4 border-success-500`    |
| Border-left (warn) | warning-500 `#eab308`        | `border-l-4 border-warning-500`    |
| Border-left (err)  | error-500 `#ef4444`          | `border-l-4 border-error-500`      |

### 7.11 Dropdown / Select Menu

| Property           | Token / Value                | Tailwind                           |
|--------------------|------------------------------|------------------------------------|
| Background         | white                        | `bg-white`                         |
| Border             | gray-200                     | `border border-gray-200`           |
| Border Radius      | md `8px`                     | `rounded-md`                       |
| Shadow             | md                           | `shadow-md`                        |
| Item Padding       | 8px / 12px                   | `py-2 px-3`                        |
| Item Hover bg      | gray-50                      | `hover:bg-gray-50`                 |
| Item Active bg     | primary-50                   | `bg-primary-50`                    |
| Item Active text   | primary-700                  | `text-primary-700`                 |

---

## 8. Dark Mode Tokens (Future)

> **Status:** Not implemented. This section documents the planned token mapping for
> when dark mode is introduced.

### 8.1 Tokens That Would Change

| Light Mode Token     | Light Value     | Dark Mode Value (Planned) | Notes                          |
|----------------------|-----------------|---------------------------|--------------------------------|
| **Backgrounds**      |                 |                           |                                |
| Page bg              | white `#ffffff` | gray-950 `#030712`        | Near-black page background     |
| Card bg              | white `#ffffff` | gray-900 `#111827`        | Dark surface                   |
| Section bg           | gray-50         | gray-800 `#1f2937`        | Subtle surface variation       |
| Table header bg      | gray-50         | gray-800                  |                                |
| Input bg             | white           | gray-800                  |                                |
| Hover bg             | gray-50         | gray-700                  |                                |
| **Text**             |                 |                           |                                |
| Primary text         | gray-900        | gray-50 `#f9fafb`         | Near-white                     |
| Body text            | gray-700        | gray-300 `#d1d5db`        |                                |
| Muted text           | gray-500        | gray-400 `#9ca3af`        | Stays roughly the same         |
| Caption text         | gray-400        | gray-500 `#6b7280`        |                                |
| **Borders**          |                 |                           |                                |
| Default border       | gray-200        | gray-700 `#374151`        |                                |
| Input border         | gray-300        | gray-600 `#4b5563`        |                                |
| **Brand colors**     |                 |                           |                                |
| primary-500          | `#F97316`       | `#FB923C` (400)           | Slightly lighter for contrast  |
| primary-600 (hover)  | `#EA580C`       | `#F97316` (500)           | Shift up one shade             |
| **Semantic colors**  |                 |                           |                                |
| success-600          | `#16a34a`       | `#22c55e` (500)           | Lighter green on dark          |
| error-600            | `#dc2626`       | `#ef4444` (500)           | Lighter red on dark            |
| warning-600          | `#ca8a04`       | `#eab308` (500)           | Lighter yellow on dark         |
| **Shadows**          |                 |                           |                                |
| sm shadow            | 5% black        | 30% black                 | Stronger shadows on dark bg    |
| md shadow            | 10% black       | 40% black                 |                                |
| lg shadow            | 10% black       | 50% black                 |                                |

### 8.2 Tokens That Would NOT Change

These remain identical in both modes:

- **Navy palette** (navy-700/800/900) -- already dark
- **Admin/Warehouse backgrounds** -- already dark
- **Sidebar** -- already uses dark bg with light text
- **White text on dark backgrounds** -- remains white
- **Border radius values** -- geometry does not change
- **Spacing values** -- layout does not change
- **Typography sizes/weights** -- text metrics do not change
- **Breakpoints** -- responsive behavior does not change

### 8.3 Implementation Strategy (When Ready)

```
1. Use CSS custom properties for all swappable tokens
2. Toggle via `class="dark"` on <html> (Tailwind dark mode = 'class')
3. Define dark overrides in tailwind-preset:
     darkMode: 'class',
     theme: { extend: { ... } }
4. Use Tailwind `dark:` prefix in components:
     bg-white dark:bg-gray-900
     text-gray-900 dark:text-gray-50
     border-gray-200 dark:border-gray-700
5. Store preference in localStorage, respect prefers-color-scheme
```

---

## Quick Reference Card

### The 5 Colors You Use 90% of the Time

| Purpose                | Token          | Hex       | Tailwind             |
|------------------------|----------------|-----------|----------------------|
| CTA button background  | primary-500    | `#F97316` | `bg-primary-500`     |
| CTA button hover       | primary-600    | `#EA580C` | `hover:bg-primary-600`|
| Page/card title text   | gray-900       | `#111827` | `text-gray-900`      |
| Body text              | gray-700       | `#374151` | `text-gray-700`      |
| Default border         | gray-200       | `#e5e7eb` | `border-gray-200`    |

### The 3 Spacing Values You Use 80% of the Time

| Purpose         | Value | Tailwind |
|-----------------|-------|----------|
| Card padding    | 12px  | `p-3`   |
| Section gap     | 24px  | `gap-6` |
| Page padding    | 16-24px | `px-4` / `md:px-6` |

### The 2 Radius Values You Use 95% of the Time

| Purpose                | Value  | Tailwind        |
|------------------------|--------|-----------------|
| Buttons, cards, inputs | 8px    | `rounded-md`    |
| Avatars, badges        | 9999px | `rounded-full`  |

---

*Generated from `@homebase/design-system` source files.
Tokens are defined in `packages/design-system/src/tokens/` and consumed
via `homebasePreset` in each app's `tailwind.config.ts`.*
