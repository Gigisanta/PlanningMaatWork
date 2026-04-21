import { describe, it, expect, beforeEach, afterEach, setSystemTime } from 'bun:test';
import { getCachedPDF, cachePDF, clearPDFCache } from '../pdf-cache';

describe('PDF Cache', () => {
  const CACHE_TTL = 5 * 60 * 1000;
  const testData1 = { name: 'Alice', age: 30 };
  const testData2 = { name: 'Bob', age: 25 };
  const testHtml1 = '<div>Alice</div>';
  const testHtml2 = '<div>Bob</div>';
  let initialTime: number;

  beforeEach(() => {
    clearPDFCache();
    initialTime = Date.now();
    setSystemTime(new Date(initialTime));
  });

  afterEach(() => {
    setSystemTime();
  });

  describe('getCachedPDF', () => {
    it('should return null when cache is empty', () => {
      expect(getCachedPDF(testData1)).toBeNull();
    });

    it('should return cached HTML when valid entry exists', () => {
      cachePDF(testData1, testHtml1);
      expect(getCachedPDF(testData1)).toBe(testHtml1);
    });

    it('should return null for different data inputs', () => {
      cachePDF(testData1, testHtml1);
      expect(getCachedPDF(testData2)).toBeNull();
    });

    it('should correctly store multiple entries', () => {
      cachePDF(testData1, testHtml1);
      cachePDF(testData2, testHtml2);

      expect(getCachedPDF(testData1)).toBe(testHtml1);
      expect(getCachedPDF(testData2)).toBe(testHtml2);
    });

    it('should return null when cache entry has expired', () => {
      cachePDF(testData1, testHtml1);

      // Advance time beyond TTL
      setSystemTime(new Date(initialTime + CACHE_TTL + 1000));

      expect(getCachedPDF(testData1)).toBeNull();
    });

    it('should return cached HTML just before expiration', () => {
      cachePDF(testData1, testHtml1);

      // Advance time just before TTL
      setSystemTime(new Date(initialTime + CACHE_TTL - 1000));

      expect(getCachedPDF(testData1)).toBe(testHtml1);
    });
  });

  describe('clearPDFCache', () => {
    it('should remove all cached entries', () => {
      cachePDF(testData1, testHtml1);
      cachePDF(testData2, testHtml2);

      clearPDFCache();

      expect(getCachedPDF(testData1)).toBeNull();
      expect(getCachedPDF(testData2)).toBeNull();
    });
  });
});
