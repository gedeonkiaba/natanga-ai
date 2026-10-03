import { describe, expect, it } from 'vitest';
import { checkSoundGrapheme, checkWordRecognition, choicesOf, spokenPrompt } from './exercises';
import { LEVEL1_EXERCISES, LEVEL1_ITEMS, LEVEL1_LESSONS, LEVEL1_NODES } from './content';

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

describe('contenu : chaque leçon est jouable', () => {
  it('chaque nœud a une leçon d’au moins 3 exercices', () => {
    for (const node of LEVEL1_NODES) {
      const lesson = LEVEL1_LESSONS.find((l) => l.nodeId === node.id);
      expect(lesson, node.id).toBeDefined();
      expect(
        LEVEL1_EXERCISES.filter((e) => e.lessonId === lesson!.id).length,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it('chaque exercice propose exactement une bonne réponse et une consigne orale', () => {
    for (const e of LEVEL1_EXERCISES) {
      const choices = choicesOf(e, LEVEL1_ITEMS);
      expect(choices.length, e.id).toBe(e.params.itemIds?.length ?? 7);
      const right = choices.filter((c) =>
        e.type === 'sound-grapheme'
          ? checkSoundGrapheme(e, LEVEL1_ITEMS, c.id).correct
          : c.id === e.params.correctItemId,
      );
      expect(right, e.id).toHaveLength(1);
      expect(spokenPrompt(e, LEVEL1_ITEMS), e.id).not.toBe('');
    }
  });

  it('b/d : seulement les lettres en miroir, avec un mot-repère', () => {
    const b1 = LEVEL1_EXERCISES.find((e) => e.id === 'e-bd-b1')!;
    expect(choicesOf(b1, LEVEL1_ITEMS).map((c) => c.label)).toEqual(['b', 'd']);
    expect(spokenPrompt(b1, LEVEL1_ITEMS)).toBe('b, comme ballon');
    const bon = LEVEL1_EXERCISES.find((e) => e.id === 'e-bd-bon')!;
    expect(spokenPrompt(bon, LEVEL1_ITEMS)).toBe('bon');
  });
});
