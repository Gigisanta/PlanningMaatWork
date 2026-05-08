## 2026-03-04 - ARIA labels in Spanish for localized apps
**Learning:** Found multiple icon-only buttons (like Trash, Lock/Unlock, Close X) missing ARIA labels in `PortfolioEditor.tsx`. Since the app's UI is strictly localized in Spanish, the standard ARIA labels also need to be translated.
**Action:** Always provide translated `aria-label` attributes for icon-only buttons (e.g., "Eliminar documento" instead of "Delete document") matching the app's primary language. Also add `aria-current="step"` and descriptive `aria-label` to wizard navigation steps for better screen reader support.

## 2025-03-10 - Accessibility gaps in icon-only buttons
**Learning:** Found a recurring pattern in the app where icon-only interactive elements (like Settings and Toggle buttons on list items) lack `aria-label` or `title` attributes. Without these attributes, screen reader users and those navigating visually cannot easily infer the button's purpose or action state.
**Action:** Ensure that anytime an icon-only button is implemented or updated, both an `aria-label` for assistive technologies and a `title` attribute for native tooltips are provided, and that the language specifically describes the resulting action or context.

## 2023-10-27 - Handling visible text changes in buttons
**Learning:** Found an issue where the "Copy" button changes its visible text to "Copied!" upon success. While tempting to update `aria-label`, doing so causes the accessible name to diverge from the visible text, violating WCAG 2.5.3 (Label in Name).
**Action:** Whenever a button's visible text changes temporarily to indicate success, do not alter its `aria-label`. Instead, use a nearby visually hidden element (`<div className="sr-only" aria-live="polite">`) to announce the state change cleanly to screen readers.

## 2023-10-27 - Loading states on async action buttons
**Learning:** Found action buttons (like "Generate Plan" and "Export PDF") that only used the `disabled` attribute during loading states. This prevents screen readers from understanding *why* the button is disabled or that a background process is running.
**Action:** Always accompany `disabled={isLoading}` with `aria-busy={isLoading}` on interactive elements that trigger asynchronous operations, ensuring screen readers announce the processing state.
