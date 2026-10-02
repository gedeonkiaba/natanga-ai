import { describe, expect, it } from 'vitest';
import { placeStartLevel } from './placement';

describe('test de positionnement v0 (US-04)', () => {
  it('avance au niveau suivant quand un niveau est maîtrisé', () => {
    const result = placeStartLevel([
      { level: 'letters', score: 0.9 },
      { level: 'syllables', score: 0.2 },
    ]);
    // letters maîtrisée (0.9 ≥ 0.7) → démarre à syllables.
    expect(result.startLevel).toBe('syllables');
  });

  it('démarre au premier niveau non maîtrisé', () => {
    const result = placeStartLevel([
      { level: 'letters', score: 0.9 },
      { level: 'syllables', score: 0.4 },
      { level: 'words', score: 0.1 },
    ]);
    // letters maîtrisée → commence à syllables (score 0.4 < seuil).
    expect(result.startLevel).toBe('syllables');
  });

  it('retourne lettres si aucune donnée', () => {
    const result = placeStartLevel([]);
    expect(result.startLevel).toBe('letters');
    expect(result.confidence).toBe(1);
  });
});
