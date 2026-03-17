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
  const strUrl = String(url).trim();
  if (/^javascript:/i.test(strUrl) || /^vbscript:/i.test(strUrl)) {
    return '#';
  }
  return strUrl;
}
