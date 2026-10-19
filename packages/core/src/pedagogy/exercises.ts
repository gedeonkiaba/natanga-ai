/**
 * Exercices niveau 1 — logique de correction pédagogique.
 *
 * US-07 : association son ⇄ graphème (audio + visuel).
 * US-08 : reconnaissance de mots (QCM, distracteurs bienveillants).
 */

import type { Exercise, ExerciseParams, PedagogyItem } from './model';

/** Résultat de correction d'une réponse. */
export interface AnswerCheck {
  correct: boolean;
  /** Feedback pédagogique (reformulation, jamais punitif). */
  feedback: string;
  /** Id de la bonne réponse (pour la reformulation). */
  correctId?: string;
}

/**
 * Association son ⇄ graphème : l'enfant entend un phonème et choisit le graphème.
 * `chosenId` est l'item (graphème) sélectionné.
 */
export function checkSoundGrapheme(
  exercise: Exercise,
  items: PedagogyItem[],
  chosenId: string,
): AnswerCheck {
  const phoneme = exercise.params.phoneme;
  const chosen = items.find((i) => i.id === chosenId);
  const correct = chosen?.phoneme === phoneme || chosen?.label === phoneme;

  if (correct) {
    return { correct: true, feedback: 'Bravo !', correctId: chosenId };
  }
  const correctItem = items.find((i) => i.phoneme === phoneme);
  return {
    correct: false,
    feedback: `Presque ! C’est « ${correctItem?.label ?? phoneme} ». On réessaie.`,
    correctId: correctItem?.id,
  };
}

/**
 * Reconnaissance de mots (QCM) : l'enfant choisit le bon mot parmi des distracteurs.
 * `correctItemId` est défini dans `params` ; les distracteurs sont issus de `params.itemIds`.
 */
export function checkWordRecognition(exercise: Exercise, chosenId: string): AnswerCheck {
  const params: ExerciseParams = exercise.params;
  const correct = chosenId === params.correctItemId;

  if (correct) {
    return { correct: true, feedback: 'Bien joué !', correctId: chosenId };
  }
  return {
    correct: false,
    feedback: 'Pas tout à fait. Regarde bien les lettres, on réessaie.',
    correctId: params.correctItemId,
  };
}

/** Choix affichés : ceux de l'exercice, sinon toutes les lettres (son ⇄ graphème). */
export function choicesOf(exercise: Exercise, items: PedagogyItem[]): PedagogyItem[] {
  const ids = exercise.params.itemIds;
  if (!ids?.length && exercise.type === 'sound-grapheme') {
    return items.filter((i) => i.type === 'grapheme');
  }
  return (ids ?? [])
    .map((id) => items.find((i) => i.id === id))
    .filter((i): i is PedagogyItem => Boolean(i));
}

/** Ce que la voix dit : le son (ou son mot-repère), ou le mot à trouver. */
export function spokenPrompt(exercise: Exercise, items: PedagogyItem[]): string {
  if (
    exercise.type === 'sound-grapheme' ||
    exercise.type === 'tracing' ||
    exercise.type === 'picture-match'
  ) {
    return exercise.params.cue ?? exercise.params.phoneme ?? '';
  }
  return items.find((i) => i.id === exercise.params.correctItemId)?.phoneme ?? '';
}

/**
 * Assemblage : les syllabes choisies, dans l'ordre, doivent redonner le mot
 * (`params.correctItemId`, découpé dans `syllables`).
 */
export function checkSyllableAssembly(
  exercise: Exercise,
  items: PedagogyItem[],
  chosenIds: string[],
): AnswerCheck {
  const target = items.find((i) => i.id === exercise.params.correctItemId);
  const expected = target?.syllables ?? [];
  const chosen = chosenIds.map((id) => items.find((i) => i.id === id)?.label ?? '');
  if (expected.length > 0 && chosen.join('|') === expected.join('|')) {
    return { correct: true, feedback: 'Bravo !', correctId: target?.id };
  }
  return {
    correct: false,
    feedback: `Presque ! C’est « ${expected.join(' · ')} ». On réessaie.`,
    correctId: target?.id,
  };
}

/** Lis et trouve l'image : la bonne image est celle du mot attendu. */
export function checkPictureMatch(
  exercise: Exercise,
  items: PedagogyItem[],
  chosenId: string,
): AnswerCheck {
  const id = exercise.params.correctItemId;
  if (chosenId === id) return { correct: true, feedback: 'Bravo, tu as bien lu !', correctId: id };
  const answer = items.find((i) => i.id === id)?.label ?? '';
  return { correct: false, feedback: `Presque ! C’est « ${answer} ». On réessaie.`, correctId: id };
}

/** Types d'exercices jouables dans l'app Expo (le tracé au doigt est propre à l'app Flutter). */
export const EXPO_EXERCISE_TYPES: ReadonlySet<Exercise['type']> = new Set([
  'sound-grapheme',
  'word-recognition',
  'syllable-assembly',
  'picture-match',
]);
