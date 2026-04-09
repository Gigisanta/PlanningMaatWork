## 2026-03-04 - ARIA labels in Spanish for localized apps
**Learning:** Found multiple icon-only buttons (like Trash, Lock/Unlock, Close X) missing ARIA labels in `PortfolioEditor.tsx`. Since the app's UI is strictly localized in Spanish, the standard ARIA labels also need to be translated.
**Action:** Always provide translated `aria-label` attributes for icon-only buttons (e.g., "Eliminar documento" instead of "Delete document") matching the app's primary language. Also add `aria-current="step"` and descriptive `aria-label` to wizard navigation steps for better screen reader support.

## 2025-03-10 - Accessibility gaps in icon-only buttons
**Learning:** Found a recurring pattern in the app where icon-only interactive elements (like Settings and Toggle buttons on list items) lack `aria-label` or `title` attributes. Without these attributes, screen reader users and those navigating visually cannot easily infer the button's purpose or action state.
**Action:** Ensure that anytime an icon-only button is implemented or updated, both an `aria-label` for assistive technologies and a `title` attribute for native tooltips are provided, and that the language specifically describes the resulting action or context.
## 2026-04-09 - Mobile Navigation Accessibility Improvements
**Learning:** Found that the bottom navigation bar on mobile used buttons that contained both an icon and text, but didn't explicitly communicate their current active state to screen readers, making it harder for non-visual users to know which tab they were currently on.
**Action:** Add `aria-current="page"` conditionally to active navigation items and ensure explicitly translated `aria-label` attributes are present for buttons that serve as major navigational landmarks, even if they have some text.
