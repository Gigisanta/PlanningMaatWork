import { describe, it, expect, beforeEach, afterEach, setSystemTime } from "bun:test";
import { getCachedPDF, cachePDF, clearPDFCache, CACHE_TTL } from "../pdf-cache";

describe("pdf-cache", () => {
  beforeEach(() => {
    clearPDFCache();
    // Reset time to a fixed point before each test
    setSystemTime(new Date("2024-01-01T00:00:00Z"));
  });

  afterEach(() => {
    // Reset system time after each test to avoid side effects
    setSystemTime();
  });

  it("should return null when cache is empty", () => {
    const data = { id: 1, name: "Test" };
    expect(getCachedPDF(data)).toBeNull();
  });

  it("should cache and retrieve a PDF", () => {
    const data = { id: 1, name: "Test" };
    const html = "<html><body>Test</body></html>";

    cachePDF(data, html);
    expect(getCachedPDF(data)).toBe(html);
  });

  it("should return null if entry has expired (TTL >= 5 minutes)", () => {
    const data = { id: 1, name: "Test" };
    const html = "<html><body>Test</body></html>";

    cachePDF(data, html);
    expect(getCachedPDF(data)).toBe(html);

    // Advance time by exactly CACHE_TTL
    setSystemTime(new Date(Date.now() + CACHE_TTL));
    expect(getCachedPDF(data)).toBeNull();
  });

  it("should return html if entry is just about to expire", () => {
    const data = { id: 1, name: "Test" };
    const html = "<html><body>Test</body></html>";

    cachePDF(data, html);

    // Advance time by CACHE_TTL - 1ms
    setSystemTime(new Date(Date.now() + CACHE_TTL - 1));
    expect(getCachedPDF(data)).toBe(html);
  });

  it("should clear the cache", () => {
    const data = { id: 1, name: "Test" };
    const html = "<html><body>Test</body></html>";

    cachePDF(data, html);
    expect(getCachedPDF(data)).toBe(html);

    clearPDFCache();
    expect(getCachedPDF(data)).toBeNull();
  });

  it("should distinguish between different data objects", () => {
    const data1 = { id: 1, name: "Test 1" };
    const html1 = "<html><body>Test 1</body></html>";
    const data2 = { id: 2, name: "Test 2" };
    const html2 = "<html><body>Test 2</body></html>";

    cachePDF(data1, html1);
    cachePDF(data2, html2);

    expect(getCachedPDF(data1)).toBe(html1);
    expect(getCachedPDF(data2)).toBe(html2);
  });

  it("should handle complex data objects", () => {
    const data = {
      user: { id: 1, profile: { name: "Complex" } },
      items: [1, 2, 3],
      meta: null
    };
    const html = "<html><body>Complex</body></html>";

    cachePDF(data, html);
    expect(getCachedPDF(data)).toBe(html);
  });
});
