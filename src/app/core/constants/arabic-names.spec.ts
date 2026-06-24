import { describe, it, expect } from 'vitest';
import { ARABIC_CITY_NAMES } from './arabic-names';

describe('ARABIC_CITY_NAMES', () => {
  it('contient les 4 villes impériales', () => {
    expect(ARABIC_CITY_NAMES['Marrakech']).toBe('مراكش');
    expect(ARABIC_CITY_NAMES['Fès']).toBe('فاس');
    expect(ARABIC_CITY_NAMES['Meknès']).toBe('مكناس');
    expect(ARABIC_CITY_NAMES['Rabat']).toBe('الرباط');
  });

  it('retourne undefined pour une ville sans nom arabe (plat, tradition)', () => {
    expect(ARABIC_CITY_NAMES['Tajine Marrakchi']).toBeUndefined();
    expect(ARABIC_CITY_NAMES['Hammam Marocain']).toBeUndefined();
  });

  it('ne contient que des chaînes non vides', () => {
    for (const [key, value] of Object.entries(ARABIC_CITY_NAMES)) {
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it('contient au moins 14 villes', () => {
    expect(Object.keys(ARABIC_CITY_NAMES).length).toBeGreaterThanOrEqual(14);
  });
});
