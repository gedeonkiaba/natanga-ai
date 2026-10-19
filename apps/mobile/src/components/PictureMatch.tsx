import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  checkPictureMatch,
  choicesOf,
  spokenPrompt,
  type Exercise,
  type PedagogyItem,
} from '@natanga/core';
import { Text, TTSButton } from '@natanga/ui';
import { spacing } from '@natanga/ui'; // racine : Metro ne résout pas les sous-chemins d'exports
import { Icon } from '../design';
import type { IconName } from '../design/icons.generated';
import type { AnswerFeedback } from './shared';

export interface PictureMatchProps {
  exercise: Exercise;
  items: PedagogyItem[];
  onAnswer: (isCorrect: boolean) => void;
}

/**
 * Lis et trouve l'image : l'enfant lit un mot ou une phrase sans l'entendre (la voix ne dit
 * que la consigne), puis touche l'image qui correspond.
 */
export function PictureMatch({ exercise, items, onAnswer }: PictureMatchProps) {
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const text = items.find((i) => i.id === exercise.params.textItemId);
  const question = exercise.params.question;

  const choose = (item: PedagogyItem) => {
    if (feedback) return;
    const result = checkPictureMatch(exercise, items, item.id);
    setFeedback({ correct: result.correct, message: result.feedback, correctId: result.correctId });
    setChosenId(item.id);
    onAnswer(result.correct);
  };

  return (
    <View style={styles.container}>
      <Text variant="body">
        {question
          ? `Lis ${exercise.params.cue?.startsWith('Lis le texte') ? 'le texte' : 'la phrase'}, puis réponds en touchant une image :`
          : 'Lis le mot, puis touche la bonne image :'}
      </Text>
      <TTSButton
        text={spokenPrompt(exercise, items)}
        label="la consigne"
        accessibilityLabel="Réécouter la consigne"
      />
      <View
        style={styles.reading}
        accessible
        accessibilityLabel={`${text?.type === 'sentence' ? 'Phrase' : 'Mot'} à lire : ${text?.label ?? ''}`}
      >
        <Text variant="title">{text?.label}</Text>
      </View>
      {question ? <Text variant="title">{question}</Text> : null}
      <View style={styles.row}>
        {choicesOf(exercise, items).map((item) => {
          const state = !feedback
            ? 'idle'
            : item.id === feedback.correctId
              ? 'right'
              : item.id === chosenId
                ? 'wrong'
                : 'idle';
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`Image : ${item.label}`}
              onPress={() => choose(item)}
              style={[styles.image, styles[state]]}
            >
              <Icon name={item.image as IconName} size={60} />
            </Pressable>
          );
        })}
      </View>
      {feedback && (
        <Text variant="caption" muted={feedback.correct}>
          {feedback.message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, alignItems: 'center' },
  reading: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center' },
  image: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idle: { backgroundColor: '#FFFFFF', borderColor: '#A5B4FC' },
  right: { backgroundColor: '#F0FDFA', borderColor: '#0D9488' },
  wrong: { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' },
});
