import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  checkSyllableAssembly,
  choicesOf,
  spokenPrompt,
  type Exercise,
  type PedagogyItem,
} from '@natanga/core';
import { Button, Text, TTSButton } from '@natanga/ui';
import { spacing } from '@natanga/ui'; // racine : Metro ne résout pas les sous-chemins d'exports
import type { AnswerFeedback } from './shared';

export interface SyllableAssemblyProps {
  exercise: Exercise;
  items: PedagogyItem[];
  onAnswer: (isCorrect: boolean) => void;
}

/**
 * Assemblage de syllabes : la voix dit le mot, l'enfant touche ses syllabes dans l'ordre
 * (une syllabe piège en plus). Toucher une case remplie la vide.
 */
export function SyllableAssembly({ exercise, items, onAnswer }: SyllableAssemblyProps) {
  const tiles = choicesOf(exercise, items);
  const slots = items.find((i) => i.id === exercise.params.correctItemId)?.syllables?.length ?? 0;
  const [placed, setPlaced] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);

  const add = (tile: number) => {
    if (feedback || placed.includes(tile) || placed.length >= slots) return;
    const next = [...placed, tile];
    setPlaced(next);
    if (next.length === slots) {
      const result = checkSyllableAssembly(
        exercise,
        items,
        next.map((i) => tiles[i]!.id),
      );
      setFeedback({ correct: result.correct, message: result.feedback });
      onAnswer(result.correct);
    }
  };

  const remove = (slot: number) => {
    if (feedback) return;
    setPlaced(placed.filter((_, i) => i !== slot));
  };

  return (
    <View style={styles.container}>
      <Text variant="body">Écoute, puis remets les syllabes dans l’ordre :</Text>
      <TTSButton
        text={spokenPrompt(exercise, items)}
        label="le mot"
        accessibilityLabel="Réécouter le mot"
      />

      <View style={styles.row}>
        {Array.from({ length: slots }, (_, slot) => {
          const tile = placed[slot];
          const label = tile === undefined ? undefined : tiles[tile]!.label;
          return (
            <Pressable
              key={slot}
              accessibilityRole={label ? 'button' : undefined}
              accessibilityLabel={
                label
                  ? `Case ${slot + 1} : ${label}, toucher pour retirer`
                  : `Case ${slot + 1} vide`
              }
              onPress={() => remove(slot)}
              style={styles.slot}
            >
              <Text variant="title">{label ?? ' '}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.row}>
        {tiles.map((t, i) =>
          placed.includes(i) ? (
            <View key={i} style={styles.hidden} />
          ) : (
            <Button
              key={i}
              onPress={() => add(i)}
              accessibilityLabel={`Ajouter la syllabe ${t.label}`}
            >
              {t.label}
            </Button>
          ),
        )}
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  slot: {
    minWidth: 72,
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#A5B4FC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  hidden: { minWidth: 72, minHeight: 56 },
});
