import { describe, it, expect } from 'vitest';

describe('logger', () => {
  it('should have info level in production', async () => {
    process.env.NODE_ENV = 'production';
    const { logger } = await import('./logger');
    expect(logger.level).toBe('info');
  });
});
