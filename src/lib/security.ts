export function escapeHtml(unsafe: string | number | undefined | null): string {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function safeUrl(url: string | undefined | null): string {
  if (!url) return '#';
  const sanitized = String(url).trim();
  if (/^(javascript|data|vbscript):/i.test(sanitized)) {
    return '#';
  }
  return sanitized;
}
