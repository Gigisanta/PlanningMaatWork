## 2024-11-20 - [XSS Prevention in User-Editable HTML Preview]
**Vulnerability:** The application renders user-editable HTML directly into an `iframe` without any sandboxing, creating a potential XSS vulnerability if a user adds malicious scripts to the `editableHTML` state.
**Learning:** The `PortfolioPreview` component allows users to edit the generated HTML code. If this HTML contains a `<script>` tag, it would be executed within the context of the application since the `iframe` had no restrictions.
**Prevention:** Adding a `sandbox` attribute to the `iframe` (`sandbox="allow-same-origin allow-popups"`) restricts the capabilities of the content inside the iframe. Importantly, by omitting `allow-scripts`, it prevents any embedded JavaScript from executing, thus mitigating the XSS risk while still allowing the preview to render correctly and allowing necessary features like popups and same-origin access for PDF generation.
## 2026-04-28 - [Insecure ID Generation using Math.random()]
**Vulnerability:** Weak PRNG used for generating IDs (`Math.random()`)
**Learning:** The application was using `Date.now().toString(36) + Math.random().toString(36).substr(2, 9)` to generate IDs for Leads, FollowUps, and OutreachLogs across multiple API routes. This pattern is cryptographically insecure and predictable, which could potentially lead to ID collisions or IDOR vulnerabilities.
**Prevention:** Use native `crypto.randomUUID()` (available in modern Node/Next.js environments globally) to ensure cryptographically secure, collision-resistant UUID generation.
