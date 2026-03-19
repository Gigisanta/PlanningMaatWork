## 2024-11-20 - [XSS Prevention in User-Editable HTML Preview]
**Vulnerability:** The application renders user-editable HTML directly into an `iframe` without any sandboxing, creating a potential XSS vulnerability if a user adds malicious scripts to the `editableHTML` state.
**Learning:** The `PortfolioPreview` component allows users to edit the generated HTML code. If this HTML contains a `<script>` tag, it would be executed within the context of the application since the `iframe` had no restrictions.
**Prevention:** Adding a `sandbox` attribute to the `iframe` (`sandbox="allow-same-origin allow-popups"`) restricts the capabilities of the content inside the iframe. Importantly, by omitting `allow-scripts`, it prevents any embedded JavaScript from executing, thus mitigating the XSS risk while still allowing the preview to render correctly and allowing necessary features like popups and same-origin access for PDF generation.## 2024-03-19 - XSS in HTML generation
**Vulnerability:** HTML is generated using string interpolation without escaping user input, leading to XSS.
**Learning:** String interpolation in HTML templates must manually sanitize dynamic input to prevent injection attacks.
**Prevention:** Implement and use an `escapeHtml` function for all dynamic text content and `safeUrl` for URL attributes before interpolating.
