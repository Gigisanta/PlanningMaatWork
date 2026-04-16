## 2026-03-04 - ARIA labels in Spanish for localized apps
**Learning:** Found multiple icon-only buttons (like Trash, Lock/Unlock, Close X) missing ARIA labels in `PortfolioEditor.tsx`. Since the app's UI is strictly localized in Spanish, the standard ARIA labels also need to be translated.
**Action:** Always provide translated `aria-label` attributes for icon-only buttons (e.g., "Eliminar documento" instead of "Delete document") matching the app's primary language. Also add `aria-current="step"` and descriptive `aria-label` to wizard navigation steps for better screen reader support.

## 2025-03-10 - Accessibility gaps in icon-only buttons
**Learning:** Found a recurring pattern in the app where icon-only interactive elements (like Settings and Toggle buttons on list items) lack `aria-label` or `title` attributes. Without these attributes, screen reader users and those navigating visually cannot easily infer the button's purpose or action state.
**Action:** Ensure that anytime an icon-only button is implemented or updated, both an `aria-label` for assistive technologies and a `title` attribute for native tooltips are provided, and that the language specifically describes the resulting action or context.

## 2025-03-10 - Mobile Bottom Navigation Accessibility
**Learning:** The custom mobile bottom navigation in `src/app/page.tsx` was implemented as a simple flex layout with standard `<button>` elements switching state, lacking any semantics to inform screen readers of its tab-like behavior and relationships to the panels.
**Action:** Always add standard ARIA attributes (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` for navigation, and `role="tabpanel"`, `aria-labelledby`, `aria-hidden` for content panels) when implementing custom tab-like navigation, especially on mobile where visual cues might be limited.
