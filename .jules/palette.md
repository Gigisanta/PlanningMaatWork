## 2026-03-04 - ARIA labels in Spanish for localized apps
**Learning:** Found multiple icon-only buttons (like Trash, Lock/Unlock, Close X) missing ARIA labels in `PortfolioEditor.tsx`. Since the app's UI is strictly localized in Spanish, the standard ARIA labels also need to be translated.
**Action:** Always provide translated `aria-label` attributes for icon-only buttons (e.g., "Eliminar documento" instead of "Delete document") matching the app's primary language. Also add `aria-current="step"` and descriptive `aria-label` to wizard navigation steps for better screen reader support.

## 2025-03-10 - Accessibility gaps in icon-only buttons
**Learning:** Found a recurring pattern in the app where icon-only interactive elements (like Settings and Toggle buttons on list items) lack `aria-label` or `title` attributes. Without these attributes, screen reader users and those navigating visually cannot easily infer the button's purpose or action state.
**Action:** Ensure that anytime an icon-only button is implemented or updated, both an `aria-label` for assistive technologies and a `title` attribute for native tooltips are provided, and that the language specifically describes the resulting action or context.

## 2026-04-10 - Expand clickable area for checkboxes
**Learning:** Found multiple checkboxes where the associated text label was not wrapped in an `htmlFor` attribute linked to the checkbox's `id`. This forced users to click exactly on the small checkbox input, reducing the hit target area.
**Action:** When implementing form controls like checkboxes, always explicitly associate them by applying an `id` to the input element and an identical `htmlFor` property to the label. Apply `cursor-pointer` to both to provide clear visual interactivity and expand the clickable target area.
