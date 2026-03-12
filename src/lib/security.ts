export function escapeHtml(unsafe: string | number): string {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function safeUrl(url: string | undefined | null): string {
  if (!url) return '#';
  const trimmed = url.trim();
  const lowerUrl = trimmed.toLowerCase();

  if (
    lowerUrl.startsWith('http://') ||
    lowerUrl.startsWith('https://') ||
    lowerUrl.startsWith('mailto:') ||
    lowerUrl.startsWith('tel:') ||
    lowerUrl.startsWith('/') ||
    lowerUrl.startsWith('#') ||
    lowerUrl.startsWith('?')
  ) {
    return escapeHtml(trimmed);
  }

  // Si no tiene protocolo y parece un dominio, agregamos https://
  if (/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(trimmed)) {
    return escapeHtml('https://' + trimmed);
  }

  return '#';
}
