import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import { getCachedPDF, cachePDF, clearPDFCache } from './pdf-cache';

describe('PDF Cache', () => {
  beforeEach(() => {
    clearPDFCache();
  });

  afterEach(() => {
    clearPDFCache();
  });

  describe('cachePDF', () => {
    it('should store a PDF HTML string correctly for a given data object', () => {
      const data = { id: 1, name: 'Test' };
      const html = '<div>Test PDF</div>';

      cachePDF(data, html);

      const cachedHtml = getCachedPDF(data);
      expect(cachedHtml).toBe(html);
    });

    it('should handle complex nested data objects', () => {
      const data = {
        user: { name: 'John Doe', age: 30 },
        items: [{ id: 1 }, { id: 2 }],
        settings: { active: true }
      };
      const html = '<div>Complex Data PDF</div>';

      cachePDF(data, html);

      const cachedHtml = getCachedPDF(data);
      expect(cachedHtml).toBe(html);
    });
  });

  describe('getCachedPDF', () => {
    it('should return null if the data object is not in the cache', () => {
      const data = { id: 1 };
      const cachedHtml = getCachedPDF(data);
      expect(cachedHtml).toBeNull();
    });

    it('should return the html if the cache entry is valid', () => {
      const data = { id: 2 };
      const html = '<div>Valid PDF</div>';

      cachePDF(data, html);

      const cachedHtml = getCachedPDF(data);
      expect(cachedHtml).toBe(html);
    });

    it('should return null if the cache entry has expired', () => {
      const data = { id: 3 };
      const html = '<div>Expired PDF</div>';

      // CACHE_TTL is 5 * 60 * 1000 = 300000ms
      const initialTime = Date.now();

      // Mock Date.now to simulate time passing
      const dateSpy = spyOn(globalThis.Date, 'now').mockImplementation(() => initialTime);

      try {
        cachePDF(data, html);

        // Advance time past the TTL (5 minutes and 1 millisecond)
        dateSpy.mockImplementation(() => initialTime + 300001);

        const cachedHtml = getCachedPDF(data);
        expect(cachedHtml).toBeNull();
      } finally {
        dateSpy.mockRestore();
      }
    });
  });

  describe('clearPDFCache', () => {
    it('should remove all items from the cache', () => {
      const data1 = { id: 1 };
      const data2 = { id: 2 };

      cachePDF(data1, '<div>PDF 1</div>');
      cachePDF(data2, '<div>PDF 2</div>');

      expect(getCachedPDF(data1)).not.toBeNull();
      expect(getCachedPDF(data2)).not.toBeNull();

      clearPDFCache();

      expect(getCachedPDF(data1)).toBeNull();
      expect(getCachedPDF(data2)).toBeNull();
    });
  });
});
