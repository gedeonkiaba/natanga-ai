import { describe, expect, it } from 'vitest';
import { checkSoundGrapheme, checkWordRecognition, choicesOf, spokenPrompt } from './exercises';
import {
  CURRICULUM_EXERCISES,
  CURRICULUM_ITEMS,
  CURRICULUM_LESSONS,
  CURRICULUM_LEVELS,
  CURRICULUM_NODES,
} from './content';

describe('association son ⇄ graphème (US-07)', () => {
  const ex = CURRICULUM_EXERCISES[0]!; // « Le son /a/ » : a | o

  it('valide la bonne correspondance', () => {
    const result = checkSoundGrapheme(ex, CURRICULUM_ITEMS, 'g-a');
    expect(result.correct).toBe(true);
  });

  it('rejette une mauvaise correspondance avec feedback bienveillant', () => {
    const result = checkSoundGrapheme(ex, CURRICULUM_ITEMS, 'g-o');
    expect(result.correct).toBe(false);
    expect(result.feedback).toContain('réessaie');
    expect(result.correctId).toBe('g-a');
  });
});

describe('reconnaissance de mots (US-08)', () => {
  const ex = CURRICULUM_EXERCISES.find((e) => e.type === 'word-recognition')!; // « avion »

  it('valide le bon mot', () => {
    const result = checkWordRecognition(ex, 'w-avion');
    expect(result.correct).toBe(true);
  });

  it('rejette un distracteur sans message punitif', () => {
    const result = checkWordRecognition(ex, 'w-ecole');
    expect(result.correct).toBe(false);
    expect(result.feedback.toLowerCase()).not.toContain('erreur');
  });
});

describe('contenu : chaque leçon est jouable', () => {
  it('chaque nœud a une leçon d’au moins 3 exercices', () => {
    for (const node of CURRICULUM_NODES) {
      const lesson = CURRICULUM_LESSONS.find((l) => l.nodeId === node.id);
      expect(lesson, node.id).toBeDefined();
      expect(
        CURRICULUM_EXERCISES.filter((e) => e.lessonId === lesson!.id).length,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it('chaque exercice propose exactement une bonne réponse et une consigne orale', () => {
    for (const e of CURRICULUM_EXERCISES) {
      const choices = choicesOf(e, CURRICULUM_ITEMS);
      expect(choices.length, e.id).toBe(e.params.itemIds!.length);
      const right = choices.filter((c) =>
        e.type === 'sound-grapheme'
          ? checkSoundGrapheme(e, CURRICULUM_ITEMS, c.id).correct
          : c.id === e.params.correctItemId,
      );
      expect(right, e.id).toHaveLength(1);
      expect(spokenPrompt(e, CURRICULUM_ITEMS), e.id).not.toBe('');
    }
  });

  it('6 niveaux, 52 leçons, déblocage séquentiel', () => {
    expect(CURRICULUM_LEVELS.map((l) => l.key)).toEqual([
      'sounds',
      'letters',
      'syllables',
      'words',
      'complex-sounds',
      'sentences',
    ]);
    expect(CURRICULUM_NODES).toHaveLength(52);
    expect(CURRICULUM_NODES.map((n) => n.unlockedWhen)).toEqual(CURRICULUM_NODES.map((_, i) => i));
  });

  it('corrections de la base : le mot-repère contient vraiment le son', () => {
    const first = (lessonId: string) => CURRICULUM_EXERCISES.find((e) => e.lessonId === lessonId)!;
    expect(spokenPrompt(first('l-son-e'), CURRICULUM_ITEMS)).toBe('e, comme dans cheval');
    expect(spokenPrompt(first('l-son-an'), CURRICULUM_ITEMS)).toBe('an, comme dans maman');
  });

  it('b/d : seulement les lettres en miroir, avec un mot-repère', () => {
    const b1 = CURRICULUM_EXERCISES.find((e) => e.id === 'e-bd-b1')!;
    expect(choicesOf(b1, CURRICULUM_ITEMS).map((c) => c.label)).toEqual(['b', 'd']);
    expect(spokenPrompt(b1, CURRICULUM_ITEMS)).toBe('b, comme ballon');
    const bon = CURRICULUM_EXERCISES.find((e) => e.id === 'e-bd-bon')!;
    expect(spokenPrompt(bon, CURRICULUM_ITEMS)).toBe('bon');
  });
});
