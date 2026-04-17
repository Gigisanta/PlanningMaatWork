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
  try {
    const parsed = new URL(url, 'http://localhost');
    if (['http:', 'https:', 'mailto:', 'tel:', 'whatsapp:', 'blob:'].includes(parsed.protocol)) {
      return url;
    }
  } catch (e) {
    if (url.startsWith('/') || url.startsWith('?')) return url;
  }
  return '#';
}
