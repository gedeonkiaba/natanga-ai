import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  checkWordRecognition,
  choicesOf,
  spokenPrompt,
  type Exercise,
  type PedagogyItem,
} from '@natanga/core';
import { Button, Text, TTSButton } from '@natanga/ui';
import { spacing } from '@natanga/ui'; // racine : Metro ne résout pas les sous-chemins d'exports

export interface WordRecognitionProps {
  exercise: Exercise;
  items: PedagogyItem[];
  onAnswer: (isCorrect: boolean) => void;
}

/**
 * Exercice « reconnaissance de mots » (QCM) (US-08).
 * L'enfant choisit le bon mot parmi des distracteurs (jamais punitifs).
 */
export function WordRecognition({ exercise, items, onAnswer }: WordRecognitionProps) {
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(null);

  const candidateItems = choicesOf(exercise, items);

  const choose = (item: PedagogyItem) => {
    const result = checkWordRecognition(exercise, item.id);
    setFeedback({ correct: result.correct, message: result.feedback });
    setChosenId(item.id);
    onAnswer(result.correct);
  };

  return (
    <View style={styles.container}>
      <Text variant="body">Écoute, puis touche le mot entendu :</Text>

      <TTSButton
        text={spokenPrompt(exercise, items)}
        label="le mot"
        accessibilityLabel="Réécouter le mot"
      />

      <View style={styles.choices}>
        {candidateItems.map((item) => (
          <Button
            key={item.id}
            variant={chosenId === item.id && feedback?.correct === false ? 'warning' : 'primary'}
            onPress={() => choose(item)}
            accessibilityLabel={`Choisir le mot ${item.label}`}
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
