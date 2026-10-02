/**
 * Types et réexports partagés entre les composants d'exercice.
 */
export interface AnswerFeedback {
  correct: boolean;
  message: string;
  /** Id de la bonne réponse (pour la reformulation). */
  correctId?: string;
}
