import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { LEVEL1_EXERCISES, LEVEL1_ITEMS, LEVEL1_LESSONS, type Lesson } from '@natanga/core';
import { Badge, Button, ProgressBar, Text } from '@natanga/ui';
import { spacing } from '@natanga/ui'; // racine : Metro ne résout pas les sous-chemins d'exports
import { useLessonSession } from '../hooks/useLessonSession';
import { SoundGrapheme } from '../components/SoundGrapheme';
import { WordRecognition } from '../components/WordRecognition';

/** Durée d'affichage du retour avant l'exercice suivant (ms). */
const FEEDBACK_MS = 1200;

export interface LessonScreenProps {
  lesson: Lesson;
  onFinish: (result: { score: number; correct: number; total: number; gems: number }) => void;
  onQuit: () => void;
}

/**
 * Écran de leçon jouable (US-06) : séquence d'exercices + progrès + récompenses.
 * Consomme le moteur `@natanga/core` et les composants accessibles `@natanga/ui`.
 */
export function LessonScreen({ lesson, onFinish, onQuit }: LessonScreenProps) {
  const exercises = LEVEL1_EXERCISES.filter((e) => e.lessonId === lesson.id);
  const { exercise, gems, correct, finished, score, answer } = useLessonSession(lesson, exercises);

  // Le moteur passe à l'exercice suivant dès la réponse : on laisse d'abord l'enfant
  // lire le retour (« Bravo ! », « Presque ! C'est « a » ») sur l'exercice en cours,
  // et on ignore les autres touches pendant ce temps (une seule réponse comptée).
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (pending.current) clearTimeout(pending.current);
    },
    [],
  );
  const onAnswer = (isCorrect: boolean) => {
    if (pending.current) return;
    pending.current = setTimeout(() => {
      pending.current = null;
      answer(isCorrect);
    }, FEEDBACK_MS);
  };

  if (finished) {
    return (
      <View style={styles.container}>
        <Text variant="title" accessibilityRole="header">
          Leçon terminée !
        </Text>
        <Badge label={`${gems}`} kind="gems" accessibilityLabel={`Gemmes gagnées : ${gems}`} />
        <Text variant="body">
          {correct} bonne{correct > 1 ? 's' : ''} réponse{correct > 1 ? 's' : ''} sur{' '}
          {exercises.length}.
        </Text>
        <Button
          onPress={() => onFinish({ score, correct, total: exercises.length, gems })}
          accessibilityLabel="Terminer la leçon"
        >
          Continuer
        </Button>
      </View>
    );
  }

  // Leçon sans exercice (contenu pas encore rédigé, ex. « b ou d ? ») : jamais
  // d'écran vide sans issue pour l'enfant.
  if (exercises.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="title" accessibilityRole="header">
          {lesson.title}
        </Text>
        <Text variant="body">Cette leçon arrive bientôt. Reviens vite !</Text>
        <Button onPress={onQuit} accessibilityLabel="Retour au parcours">
          Retour au parcours
        </Button>
      </View>
    );
  }

  if (!exercise) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <Button variant="ghost" onPress={onQuit} accessibilityLabel="Quitter la leçon">
          Quitter
        </Button>
        <Badge label={`${gems}`} kind="gems" accessibilityLabel={`${gems} gemmes`} />
      </View>

      <ProgressBar
        value={correct / Math.max(1, exercises.length)}
        accessibilityLabel="Progression de la leçon"
      />

      <Text variant="title">{lesson.title}</Text>

      {exercise.type === 'sound-grapheme' ? (
        <SoundGrapheme
          key={exercise.id}
          exercise={exercise}
          items={LEVEL1_ITEMS}
          onAnswer={onAnswer}
        />
      ) : (
        <WordRecognition
          key={exercise.id}
          exercise={exercise}
          items={LEVEL1_ITEMS}
          onAnswer={onAnswer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.md },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
