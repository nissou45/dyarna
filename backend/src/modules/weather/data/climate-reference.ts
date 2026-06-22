export interface MonthlyClimate {
  month: number;
  avgTempMax: number;
  avgTempMin: number;
  avgRainfallMm: number;
  sunHours: number;
}

export interface CityClimate {
  cityId: string;
  monthly: MonthlyClimate[];
}

// Données climatiques cohérentes avec les régions marocaines
export const CLIMATE_DATA: CityClimate[] = [
  {
    cityId: 'marrakech',
    monthly: [
      { month: 1, avgTempMax: 18, avgTempMin: 5, avgRainfallMm: 30, sunHours: 220 },
      { month: 2, avgTempMax: 20, avgTempMin: 7, avgRainfallMm: 28, sunHours: 225 },
      { month: 3, avgTempMax: 23, avgTempMin: 10, avgRainfallMm: 25, sunHours: 260 },
      { month: 4, avgTempMax: 26, avgTempMin: 12, avgRainfallMm: 20, sunHours: 275 },
      { month: 5, avgTempMax: 30, avgTempMin: 15, avgRainfallMm: 10, sunHours: 300 },
      { month: 6, avgTempMax: 36, avgTempMin: 19, avgRainfallMm: 4, sunHours: 325 },
      { month: 7, avgTempMax: 40, avgTempMin: 23, avgRainfallMm: 1, sunHours: 340 },
      { month: 8, avgTempMax: 39, avgTempMin: 23, avgRainfallMm: 2, sunHours: 330 },
      { month: 9, avgTempMax: 34, avgTempMin: 19, avgRainfallMm: 8, sunHours: 280 },
      { month: 10, avgTempMax: 29, avgTempMin: 15, avgRainfallMm: 18, sunHours: 260 },
      { month: 11, avgTempMax: 23, avgTempMin: 10, avgRainfallMm: 25, sunHours: 230 },
      { month: 12, avgTempMax: 19, avgTempMin: 6, avgRainfallMm: 28, sunHours: 215 },
    ],
  },
  {
    cityId: 'fes',
    monthly: [
      { month: 1, avgTempMax: 16, avgTempMin: 4, avgRainfallMm: 50, sunHours: 200 },
      { month: 2, avgTempMax: 18, avgTempMin: 6, avgRainfallMm: 45, sunHours: 210 },
      { month: 3, avgTempMax: 21, avgTempMin: 8, avgRainfallMm: 42, sunHours: 240 },
      { month: 4, avgTempMax: 24, avgTempMin: 10, avgRainfallMm: 35, sunHours: 255 },
      { month: 5, avgTempMax: 28, avgTempMin: 13, avgRainfallMm: 20, sunHours: 285 },
      { month: 6, avgTempMax: 33, avgTempMin: 17, avgRainfallMm: 8, sunHours: 310 },
      { month: 7, avgTempMax: 38, avgTempMin: 20, avgRainfallMm: 2, sunHours: 335 },
      { month: 8, avgTempMax: 37, avgTempMin: 20, avgRainfallMm: 4, sunHours: 320 },
      { month: 9, avgTempMax: 33, avgTempMin: 17, avgRainfallMm: 14, sunHours: 270 },
      { month: 10, avgTempMax: 27, avgTempMin: 13, avgRainfallMm: 30, sunHours: 245 },
      { month: 11, avgTempMax: 21, avgTempMin: 8, avgRainfallMm: 42, sunHours: 210 },
      { month: 12, avgTempMax: 17, avgTempMin: 5, avgRainfallMm: 50, sunHours: 195 },
    ],
  },
  {
    cityId: 'rabat',
    monthly: [
      { month: 1, avgTempMax: 17, avgTempMin: 8, avgRainfallMm: 75, sunHours: 195 },
      { month: 2, avgTempMax: 18, avgTempMin: 9, avgRainfallMm: 65, sunHours: 205 },
      { month: 3, avgTempMax: 20, avgTempMin: 11, avgRainfallMm: 55, sunHours: 235 },
      { month: 4, avgTempMax: 22, avgTempMin: 12, avgRainfallMm: 45, sunHours: 255 },
      { month: 5, avgTempMax: 24, avgTempMin: 15, avgRainfallMm: 25, sunHours: 285 },
      { month: 6, avgTempMax: 26, avgTempMin: 18, avgRainfallMm: 8, sunHours: 300 },
      { month: 7, avgTempMax: 28, avgTempMin: 20, avgRainfallMm: 1, sunHours: 320 },
      { month: 8, avgTempMax: 28, avgTempMin: 20, avgRainfallMm: 2, sunHours: 310 },
      { month: 9, avgTempMax: 27, avgTempMin: 19, avgRainfallMm: 15, sunHours: 260 },
      { month: 10, avgTempMax: 25, avgTempMin: 16, avgRainfallMm: 50, sunHours: 235 },
      { month: 11, avgTempMax: 21, avgTempMin: 12, avgRainfallMm: 80, sunHours: 200 },
      { month: 12, avgTempMax: 18, avgTempMin: 9, avgRainfallMm: 85, sunHours: 190 },
    ],
  },
  {
    cityId: 'casablanca',
    monthly: [
      { month: 1, avgTempMax: 17, avgTempMin: 9, avgRainfallMm: 65, sunHours: 190 },
      { month: 2, avgTempMax: 18, avgTempMin: 10, avgRainfallMm: 55, sunHours: 200 },
      { month: 3, avgTempMax: 20, avgTempMin: 12, avgRainfallMm: 45, sunHours: 230 },
      { month: 4, avgTempMax: 22, avgTempMin: 13, avgRainfallMm: 35, sunHours: 250 },
      { month: 5, avgTempMax: 23, avgTempMin: 16, avgRainfallMm: 18, sunHours: 280 },
      { month: 6, avgTempMax: 25, avgTempMin: 19, avgRainfallMm: 5, sunHours: 295 },
      { month: 7, avgTempMax: 27, avgTempMin: 21, avgRainfallMm: 1, sunHours: 310 },
      { month: 8, avgTempMax: 27, avgTempMin: 21, avgRainfallMm: 2, sunHours: 305 },
      { month: 9, avgTempMax: 26, avgTempMin: 19, avgRainfallMm: 12, sunHours: 255 },
      { month: 10, avgTempMax: 24, avgTempMin: 16, avgRainfallMm: 40, sunHours: 230 },
      { month: 11, avgTempMax: 21, avgTempMin: 13, avgRainfallMm: 70, sunHours: 195 },
      { month: 12, avgTempMax: 18, avgTempMin: 10, avgRainfallMm: 75, sunHours: 185 },
    ],
  },
  {
    cityId: 'tanger',
    monthly: [
      { month: 1, avgTempMax: 16, avgTempMin: 8, avgRainfallMm: 100, sunHours: 180 },
      { month: 2, avgTempMax: 17, avgTempMin: 9, avgRainfallMm: 85, sunHours: 190 },
      { month: 3, avgTempMax: 19, avgTempMin: 11, avgRainfallMm: 70, sunHours: 220 },
      { month: 4, avgTempMax: 21, avgTempMin: 12, avgRainfallMm: 55, sunHours: 240 },
      { month: 5, avgTempMax: 23, avgTempMin: 15, avgRainfallMm: 30, sunHours: 270 },
      { month: 6, avgTempMax: 26, avgTempMin: 18, avgRainfallMm: 10, sunHours: 290 },
      { month: 7, avgTempMax: 29, avgTempMin: 20, avgRainfallMm: 2, sunHours: 315 },
      { month: 8, avgTempMax: 29, avgTempMin: 21, avgRainfallMm: 3, sunHours: 305 },
      { month: 9, avgTempMax: 27, avgTempMin: 19, avgRainfallMm: 20, sunHours: 255 },
      { month: 10, avgTempMax: 24, avgTempMin: 16, avgRainfallMm: 60, sunHours: 225 },
      { month: 11, avgTempMax: 20, avgTempMin: 12, avgRainfallMm: 100, sunHours: 190 },
      { month: 12, avgTempMax: 17, avgTempMin: 9, avgRainfallMm: 110, sunHours: 175 },
    ],
  },
  {
    cityId: 'chefchaouen',
    monthly: [
      { month: 1, avgTempMax: 14, avgTempMin: 4, avgRainfallMm: 120, sunHours: 170 },
      { month: 2, avgTempMax: 15, avgTempMin: 5, avgRainfallMm: 110, sunHours: 180 },
      { month: 3, avgTempMax: 17, avgTempMin: 7, avgRainfallMm: 95, sunHours: 205 },
      { month: 4, avgTempMax: 19, avgTempMin: 9, avgRainfallMm: 75, sunHours: 225 },
      { month: 5, avgTempMax: 23, avgTempMin: 12, avgRainfallMm: 45, sunHours: 260 },
      { month: 6, avgTempMax: 28, avgTempMin: 16, avgRainfallMm: 18, sunHours: 285 },
      { month: 7, avgTempMax: 32, avgTempMin: 19, avgRainfallMm: 3, sunHours: 315 },
      { month: 8, avgTempMax: 32, avgTempMin: 19, avgRainfallMm: 5, sunHours: 305 },
      { month: 9, avgTempMax: 28, avgTempMin: 16, avgRainfallMm: 25, sunHours: 250 },
      { month: 10, avgTempMax: 23, avgTempMin: 12, avgRainfallMm: 65, sunHours: 220 },
      { month: 11, avgTempMax: 18, avgTempMin: 8, avgRainfallMm: 105, sunHours: 185 },
      { month: 12, avgTempMax: 15, avgTempMin: 5, avgRainfallMm: 130, sunHours: 170 },
    ],
  },
  {
    cityId: 'essaouira',
    monthly: [
      { month: 1, avgTempMax: 18, avgTempMin: 11, avgRainfallMm: 50, sunHours: 200 },
      { month: 2, avgTempMax: 19, avgTempMin: 12, avgRainfallMm: 40, sunHours: 210 },
      { month: 3, avgTempMax: 20, avgTempMin: 13, avgRainfallMm: 35, sunHours: 240 },
      { month: 4, avgTempMax: 21, avgTempMin: 14, avgRainfallMm: 30, sunHours: 260 },
      { month: 5, avgTempMax: 22, avgTempMin: 15, avgRainfallMm: 15, sunHours: 280 },
      { month: 6, avgTempMax: 23, avgTempMin: 17, avgRainfallMm: 4, sunHours: 290 },
      { month: 7, avgTempMax: 24, avgTempMin: 18, avgRainfallMm: 1, sunHours: 305 },
      { month: 8, avgTempMax: 24, avgTempMin: 18, avgRainfallMm: 2, sunHours: 295 },
      { month: 9, avgTempMax: 23, avgTempMin: 17, avgRainfallMm: 8, sunHours: 250 },
      { month: 10, avgTempMax: 22, avgTempMin: 16, avgRainfallMm: 25, sunHours: 230 },
      { month: 11, avgTempMax: 21, avgTempMin: 14, avgRainfallMm: 45, sunHours: 205 },
      { month: 12, avgTempMax: 19, avgTempMin: 12, avgRainfallMm: 55, sunHours: 195 },
    ],
  },
  {
    cityId: 'agadir',
    monthly: [
      { month: 1, avgTempMax: 20, avgTempMin: 8, avgRainfallMm: 45, sunHours: 210 },
      { month: 2, avgTempMax: 21, avgTempMin: 10, avgRainfallMm: 35, sunHours: 220 },
      { month: 3, avgTempMax: 23, avgTempMin: 12, avgRainfallMm: 30, sunHours: 250 },
      { month: 4, avgTempMax: 24, avgTempMin: 13, avgRainfallMm: 20, sunHours: 270 },
      { month: 5, avgTempMax: 26, avgTempMin: 15, avgRainfallMm: 8, sunHours: 290 },
      { month: 6, avgTempMax: 28, avgTempMin: 18, avgRainfallMm: 2, sunHours: 310 },
      { month: 7, avgTempMax: 30, avgTempMin: 20, avgRainfallMm: 0, sunHours: 330 },
      { month: 8, avgTempMax: 30, avgTempMin: 20, avgRainfallMm: 1, sunHours: 320 },
      { month: 9, avgTempMax: 28, avgTempMin: 18, avgRainfallMm: 5, sunHours: 270 },
      { month: 10, avgTempMax: 26, avgTempMin: 15, avgRainfallMm: 18, sunHours: 245 },
      { month: 11, avgTempMax: 24, avgTempMin: 12, avgRainfallMm: 35, sunHours: 220 },
      { month: 12, avgTempMax: 21, avgTempMin: 9, avgRainfallMm: 48, sunHours: 205 },
    ],
  },
  {
    cityId: 'ouarzazate',
    monthly: [
      { month: 1, avgTempMax: 17, avgTempMin: 2, avgRainfallMm: 12, sunHours: 240 },
      { month: 2, avgTempMax: 20, avgTempMin: 4, avgRainfallMm: 10, sunHours: 250 },
      { month: 3, avgTempMax: 23, avgTempMin: 7, avgRainfallMm: 8, sunHours: 280 },
      { month: 4, avgTempMax: 27, avgTempMin: 11, avgRainfallMm: 5, sunHours: 300 },
      { month: 5, avgTempMax: 31, avgTempMin: 14, avgRainfallMm: 3, sunHours: 325 },
      { month: 6, avgTempMax: 36, avgTempMin: 19, avgRainfallMm: 2, sunHours: 340 },
      { month: 7, avgTempMax: 40, avgTempMin: 23, avgRainfallMm: 1, sunHours: 355 },
      { month: 8, avgTempMax: 39, avgTempMin: 22, avgRainfallMm: 2, sunHours: 345 },
      { month: 9, avgTempMax: 34, avgTempMin: 18, avgRainfallMm: 5, sunHours: 300 },
      { month: 10, avgTempMax: 28, avgTempMin: 12, avgRainfallMm: 8, sunHours: 275 },
      { month: 11, avgTempMax: 22, avgTempMin: 6, avgRainfallMm: 12, sunHours: 250 },
      { month: 12, avgTempMax: 18, avgTempMin: 3, avgRainfallMm: 14, sunHours: 235 },
    ],
  },
  {
    cityId: 'merzouga',
    monthly: [
      { month: 1, avgTempMax: 18, avgTempMin: 3, avgRainfallMm: 8, sunHours: 250 },
      { month: 2, avgTempMax: 21, avgTempMin: 5, avgRainfallMm: 6, sunHours: 260 },
      { month: 3, avgTempMax: 25, avgTempMin: 9, avgRainfallMm: 5, sunHours: 290 },
      { month: 4, avgTempMax: 29, avgTempMin: 13, avgRainfallMm: 3, sunHours: 310 },
      { month: 5, avgTempMax: 33, avgTempMin: 17, avgRainfallMm: 2, sunHours: 335 },
      { month: 6, avgTempMax: 38, avgTempMin: 22, avgRainfallMm: 1, sunHours: 350 },
      { month: 7, avgTempMax: 42, avgTempMin: 26, avgRainfallMm: 0, sunHours: 365 },
      { month: 8, avgTempMax: 41, avgTempMin: 25, avgRainfallMm: 1, sunHours: 355 },
      { month: 9, avgTempMax: 36, avgTempMin: 21, avgRainfallMm: 3, sunHours: 310 },
      { month: 10, avgTempMax: 30, avgTempMin: 15, avgRainfallMm: 5, sunHours: 285 },
      { month: 11, avgTempMax: 23, avgTempMin: 8, avgRainfallMm: 8, sunHours: 260 },
      { month: 12, avgTempMax: 19, avgTempMin: 4, avgRainfallMm: 10, sunHours: 245 },
    ],
  },
  {
    cityId: 'meknes',
    monthly: [
      { month: 1, avgTempMax: 16, avgTempMin: 5, avgRainfallMm: 60, sunHours: 195 },
      { month: 2, avgTempMax: 18, avgTempMin: 7, avgRainfallMm: 55, sunHours: 205 },
      { month: 3, avgTempMax: 21, avgTempMin: 9, avgRainfallMm: 48, sunHours: 235 },
      { month: 4, avgTempMax: 23, avgTempMin: 11, avgRainfallMm: 40, sunHours: 255 },
      { month: 5, avgTempMax: 27, avgTempMin: 14, avgRainfallMm: 22, sunHours: 285 },
      { month: 6, avgTempMax: 32, avgTempMin: 18, avgRainfallMm: 8, sunHours: 310 },
      { month: 7, avgTempMax: 37, avgTempMin: 21, avgRainfallMm: 2, sunHours: 335 },
      { month: 8, avgTempMax: 36, avgTempMin: 21, avgRainfallMm: 4, sunHours: 320 },
      { month: 9, avgTempMax: 32, avgTempMin: 18, avgRainfallMm: 15, sunHours: 270 },
      { month: 10, avgTempMax: 27, avgTempMin: 14, avgRainfallMm: 35, sunHours: 240 },
      { month: 11, avgTempMax: 21, avgTempMin: 9, avgRainfallMm: 55, sunHours: 205 },
      { month: 12, avgTempMax: 17, avgTempMin: 6, avgRainfallMm: 65, sunHours: 190 },
    ],
  },
  {
    cityId: 'ifrane',
    monthly: [
      { month: 1, avgTempMax: 9, avgTempMin: -1, avgRainfallMm: 100, sunHours: 170 },
      { month: 2, avgTempMax: 11, avgTempMin: 1, avgRainfallMm: 95, sunHours: 180 },
      { month: 3, avgTempMax: 14, avgTempMin: 3, avgRainfallMm: 80, sunHours: 210 },
      { month: 4, avgTempMax: 16, avgTempMin: 5, avgRainfallMm: 65, sunHours: 230 },
      { month: 5, avgTempMax: 20, avgTempMin: 8, avgRainfallMm: 40, sunHours: 265 },
      { month: 6, avgTempMax: 25, avgTempMin: 12, avgRainfallMm: 18, sunHours: 290 },
      { month: 7, avgTempMax: 30, avgTempMin: 16, avgRainfallMm: 4, sunHours: 320 },
      { month: 8, avgTempMax: 30, avgTempMin: 16, avgRainfallMm: 6, sunHours: 310 },
      { month: 9, avgTempMax: 25, avgTempMin: 12, avgRainfallMm: 28, sunHours: 255 },
      { month: 10, avgTempMax: 20, avgTempMin: 8, avgRainfallMm: 60, sunHours: 225 },
      { month: 11, avgTempMax: 14, avgTempMin: 3, avgRainfallMm: 90, sunHours: 190 },
      { month: 12, avgTempMax: 10, avgTempMin: 0, avgRainfallMm: 110, sunHours: 170 },
    ],
  },
];

export function getClimateData(cityId: string): CityClimate | undefined {
  return CLIMATE_DATA.find((c) => c.cityId === cityId);
}
