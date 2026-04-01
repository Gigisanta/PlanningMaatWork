import { test, expect, describe } from "bun:test";
import { escapeHtml, safeUrl } from "../security";

describe("security utils", () => {
  describe("escapeHtml", () => {
    test("should escape unsafe characters", () => {
      expect(escapeHtml("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
      expect(escapeHtml("\"'")).toBe("&quot;&#039;");
      expect(escapeHtml("a & b")).toBe("a &amp; b");
    });

    test("should handle null/undefined", () => {
      expect(escapeHtml(null)).toBe("");
      expect(escapeHtml(undefined)).toBe("");
    });
  });

  describe("safeUrl", () => {
    test("should pass through safe urls", () => {
      expect(safeUrl("https://example.com")).toBe("https://example.com");
      expect(safeUrl("/path")).toBe("/path");
    });

    test("should block javascript/vbscript protocols", () => {
      expect(safeUrl("javascript:alert(1)")).toBe("#");
      expect(safeUrl("vbscript:msgbox(1)")).toBe("#");
      expect(safeUrl(" javascript:alert(1)")).toBe("#");
    });

    test("should handle null/undefined", () => {
      expect(safeUrl(null)).toBe("#");
      expect(safeUrl(undefined)).toBe("#");
      expect(safeUrl("")).toBe("#");
    });
  });
});
