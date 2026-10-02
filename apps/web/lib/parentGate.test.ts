import { describe, expect, it } from 'vitest';
import { newChallenge } from './parentGate';

describe('newChallenge', () => {
  it('pose une multiplication hors des tables apprises par cœur', () => {
    for (const r of [0, 0.5, 0.999]) {
      const c = newChallenge(() => r);
      expect(c.a).toBeGreaterThanOrEqual(12);
      expect(c.a).toBeLessThanOrEqual(89);
      expect(c.b).toBeGreaterThanOrEqual(3);
      expect(c.b).toBeLessThanOrEqual(9);
      expect(c.answer).toBe(c.a * c.b);
    }
  });
});
