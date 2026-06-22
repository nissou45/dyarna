import { City } from '../data/cities';

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function searchCities(query: string, allCities: City[]): City[] {
  const q = normalize(query).trim();
  if (q.length < 2) return [];

  const startMatches: City[] = [];
  const anywhereMatches: City[] = [];

  for (const city of allCities) {
    const name = normalize(city.name);
    if (name.startsWith(q)) {
      startMatches.push(city);
    } else if (name.includes(q)) {
      anywhereMatches.push(city);
    }
  }

  return [...startMatches, ...anywhereMatches].slice(0, 8);
}
