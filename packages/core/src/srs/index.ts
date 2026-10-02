/**
 * Algorithme SRS (spaced repetition) simplifié — implémentation de type Leitner/SM-2.
 * Utilisé par le Lot E/F (révisions espacées) mais isolé ici car purement déterministe.
 *
 * Note : l'US-12 (SRS) est reportée au Sprint 2 ; ce module pose les fondations testables.
 */

export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface SrCard {
  id: string;
  /** Intervalle courant en jours avant la prochaine révision. */
  intervalDays: number;
  /** Nombre de répétitions réussies consécutives. */
  repetitions: number;
  /** Facilité (facteur SM-2), valeur initiale 2.5, bornée [1.3, 2.5]. */
  ease: number;
}

const MIN_EASE = 1.3;
const MAX_EASE = 2.5;
const INITIAL_EASE = 2.5;

/** Applique la formule SM-2 simplifiée et retourne la carte mise à jour. */
export function review(card: SrCard, grade: ReviewGrade): SrCard {
  // Un échec (grade < 3) remet la carte en révision rapprochée.
  if (grade < 3) {
    return {
      ...card,
      repetitions: 0,
      intervalDays: 1,
      ease: Math.max(MIN_EASE, card.ease - 0.2),
    };
  }

  const repetitions = card.repetitions + 1;
  let intervalDays: number;
  if (repetitions === 1) intervalDays = 1;
  else if (repetitions === 2) intervalDays = 6;
  else intervalDays = Math.round(card.intervalDays * card.ease);

  const easeDelta = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
  const ease = Math.min(MAX_EASE, Math.max(MIN_EASE, card.ease + easeDelta));

  return { id: card.id, repetitions, intervalDays, ease };
}

/** Construit une nouvelle carte. */
export function createCard(id: string): SrCard {
  return { id, intervalDays: 1, repetitions: 0, ease: INITIAL_EASE };
}
