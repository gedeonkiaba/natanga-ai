import { describe, expect, it } from 'vitest';
import { cheer, sessionMetrics } from './reading';
import { messageFor } from './errors';

describe('sessionMetrics', () => {
  it('déduit les mots corrects des mots touchés', () => {
    expect(
      sessionMetrics({ lessonId: 't1', totalWords: 20, difficultWords: 3, startedAt: 0, endedAt: 61_400 }),
    ).toEqual({ lessonId: 't1', durationSec: 61, wordsRead: 20, correctWords: 17, completed: true });
  });

  it('borne les valeurs (jamais négatif, durée minimale 1 s)', () => {
    const m = sessionMetrics({ lessonId: 't', totalWords: 5, difficultWords: 9, startedAt: 10, endedAt: 10 });
    expect(m.correctWords).toBe(0);
    expect(m.durationSec).toBe(1);
  });
});

describe('cheer / messageFor', () => {
  it('reste toujours bienveillant', () => {
    expect(cheer(2)).toMatch(/Bravo/);
    expect(cheer(0)).toMatch(/continue/);
  });

  it('traduit les codes connus et retombe sur un message générique', () => {
    expect(messageFor('ERR_CONSENT_REQUIRED')).toMatch(/accord parental/);
    expect(messageFor('UNKNOWN')).toMatch(/erreur/);
    expect(messageFor(undefined, 'x')).toBe('x');
  });
});
