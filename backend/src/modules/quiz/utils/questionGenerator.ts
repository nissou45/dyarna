import { getClimateData } from '../../weather/data/climate-reference';
import { CityCulture } from '../../culture/culture.model';
import { Photo } from '../../gallery/photo.model';
import { getAllCityIds, getCityById, CITIES } from '../../../data/cities';
import type { City } from '../../../data/cities';



function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateWrongAnswers(
  correctCityId: string,
  correctCategory: string,
  count: number,
): { id: string; name: string }[] {
  const allCities = Object.values(CITIES);

  const sameCategory = allCities.filter(
    (c) => c.id !== correctCityId && c.category === correctCategory,
  );

  let pool: City[];
  if (sameCategory.length >= count) {
    pool = shuffleArray(sameCategory);
  } else {
    const rest = shuffleArray(
      allCities.filter((c) => c.id !== correctCityId && c.category !== correctCategory),
    );
    pool = [...shuffleArray(sameCategory), ...rest];
  }

  return pool.slice(0, count).map((c) => ({ id: c.id, name: c.name }));
}

function buildChoices(
  correctCityId: string,
): { id: string; name: string }[] {
  const correct = CITIES[correctCityId];
  const wrong = generateWrongAnswers(correctCityId, correct.category, 3);
  return shuffleArray([{ id: correctCityId, name: correct.name }, ...wrong]);
}

function generatePhotoClue(cityId: string, approvedPhotos: Record<string, string>): string | null {
  return approvedPhotos[cityId] || null;
}

function generateCultureClue(culture: {
  traditions?: string[];
  legend?: { title: string; content: string } | null;
  history?: string;
}): string {
  const sources: string[] = [];

  if (culture.traditions && culture.traditions.length > 0) {
    const tradition = pickRandom(culture.traditions);
    if (tradition && tradition.length < 120) {
      sources.push(tradition);
    }
  }

  if (culture.legend?.content) {
    const snippet = culture.legend.content.slice(0, 100).replace(/[.!?].*$/, '');
    if (snippet.length > 20) {
      sources.push(snippet);
    }
  }

  if (sources.length > 0) {
    return pickRandom(sources);
  }

  if (culture.history) {
    const firstSentence = culture.history.split(/[.!?]/).find((s) => s.trim().length > 30);
    if (firstSentence) {
      return firstSentence.trim();
    }
  }

  return '';
}

function generateClimateClue(cityId: string): string {
  const climate = getClimateData(cityId);
  if (!climate) return '';

  const summer = climate.monthly.filter((m) => m.month >= 6 && m.month <= 8);
  const winter = climate.monthly.filter((m) => m.month === 12 || m.month <= 2);

  const avgSummerMax = summer.reduce((s, m) => s + m.avgTempMax, 0) / summer.length;
  const avgWinterMin = winter.reduce((s, m) => s + m.avgTempMin, 0) / winter.length;
  const totalRainfall = climate.monthly.reduce((s, m) => s + m.avgRainfallMm, 0);
  const sunHoursAvg = climate.monthly.reduce((s, m) => s + m.sunHours, 0) / climate.monthly.length;

  const clues: string[] = [];

  if (avgSummerMax >= 38) {
    clues.push("Cette ville est l'une des plus chaudes du Maroc en été");
  } else if (avgSummerMax <= 28) {
    clues.push('Les étés y sont remarquablement doux grâce aux vents océaniques');
  }

  if (avgWinterMin <= 1) {
    clues.push("C'est l'une des villes les plus froides du Maroc en hiver");
  }

  if (totalRainfall <= 30) {
    clues.push('C\'est une ville très aride avec moins de 30 mm de pluie par an');
  } else if (totalRainfall >= 700) {
    clues.push('C\'est l\'une des villes les plus pluvieuses du Maroc');
  }

  if (sunHoursAvg >= 320) {
    clues.push('Cette ville bénéficie d\'un ensoleillement exceptionnel toute l\'année');
  }

  if (clues.length > 0) {
    return pickRandom(clues);
  }

  return '';
}

export interface RawQuestion {
  type: 'photo' | 'culture_fact' | 'climate_fact';
  cityId: string;
  clue: string;
  choices: { id: string; name: string }[];
}

function noCityNameLeak(text: string, cityName: string): boolean {
  const nameLower = cityName.toLowerCase();
  const textLower = text.toLowerCase();
  return !textLower.includes(nameLower);
}

export async function generateQuestionSet(count: number): Promise<{
  questions: RawQuestion[];
  internalQuestions: { cityId: string; type: 'photo' | 'culture_fact' | 'climate_fact' }[];
}> {
  const allCityIds = getAllCityIds();
  const shuffledCities = shuffleArray(allCityIds);

  const approvedPhotos = await Photo.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .lean();

  const photoMap: Record<string, string> = {};
  for (const p of approvedPhotos) {
    if (!photoMap[p.cityId]) {
      photoMap[p.cityId] = p.thumbnailUrl || p.url;
    }
  }

  const cultures = await CityCulture.find({}).lean();
  const cultureMap: Record<string, {
    traditions?: string[];
    legend?: { title: string; content: string } | null;
    history?: string;
  }> = {};
  for (const c of cultures) {
    cultureMap[c.cityId] = c;
  }

  const typePool: ('photo' | 'culture_fact' | 'climate_fact')[] = [
    'photo', 'culture_fact', 'climate_fact',
  ];

  const rawQuestions: RawQuestion[] = [];
  const internalQuestions: { cityId: string; type: 'photo' | 'culture_fact' | 'climate_fact' }[] = [];

  let idx = 0;
  while (rawQuestions.length < count) {
    const cityId = shuffledCities[idx % shuffledCities.length];
    const type = typePool[idx % typePool.length];
    idx++;

    const cityMeta = CITIES[cityId];
    if (!cityMeta) continue;

    if (rawQuestions.some((q) => q.cityId === cityId)) continue;

    let clue = '';

    if (type === 'photo') {
      const photoUrl = generatePhotoClue(cityId, photoMap);
      if (!photoUrl) continue;
      clue = photoUrl;
    } else if (type === 'culture_fact') {
      const culture = cultureMap[cityId];
      if (!culture) continue;
      clue = generateCultureClue(culture);
      if (!clue || !noCityNameLeak(clue, cityMeta.name)) continue;
    } else {
      clue = generateClimateClue(cityId);
      if (!clue || !noCityNameLeak(clue, cityMeta.name)) continue;
    }

    const choices = buildChoices(cityId);

    rawQuestions.push({ type, cityId, clue, choices });
    internalQuestions.push({ cityId, type });
  }

  return { questions: rawQuestions, internalQuestions };
}
