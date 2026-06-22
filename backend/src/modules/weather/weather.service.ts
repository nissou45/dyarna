import { WeatherCache, IWeatherCache, CurrentWeather } from './weather.model';
import { fetchCurrentWeather } from './providers/openweather.provider';
import { getClimateData, MonthlyClimate } from './data/climate-reference';
import { CITIES } from '../../data/cities';
import { AppError } from '../../utils/AppError';

const CACHE_TTL_MS = 30 * 60 * 1000;

export interface MonthScore {
  month: number;
  score: number;
  label: 'ideal' | 'good' | 'average' | 'avoid';
}

export interface BestSeasonResult {
  bestMonths: number[];
  months: MonthScore[];
}

export function calculateMonthScore(m: MonthlyClimate): number {
  const tempAvg = (m.avgTempMax + m.avgTempMin) / 2;
  let score = 50;

  // Température idéale entre 18 et 28°C
  if (tempAvg >= 18 && tempAvg <= 28) {
    score += 25;
  } else if (tempAvg > 28 && tempAvg <= 35) {
    score += 10;
  } else if (tempAvg > 35) {
    score -= 30;
  } else if (tempAvg >= 10 && tempAvg < 18) {
    score += 10;
  } else {
    score -= 20;
  }

  // Pluie : pénalité progressive
  if (m.avgRainfallMm <= 5) score += 15;
  else if (m.avgRainfallMm <= 15) score += 10;
  else if (m.avgRainfallMm <= 40) score += 0;
  else if (m.avgRainfallMm <= 80) score -= 15;
  else score -= 30;

  // Ensoleillement
  if (m.sunHours >= 300) score += 15;
  else if (m.sunHours >= 250) score += 8;
  else if (m.sunHours >= 200) score += 0;
  else score -= 10;

  return Math.max(0, Math.min(100, score));
}

export function getMonthLabel(score: number): 'ideal' | 'good' | 'average' | 'avoid' {
  if (score >= 75) return 'ideal';
  if (score >= 55) return 'good';
  if (score >= 35) return 'average';
  return 'avoid';
}

export function computeBestSeason(climate: { monthly: MonthlyClimate[] }): BestSeasonResult {
  const months = climate.monthly.map((m) => {
    const score = calculateMonthScore(m);
    return { month: m.month, score, label: getMonthLabel(score) };
  });

  const sorted = [...months].sort((a, b) => b.score - a.score);
  const bestMonths = sorted.slice(0, 4).map((m) => m.month).sort();

  return { bestMonths, months };
}

export class WeatherService {
  async getCurrentWeather(cityId: string): Promise<{
    current: CurrentWeather;
    stale: boolean;
  }> {
    const city = CITIES[cityId];
    if (!city) throw new AppError('Ville introuvable.', 404);

    const cached = await WeatherCache.findOne({ cityId });
    if (cached) {
      const age = Date.now() - cached.fetchedAt.getTime();
      if (age < CACHE_TTL_MS) {
        return { current: cached.current, stale: false };
      }
    }

    const { lat, lng } = CITIES[cityId];
    if (!lat) throw new AppError('Coordonnées de la ville introuvables.', 500);

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      if (cached) return { current: cached.current, stale: true };
      throw new AppError('Service météo temporairement indisponible.', 503);
    }

    try {
      const raw = await fetchCurrentWeather(lat, lng, apiKey);
      const now = new Date();

      await WeatherCache.findOneAndUpdate(
        { cityId },
        { cityId, current: raw, fetchedAt: now },
        { upsert: true, new: true },
      );

      return { current: raw, stale: false };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[WeatherService] OpenWeather fetch failed for "${cityId}": ${message}`);
      if (cached) return { current: cached.current, stale: true };
      throw new AppError('Service météo temporairement indisponible.', 503);
    }
  }

  async getBestSeason(cityId: string): Promise<BestSeasonResult> {
    const climate = getClimateData(cityId);
    if (!climate) throw new AppError('Données climatiques introuvables pour cette ville.', 404);
    return computeBestSeason(climate);
  }

  async getFullWeatherInfo(cityId: string): Promise<{
    current: CurrentWeather | null;
    stale: boolean;
    bestSeason: BestSeasonResult;
  }> {
    const [weatherResult, bestSeason] = await Promise.all([
      this.getCurrentWeather(cityId).catch(() => ({ current: null as CurrentWeather | null, stale: false })),
      this.getBestSeason(cityId),
    ]);

    return {
      current: weatherResult.current,
      stale: weatherResult.stale,
      bestSeason,
    };
  }


}

export const weatherService = new WeatherService();
