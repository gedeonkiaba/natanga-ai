/**
 * Gamification bienveillante — récompense de l'effort, pas seulement de la réussite.
 * Aligné sur US-09 / US-10 (spec backlog) : pas de perte totale, encouragement systématique.
 */

export type RewardKind = 'gems' | 'badge' | 'effort';

export interface RewardEvent {
  kind: RewardKind;
  amount: number;
  reason: string;
}

/** Gemmes gagnées pour un exercice : même en cas d'erreur, l'effort est récompensé. */
export const GEMS_SUCCESS = 10;
export const GEMS_EFFORT = 5;

/** Calcule la récompense selon que la réponse est correcte ou non (bienveillant). */
export function rewardForAnswer(isCorrect: boolean): RewardEvent {
  if (isCorrect) {
    return { kind: 'gems', amount: GEMS_SUCCESS, reason: 'réussite' };
  }
  return { kind: 'effort', amount: GEMS_EFFORT, reason: 'effort fourni' };
}

/**
 * Streak adouci : un jour manqué ne remet jamais le compteur à zéro brutalement.
 * On décrémente doucement le multiplicateur, sans blocage ni perte totale.
 */
export function softenStreak(currentStreak: number, missedDays: number): number {
  if (missedDays <= 0) return currentStreak;
  return Math.max(0, currentStreak - missedDays);
}
