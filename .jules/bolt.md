## 2023-10-27 - Preventing Heavy Recharts Re-renders on Form Input
**Learning:** In a single-page app (like `src/app/page.tsx`) with many form inputs (50+ `useState` hooks) that trigger frequent re-renders, any heavy child components (like `Recharts` visualizations) will also re-render on every keystroke if not properly memoized, leading to noticeable input lag.
**Action:** Always wrap heavy charting components in `React.memo` and ensure the `data` prop passed to them is memoized using `useMemo` in the parent component. Also, memoize expensive array operations (`filter`, `reduce`) that compute derived state across the entire portfolio on every render.
## 2023-10-27 - Preventing O(N*M) Array Filtrations
**Learning:** In highly trafficked endpoints calculating multiple statistics from arrays (e.g. `src/app/api/outbound/route.ts` and `src/app/api/classify/route.ts`), calling `.filter(condition).length` repeatedly leads to O(k*N) complexity and allocates many short-lived intermediate arrays causing garbage collection pressure.
**Action:** Consolidate redundant filters by doing a single `for...of` pass to accumulate counts into an object.
