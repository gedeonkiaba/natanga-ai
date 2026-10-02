import { StyleSheet, View } from 'react-native';
import { colors, radii } from '../tokens';

export interface ProgressBarProps {
  /** Valeur 0..1 (bornée en interne). */
  value: number;
  accessibilityLabel?: string;
  testID?: string;
}

/**
 * Barre de progression accessible.
 * - Annonce le pourcentage aux lecteurs d'écran via `accessibilityRole="progressbar"`.
 * - Jamais de couleur alarmante : la progression reste `primary` (vert doux).
 */
export function ProgressBar({ value, accessibilityLabel, testID }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const percent = Math.round(clamped * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? `Progression ${percent} pour cent`}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      testID={testID}
      style={styles.track}
    >
      <View style={[styles.fill, { width: `${percent}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
});
