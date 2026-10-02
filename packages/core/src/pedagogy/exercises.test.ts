import { describe, expect, it } from 'vitest';
import { checkSoundGrapheme, checkWordRecognition } from './exercises';
import { LEVEL1_ITEMS, LEVEL1_EXERCISES } from './content';

describe('association son ⇄ graphème (US-07)', () => {
  const ex = LEVEL1_EXERCISES[0]!; // phoneme 'a'

  it('valide la bonne correspondance', () => {
    const result = checkSoundGrapheme(ex, LEVEL1_ITEMS, 'g-a');
    expect(result.correct).toBe(true);
  });

  it('rejette une mauvaise correspondance avec feedback bienveillant', () => {
    const result = checkSoundGrapheme(ex, LEVEL1_ITEMS, 'g-i');
    expect(result.correct).toBe(false);
    expect(result.feedback).toContain('réessaie');
    expect(result.correctId).toBe('g-a');
  });
});

describe('reconnaissance de mots (US-08)', () => {
  const ex = LEVEL1_EXERCISES.find((e) => e.type === 'word-recognition')!; // correctItemId w-papa

  it('valide le bon mot', () => {
    const result = checkWordRecognition(ex, 'w-papa');
    expect(result.correct).toBe(true);
  });

  it('rejette un distracteur sans message punitif', () => {
    const result = checkWordRecognition(ex, 'w-maman');
    expect(result.correct).toBe(false);
    expect(result.feedback.toLowerCase()).not.toContain('erreur');
  });
});
