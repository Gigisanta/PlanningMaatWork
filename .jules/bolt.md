## 2023-10-27 - Preventing Heavy Recharts Re-renders on Form Input
**Learning:** In a single-page app (like `src/app/page.tsx`) with many form inputs (50+ `useState` hooks) that trigger frequent re-renders, any heavy child components (like `Recharts` visualizations) will also re-render on every keystroke if not properly memoized, leading to noticeable input lag.
**Action:** Always wrap heavy charting components in `React.memo` and ensure the `data` prop passed to them is memoized using `useMemo` in the parent component. Also, memoize expensive array operations (`filter`, `reduce`) that compute derived state across the entire portfolio on every render.

## 2023-10-27 - O(N) Array Accumulation vs Map/Filter/Reduce
**Learning:** In Node.js/Next.js API routes that process large datasets (like CRM leads or logs), multiple `.filter().length` or `.reduce()` calls force the engine to iterate over the array repeatedly, creating intermediate memory allocations and stressing garbage collection.
**Action:** When calculating multiple independent metrics from a single array, refactor multiple `filter` chains into a single O(N) `for...of` loop or single `reduce` pass that increments counters in an accumulator object.
