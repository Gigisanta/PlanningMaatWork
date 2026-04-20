import { expect, test } from "bun:test";
import { escapeHtml, safeUrl } from "../security";

test("escapeHtml sanitizes HTML tags", () => {
  expect(escapeHtml("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
  expect(escapeHtml('"><img src=x onerror=alert(1)>')).toBe("&quot;&gt;&lt;img src=x onerror=alert(1)&gt;");
});

test("safeUrl filters malicious URLs", () => {
  expect(safeUrl("javascript:alert(1)")).toBe("#");
  expect(safeUrl("  javascript:alert(1)")).toBe("#");
  expect(safeUrl("JaVaScRiPt:alert(1)")).toBe("#");
  expect(safeUrl("vbscript:msgbox(1)")).toBe("#");
  expect(safeUrl("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==")).toBe("#");
  expect(safeUrl("https://example.com")).toBe("https://example.com");
  expect(safeUrl("/local/path")).toBe("/local/path");
});
