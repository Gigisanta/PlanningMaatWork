export function escapeHtml(unsafe: string | null | undefined): string {
    if (!unsafe) return '';
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
    const parsedUrl = new URL(url, 'http://localhost'); // Provide a base for relative URLs
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'mailto:' || parsedUrl.protocol === 'tel:' || parsedUrl.protocol === 'whatsapp:') {
      return url;
    }
    return '#';
  } catch (e) {
    // Invalid URL format
    return '#';
  }
}
