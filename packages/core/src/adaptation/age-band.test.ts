import { describe, expect, it } from 'vitest';
import { deriveAgeBand, isSupportedAge } from './age-band';

describe('deriveAgeBand', () => {
  it('classe un enfant de 7 ans dans la tranche 6-8', () => {
    expect(deriveAgeBand(2017, 2024)).toBe('6-8');
  });

  it('classe un enfant de 11 ans dans la tranche 9-12', () => {
    expect(deriveAgeBand(2013, 2024)).toBe('9-12');
  });

  it('retourne null en dehors du périmètre produit', () => {
    expect(deriveAgeBand(2020, 2024)).toBeNull(); // 4 ans
    expect(deriveAgeBand(2008, 2024)).toBeNull(); // 16 ans
  });
});

describe('isSupportedAge', () => {
  it('accepte la plage 6-12 ans', () => {
    expect(isSupportedAge(2018, 2024)).toBe(true); // 6 ans
    expect(isSupportedAge(2012, 2024)).toBe(true); // 12 ans
  });

  it('refuse les âges hors périmètre', () => {
    expect(isSupportedAge(2021, 2024)).toBe(false); // 3 ans
    expect(isSupportedAge(1999, 2024)).toBe(false); // 25 ans
  });
});
