## 2023-10-27 - Preventing Heavy Recharts Re-renders on Form Input
**Learning:** In a single-page app (like `src/app/page.tsx`) with many form inputs (50+ `useState` hooks) that trigger frequent re-renders, any heavy child components (like `Recharts` visualizations) will also re-render on every keystroke if not properly memoized, leading to noticeable input lag.
**Action:** Always wrap heavy charting components in `React.memo` and ensure the `data` prop passed to them is memoized using `useMemo` in the parent component. Also, memoize expensive array operations (`filter`, `reduce`) that compute derived state across the entire portfolio on every render.

## 2025-02-18 - Replacing Multiple Array Operations with a Single Pass
**Learning:** Calling multiple `.filter(...).reduce(...)` iterations over the exact same array (e.g. `data.instruments` within string templates) causes O(k*N) complexity where k is the number of distinct statistics. This codebase's dynamic HTML generation makes it easy to overlook hidden array traversals.
**Action:** Always consolidate multiple array metrics into a single `reduce` pass before string interpolation to collapse O(k*N) down to O(N).
