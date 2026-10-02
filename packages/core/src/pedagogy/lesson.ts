/**
 * Moteur de leçon (US-06) — séquence d'exercices, suivi d'état, bornage durée 5–10 min.
 * Pure logique : aucune persistance, aucun I/O (les stores sont injectés).
 */

import type { Exercise } from './model';

export interface LessonSession {
  lessonId: string;
  exerciseIds: string[];
  /** Index de l'exercice courant (0-based). */
  currentIndex: number;
  /** Réponses enregistrées : exerciceId → correct/incorrect. */
  answers: Record<string, boolean>;
  startedAt: string;
}

export interface LessonResult {
  lessonId: string;
  total: number;
  correct: number;
  /** Score 0..1. */
  score: number;
  completed: boolean;
}

/** Démarre une session de leçon avec une séquence d'exercices ordonnée. */
export function startLesson(lessonId: string, exercises: Exercise[]): LessonSession {
  const ordered = [...exercises].sort((a, b) => a.order - b.order);
  return {
    lessonId,
    exerciseIds: ordered.map((e) => e.id),
    currentIndex: 0,
    answers: {},
    startedAt: new Date().toISOString(),
  };
}

/** Indique l'exercice courant de la session. */
export function currentExercise(session: LessonSession, exercises: Exercise[]): Exercise | undefined {
  const id = session.exerciseIds[session.currentIndex];
  return exercises.find((e) => e.id === id);
}

/** Enregistre une réponse et avance. Retourne `true` si la leçon est terminée. */
export function submitAnswer(
  session: LessonSession,
  exerciseId: string,
  isCorrect: boolean,
): boolean {
  session.answers[exerciseId] = isCorrect;
  const finished = session.currentIndex >= session.exerciseIds.length - 1;
  if (!finished) {
    session.currentIndex += 1;
  }
  return finished;
}

/** Calcule le résultat final de la leçon. */
export function lessonResult(session: LessonSession): LessonResult {
  const total = session.exerciseIds.length;
  const correct = session.exerciseIds.filter((id) => session.answers[id] === true).length;
  return {
    lessonId: session.lessonId,
    total,
    correct,
    score: total === 0 ? 0 : correct / total,
    completed: Object.keys(session.answers).length >= total,
  };
}
