## 2024-11-20 - [XSS Prevention in User-Editable HTML Preview]
**Vulnerability:** The application renders user-editable HTML directly into an `iframe` without any sandboxing, creating a potential XSS vulnerability if a user adds malicious scripts to the `editableHTML` state.
**Learning:** The `PortfolioPreview` component allows users to edit the generated HTML code. If this HTML contains a `<script>` tag, it would be executed within the context of the application since the `iframe` had no restrictions.
**Prevention:** Adding a `sandbox` attribute to the `iframe` (`sandbox="allow-same-origin allow-popups"`) restricts the capabilities of the content inside the iframe. Importantly, by omitting `allow-scripts`, it prevents any embedded JavaScript from executing, thus mitigating the XSS risk while still allowing the preview to render correctly and allowing necessary features like popups and same-origin access for PDF generation.

## 2024-05-02 - Insecure ID Generation using Math.random
**Vulnerability:** Found `Date.now().toString(36) + Math.random().toString(36).substr(2, 9)` used for generating IDs in API routes (`leads`, `outbound`, `classify`), including sensitive entity identifiers like Lead ID and OutreachLog ID.
**Learning:** `Math.random()` is not cryptographically secure and predictable, which could lead to ID collision or insecure direct object references (IDOR) attacks if used for sensitive resources without proper authorization checks.
**Prevention:** Always use Node's native `crypto.randomUUID()` for generating cryptographically secure and unpredictable unique identifiers.
