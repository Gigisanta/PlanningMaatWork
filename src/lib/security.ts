export function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function safeUrl(url: string | null | undefined): string {
  if (!url) return '#';
  const strUrl = String(url).trim();

  // Allow relative URLs and anchors
  if (strUrl.startsWith('/') || strUrl.startsWith('#')) {
    return strUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Strip control characters
  }

  try {
    const parsed = new URL(strUrl);
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'whatsapp:'];
    if (allowedProtocols.includes(parsed.protocol)) {
       return strUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    }
  } catch (e) {
    // If it's not a valid URL format but looks like a safe mailto/tel/whatsapp that didn't parse
    // (some environments might not parse mailto/tel properly with new URL())
    if (/^(mailto|tel|whatsapp):/i.test(strUrl)) {
      return strUrl.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    }
  }
  return '#';
}
