import { logger } from '../../../utils/logger';

export interface RawWikiContent {
  title: string;
  extract: string;
  sourceUrl: string;
}

const BASE_URL = 'https://fr.wikipedia.org/api/rest_v1/page/summary';

async function fetchWithTimeout(url: string, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Dyarna/1.0 (culture-module)' },
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchCitySummary(cityName: string): Promise<RawWikiContent | null> {
  const encoded = encodeURIComponent(cityName);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/${encoded}`);

      if (response.status === 404) return null;

      if (!response.ok) {
        logger.warn(`[WikipediaProvider] HTTP ${response.status} for "${cityName}" (attempt ${attempt + 1})`);
        if (attempt === 0) continue;
        return null;
      }

      const data = await response.json() as { type?: string; title?: string; extract?: string; content_urls?: { desktop?: { page?: string } } };

      if (data.type === 'disambiguation') {
        logger.warn(`[WikipediaProvider] Disambiguation page for "${cityName}"`);
        return null;
      }

      return {
        title: data.title || cityName,
        extract: data.extract || '',
        sourceUrl: data.content_urls?.desktop?.page || `https://fr.wikipedia.org/wiki/${encoded}`,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.warn(`[WikipediaProvider] Error fetching "${cityName}" (attempt ${attempt + 1}): ${message}`);
      if (attempt === 0) continue;
      return null;
    }
  }

  return null;
}
