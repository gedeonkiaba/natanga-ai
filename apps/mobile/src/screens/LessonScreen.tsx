import { StyleSheet, View } from 'react-native';
import {
  LEVEL1_EXERCISES,
  LEVEL1_ITEMS,
  LEVEL1_LESSONS,
  type Lesson,
} from '@natanga/core';
import { Badge, Button, ProgressBar, Text } from '@natanga/ui';
import { spacing } from '@natanga/ui/tokens';
import { useLessonSession } from '../hooks/useLessonSession';
import { SoundGrapheme } from '../components/SoundGrapheme';
import { WordRecognition } from '../components/WordRecognition';

export interface LessonScreenProps {
  lesson: Lesson;
  onFinish: (score: number) => void;
  onQuit: () => void;
}

/**
 * Écran de leçon jouable (US-06) : séquence d'exercices + progrès + récompenses.
 * Consomme le moteur `@natanga/core` et les composants accessibles `@natanga/ui`.
 */
export function LessonScreen({ lesson, onFinish, onQuit }: LessonScreenProps) {
  const exercises = LEVEL1_EXERCISES.filter((e) => e.lessonId === lesson.id);
  const { exercise, gems, correct, finished, score, answer } = useLessonSession(
    lesson,
    exercises,
  );

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
        <Button onPress={() => onFinish(score)} accessibilityLabel="Terminer la leçon">
          Continuer
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
        <SoundGrapheme exercise={exercise} items={LEVEL1_ITEMS} onAnswer={answer} />
      ) : (
        <WordRecognition exercise={exercise} items={LEVEL1_ITEMS} onAnswer={answer} />
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
