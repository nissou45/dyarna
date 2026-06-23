import { CITIES, City } from './cities';

describe('CITIES', () => {
  it('should have at least 90 cities', () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(90);
  });

  it('should have unique ids', () => {
    const ids = CITIES.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have 6 featured cities', () => {
    const featured = CITIES.filter(c => c.featured);
    expect(featured.length).toBe(6);
  });
});
