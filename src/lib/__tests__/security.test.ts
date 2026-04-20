import { test, expect, describe } from 'bun:test';
import { escapeHtml, safeUrl } from '../security';

describe('Security utils', () => {
  describe('escapeHtml', () => {
    test('handles null/undefined safely', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    test('escapes HTML characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
      expect(escapeHtml("It's fine")).toBe("It&#039;s fine");
    });

    test('converts non-strings to strings safely', () => {
      expect(escapeHtml(123 as any)).toBe('123');
      expect(escapeHtml(true as any)).toBe('true');
    });
  });

  describe('safeUrl', () => {
    test('handles null/undefined/empty safely', () => {
      expect(safeUrl(null)).toBe('#');
      expect(safeUrl(undefined)).toBe('#');
      expect(safeUrl('')).toBe('#');
    });

    test('allows safe absolute URLs', () => {
      expect(safeUrl('https://example.com')).toBe('https://example.com');
      expect(safeUrl('http://test.com')).toBe('http://test.com');
      expect(safeUrl('mailto:test@test.com')).toBe('mailto:test@test.com');
      expect(safeUrl('tel:+1234567890')).toBe('tel:+1234567890');
      expect(safeUrl('whatsapp://send?text=hello')).toBe('whatsapp://send?text=hello');
    });

    test('allows relative URLs and anchors', () => {
      expect(safeUrl('/path/to/page')).toBe('/path/to/page');
      expect(safeUrl('#section-1')).toBe('#section-1');
      expect(safeUrl('?query=1')).toBe('?query=1');
    });

    test('blocks javascript: URLs', () => {
      expect(safeUrl('javascript:alert(1)')).toBe('#');
      expect(safeUrl('  javascript:alert(1)  ')).toBe('#');
      expect(safeUrl('JAVASCRIPT:alert(1)')).toBe('#');
      // Even if encoded or weird cases might slip past basic string matching, URL parsing catches protocol
    });

    test('blocks other unsafe protocols', () => {
      expect(safeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
      expect(safeUrl('vbscript:msgbox("hello")')).toBe('#');
      expect(safeUrl('file:///etc/passwd')).toBe('#');
    });
  });
});
