import { logger } from '../../utils/logger';
import { CITIES, type City } from '../../data/cities';
import { fetchWikiSummary } from './providers/wikipedia-summary.provider';
import { fetchCommonsImage } from './providers/commons-image.provider';

export interface CityContentResult {
  id: string;
  name: string;
  status: 'success' | 'partial' | 'failed';
  shortDescription: string | null;
  thumbnailUrl: string | null;
  imageAttributionUrl: string | null;
  wikiSourceUrl: string | null;
  detail: string;
}

export interface FillReport {
  total: number;
  success: number;
  partial: number;
  failed: number;
  results: CityContentResult[];
}

async function fillOneCity(city: City): Promise<CityContentResult> {
  // Fetch sequentially to be polite to APIs
  const summary = await fetchWikiSummary({ name: city.name, id: city.id, region: city.region, category: city.category });
  await new Promise((r) => setTimeout(r, 500));
  const image = await fetchCommonsImage(city.name, city.lat, city.lng);

  const hasText = !!summary?.shortDescription;
  const hasImage = !!image;

  const missing: string[] = [];
  if (!hasText) missing.push('description');
  if (!hasImage) missing.push('image');

  let status: 'success' | 'partial' | 'failed' = 'failed';
  let detail = '';
  if (hasText && hasImage) {
    status = 'success';
    detail = 'Ok';
  } else if (hasText || hasImage) {
    status = 'partial';
    detail = `Missing: ${missing.join(', ')}`;
  } else {
    detail = 'No Wikipedia summary and no Commons image found';
  }

  return {
    id: city.id,
    name: city.name,
    status,
    shortDescription: summary?.shortDescription ?? null,
    thumbnailUrl: image?.url ?? null,
    imageAttributionUrl: image?.descriptionUrl ?? null,
    wikiSourceUrl: summary?.sourceUrl ?? null,
    detail,
  };
}

export async function fillContentForCities(ids: string[]): Promise<FillReport> {
  const cities = ids
    .map((id) => CITIES[id])
    .filter((c): c is City => c !== undefined);

  const results: CityContentResult[] = [];

  for (const city of cities) {
    logger.info({ name: city.name }, 'Filling content');
    const result = await fillOneCity(city);
    results.push(result);
    // Rate-limit: 1s between cities
    await new Promise((r) => setTimeout(r, 1000));
  }

  const success = results.filter((r) => r.status === 'success').length;
  const partial = results.filter((r) => r.status === 'partial').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  return { total: cities.length, success, partial, failed, results };
}
