# CLAUDE.md — Frontend Engineering Standards

This file provides mandatory guidance for ALL frontend code in this repository.
Follow these standards on EVERY task — no exceptions.

## Architecture

- **Feature-based structure** — `features/{domain}/` with components, hooks, api, types, adapters
- **Composition over inheritance** — split large components into small, focused children
- **Each component: one job** — if > 150 lines, split it
- **Blast radius containment** — each section handles its own errors independently

## Design Patterns (Mandatory)

1. **Composition Pattern** — Pages are thin orchestrators. Child components fetch their own data.
2. **Adapter Pattern** — API responses are transformed in adapter files, never consumed raw in UI.
3. **Strategy Pattern** — Formatters (currency, date, number) are pluggable strategies, not hardcoded.
4. **Registry Pattern** — Icon maps, badge configs use typed registries with fallbacks.
5. **Observer/Context Pattern** — Shared state (date filters, auth) via Context, not prop drilling.
6. **Builder/Config Pattern** — Repetitive UI (stat cards, table columns) driven by config arrays.
7. **Error Boundary Pattern** — Per-section error isolation. Never show a blank page.
8. **Slot-based Layout** — Layouts accept named slots (header, content, sidebar, footer).

## Every Component Must Handle 4 States

```tsx
if (isLoading) return <Skeleton />;        // Loading
if (isError) return <ErrorBanner retry />; // Error with retry
if (isEmpty) return <EmptyState action />; // Empty with CTA
return <SuccessUI />;                      // Success
```

## TypeScript

- **Strict mode** — no `any`, no `as` casts unless absolutely necessary
- **Interface for props** — with JSDoc comments
- **Exported types** — from feature's `types/` folder
- **Zod for validation** — all form inputs, API responses at boundaries

## Accessibility (WCAG AA)

- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`
- `aria-label` on all interactive elements without visible text
- `aria-current="page"` on active navigation links
- `aria-expanded` on dropdowns/accordions
- `aria-live="polite"` on dynamic content (filter counts, search results)
- `role="tablist"`, `role="tab"`, `role="tabpanel"` for tabs
- `role="alert"` on error messages
- Keyboard navigation: Tab, Enter, Escape, Arrow keys
- Focus management: trap in modals, return on close
- Min 4.5:1 contrast ratio

## Styling

- **Tailwind only** — no inline styles, no CSS modules
- **`cn()` from @homebase/ui** for class merging
- **Design tokens** — colors via `bg-brand-500`, `text-[#0A1628]` etc.
- **Mobile-first** — `sm:`, `md:`, `lg:` breakpoints
- **No `w-4.5`** — use valid Tailwind classes only (w-4, w-5, not w-4.5)

## Data Fetching

- **Server Components** by default for initial load
- **React Query** for client-side data with proper `staleTime`
- **Mock data first** — structure hooks for easy real API swap:
  ```tsx
  // TODO: Replace with real API call
  // return api.get('/admin/dashboard/stats');
  return mockDashboardStats;
  ```
- **Parallel fetching** — `Promise.allSettled`, not waterfall
- **Adapters** between API response and component props

## Text & i18n

- **All user-facing text in constants** — `const TEXT = { ... } as const`
- **No hardcoded strings in JSX** — use `TEXT.pageTitle`, `TEXT.retry`, etc.
- **Ready for next-intl** — structured for easy translation key swap

## Performance

- **Lazy load** below-fold components: `const Chart = lazy(() => import('./Chart'))`
- **Suspense boundaries** per section with skeleton fallbacks
- **Images**: use `next/image`, `loading="lazy"`, proper `sizes`
- **Bundle budget**: < 50KB per feature (gzipped)

## Testing

- Every utility function: unit test
- Every hook: renderHook test
- Every component: renders 4 states test
- Critical flows: E2E with Playwright

## Naming Conventions

- Files: `kebab-case.tsx` (e.g., `order-list.tsx`)
- Components: `PascalCase` (e.g., `OrderList`)
- Hooks: `useCamelCase` (e.g., `useOrderList`)
- Types: `PascalCase` (e.g., `OrderListProps`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `PAGE_SIZE`)
- Mock data: `mockCamelCase` (e.g., `mockOrderStats`)

## Project Structure

```
apps/platform/
├── app/                    ← Routes (page.tsx, layout.tsx, loading.tsx, error.tsx)
├── components/             ← App-level shared components (sidebar, header)
├── features/               ← Feature modules (self-contained)
│   └── {feature}/
│       ├── components/     ← React components
│       ├── hooks/          ← React Query hooks (use-{feature}.ts)
│       ├── services/       ← Mock data + adapters (API → UI transforms)
│       ├── context/        ← Feature-level context/state (if needed)
│       └── types.ts        ← TypeScript types (flat file)
├── lib/                    ← Utilities
│   ├── formatters/         ← Currency, date, number formatters
│   └── registries/         ← Icon, badge registries
```

## Chenile Backend Integration

- **Queries**: `POST /{entity}/{queryName}` with `SearchRequest` body
- **Commands**: `PATCH /{entity}/{id}/{eventID}` for STM state transitions
- **Retrieve**: `GET /{entity}/{id}` returning `StateEntityServiceResponse`
- **allowedActions** from response drives which action buttons to show
- Never hardcode which buttons to show based on status — read from `allowedActions`

## What NOT to Do

- No `console.log` in production code (use structured logger)
- No `// @ts-ignore` or `// eslint-disable`
- No inline event handlers in JSX (`onClick={() => setState(x)}` is OK for simple cases)
- No God components > 150 lines
- No raw API data in UI — always use adapters
- No hardcoded text strings in JSX
- No `any` type
- No `w-4.5` or other invalid Tailwind classes
