## 2026-03-04 - ARIA labels in Spanish for localized apps
**Learning:** Found multiple icon-only buttons (like Trash, Lock/Unlock, Close X) missing ARIA labels in `PortfolioEditor.tsx`. Since the app's UI is strictly localized in Spanish, the standard ARIA labels also need to be translated.
**Action:** Always provide translated `aria-label` attributes for icon-only buttons (e.g., "Eliminar documento" instead of "Delete document") matching the app's primary language. Also add `aria-current="step"` and descriptive `aria-label` to wizard navigation steps for better screen reader support.

## 2025-03-10 - Accessibility gaps in icon-only buttons
**Learning:** Found a recurring pattern in the app where icon-only interactive elements (like Settings and Toggle buttons on list items) lack `aria-label` or `title` attributes. Without these attributes, screen reader users and those navigating visually cannot easily infer the button's purpose or action state.
**Action:** Ensure that anytime an icon-only button is implemented or updated, both an `aria-label` for assistive technologies and a `title` attribute for native tooltips are provided, and that the language specifically describes the resulting action or context.

## 2024-05-24 - Accessibility states on interactive elements
**Learning:** The visible text changes during interactions (e.g. "Copy" changing to "Listo" or adding a spinner) are not inherently accessible to screen readers. For loading states, `aria-busy` is essential. For temporary success states without focus changes, a visually hidden `aria-live` region ensures screen reader users are notified.
**Action:** Always accompany `disabled={isLoading}` with `aria-busy={isLoading}`. Ensure temporary text changes in buttons are accompanied by an `aria-live="polite"` element to announce the state change.
