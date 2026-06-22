import puppeteer from 'puppeteer';
import { PdfData, renderPdfHtml } from './itinerary-pdf.template';

const PDF_CACHE_TTL_MS = 5 * 60 * 1000;

const pdfCache = new Map<string, { buffer: Buffer; updatedAt: string }>();

export async function generatePdf(data: PdfData, cacheKey: string): Promise<Buffer> {
  const cached = pdfCache.get(cacheKey);
  if (cached && cached.updatedAt === data.generatedAt) {
    const age = Date.now() - new Date(data.generatedAt).getTime();
    if (age < PDF_CACHE_TTL_MS) {
      return cached.buffer;
    }
  }

  const html = renderPdfHtml(data);
  let browser;

  try {
    browser = await puppeteer.launch({
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
    pdfCache.set(cacheKey, { buffer, updatedAt: data.generatedAt });

    return buffer;
  } finally {
    if (browser) await browser.close();
  }
}

export function invalidatePdfCache(cacheKey: string): void {
  pdfCache.delete(cacheKey);
}
