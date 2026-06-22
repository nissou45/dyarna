const CITIES: Record<string, { name: string; region: string }> = {
  marrakech: { name: 'Marrakech', region: 'Marrakech-Safi' },
  fes: { name: 'Fès', region: 'Fès-Meknès' },
  rabat: { name: 'Rabat', region: 'Rabat-Salé-Kénitra' },
  casablanca: { name: 'Casablanca', region: 'Casablanca-Settat' },
  tanger: { name: 'Tanger', region: 'Tanger-Tétouan-Al Hoceïma' },
  chefchaouen: { name: 'Chefchaouen', region: 'Tanger-Tétouan-Al Hoceïma' },
  essaouira: { name: 'Essaouira', region: 'Marrakech-Safi' },
  agadir: { name: 'Agadir', region: 'Souss-Massa' },
  ouarzazate: { name: 'Ouarzazate', region: 'Drâa-Tafilalet' },
  merzouga: { name: 'Merzouga', region: 'Drâa-Tafilalet' },
  meknes: { name: 'Meknès', region: 'Fès-Meknès' },
  ifrane: { name: 'Ifrane', region: 'Fès-Meknès' },
};

export function getCityById(cityId: string): { name: string; region: string } | undefined {
  return CITIES[cityId];
}

export function getAllCityIds(): string[] {
  return Object.keys(CITIES);
}
