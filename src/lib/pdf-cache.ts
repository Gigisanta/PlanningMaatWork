interface CacheEntry {
  data: any;
  html: string;
  timestamp: number;
}

const pdfCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

export function getCachedPDF(data: any): string | null {
  const key = JSON.stringify(data);
  const entry = pdfCache.get(key);
  
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.html;
  }
  
  return null;
}

export function cachePDF(data: any, html: string): void {
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
