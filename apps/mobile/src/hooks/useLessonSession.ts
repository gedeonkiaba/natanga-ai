import { useCallback, useMemo, useState } from 'react';
import {
  lessonResult,
  startLesson,
  submitAnswer,
  rewardForAnswer,
  type Exercise,
  type Lesson,
  type LessonSession,
} from '@natanga/core';

export interface LessonUiState {
  session: LessonSession;
  exercise: Exercise | undefined;
  /** Gemmes accumulées pendant la session. */
  gems: number;
  /** Nombre de réponses correctes à date. */
  correct: number;
  finished: boolean;
  score: number;
}

/**
 * Hook de session de leçon : encapsule l'état de lecture du moteur `@natanga/core`
 * et branche la gamification (récompense d'effort, même en cas d'erreur).
 */
export function useLessonSession(lesson: Lesson, exercises: Exercise[]) {
  const [session, setSession] = useState<LessonSession>(() =>
    startLesson(lesson.id, exercises),
  );
  const [gems, setGems] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const exercise = useMemo(
    () => session.exerciseIds.map((id) => exercises.find((e) => e.id === id))[session.currentIndex],
    [session, exercises],
  );

  const answer = useCallback(
    (isCorrect: boolean) => {
      const currentId = session.exerciseIds[session.currentIndex]!;
      const done = submitAnswer(session, currentId, isCorrect);
      setSession({ ...session });

      // Gamification bienveillante : récompense l'effort ET la réussite.
      const reward = rewardForAnswer(isCorrect);
      setGems((g) => g + reward.amount);
      if (isCorrect) setCorrect((c) => c + 1);

      if (done) {
        setFinished(true);
      }
    },
    [session],
  );

  const result = useMemo(() => lessonResult(session), [session]);

  return {
    exercise,
    gems,
    correct,
    finished,
    score: result.score,
    answer,
  };
}
