import { describe, expect, it } from 'vitest';
import { countWords, syllables, tokenize } from './text';

describe('tokenize', () => {
  it('sépare mots et ponctuation en conservant le texte exact', () => {
    const text = "Le chat de Léa dort. Boum ! Jusqu'à trois.";
    const tokens = tokenize(text);
    expect(tokens.map((t) => t.text).join('')).toBe(text);
    expect(tokens.filter((t) => t.kind === 'word').map((t) => t.text)).toEqual([
      'Le', 'chat', 'de', 'Léa', 'dort', 'Boum', "Jusqu'à", 'trois',
    ]);
  });

  it('indexe les mots de façon continue', () => {
    const words = tokenize('un, deux trois').filter((t) => t.kind === 'word');
    expect(words.map((w) => (w.kind === 'word' ? w.index : -1))).toEqual([0, 1, 2]);
  });

  it('compte les mots', () => {
    expect(countWords('La fusée part vers les étoiles.')).toBe(6);
    expect(countWords('')).toBe(0);
  });
});

describe('syllables', () => {
  it.each([
    ['chat', ['chat']],
    ['soleil', ['so', 'leil']],
    ['caresse', ['ca', 'res', 'se']],
    ['tableau', ['ta', 'bleau']],
    ['fusée', ['fu', 'sée']],
    ['montagne', ['mon', 'ta', 'gne']],
    ['arbre', ['ar', 'bre']],
    ['doucement', ['dou', 'ce', 'ment']],
    ['quelque', ['quel', 'que']],
    ['Léa', ['Léa']],
  ])('%s → %j', (word, expected) => {
    expect(syllables(word)).toEqual(expected);
  });

  it("garde l'apostrophe avec ce qui précède et reconstitue le mot", () => {
    expect(syllables("l'arbre")).toEqual(["l'", 'ar', 'bre']);
    for (const w of ["jusqu'à", 'grand-mère', 'étoiles', 'ronronne']) {
      expect(syllables(w).join('')).toBe(w);
    }
  });
});
