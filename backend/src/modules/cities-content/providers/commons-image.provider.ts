import { logger } from '../../../utils/logger';

const API_URL = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'Dyarna/1.0 (city-content-filler)';
const TIMEOUT_MS = 5000;
const MIN_WIDTH = 800;

const EXCLUDE_PATTERNS = /map|logo|flag|coat_of_arms|blason|drapeau|carte|armoiries/i;

export interface CommonsImageResult {
  url: string;
  width: number;
  height: number;
  descriptionUrl: string;
  fileName: string;
}

async function fetchWithTimeout(url: string, attempt: number = 0): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    });

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
      const waitMs = Math.min((retryAfter + 1) * 1000, 15000);
      logger.warn({ url, waitMs, attempt }, 'Commons 429 rate limited, waiting');
      clearTimeout(timer);
      await new Promise((r) => setTimeout(r, waitMs));
      return fetchWithTimeout(url, attempt + 1);
    }

    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function searchByName(cityName: string): Promise<CommonsImageResult | null> {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: cityName,
    gsrnamespace: '6',
    prop: 'imageinfo',
    iiprop: 'url|size',
    format: 'json',
    origin: '*',
  });

  try {
    const response = await fetchWithTimeout(`${API_URL}?${params}`);
    if (!response.ok) return null;

    const data = (await response.json()) as {
      query?: { pages?: Record<string, { title: string; imageinfo?: { url: string; width: number; height: number; descriptionurl: string }[] }> };
    };

    const pages = data.query?.pages;
    if (!pages) return null;

    const candidates: CommonsImageResult[] = [];

    for (const page of Object.values(pages)) {
      const title = page.title || '';
      if (EXCLUDE_PATTERNS.test(title)) continue;

      const info = page.imageinfo?.[0];
      if (!info || !info.url || info.width < MIN_WIDTH) continue;

      candidates.push({
        url: info.url,
        width: info.width,
        height: info.height,
        descriptionUrl: info.descriptionurl,
        fileName: title,
      });
    }

    // Return the widest image
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.width - a.width);
    return candidates[0];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn({ cityName, error: message }, 'Commons name search failed');
    return null;
  }
}

async function searchByCoords(
  cityName: string,
  lat: number,
  lng: number,
): Promise<CommonsImageResult | null> {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'geosearch',
    ggscoord: `${lat}|${lng}`,
    ggsradius: '10000',
    ggslimit: '10',
    prop: 'imageinfo',
    iiprop: 'url|size',
    format: 'json',
    origin: '*',
  });

  try {
    const response = await fetchWithTimeout(`${API_URL}?${params}`);
    if (!response.ok) return null;

    const data = (await response.json()) as {
      query?: { pages?: Record<string, { title: string; imageinfo?: { url: string; width: number; height: number; descriptionurl: string }[] }> };
    };

    const pages = data.query?.pages;
    if (!pages) return null;

    const candidates: CommonsImageResult[] = [];

    for (const page of Object.values(pages)) {
      const title = page.title || '';
      if (EXCLUDE_PATTERNS.test(title)) continue;

      const info = page.imageinfo?.[0];
      if (!info || !info.url || info.width < MIN_WIDTH) continue;

      candidates.push({
        url: info.url,
        width: info.width,
        height: info.height,
        descriptionUrl: info.descriptionurl,
        fileName: title,
      });
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.width - a.width);
    return candidates[0];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn({ cityName, lat, lng, error: message }, 'Commons geo search failed');
    return null;
  }
}

export async function fetchCommonsImage(
  cityName: string,
  lat?: number,
  lng?: number,
): Promise<CommonsImageResult | null> {
  const byName = await searchByName(cityName);
  if (byName) return byName;

  if (lat !== undefined && lng !== undefined) {
    const byGeo = await searchByCoords(cityName, lat, lng);
    if (byGeo) return byGeo;
  }

  return null;
}
