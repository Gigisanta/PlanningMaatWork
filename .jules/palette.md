## 2026-03-04 - ARIA labels in Spanish for localized apps
**Learning:** Found multiple icon-only buttons (like Trash, Lock/Unlock, Close X) missing ARIA labels in `PortfolioEditor.tsx`. Since the app's UI is strictly localized in Spanish, the standard ARIA labels also need to be translated.
**Action:** Always provide translated `aria-label` attributes for icon-only buttons (e.g., "Eliminar documento" instead of "Delete document") matching the app's primary language. Also add `aria-current="step"` and descriptive `aria-label` to wizard navigation steps for better screen reader support.

## 2025-03-10 - Accessibility gaps in icon-only buttons
**Learning:** Found a recurring pattern in the app where icon-only interactive elements (like Settings and Toggle buttons on list items) lack `aria-label` or `title` attributes. Without these attributes, screen reader users and those navigating visually cannot easily infer the button's purpose or action state.
**Action:** Ensure that anytime an icon-only button is implemented or updated, both an `aria-label` for assistive technologies and a `title` attribute for native tooltips are provided, and that the language specifically describes the resulting action or context.

## 2026-03-04 - Dynamic success states on buttons with visible text
**Learning:** For action buttons that temporarily change their text to indicate success (e.g., a "Copiar" button that changes to "Listo" temporarily after being clicked), dynamically altering `aria-label` is an anti-pattern. This overwrites the visible text entirely, which violates WCAG 2.5.3 (Label in Name) and can confuse voice control users.
**Action:** Instead of dynamically swapping `aria-label`, inject a visually hidden `div` with `aria-live="polite"` inside the button. Update the text in this hidden div to announce the state change smoothly to screen readers while keeping the visible label intact.
