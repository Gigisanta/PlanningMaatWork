## 2026-03-04 - ARIA labels in Spanish for localized apps
**Learning:** Found multiple icon-only buttons (like Trash, Lock/Unlock, Close X) missing ARIA labels in `PortfolioEditor.tsx`. Since the app's UI is strictly localized in Spanish, the standard ARIA labels also need to be translated.
**Action:** Always provide translated `aria-label` attributes for icon-only buttons (e.g., "Eliminar documento" instead of "Delete document") matching the app's primary language. Also add `aria-current="step"` and descriptive `aria-label` to wizard navigation steps for better screen reader support.

## 2025-03-10 - Accessibility gaps in icon-only buttons
**Learning:** Found a recurring pattern in the app where icon-only interactive elements (like Settings and Toggle buttons on list items) lack `aria-label` or `title` attributes. Without these attributes, screen reader users and those navigating visually cannot easily infer the button's purpose or action state.
**Action:** Ensure that anytime an icon-only button is implemented or updated, both an `aria-label` for assistive technologies and a `title` attribute for native tooltips are provided, and that the language specifically describes the resulting action or context.

## 2023-10-25 - WCAG 2.5.3 (Label in Name) violations on text buttons
**Learning:** Found that adding `aria-label` to buttons that already have visible text (like "Copiar" or "Exportar PDF") overrides the visible text for screen readers, causing a WCAG 2.5.3 (Label in Name) violation. This breaks the experience for voice dictation users. Also, using `aria-live` directly on a button relying on `aria-label` swaps is unreliable.
**Action:** Never add `aria-label` to buttons that already contain visible text. Only use it for icon-only buttons. For action buttons with temporary success states (like "Copiar" changing to "Listo"), use a visually-hidden element (e.g., `<div className="sr-only" aria-live="polite">`) to announce the state change smoothly.
