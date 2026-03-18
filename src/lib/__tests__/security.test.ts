import { expect, test, describe } from "bun:test";
import { escapeHtml, safeUrl } from "../security";

describe("security utils", () => {
  test("escapeHtml escapes HTML chars", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(escapeHtml('"hello"')).toBe("&quot;hello&quot;");
    expect(escapeHtml("'hello'")).toBe("&#039;hello&#039;");
    expect(escapeHtml("a & b")).toBe("a &amp; b");
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  test("safeUrl allows safe protocols", () => {
    expect(safeUrl("https://google.com")).toBe("https://google.com");
    expect(safeUrl("http://google.com")).toBe("http://google.com");
    expect(safeUrl("mailto:test@test.com")).toBe("mailto:test@test.com");
    expect(safeUrl("tel:+12345")).toBe("tel:+12345");
    expect(safeUrl("whatsapp://send?text=hello")).toBe("whatsapp://send?text=hello");
  });

  test("safeUrl sanitizes dangerous protocols", () => {
    expect(safeUrl("javascript:alert(1)")).toBe("#");
    expect(safeUrl("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTs8L3NjcmlwdD4=")).toBe("#");
    expect(safeUrl("vbscript:msgbox(1)")).toBe("#");
    expect(safeUrl(null)).toBe("#");
    expect(safeUrl(undefined)).toBe("#");
    expect(safeUrl("")).toBe("#");
  });

  test("safeUrl allows relative paths", () => {
    expect(safeUrl("/about")).toBe("/about");
  });
});
