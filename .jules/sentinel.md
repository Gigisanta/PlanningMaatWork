## 2024-11-20 - [XSS Prevention in User-Editable HTML Preview]
**Vulnerability:** The application renders user-editable HTML directly into an `iframe` without any sandboxing, creating a potential XSS vulnerability if a user adds malicious scripts to the `editableHTML` state.
**Learning:** The `PortfolioPreview` component allows users to edit the generated HTML code. If this HTML contains a `<script>` tag, it would be executed within the context of the application since the `iframe` had no restrictions.
**Prevention:** Adding a `sandbox` attribute to the `iframe` (`sandbox="allow-same-origin allow-popups"`) restricts the capabilities of the content inside the iframe. Importantly, by omitting `allow-scripts`, it prevents any embedded JavaScript from executing, thus mitigating the XSS risk while still allowing the preview to render correctly and allowing necessary features like popups and same-origin access for PDF generation.
## 2025-04-27 - [Predictable ID Generation]
**Vulnerability:** The application used `Math.random()` and `Date.now()` to generate IDs for Leads and OutreachLogs in `src/app/api`. `Math.random()` is not cryptographically secure, leading to predictable IDs and potential collision risks.
**Learning:** Legacy Node.js or older utility code sometimes relies on non-cryptographic PRNGs. In modern Next.js environments, Web Crypto is universally available.
**Prevention:** Always use `crypto.randomUUID()` to generate secure, unpredictable universally unique identifiers instead of custom `Math.random()` string manipulation.
