import { TestBed } from '@angular/core/testing';
import { CITIES } from '../data/cities';
import { CitySearchService } from './city-search.service';

describe('CitySearchService', () => {
  let service: CitySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitySearchService);
  });

  it('should return empty for query < 2 chars', () => {
    expect(service.search('a').length).toBe(0);
  });

  it('should return Marrakech first for "Mar"', () => {
    const results = service.search('Mar');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe('Marrakech');
  });

  it('should be accent-insensitive', () => {
    const withAccent = service.search('Meknès');
    const withoutAccent = service.search('Meknes');
    expect(withAccent[0].id).toBe(withoutAccent[0].id);
  });

  it('should be case-insensitive', () => {
    const upper = service.search('FES');
    const lower = service.search('fes');
    expect(upper.length).toBeGreaterThan(0);
    expect(upper[0].id).toBe(lower[0].id);
  });

  it('should return max 8 results', () => {
    const results = service.search('a');
    expect(results.length).toBeLessThanOrEqual(8);
  });
});
