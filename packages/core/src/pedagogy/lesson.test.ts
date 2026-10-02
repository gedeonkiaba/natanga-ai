import { describe, expect, it } from 'vitest';
import { startLesson, submitAnswer, lessonResult, currentExercise } from './lesson';
import type { Exercise } from './model';

const exercises: Exercise[] = [
  { id: 'e1', lessonId: 'l1', type: 'sound-grapheme', params: { phoneme: 'a' }, order: 2 },
  { id: 'e2', lessonId: 'l1', type: 'sound-grapheme', params: { phoneme: 'i' }, order: 1 },
  { id: 'e3', lessonId: 'l1', type: 'word-recognition', params: {}, order: 3 },
];

describe('moteur de leçon', () => {
  it('ordonne les exercices par `order`', () => {
    const session = startLesson('l1', exercises);
    expect(session.exerciseIds).toEqual(['e2', 'e1', 'e3']);
  });

  it('avance séquentiellement et détecte la fin', () => {
    const session = startLesson('l1', exercises);
    let finished = submitAnswer(session, 'e2', true);
    expect(finished).toBe(false);
    expect(session.currentIndex).toBe(1);

    finished = submitAnswer(session, 'e1', false);
    expect(finished).toBe(false);

    finished = submitAnswer(session, 'e3', true);
    expect(finished).toBe(true);
  });

  it('calcule le score final', () => {
    const session = startLesson('l1', exercises);
    submitAnswer(session, 'e2', true);
    submitAnswer(session, 'e1', false);
    submitAnswer(session, 'e3', true);
    const result = lessonResult(session);
    expect(result.total).toBe(3);
    expect(result.correct).toBe(2);
    expect(result.score).toBeCloseTo(2 / 3);
    expect(result.completed).toBe(true);
  });

  it('retrouve l’exercice courant', () => {
    const session = startLesson('l1', exercises);
    expect(currentExercise(session, exercises)?.id).toBe('e2');
  });
});
