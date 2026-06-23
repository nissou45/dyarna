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

export interface WikiCityInput {
  name: string;
  id: string;
  region: string;
  category: string;
}

const GEO_NAME_FALLBACKS: Record<string, string[]> = {
  'ait-bouguemez': ['Vallée des Aït Bouguemez', "Vallée d'Aït Bouguemez"],
  'amtoudi': ['Agadir Id Aïssa', 'Amtoudi oasis'],
  'aourir': ['Banana Village Aourir'],
  'moulay-bouzerktoune': ['Moulay Bouzerktoune plage'],
  'oukaimeden': ['Oukaimeden', 'Station de ski Oukaimeden'],
  'rissani': ['Tafilalet'],
  'setti-fatma': ["Vallée de l'Ourika", 'Ourika'],
  'sidi-kaouki': ['Plage Sidi Kaouki'],
  'tafedna': ['Tafedna plage'],
  'talioune-kasbah': ['Taliouine', 'Tioute'],
};

const CATEGORY_QUALIFIER: Record<string, string> = {
  montagne: 'Village de montagne situé dans une vallée du Haut Atlas',
  desert: 'Localité présaharienne',
  cotiere: 'Village côtier sur la côte atlantique',
  ville: 'Ville',
  moderne: 'Localité',
  historique: 'Localité historique',
};

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

async function fetchSummary(title: string): Promise<WikiSummaryResult | null> {
  try {
    const encoded = encodeURIComponent(title);
    const response = await fetchWithTimeout(`${BASE_URL}/${encoded}`);
    if (response.status === 404) return null;
    if (!response.ok) return null;

    const data = (await response.json()) as {
      type?: string;
      title?: string;
      extract?: string;
      content_urls?: { desktop?: { page?: string } };
    };

    if (data.type === 'disambiguation') return null;

    const extract = data.extract || '';
    if (!extract) return null;

    return {
      title: data.title || title,
      extract,
      sourceUrl:
        data.content_urls?.desktop?.page ||
        `https://fr.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      shortDescription: truncateToSentences(extract),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn({ title, error: message }, 'Wiki summary fetch failed');
    return null;
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
  if (!result) {
    result = text.substring(0, maxChars).trim();
    const lastSpace = result.lastIndexOf(' ');
    if (lastSpace > 0) result = result.substring(0, lastSpace);
  }
  return result.trim();
}

function generateOrthographicVariants(name: string): string[] {
  const variants: string[] = [];
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
  if (name.includes('-')) {
    variants.push(name.replace(/-/g, ' '));
  }
  const noAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (noAccents !== name) variants.push(noAccents);
  return variants;
}

function buildAttempts(name: string): string[] {
  const attempts = [
    name,
    `${name} (Maroc)`,
    ...generateOrthographicVariants(name),
    ...generateOrthographicVariants(name).map((v) => `${v} (Maroc)`),
  ];
  const seen = new Set<string>();
  return attempts.filter((a) => {
    if (seen.has(a)) return false;
    seen.add(a);
    return true;
  });
}

async function searchFallback(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://fr.wikipedia.org/api/rest_v1/search/page?q=${encodeURIComponent(query)}&limit=1`;
    const searchRes = await fetchWithTimeout(searchUrl);
    if (!searchRes.ok) return null;

    const searchData = (await searchRes.json()) as {
      pages?: { title: string; key?: string }[];
    };
    if (!searchData.pages || searchData.pages.length === 0) return null;

    const foundTitle = searchData.pages[0].title;
    logger.info({ query, foundTitle }, 'Wiki search fallback found title');
    return foundTitle;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn({ query, error: message }, 'Wiki search fallback failed');
    return null;
  }
}

/**
 * Level 1: Try named geographic features associated with the city
 * (valleys, mountains, beaches, districts, etc.)
 */
async function tryGeoFallback(city: WikiCityInput): Promise<WikiSummaryResult | null> {
  const names = GEO_NAME_FALLBACKS[city.id];
  if (!names || names.length === 0) return null;

  for (const geoName of names) {
    // Try the geo name directly
    const result = await fetchSummary(geoName);
    if (result) {
      logger.info({ cityName: city.name, geoName }, 'Geo fallback succeeded');
      return result;
    }

    // Try search fallback for the geo name
    const foundTitle = await searchFallback(geoName + ' Maroc');
    if (foundTitle) {
      const result2 = await fetchSummary(foundTitle);
      if (result2) {
        logger.info({ cityName: city.name, geoName, foundTitle }, 'Geo search fallback succeeded');
        return result2;
      }
    }
  }

  return null;
}

/**
 * Level 2: Fetch the Wikipedia page of the administrative region and reformulate
 * its extract to keep the city as the subject.
 */
async function tryRegionFallback(city: WikiCityInput): Promise<WikiSummaryResult | null> {
  const regionAttempts = [
    city.region,
    `Région de ${city.region}`,
    `Région ${city.region}`,
  ];

  for (const regionName of regionAttempts) {
    const result = await fetchSummary(regionName);
    if (!result) continue;

    // Reformulate: prepend the city context before the region description
    const firstSentence = result.extract.match(/[^.!?]*[.!?]/)?.[0] || result.extract;
    const rest = result.extract.slice(firstSentence.length).trim();

    const reformulated = `${city.name} se situe dans la région de ${city.region}. ${firstSentence}${rest ? ' ' + rest : ''}`;

    return {
      title: city.name,
      extract: reformulated,
      sourceUrl: result.sourceUrl,
      shortDescription: truncateToSentences(reformulated),
    };
  }

  return null;
}

/**
 * Level 3: Generate a short sentence from category + region.
 */
function tryCategoryFallback(city: WikiCityInput): WikiSummaryResult {
  const qualifier = CATEGORY_QUALIFIER[city.category] || 'Localité';
  const extract = `${qualifier}, dans la région de ${city.region}.`;

  const regionFormats = [
    city.region,
    `Région de ${city.region}`,
  ];

  return {
    title: city.name,
    extract,
    sourceUrl: null as unknown as string,
    shortDescription: extract,
  };
}

export async function fetchWikiSummary(city: WikiCityInput): Promise<WikiSummaryResult | null> {
  // Primary: try exact city name matches
  const attempts = buildAttempts(city.name);

  for (const name of attempts) {
    const result = await fetchSummary(name);
    if (result) return result;
  }

  // Search API fallback
  const foundTitle = await searchFallback(city.name + ' Maroc');
  if (foundTitle) {
    const result = await fetchSummary(foundTitle);
    if (result) return result;
  }

  // Level 1: geographic feature names (valleys, beaches, districts, etc.)
  const geoResult = await tryGeoFallback(city);
  if (geoResult) return geoResult;

  // Level 2: administrative region Wikipedia page, reformulated
  const regionResult = await tryRegionFallback(city);
  if (regionResult) return regionResult;

  // Level 3: generated sentence from category + region
  return tryCategoryFallback(city);
}
