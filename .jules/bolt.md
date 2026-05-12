## 2023-10-27 - Preventing Heavy Recharts Re-renders on Form Input
**Learning:** In a single-page app (like `src/app/page.tsx`) with many form inputs (50+ `useState` hooks) that trigger frequent re-renders, any heavy child components (like `Recharts` visualizations) will also re-render on every keystroke if not properly memoized, leading to noticeable input lag.
**Action:** Always wrap heavy charting components in `React.memo` and ensure the `data` prop passed to them is memoized using `useMemo` in the parent component. Also, memoize expensive array operations (`filter`, `reduce`) that compute derived state across the entire portfolio on every render.

## 2023-10-28 - Consolidating O(N) array passes in Next.js API Routes
**Learning:** In API routes processing data arrays, relying on multiple `.filter().length` calls for distinct categories creates redundant `O(N)` passes. This can become a performance bottleneck when dealing with larger payloads.
**Action:** Always consolidate multiple array passes into a single `O(N)` pass using a `for...of` loop or `.reduce()` to compute multiple independent metrics simultaneously. When dealing with hierarchical logic (e.g. status "booked" implying "replied"), structure the loop body to correctly increment all applicable counters.
