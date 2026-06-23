import { logger } from '../../../utils/logger';

const BASE_URL = 'https://fr.wikipedia.org/api/rest_v1/page/summary';
const USER_AGENT = 'Dyarna/1.0 (city-content-filler)';
const TIMEOUT_MS = 5000;

export interface WikiSummaryResult {
  title: string;
  extract: string;
  sourceUrl: string;
  shortDescription: string;
}

async function fetchWithTimeout(url: string, attempt: number = 0): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    });

    // Rate limited: wait and retry
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
      const waitMs = Math.min((retryAfter + 1) * 1000, 15000);
      logger.warn({ url, waitMs, attempt }, 'Wiki 429 rate limited, waiting');
      clearTimeout(timer);
      await new Promise((r) => setTimeout(r, waitMs));
      return fetchWithTimeout(url, attempt + 1);
    }

    return response;
  } finally {
    clearTimeout(timer);
  }
}

function truncateToSentences(text: string, maxChars: number = 200): string {
  if (!text) return '';
  const sentences = text.match(/[^.!?]*[.!?]/g) || [text];
  let result = '';
  for (const s of sentences) {
    if ((result + s).length > maxChars) break;
    result += s;
  }
  // If no sentence-ending punctuation was found, return truncated raw text
  if (!result) {
    result = text.substring(0, maxChars).trim();
    // Cut at last space to avoid word-break
    const lastSpace = result.lastIndexOf(' ');
    if (lastSpace > 0) result = result.substring(0, lastSpace);
  }
  return result.trim();
}

function generateOrthographicVariants(name: string): string[] {
  const variants: string[] = [];
  // Ajout/suppression double lettre (ex: Asilah → Assilah)
  const doublePatterns = [
    [/s([aeiouàâäéèêëïîôöùûü])/g, 'ss$1'],
    [/ss([aeiouàâäéèêëïîôöùûü])/g, 's$1'],
    [/l([aeiouàâäéèêëïîôöùûü])/g, 'll$1'],
    [/ll([aeiouàâäéèêëïîôöùûü])/g, 'l$1'],
  ];
  for (const [pattern, replacement] of doublePatterns) {
    const v = name.replace(pattern, replacement as string);
    if (v !== name) variants.push(v);
  }
  // Suppression tirets (ex: Aït-Benhaddou → Aït Benhaddou)
  if (name.includes('-')) {
    variants.push(name.replace(/-/g, ' '));
  }
  // Variantes d'accents: supprimer les accents
  const noAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (noAccents !== name) variants.push(noAccents);
  return variants;
}

export async function fetchWikiSummary(cityName: string): Promise<WikiSummaryResult | null> {
  const attempts = [
    cityName,
    `${cityName} (Maroc)`,
    ...generateOrthographicVariants(cityName),
    ...generateOrthographicVariants(cityName).map((v) => `${v} (Maroc)`),
  ];
  // Deduplicate while preserving order
  const seen = new Set<string>();
  const uniqueAttempts = attempts.filter((a) => {
    if (seen.has(a)) return false;
    seen.add(a);
    return true;
  });

  for (const name of uniqueAttempts) {
    const encoded = encodeURIComponent(name);
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/${encoded}`);

      if (response.status === 404) continue;
      if (!response.ok) {
        logger.warn({ cityName, status: response.status }, 'Wiki summary HTTP error');
        continue;
      }

      const data = (await response.json()) as {
        type?: string;
        title?: string;
        extract?: string;
        content_urls?: { desktop?: { page?: string } };
      };

      if (data.type === 'disambiguation') {
        logger.warn({ cityName }, 'Wiki disambiguation page, trying fallback');
        continue;
      }

      const extract = data.extract || '';
      const shortDescription = truncateToSentences(extract);

      return {
        title: data.title || cityName,
        extract,
        sourceUrl:
          data.content_urls?.desktop?.page ||
          `https://fr.wikipedia.org/wiki/${encodeURIComponent(cityName)}`,
        shortDescription,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.warn({ cityName, attempt: name, error: message }, 'Wiki summary fetch failed');
    }
  }

  // Final fallback: search API — find the title then fetch summary (handles accents, alternate spellings)
  try {
    const searchUrl = `https://fr.wikipedia.org/api/rest_v1/search/page?q=${encodeURIComponent(cityName + ' Maroc')}&limit=1`;
    const searchRes = await fetchWithTimeout(searchUrl);
    if (searchRes.ok) {
      const searchData = (await searchRes.json()) as {
        pages?: { title: string; key?: string }[];
      };
      if (searchData.pages && searchData.pages.length > 0) {
        const foundTitle = searchData.pages[0].title;
        logger.info({ cityName, foundTitle }, 'Wiki search fallback found title');
        // Fetch clean summary for the found title
        const encoded = encodeURIComponent(foundTitle);
        const summaryRes = await fetchWithTimeout(`${BASE_URL}/${encoded}`);
        if (summaryRes.ok) {
          const data = (await summaryRes.json()) as {
            type?: string;
            title?: string;
            extract?: string;
            content_urls?: { desktop?: { page?: string } };
          };
          if (data.type !== 'disambiguation' && data.extract) {
            const shortDescription = truncateToSentences(data.extract);
            return {
              title: data.title || foundTitle,
              extract: data.extract,
              sourceUrl:
                data.content_urls?.desktop?.page ||
                `https://fr.wikipedia.org/wiki/${encoded}`,
              shortDescription,
            };
          }
        }
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn({ cityName, error: message }, 'Wiki search fallback failed');
  }

  return null;
}
