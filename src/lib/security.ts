export function escapeHtml(unsafe: string | null | undefined): string {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function safeUrl(url: string | null | undefined): string {
  if (!url) return '#';

  // Strip control characters to prevent HTML/XSS bypasses
  let sanitized = String(url).replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();

  if (!sanitized) return '#';

  // Allow relative URLs, anchors, and query params
  if (sanitized.startsWith('/') || sanitized.startsWith('#') || sanitized.startsWith('?')) {
    return sanitized;
  }

  // Try to parse as URL
  try {
    const parsedUrl = new URL(sanitized);
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'whatsapp:'];
    if (allowedProtocols.includes(parsedUrl.protocol)) {
      return sanitized;
    }
    return '#';
  } catch (e) {
    // If it fails to parse but doesn't have a protocol, it might be a domain (e.g. "example.com")
    const colonIndex = sanitized.indexOf(':');
    if (colonIndex === -1) {
      return sanitized;
    }
    return '#';
  }
}
