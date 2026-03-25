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
  if (url == null) return '';
  const strUrl = String(url).trim();

  // Remove control characters (including zero-width spaces, newlines, etc)
  const cleanUrl = strUrl.replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, '');

  try {
    const parsedUrl = new URL(cleanUrl, 'http://localhost');
    const protocol = parsedUrl.protocol.toLowerCase();

    if (['http:', 'https:', 'mailto:', 'tel:', 'whatsapp:'].includes(protocol)) {
      return cleanUrl;
    }
  } catch (e) {
    // If it's a relative URL or anchor, it won't parse with URL but might be safe
    if (cleanUrl.startsWith('/') || cleanUrl.startsWith('#') || cleanUrl.startsWith('?')) {
      return cleanUrl;
    }
  }

  return '#';
}
