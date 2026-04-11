## 2026-03-04 - ARIA labels in Spanish for localized apps
**Learning:** Found multiple icon-only buttons (like Trash, Lock/Unlock, Close X) missing ARIA labels in `PortfolioEditor.tsx`. Since the app UI is strictly localized in Spanish, the standard ARIA labels also need to be translated.
**Action:** Always provide translated `aria-label` attributes for icon-only buttons (e.g., "Eliminar documento" instead of "Delete document") matching the app primary language. Also add `aria-current="step"` and descriptive `aria-label` to wizard navigation steps for better screen reader support.

## 2025-03-10 - Accessibility gaps in icon-only buttons
**Learning:** Found a recurring pattern in the app where icon-only interactive elements (like Settings and Toggle buttons on list items) lack `aria-label` or `title` attributes. Without these attributes, screen reader users and those navigating visually cannot easily infer the button purpose or action state.
**Action:** Ensure that anytime an icon-only button is implemented or updated, both an `aria-label` for assistive technologies and a `title` attribute for native tooltips are provided, and that the language specifically describes the resulting action or context.

## 2025-05-15 - Form controls missing explicit label associations
**Learning:** Found checkboxes in `PortfolioEditor.tsx` and `page.tsx` missing explicit ID associations with their adjacent `<Label>` elements. The `cursor-pointer` was also missing, making the hit target strictly limited to the small checkbox.
**Action:** Always explicitly associate form controls by adding an `id` to the input and an identical `htmlFor` property to the label. Also apply `cursor-pointer` to both elements to improve UX by providing clear visual interactivity and expanding the clickable target area.
