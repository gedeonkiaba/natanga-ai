import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { checkSoundGrapheme, type Exercise, type PedagogyItem } from '@natanga/core';
import { Button, Text, TTSButton } from '@natanga/ui';
import type { AnswerFeedback } from './shared';
import { spacing } from '@natanga/ui/tokens';

export interface SoundGraphemeProps {
  exercise: Exercise;
  items: PedagogyItem[];
  onAnswer: (isCorrect: boolean) => void;
}

/**
 * Exercice « association son ⇄ graphème » (US-07).
 * L'enfant entend le phonème (TTS) et sélectionne le graphème correspondant.
 */
export function SoundGrapheme({ exercise, items, onAnswer }: SoundGraphemeProps) {
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);

  const playSound = exercise.params.phoneme ?? '';

  const choose = (item: PedagogyItem) => {
    const result = checkSoundGrapheme(exercise, items, item.id);
    setFeedback({ correct: result.correct, message: result.feedback, correctId: result.correctId });
    onAnswer(result.correct);
  };

  return (
    <View style={styles.container}>
      <Text variant="body">Écoute, puis touche le son entendu :</Text>

      <TTSButton
        text={playSound}
        label={`le son ${playSound}`}
        accessibilityLabel={`Écouter le son ${playSound}`}
      />

      <View style={styles.choices}>
        {items
          .filter((i) => i.type === 'grapheme')
          .map((item) => (
            <Button
              key={item.id}
              variant={
                feedback?.correct === false && feedback.correctId === item.id
                  ? 'warning'
                  : 'primary'
              }
              onPress={() => choose(item)}
              accessibilityLabel={`Choisir la lettre ${item.label}`}
            >
              {item.label}
            </Button>
          ))}
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
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
});
