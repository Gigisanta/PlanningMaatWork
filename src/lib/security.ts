export function escapeHtml(unsafe: string | null | undefined): string {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function safeUrl(url: string | null | undefined): string {
  if (!url) return '#';
  // Strip control characters and whitespace
  let strUrl = String(url).replace(/[\u0000-\u001F\u007F-\u009F\s]+/g, '');

  if (strUrl.startsWith('/') || strUrl.startsWith('#') || strUrl.startsWith('?')) {
    return strUrl;
  }

  try {
    const parsed = new URL(strUrl);
    const protocol = parsed.protocol.toLowerCase();
    if (['http:', 'https:', 'mailto:', 'tel:', 'whatsapp:'].includes(protocol)) {
      return strUrl;
    }
    return '#';
  } catch {
    if (strUrl.toLowerCase().startsWith('javascript:')) {
      return '#';
    }
    return strUrl;
  }
}
