/**
 * Escapes characters that could be used for XSS.
 * Replaces <, >, &, ", and ' with their corresponding HTML entities.
 */
export function escapeHtml(unsafe: string | number | undefined | null): string {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates and sanitizes a URL.
 * Allows only http:, https:, mailto:, and tel: protocols.
 * Returns '#' if the URL is invalid or uses a forbidden protocol (like javascript:).
 */
export function safeUrl(url: string | undefined | null): string {
  if (!url) return '#';

  try {
    const parsedUrl = new URL(url, 'http://dummy.com'); // use dummy base for relative URLs

    // Only allow safe protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (allowedProtocols.includes(parsedUrl.protocol)) {
      return escapeHtml(url);
    }

    // Fallback for URLs without explicit protocols (e.g., "www.google.com" -> we should treat carefully)
    // If it doesn't have a protocol and doesn't contain a colon, it's likely a relative path
    if (!url.includes(':')) {
       return escapeHtml(url);
    }

    return '#';
  } catch (e) {
    // If it's completely unparseable, return empty or #
    return '#';
  }
}
