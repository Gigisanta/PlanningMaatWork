## 2024-11-20 - [XSS Prevention in User-Editable HTML Preview]
**Vulnerability:** The application renders user-editable HTML directly into an `iframe` without any sandboxing, creating a potential XSS vulnerability if a user adds malicious scripts to the `editableHTML` state.
**Learning:** The `PortfolioPreview` component allows users to edit the generated HTML code. If this HTML contains a `<script>` tag, it would be executed within the context of the application since the `iframe` had no restrictions.
**Prevention:** Adding a `sandbox` attribute to the `iframe` (`sandbox="allow-same-origin allow-popups"`) restricts the capabilities of the content inside the iframe. Importantly, by omitting `allow-scripts`, it prevents any embedded JavaScript from executing, thus mitigating the XSS risk while still allowing the preview to render correctly and allowing necessary features like popups and same-origin access for PDF generation.

## 2024-11-20 - [Insecure Random UUID Generation]
**Vulnerability:** Insecure, predictable ID generation using `Math.random().toString(36)` to create UUIDs.
**Learning:** Using `Math.random` combined with `Date.now` for ID generation doesn't provide cryptographically secure values and introduces predictability, leading to potential IDOR vulnerabilities or collisions in larger sets.
**Prevention:** Replace all custom `Math.random` based UUID generation implementations with standard, secure alternatives like `crypto.randomUUID()` in the Web Crypto API, or `import { randomUUID } from 'crypto'` in native Node.js environments.
