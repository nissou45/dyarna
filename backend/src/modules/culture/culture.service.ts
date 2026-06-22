import { CityCulture, ICityCulture } from './culture.model';
import { fetchCitySummary } from './providers/wikipedia.provider';
import { structureContent } from './providers/structurer.service';
import { getCityById } from './cities.data';
import { AppError } from '../../utils/AppError';

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export class CultureService {
  async getByCityId(cityId: string): Promise<ICityCulture | null> {
    const cached = await CityCulture.findOne({ cityId });

    if (cached) {
      if (cached.isManuallyEdited) return cached;
      const age = Date.now() - cached.lastFetchedAt.getTime();
      if (age < CACHE_TTL_MS) return cached;
    }

    const city = getCityById(cityId);
    if (!city) {
      throw new AppError('Ville introuvable.', 404);
    }

    const raw = await fetchCitySummary(city.name);
    if (!raw) {
      if (cached) return cached;
      return null;
    }

    const { content } = await structureContent(raw);

    const now = new Date();
    const doc = await CityCulture.findOneAndUpdate(
      { cityId },
      {
        cityId,
        history: content.history,
        traditions: content.traditions,
        legend: content.legend,
        cuisine: content.cuisine,
        sourceUrl: raw.sourceUrl,
        lastFetchedAt: now,
        isManuallyEdited: false,
      },
      { upsert: true, new: true },
    );

    return doc;
  }

  async refresh(cityId: string): Promise<ICityCulture> {
    const city = getCityById(cityId);
    if (!city) {
      throw new AppError('Ville introuvable.', 404);
    }

    const current = await CityCulture.findOne({ cityId });
    if (current?.isManuallyEdited) {
      throw new AppError('Le contenu a été édité manuellement. Utilisez PATCH pour le modifier.', 409);
    }

    const raw = await fetchCitySummary(city.name);
    if (!raw) {
      throw new AppError('Contenu Wikipedia introuvable pour cette ville.', 404);
    }

    const { content } = await structureContent(raw);

    const now = new Date();
    const doc = await CityCulture.findOneAndUpdate(
      { cityId },
      {
        cityId,
        history: content.history,
        traditions: content.traditions,
        legend: content.legend,
        cuisine: content.cuisine,
        sourceUrl: raw.sourceUrl,
        lastFetchedAt: now,
        isManuallyEdited: false,
      },
      { upsert: true, new: true },
    );

    return doc;
  }

  async updateManually(
    cityId: string,
    data: Partial<Pick<ICityCulture, 'history' | 'traditions' | 'legend' | 'cuisine' | 'sourceUrl'>>,
  ): Promise<ICityCulture> {
    const doc = await CityCulture.findOneAndUpdate(
      { cityId },
      {
        ...data,
        cityId,
        isManuallyEdited: true,
        lastFetchedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    return doc;
  }
}

export const cultureService = new CultureService();
