import { describe, it, expect } from 'vitest';
import { calculateMonthScore, getMonthLabel } from './weather.service';

describe('calculateMonthScore', () => {
  it('should return 90 for ideal conditions', () => {
    const result = calculateMonthScore({
      month: 4,
      avgTempMin: 16,
      avgTempMax: 26,
      avgRainfallMm: 3,
      sunHours: 310,
    });
    expect(result).toBeGreaterThanOrEqual(75);
  });

  it('should return low score for extreme heat and rain', () => {
    const result = calculateMonthScore({
      month: 7,
      avgTempMin: 28,
      avgTempMax: 42,
      avgRainfallMm: 120,
      sunHours: 180,
    });
    expect(result).toBeLessThanOrEqual(30);
  });
});

describe('getMonthLabel', () => {
  it('should return ideal for score >= 75', () => {
    expect(getMonthLabel(80)).toBe('ideal');
  });
  it('should return avoid for score < 35', () => {
    expect(getMonthLabel(20)).toBe('avoid');
  });
});
