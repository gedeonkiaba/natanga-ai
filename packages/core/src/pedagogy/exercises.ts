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
export function checkWordRecognition(
  exercise: Exercise,
  chosenId: string,
): AnswerCheck {
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
