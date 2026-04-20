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
  const trimmed = String(url).trim();
  try {
    const parsed = new URL(trimmed, 'https://example.com');
    if (['http:', 'https:', 'mailto:', 'tel:', 'whatsapp:'].includes(parsed.protocol)) {
      return trimmed;
    }
    return '#';
  } catch {
    // If it can't be parsed (e.g., relative path, or just a bad URL), default to #
    // Unless it starts with a safe relative protocol like '/'
    if (trimmed.startsWith('/')) {
        return trimmed;
    }
    return '#';
  }
}
