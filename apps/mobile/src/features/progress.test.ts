import { describe, expect, it } from 'vitest';
import {
  OUTBOX_LIMIT,
  initialProgress,
  isMastered,
  parseProgress,
  readingStars,
  recordLesson,
  recordReading,
  saveProfile,
  treeProgress,
} from './progress';

const NOW = new Date('2026-10-02T10:00:00Z');
const vowels = { nodeId: 'n-letters-a', lessonId: 'l-vowels-1', gems: 35 };

describe('maîtrise (même règle que l’API)', () => {
  it('exige au moins 3 réponses et 70 % de réussite', () => {
    expect(isMastered(3, 4)).toBe(true);
    expect(isMastered(2, 4)).toBe(false);
    expect(isMastered(2, 2)).toBe(false);
  });
});

describe('recordLesson', () => {
  it('marque le nœud maîtrisé, ajoute les gemmes et met l’événement en file', () => {
    const s = recordLesson(initialProgress, { ...vowels, correct: 3, total: 4 }, NOW);
    expect(s.nodes['n-letters-a']).toEqual({ status: 'mastered', bestScore: 0.75 });
    expect(s.gems).toBe(35);
    expect(s.outbox).toHaveLength(1);
    expect(s.outbox[0]).toMatchObject({
      type: 'lesson_completed',
      at: NOW.toISOString(),
      payload: { correct: 3, total: 4, score: 0.75 },
    });
    expect(initialProgress.nodes).toEqual({}); // pas de mutation
  });

  it('laisse « en cours » sous le seuil et ne rétrograde jamais un nœud maîtrisé', () => {
    const low = recordLesson(initialProgress, { ...vowels, correct: 1, total: 4 }, NOW);
    expect(low.nodes['n-letters-a']?.status).toBe('in_progress');
    const mastered = recordLesson(low, { ...vowels, correct: 4, total: 4 }, NOW);
    const again = recordLesson(mastered, { ...vowels, correct: 0, total: 4 }, NOW);
    expect(again.nodes['n-letters-a']).toEqual({ status: 'mastered', bestScore: 1 });
  });

  it('alimente l’arbre de compétences', () => {
    const s = recordLesson(initialProgress, { ...vowels, correct: 4, total: 4 }, NOW);
    expect(treeProgress(s)).toEqual([
      { childId: 'local', nodeId: 'n-letters-a', status: 'mastered', masteredScore: 1 },
    ]);
  });
});

describe('lecture et profil', () => {
  it('compte les étoiles comme l’API', () => {
    expect(readingStars(20, 17)).toBe(2);
    expect(readingStars(20, 10)).toBe(1);
    const s = recordReading(
      initialProgress,
      { lessonId: 't', durationSec: 60, wordsRead: 20, correctWords: 18 },
      NOW,
    );
    expect(s).toMatchObject({ stars: 2, readings: 1 });
    expect(s.outbox[0]?.payload).toEqual({
      lessonId: 't',
      durationSec: 60,
      wordsRead: 20,
      correctWords: 18,
      completed: true,
      stars: 2,
    });
  });

  it('enregistre le profil', () => {
    const s = saveProfile(initialProgress, { avatar: 'lumi', themes: ['animaux'] }, NOW);
    expect(s.profile).toEqual({ avatar: 'lumi', themes: ['animaux'] });
    expect(s.outbox[0]?.type).toBe('profile_saved');
  });

  it('borne la file d’envoi', () => {
    let s = initialProgress;
    for (let i = 0; i < OUTBOX_LIMIT + 5; i++)
      s = recordReading(
        s,
        { lessonId: `t${i}`, durationSec: 1, wordsRead: 1, correctWords: 1 },
        NOW,
      );
    expect(s.outbox).toHaveLength(OUTBOX_LIMIT);
    expect(s.outbox[0]?.payload.lessonId).toBe('t5');
  });
});

describe('parseProgress', () => {
  it('relit un état sauvegardé', () => {
    const s = recordLesson(initialProgress, { ...vowels, correct: 3, total: 4 }, NOW);
    expect(parseProgress(JSON.stringify(s))).toEqual(s);
  });

  it('repart d’un état neuf si la sauvegarde est absente, corrompue ou d’un autre schéma', () => {
    expect(parseProgress(null)).toEqual(initialProgress);
    expect(parseProgress('{pas du json')).toEqual(initialProgress);
    expect(parseProgress(JSON.stringify({ version: 99, gems: 5 }))).toEqual(initialProgress);
  });
});
