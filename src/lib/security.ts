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
  const urlStr = String(url);
  // Basic check for javascript/vbscript/data protocols
  if (/^(?:javascript|vbscript|data):/i.test(urlStr)) {
    return '#';
  }
  return urlStr;
}
