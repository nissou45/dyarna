import { PdfData, renderPdfHtml } from './itinerary-pdf.template';

const PDF_CACHE_TTL_MS = 5 * 60 * 1000;
const PDF_CACHE_MAX = 50;

interface CacheEntry {
  buffer: Buffer;
  updatedAt: string;
  cachedAt: number;
}

const pdfCache = new Map<string, CacheEntry>();

function evictIfNeeded(): void {
  if (pdfCache.size < PDF_CACHE_MAX) return;
  let oldestKey: string | null = null;
  let oldestTime = Infinity;
  for (const [key, entry] of pdfCache) {
    if (entry.cachedAt < oldestTime) {
      oldestTime = entry.cachedAt;
      oldestKey = key;
    }
  }
  if (oldestKey) pdfCache.delete(oldestKey);
}

export async function generatePdf(data: PdfData, cacheKey: string): Promise<Buffer> {
  const cached = pdfCache.get(cacheKey);
  if (cached && cached.updatedAt === data.generatedAt) {
    const age = Date.now() - new Date(data.generatedAt).getTime();
    if (age < PDF_CACHE_TTL_MS) {
      return cached.buffer;
    }
  }

  const html = renderPdfHtml(data);
  const puppeteer: any = await eval('import("puppeteer")');
  let browser;

  try {
    browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });

    const pdfBytes = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });

    const buffer = Buffer.from(pdfBytes);
    evictIfNeeded();
    pdfCache.set(cacheKey, { buffer, updatedAt: data.generatedAt, cachedAt: Date.now() });

    return buffer;
  } finally {
    if (browser) await browser.close();
  }
}

export function invalidatePdfCache(cacheKey: string): void {
  pdfCache.delete(cacheKey);
}
