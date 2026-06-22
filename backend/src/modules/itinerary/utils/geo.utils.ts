import { CITIES, getAllCityIds } from '../../../data/cities';
import { City } from '../../../data/cities';

export type CityCoord = Pick<City, 'name' | 'lat' | 'lng'>;

const AVG_ROAD_SPEED_KMH = 70;

export function getCoords(cityId: string): CityCoord | undefined {
  const city = CITIES[cityId];
  if (!city) return undefined;
  return { name: city.name, lat: city.lat, lng: city.lng };
}

export { getAllCityIds };

export function haversineDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function estimateTravelTime(distanceKm: number): { hours: number; minutes: number } {
  const totalMinutes = Math.round((distanceKm / AVG_ROAD_SPEED_KMH) * 60);
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

export function distanceBetweenCities(cityId1: string, cityId2: string): number | null {
  const c1 = CITIES[cityId1];
  const c2 = CITIES[cityId2];
  if (!c1 || !c2) return null;
  return haversineDistanceKm(c1.lat, c1.lng, c2.lat, c2.lng);
}
