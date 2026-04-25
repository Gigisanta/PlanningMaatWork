## 2024-11-20 - [XSS Prevention in User-Editable HTML Preview]
**Vulnerability:** The application renders user-editable HTML directly into an `iframe` without any sandboxing, creating a potential XSS vulnerability if a user adds malicious scripts to the `editableHTML` state.
**Learning:** The `PortfolioPreview` component allows users to edit the generated HTML code. If this HTML contains a `<script>` tag, it would be executed within the context of the application since the `iframe` had no restrictions.
**Prevention:** Adding a `sandbox` attribute to the `iframe` (`sandbox="allow-same-origin allow-popups"`) restricts the capabilities of the content inside the iframe. Importantly, by omitting `allow-scripts`, it prevents any embedded JavaScript from executing, thus mitigating the XSS risk while still allowing the preview to render correctly and allowing necessary features like popups and same-origin access for PDF generation.
## 2024-05-18 - Insecure Predictable Random Number Generator (PRNG) usage
**Vulnerability:** Found insecure ID generation throughout the API route files using `Date.now().toString(36) + Math.random().toString(36).substr(2, 9)`.
**Learning:** `Math.random()` provides a statistically random number but is NOT cryptographically secure, leading to predictable IDs that could be exploited in specific contexts (e.g., iterating object structures, ID-based references).
**Prevention:** Always use Node.js's native `crypto.randomUUID()` when generating UUIDs or unique IDs on the server-side to guarantee cryptographic randomness.
