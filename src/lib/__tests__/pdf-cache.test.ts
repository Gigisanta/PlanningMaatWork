import { expect, test, describe, beforeEach } from "bun:test";
import { cachePDF, getCachedPDF, clearPDFCache } from "../pdf-cache";

describe("pdf-cache", () => {
  beforeEach(() => {
    clearPDFCache();
  });

  test("clearPDFCache should remove all items from the cache", () => {
    const mockData1 = { id: 1 };
    const mockHtml1 = "<div>PDF 1</div>";

    const mockData2 = { id: 2 };
    const mockHtml2 = "<div>PDF 2</div>";

    // Add items to cache
    cachePDF(mockData1, mockHtml1);
    cachePDF(mockData2, mockHtml2);

    // Verify items are in cache
    expect(getCachedPDF(mockData1)).toBe(mockHtml1);
    expect(getCachedPDF(mockData2)).toBe(mockHtml2);

    // Clear cache
    clearPDFCache();

    // Verify items are no longer in cache
    expect(getCachedPDF(mockData1)).toBeNull();
    expect(getCachedPDF(mockData2)).toBeNull();
  });
});
