interface CacheEntry {
  data: unknown;
  html: string;
  timestamp: number;
}

const pdfCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

export function getCachedPDF(data: unknown): string | null {
  const key = JSON.stringify(data);
  const entry = pdfCache.get(key);
  
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.html;
  }
  
  return null;
}

export function cachePDF(data: unknown, html: string): void {
  const key = JSON.stringify(data);
  pdfCache.set(key, {
    data,
    html,
    timestamp: Date.now()
  });
}

export function clearPDFCache(): void {
  pdfCache.clear();
}
