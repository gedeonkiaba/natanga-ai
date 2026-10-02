/**
 * Mesures d'une session de lecture envoyées à l'API (POST /children/{id}/sessions).
 *
 * L'enfant touche les mots difficiles (le mot est lu à voix haute et noté) :
 * mots corrects = mots du texte − mots touchés. Mesure auto-déclarée, honnête
 * et sans micro (aucune donnée vocale collectée).
 */

export interface SessionMetrics {
  lessonId: string;
  durationSec: number;
  wordsRead: number;
  correctWords: number;
  completed: boolean;
}

export function sessionMetrics(input: {
  lessonId: string;
  totalWords: number;
  difficultWords: number;
  startedAt: number;
  endedAt: number;
  completed?: boolean;
}): SessionMetrics {
  const wordsRead = Math.max(0, Math.floor(input.totalWords));
  const difficult = Math.min(wordsRead, Math.max(0, Math.floor(input.difficultWords)));
  return {
    lessonId: input.lessonId,
    durationSec: Math.max(1, Math.round((input.endedAt - input.startedAt) / 1000)),
    wordsRead,
    correctWords: wordsRead - difficult,
    completed: input.completed ?? true,
  };
}

/** Message d'encouragement (jamais d'échec : ton bienveillant). */
export function cheer(stars: number): string {
  if (stars >= 2) return 'Bravo, super lecture !';
  if (stars === 1) return 'Bravo, tu as fini ton texte !';
  return 'Tu as bien travaillé, continue !';
}
