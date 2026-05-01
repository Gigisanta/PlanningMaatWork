## 2023-10-27 - Preventing Heavy Recharts Re-renders on Form Input
**Learning:** In a single-page app (like `src/app/page.tsx`) with many form inputs (50+ `useState` hooks) that trigger frequent re-renders, any heavy child components (like `Recharts` visualizations) will also re-render on every keystroke if not properly memoized, leading to noticeable input lag.
**Action:** Always wrap heavy charting components in `React.memo` and ensure the `data` prop passed to them is memoized using `useMemo` in the parent component. Also, memoize expensive array operations (`filter`, `reduce`) that compute derived state across the entire portfolio on every render.
## 2025-05-01 - Consolidating filter counts in API routes
**Learning:** Found an O(N*M) performance anti-pattern in `src/app/api/outbound/route.ts` where arrays were traversed repeatedly using 12 chained `.filter(x => ...).length` calls to calculate independent statistics.
**Action:** Replace multiple `.filter().length` calculations with a single O(N) `for...of` loop or `.reduce()` pass that accumulates all values into a single object, preserving hierarchical logic if present.
