import { expect, test, describe } from "bun:test";
import { safeUrl, escapeHtml } from "../security";

describe("security utilities", () => {
  describe("safeUrl", () => {
    test("allows standard safe protocols", () => {
      expect(safeUrl("https://example.com")).toBe("https://example.com");
      expect(safeUrl("http://example.com")).toBe("http://example.com");
      expect(safeUrl("mailto:test@example.com")).toBe("mailto:test@example.com");
      expect(safeUrl("tel:+1234567890")).toBe("tel:+1234567890");
      expect(safeUrl("whatsapp://send?text=hello")).toBe("whatsapp://send?text=hello");
    });

    test("allows relative URLs and anchors", () => {
      expect(safeUrl("/path/to/resource")).toBe("/path/to/resource");
      expect(safeUrl("#section")).toBe("#section");
      expect(safeUrl("?query=1")).toBe("?query=1");
      expect(safeUrl("example.com")).toBe("example.com");
    });

    test("blocks malicious protocols", () => {
      expect(safeUrl("javascript:alert(1)")).toBe("#");
      expect(safeUrl("vbscript:msgbox(1)")).toBe("#");
      expect(safeUrl("data:text/html,<script>alert(1)</script>")).toBe("#");
    });

    test("handles null or undefined", () => {
      expect(safeUrl(null)).toBe("#");
      expect(safeUrl(undefined)).toBe("#");
      expect(safeUrl("")).toBe("#");
    });

    test("strips control characters", () => {
      // javascript: with control characters
      expect(safeUrl("\x00javascript:alert(1)")).toBe("#");
      expect(safeUrl("java\x0Bscript:alert(1)")).toBe("#");
    });
  });

  describe("escapeHtml", () => {
    test("escapes HTML entities", () => {
      expect(escapeHtml('<script>alert("XSS & \'attack\'")</script>'))
        .toBe("&lt;script&gt;alert(&quot;XSS &amp; &#039;attack&#039;&quot;)&lt;/script&gt;");
    });

    test("handles null or undefined safely", () => {
      expect(escapeHtml(null)).toBe("");
      expect(escapeHtml(undefined)).toBe("");
      expect(escapeHtml("")).toBe("");
    });
  });
});
